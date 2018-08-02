import {DefaultStreamDataProxyURL} from '../configuration/proxy.config';
import {EventSource, URL} from '../configuration/targets.config';
import {EventType} from '../sse/streamdata-events';
import {JsonHelper} from '../utils/json-helper';
import {Listeners} from '../utils/listeners';
import {Logger} from '../utils/logger';
import {Preconditions} from '../utils/preconditions';

export abstract class StreamdataProxySubscriber<E> {

  protected static readonly X_SD_SUBSCRIBER_KEY = 'X-Sd-Subscriber-Key';

  // Listeners
  private _openListeners: Listeners<any> = new Listeners<void>();
  private _dataListeners: Listeners<any> = new Listeners<string>();
  private _patchListeners: Listeners<any> = new Listeners<string>();
  private _errorListeners: Listeners<E> = new Listeners<E>();
  private _monitorListeners: Listeners<any> = new Listeners<any>();

  // SSE
  private _sse: EventSource;

  protected constructor(protected _subscriberKey: string) {

    // Build internal configuration
    Preconditions.checkNotNull(this._subscriberKey, 'subscriberKey cannot be null.');

    // SSE
    this._sse = null;
    this._proxy = DefaultStreamDataProxyURL;
  }

  protected _proxy: URL;

  public set proxy(proxyURL: string | URL) {
    if (typeof proxyURL === 'string') {
      if (!proxyURL.endsWith('/')) {
        proxyURL += '/';
      }
      this._proxy = new URL(proxyURL);
    } else {
      this._proxy = proxyURL;
    }
    Logger.debug('Set proxy url to: ' + this._proxy);
  }


  public open(): StreamdataProxySubscriber<E> {
    // Shutdown the actual sse client
    this.close();

    Logger.debug('Opening SSE Stream');
    let streamingUrl = this.getStreamingUrl();
    Preconditions.checkNotNull(streamingUrl, 'Stream url cannot be null');
    Logger.debug('Streaming url built: ' + streamingUrl);

    this._sse = new EventSource(streamingUrl.toString());
    this._sse.addEventListener(EventType.OPEN, () => {
      Logger.debug('SSE Stream opened to [{0}]', streamingUrl);
      this._openListeners.fire({});
    });

    this._sse.addEventListener(EventType.DATA, (messageEvent: MessageEvent) => {
      Logger.debug('Received data: [{0}]', messageEvent.data);
      let data = StreamdataProxySubscriber._parseMessageData(messageEvent);
      this._dataListeners.fire(data);
    });

    this._sse.addEventListener(EventType.ERROR, (messageEvent: MessageEvent) => {
      Logger.error('Error received, server connection lost, retrying ... [{0}]', messageEvent.data);
      let error = StreamdataProxySubscriber._parseMessageData(messageEvent);
      this._errorListeners.fire(this.buildError(error));
    });

    this._sse.addEventListener(EventType.PATCH, (messageEvent: MessageEvent) => {
      Logger.debug('Received patch: [{0}]', messageEvent.data);
      let patch = StreamdataProxySubscriber._parseMessageData(messageEvent);
      this._patchListeners.fire(patch);
    });

    this._sse.addEventListener(EventType.MONITOR, (messageEvent: MessageEvent) => {
      Logger.debug('Received monitor: [{0}]', messageEvent.data);
      let monitor = StreamdataProxySubscriber._parseMessageData(messageEvent);
      this._monitorListeners.fire(monitor);
    });

    return this;
  }

  private static _parseMessageData(messageEvent: MessageEvent) {
    return messageEvent.data ? JsonHelper.parse(messageEvent.data) : null;
  }

  public close(): StreamdataProxySubscriber<E> {
    if (this._sse && (this._sse.readyState === EventSource.OPEN || this._sse.readyState === EventSource.CONNECTING)) {
      Logger.debug('Closing SSE Stream');
      this._sse.close();
    }
    return this;
  }

  public onOpen(callback: (data: any) => void, thisArg?: any): StreamdataProxySubscriber<E> {
    this._openListeners.addCallback(callback, thisArg);
    return this;
  }

  public onError(callback: (data: E) => void, thisArg?: any): StreamdataProxySubscriber<E> {
    this._errorListeners.addCallback(callback, thisArg);
    return this;
  }

  public onData(callback: (data: any) => void, thisArg?: any): StreamdataProxySubscriber<E> {
    this._dataListeners.addCallback(callback, thisArg);
    return this;
  }

  public onPatch(callback: (data: any) => void, thisArg?: any): StreamdataProxySubscriber<E> {
    this._patchListeners.addCallback(callback, thisArg);
    return this;
  }

  public onMonitor(callback: (data: any) => void, thisArg?: any): StreamdataProxySubscriber<E> {
    this._monitorListeners.addCallback(callback, thisArg);
    return this;
  }

  public isConnected() {
    return this._sse && this._sse.readyState === EventSource.OPEN;
  }

  protected abstract getStreamingUrl(): URL;

  protected abstract buildError(error: any): E;
}



