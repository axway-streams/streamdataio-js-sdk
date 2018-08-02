import {Logger} from 'utils/logger';
import {DataEvent, ErrorEvent, EventType, MonitorEvent, OpenEvent, PatchEvent} from 'sse/streamDataEvents';
import {JsonHelper} from 'utils/jsonHelper';

// ************************************
// EventSource constructor handling

// Webpack Defined Plugin Variable
declare let NODE: boolean;
if (NODE) {
  var EventSource = require('eventsource');
}

// ************************************

export class StreamDataEventSource {

  // SSE
  private readonly _sse: EventSource;

  constructor(url: string) {
    this._sse = new EventSource(url);
  }

  public close() {
    if (this._sse && (this._sse.readyState === EventSource.OPEN || this._sse.readyState === EventSource.CONNECTING)) {
      Logger.info('Closing the SSE Stream.');
      this._sse.close();
    }
  }

  public addOpenListener(onOpenCallback: (event: OpenEvent) => void, context?: any) {
    this._sse.addEventListener(EventType.OPEN, function () {
      if (context) {
        onOpenCallback.apply(context, [{} as OpenEvent]);
      } else {
        onOpenCallback({} as OpenEvent);
      }
    });
  }

  public addErrorListener(onErrorCallback: (event: ErrorEvent) => void, context?: any) {
    this._sse.addEventListener(EventType.ERROR, function (messageEvent: MessageEvent) {
      let error = messageEvent ? JsonHelper.parse((messageEvent.data)) : null;
      if (context) {
        onErrorCallback.apply(context, [{error: error} as ErrorEvent]);
      } else {
        onErrorCallback({error: error} as ErrorEvent);
      }
    });
  }

  public addDataListener(onDataCallback: (event: DataEvent) => void, context?: any) {
    this._sse.addEventListener(EventType.DATA, function (messageEvent: MessageEvent) {
      let data = messageEvent ? JsonHelper.parse((messageEvent.data)) : null;
      if (context) {
        onDataCallback.apply(context, [{data: data} as DataEvent]);
      } else {
        onDataCallback({data: data} as DataEvent);
      }
    });
  }

  public addPatchListener(onPatchCallback: (event: PatchEvent) => void, context?: any) {
    this._sse.addEventListener(EventType.PATCH, function (messageEvent: MessageEvent) {
      let patch = messageEvent ? JsonHelper.parse((messageEvent.data)) : null;
      if (context) {
        onPatchCallback.apply(context, [{patch: patch} as PatchEvent]);
      } else {
        onPatchCallback({patch: patch} as PatchEvent);
      }
    });
  }

  public addMonitorListener(onMonitorCallback: (event: MonitorEvent) => void, context?: any) {
    this._sse.addEventListener(EventType.MONITOR, function (messageEvent: MessageEvent) {
      let monitor = messageEvent ? JsonHelper.parse((messageEvent.data)) : null;
      if (context) {
        onMonitorCallback.apply(context, [{data: monitor} as MonitorEvent]);
      } else {
        onMonitorCallback({data: monitor} as MonitorEvent);
      }
    });
  }

  public isConnected(): boolean {
    return this._sse.readyState === EventSource.OPEN;
  }

}
