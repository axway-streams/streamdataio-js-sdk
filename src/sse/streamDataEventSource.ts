import {Logger} from '../utils/logger';
import {DataEvent, ErrorEvent, MonitorEvent, OpenEvent, PatchEvent} from './streamDataEvents';
import {JsonHelper} from '../utils/jsonHelper';

import IEventSourceStatic = sse.IEventSourceStatic;
import IOnMessageEvent = sse.IOnMessageEvent;

// ************************************
// EventSource constructor handling

// Webpack Defined Plugin Variable
declare let NODE: boolean;
if (NODE) {
  var EventSource: IEventSourceStatic = require('eventsource');
} else {
  var EventSource: IEventSourceStatic = window && (<StreamDataWindow>window).EventSource;
}

interface StreamDataWindow extends Window {
  EventSource: IEventSourceStatic;
}
// ************************************

export class StreamDataEventSource {

  // SSE
  private _sse: sse.IEventSourceStatic;

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
    this._sse.addEventListener(EventType.ERROR, function (messageEvent: sse.IOnMessageEvent) {
      let error = messageEvent ? JsonHelper.parse((messageEvent.data)) : null;
      if (context) {
        onErrorCallback.apply(context, [{error: error} as ErrorEvent]);
      } else {
        onErrorCallback({error: error} as ErrorEvent);
      }
    });
  }

  public addDataListener(onDataCallback: (event: DataEvent) => void, context?: any) {
    this._sse.addEventListener(EventType.DATA, function (messageEvent: sse.IOnMessageEvent) {
      let data = messageEvent ? JsonHelper.parse((messageEvent.data)) : null;
      if (context) {
        onDataCallback.apply(context, [{data: data} as DataEvent]);
      } else {
        onDataCallback({data: data} as DataEvent);
      }
    });
  }

  public addPatchListener(onPatchCallback: (event: PatchEvent) => void, context?: any) {
    this._sse.addEventListener(EventType.PATCH, function (messageEvent: sse.IOnMessageEvent) {
      let patch = messageEvent ? JsonHelper.parse((messageEvent.data)) : null;
      if (context) {
        onPatchCallback.apply(context, [{patch: patch} as PatchEvent]);
      } else {
        onPatchCallback({patch: patch} as PatchEvent);
      }
    });
  }

  public addMonitorListener(onMonitorCallback: (event: MonitorEvent) => void, context?: any) {
    this._sse.addEventListener(EventType.MONITOR, function (messageEvent: sse.IOnMessageEvent) {
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

export class EventType {

  public static readonly OPEN = 'open';
  public static readonly ERROR = 'error';
  public static readonly DATA = 'data';
  public static readonly PATCH = 'patch';
  public static readonly MONITOR = 'monitor';
}