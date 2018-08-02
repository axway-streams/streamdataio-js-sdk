import {EventSource, URL} from '../configuration/targets.config';
import {EventType} from '../sse/streamdata-events';
import {StreamdataProxySubscriber} from './streamdata-proxy-subscriber';

export class MockStreamdataSubscriber extends StreamdataProxySubscriber<any> {

  constructor(subscriberKey: string) {
    super(subscriberKey);
    this.proxy = new URL('http://sse.proxy/');
  }

  protected buildError(error: any): string {
    return error;
  }

  protected getStreamingUrl(): URL {
    return new URL('/mock', this._proxy);
  }
}

describe('StreamdataProxySubscriber', () => {

  const eventSourceMock = require('eventsourcemock');
  const proxyURL = 'http://sse.proxy/mock';

  describe('Constructor', () => {

    it('should initialize a StreamdataProxySubscriber', () => {
      // GIVEN
      const subscriber = new MockStreamdataSubscriber('key');
      // THEN
      expect(subscriber).toBeDefined();
    });

    it('should set proxy url as string with /', () => {
      // GIVEN
      const subscriber = new MockStreamdataSubscriber('key');

      // WHEN
      subscriber.proxy = 'http://toto/';
      subscriber.open();

      // THEN
      expect(eventSourceMock.sources['http://toto/mock']).toBeDefined();
    });

    it('should set proxy url as string without /', () => {
      // GIVEN
      const subscriber = new MockStreamdataSubscriber('key');

      // WHEN
      subscriber.proxy = 'http://toto';
      subscriber.open();

      // THEN
      expect(eventSourceMock.sources['http://toto/mock']).toBeDefined();
    });

    it('should set proxy url as URL with /', () => {
      // GIVEN
      const subscriber = new MockStreamdataSubscriber('key');

      // WHEN
      subscriber.proxy = new URL('http://toto/');
      subscriber.open();

      // THEN
      expect(eventSourceMock.sources['http://toto/mock']).toBeDefined();
    });

    it('should set proxy url as string without /', () => {
      // GIVEN
      const subscriber = new MockStreamdataSubscriber('key');

      // WHEN
      subscriber.proxy = new URL('http://toto');
      subscriber.open();

      // THEN
      expect(eventSourceMock.sources['http://toto/mock']).toBeDefined();
    });

  });

  describe('Listeners', () => {

    it('should emit open event to the added listener', () => {
      // GIVEN
      const subscriber = new MockStreamdataSubscriber('key');
      const openCallBack = jest.fn();
      subscriber.onOpen(openCallBack);

      // WHEN
      subscriber.open();
      eventSourceMock.sources[proxyURL].emitOpen();
      eventSourceMock.sources[proxyURL].emit(EventType.OPEN);

      // THEN
      expect(subscriber.isConnected()).toBeTruthy();
      expect(openCallBack).toBeCalledWith({});
    });

    it('should emit error event to the added listener', () => {
      // GIVEN
      const subscriber = new MockStreamdataSubscriber('key');
      const errorCallBack = jest.fn();
      subscriber.onError(errorCallBack);

      // WHEN
      subscriber.open();
      eventSourceMock.sources[proxyURL].emit(EventType.ERROR, {data: '{ "key" : "error"}'} as MessageEvent);

      // THEN
      expect(errorCallBack).toBeCalledWith({'key': 'error'});
    });

    it('should emit error event with no data to the added listener', () => {
      // GIVEN
      const subscriber = new MockStreamdataSubscriber('key');
      const errorCallBack = jest.fn();
      subscriber.onError(errorCallBack);

      // WHEN
      subscriber.open();
      eventSourceMock.sources[proxyURL].emit(EventType.ERROR, {data: null} as MessageEvent);

      // THEN
      expect(errorCallBack).toBeCalledWith(null);
    });

    it('should emit data event to the added listener', () => {
      // GIVEN
      const subscriber = new MockStreamdataSubscriber('key');
      const dataCallBack = jest.fn();
      subscriber.onData(dataCallBack);

      // WHEN
      subscriber.open();
      eventSourceMock.sources[proxyURL].emit(EventType.DATA, {data: '{ "key" : "data"}'} as MessageEvent);

      // THEN
      expect(dataCallBack).toBeCalledWith({'key': 'data'});
    });

    it('should emit data event with no data to the added listener', () => {
      // GIVEN
      const subscriber = new MockStreamdataSubscriber('key');
      const dataCallBack = jest.fn();
      subscriber.onData(dataCallBack);

      // WHEN
      subscriber.open();
      eventSourceMock.sources[proxyURL].emit(EventType.DATA, {data: null} as MessageEvent);

      // THEN
      expect(dataCallBack).toBeCalledWith(null);
    });

    it('should emit patch event to the added listener', () => {
      // GIVEN
      const subscriber = new MockStreamdataSubscriber('key');
      const patchCallBack = jest.fn();
      subscriber.onPatch(patchCallBack);

      // WHEN
      subscriber.open();
      eventSourceMock.sources[proxyURL].emit(EventType.PATCH, {data: '{ "key" : "patch"}'} as MessageEvent);

      // THEN
      expect(patchCallBack).toBeCalledWith({'key': 'patch'});
    });

    it('should emit patch event with no data to the added listener', () => {
      // GIVEN
      const subscriber = new MockStreamdataSubscriber('key');
      const patchCallBack = jest.fn();
      subscriber.onPatch(patchCallBack);

      // WHEN
      subscriber.open();
      eventSourceMock.sources[proxyURL].emit(EventType.PATCH, {data: null} as MessageEvent);

      // THEN
      expect(patchCallBack).toBeCalledWith(null);
    });

    it('should emit monitor event to the added listener', () => {
      // GIVEN
      const subscriber = new MockStreamdataSubscriber('key');
      const monitorCallBack = jest.fn();
      subscriber.onMonitor(monitorCallBack);

      // WHEN
      subscriber.open();
      eventSourceMock.sources[proxyURL].emit(EventType.MONITOR, {data: '{ "key" : "monitor"}'} as MessageEvent);

      // THEN
      expect(monitorCallBack).toBeCalledWith({'key': 'monitor'});
    });

    it('should emit monitor event with no data to the added listener', () => {
      // GIVEN
      const subscriber = new MockStreamdataSubscriber('key');
      const monitorCallBack = jest.fn();
      subscriber.onMonitor(monitorCallBack);

      // WHEN
      subscriber.open();
      eventSourceMock.sources[proxyURL].emit(EventType.MONITOR, {data: null} as MessageEvent);

      // THEN
      expect(monitorCallBack).toBeCalledWith(null);
    });

    it('should close the EventSource', () => {
      // GIVEN
      const subscriber = new MockStreamdataSubscriber('key');
      subscriber.open();

      // WHEN
      subscriber.close();

      // THEN
      expect(subscriber.isConnected()).toBeFalsy();
    });

    it('should close without error even if sse wasn\'t opened first', () => {
      // GIVEN
      const subscriber = new MockStreamdataSubscriber('key');

      // THEN
      expect(() => {
        subscriber.close();
      }).not.toThrow();
    });
  });
})
;
