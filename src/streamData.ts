import {StreamDataEventSource} from './sse/streamDataEventSource';
import {Listeners} from './events/listeners';
import {Preconditions} from './utils/preconditions';
import {Logger} from './utils/logger';
import {DataEvent, MonitorEvent, OpenEvent, PatchEvent} from './sse/streamDataEvents';
import {DefaultStreamDataServer} from './configuration/config';
import {StreamDataError} from './errors/streamDataError';
import {StreamDataServer} from './sse/streamDataServer';
import {StreamDataUrl} from './sse/streamDataUrl';
import {StreamDataAuthStrategy} from './auth/streamDataAuthStrategy';

export class StreamData {

  // Configuration
  private _url: string;
  private _token: string;
  private _headers: string[];
  private _authStrategy: StreamDataAuthStrategy;

  // Listeners
  private _openListeners: Listeners<any>;
  private _dataListeners: Listeners<any>;
  private _patchListeners: Listeners<any>;
  private _errorListeners: Listeners<StreamDataError>;
  private _monitorListeners: Listeners<any>;

  // SSE
  private _sse: StreamDataEventSource;
  public server: StreamDataServer;

  constructor(url: string, appToken: string, headers?: string[], authStragety?: StreamDataAuthStrategy) {

    // Build internal configuration
    Preconditions.checkNotNull(url, 'url cannot be null.');
    Preconditions.checkNotNull(appToken, 'appToken cannot be null.');

    this._url = url;
    this._token = appToken;
    this._headers = headers ? headers : [];
    this._authStrategy = authStragety;

    // Init listeners
    this._openListeners = new Listeners<any>();
    this._dataListeners = new Listeners<any>();
    this._patchListeners = new Listeners<any>();
    this._errorListeners = new Listeners<StreamDataError>();
    this._monitorListeners = new Listeners<any>();

    // SSE
    this._sse = null;
    this.server = DefaultStreamDataServer;
  }

  public open(): StreamData {
    Preconditions.checkNotNull(this._url, 'url cannot be null');
    this._sse && this.close();
    let decoratedUrl = this._decorate(this._url, this._headers);

    if (decoratedUrl) {

      this._sse = new StreamDataEventSource(decoratedUrl);
      this._sse.addOpenListener(function (event: OpenEvent) {
        Logger.debug('SSE Stream Opened to ' + this._url + 'event: ' + event);
        this._openListeners.fire();
      }, this);

      this._sse.addErrorListener(function (event: ErrorEvent) {
        if (this._sse.readyState !== 0 || !this._isConnected) {
          Logger.debug('Error with SSE at ' + event + ': closing the stream.');
          this._sse.close();
          this._errorListeners.fire(StreamData._buildErrorMessage(event.error));
        }
        else {
          Logger.info('SSE server connection lost, retrying ...');
        }
      }, this);

      this._sse.addDataListener(function (event: DataEvent) {
        Logger.debug('Received data:' + event.data);
        this._dataListeners.fire(event.data);
      }, this);

      this._sse.addPatchListener(function (event: PatchEvent) {
        Logger.debug('Received patch:' + event.patch);
        this._patchListeners.fire(event.patch);
      }, this);


      this._sse.addMonitorListener(function (event: MonitorEvent) {
        Logger.debug('Received monitor:' + event.data);
        this._monitorListeners.fire(event.data);
      }, this);
    }
    return this;
  }

  public close(): StreamData {
    this._sse.close();
    return this;
  }

  public onOpen(callback: (data: any) => void, context?: any) {
    Preconditions.checkNotNull(callback, 'listener cannot be null');
    this._openListeners.add(callback, context);
    return this;
  }

  public onError(callback: (data: StreamDataError) => void, context?: any) {
    Preconditions.checkNotNull(callback, 'listener cannot be null');
    this._errorListeners.add(callback, context);
    return this;
  }

  public onData(callback: (data: any) => void, context?: any) {
    Preconditions.checkNotNull(callback, 'listener cannot be null');
    this._dataListeners.add(callback, context);
    return this;
  }

  public onPatch(callback: (data: any) => void, context?: any) {
    Preconditions.checkNotNull(callback, 'listener cannot be null');
    this._patchListeners.add(callback, context);
    return this;
  }

  public onMonitor(callback: (data: any) => void, context?: any) {
    Preconditions.checkNotNull(callback, 'listener cannot be null');
    this._monitorListeners.add(callback, context);
    return this;
  }

  public isConnected() {
    return this._sse.isConnected();
  }

  private _decorate(url: string, headers: string[]) {
    Preconditions.checkNotNull(url, 'url cannot be null');

    let signedUrl = this._authStrategy ? this._authStrategy.signUrl(url) : url;
    let clientUrl = new StreamDataUrl(signedUrl, this._token, headers);
    let streamdataUrl = this.server.getFullUrl(clientUrl);
    Logger.debug('converted url :' + streamdataUrl);
    return streamdataUrl;
  }

  private static _buildErrorMessage(error: any): StreamDataError {
    Logger.error(error);
    if (error['cause'] || error['message'] || error['status']) {
      return new StreamDataError(error['cause'], error['message'], error['status'], 'server', error);
    } else {
      return StreamDataError.createDefault(error);
    }
  }
}



