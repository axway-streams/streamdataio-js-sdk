import {EventType} from '../sse/streamdata-events';
import {StreamdataLegacySubscriber} from './streamdata-legacy-subscriber';
import {StreamdataLegacyError} from '../errors/streamdata-legacy-error';
import {StreamdataAuthStrategy} from '../auth/streamdata-auth-strategy';

export class MockStreamdataAuthStrategy implements StreamdataAuthStrategy {
  signUrl(url: string): string {
    let hash = 0;
    if (url.length === 0) {
      return hash.toString();
    }
    for (var i = 0; i < url.length; i++) {
      var char = url.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

}

describe('StreamdataLegacySubscriber', () => {

  const eventSourceMock = require('eventsourcemock');
  const token = 'token';
  const streamUrl = 'http://stream';
  const proxyUrl = `https://streamdata.motwin.net/${streamUrl}?X-Sd-Token=${token}`;

  describe('Constructor', () => {

    it('should initialize a StreamdataLegacySubscriber', () => {
      // GIVEN
      const subscriber = new StreamdataLegacySubscriber(streamUrl, token);
      // THEN
      expect(subscriber).toBeDefined();
    });

    it('should initialize a StreamdataLegacySubscriber with headers', () => {

      // GIVEN
      const proxyUrlWithHeaders = `https://streamdata.motwin.net/${streamUrl}?X-Sd-Header=custom%253A%2520value&X-Sd-Token=${token}`;
      const headers = ['custom: value'];
      const subscriber = new StreamdataLegacySubscriber(streamUrl, token, headers);
      const openCallBack = jest.fn();
      subscriber.onOpen(openCallBack);

      // WHEN
      subscriber.open();

      // THEN
      expect(eventSourceMock.sources[proxyUrlWithHeaders]).toBeDefined();
    });

    it('should initialize a StreamdataLegacySubscriber with auth strategy', () => {

      // GIVEN
      const proxyUrlWithAuth = `https://streamdata.motwin.net/-462511086?X-Sd-Token=${token}`;
      const subscriber = new StreamdataLegacySubscriber(streamUrl, token, null, new MockStreamdataAuthStrategy());
      const openCallBack = jest.fn();
      subscriber.onOpen(openCallBack);

      // WHEN
      subscriber.open();

      // THEN
      expect(eventSourceMock.sources[proxyUrlWithAuth]).toBeDefined();
    });

  });

  describe('Listeners', () => {

    it('should emit open event to the added listener', () => {
      // GIVEN
      const subscriber = new StreamdataLegacySubscriber(streamUrl, token);
      const openCallBack = jest.fn();
      subscriber.onOpen(openCallBack);

      // WHEN
      subscriber.open();
      eventSourceMock.sources[proxyUrl].emitOpen();
      eventSourceMock.sources[proxyUrl].emit(EventType.OPEN);

      // THEN
      expect(subscriber.isConnected()).toBeTruthy();
      expect(openCallBack).toBeCalledWith({});
    });

    it('should emit error event to the added listener', () => {
      // GIVEN
      const subscriber = new StreamdataLegacySubscriber(streamUrl, token);
      const errorCallBack = jest.fn((error) => {
        if (error) {
          expect(error.status).toEqual(1000);
          expect(error.cause).toEqual('UnknownError');
          expect(error.message).toEqual('An error occured. Please check your console logs for more details.');
          expect(error.source).toEqual('server');
          expect(error.original).toEqual({'key': 'error'});
        }
      });
      subscriber.onError(errorCallBack);

      // WHEN
      subscriber.open();
      eventSourceMock.sources[proxyUrl].emit(EventType.ERROR, {data: '{ "key" : "error"}'} as MessageEvent);

      // THEN
      expect(errorCallBack).not.toThrow();
    });

    it('should emit error event with StreamdataLegacyError to the added listener', () => {
      // GIVEN
      const testError = new StreamdataLegacyError(2000, 'BadException', 'error message', Date.now().toString(), 'client');
      const subscriber = new StreamdataLegacySubscriber(streamUrl, token);
      const errorCallBack = jest.fn();
      subscriber.onError(errorCallBack);

      // WHEN
      subscriber.open();
      eventSourceMock.sources[proxyUrl].emit(EventType.ERROR, {data: JSON.stringify(testError)} as MessageEvent);

      // THEN
      expect(errorCallBack).toBeCalledWith(testError);
    });

    it('should emit data event to the added listener', () => {
      // GIVEN
      const subscriber = new StreamdataLegacySubscriber(streamUrl, token);
      const dataCallBack = jest.fn();
      subscriber.onData(dataCallBack);

      // WHEN
      subscriber.open();
      eventSourceMock.sources[proxyUrl].emit(EventType.DATA, {data: '{ "key" : "data"}'} as MessageEvent);

      // THEN
      expect(dataCallBack).toBeCalledWith({'key': 'data'});
    });

    it('should emit patch event to the added listener', () => {
      // GIVEN
      const subscriber = new StreamdataLegacySubscriber(streamUrl, token);
      const patchCallBack = jest.fn();
      subscriber.onPatch(patchCallBack);

      // WHEN
      subscriber.open();
      eventSourceMock.sources[proxyUrl].emit(EventType.PATCH, {data: '{ "key" : "patch"}'} as MessageEvent);

      // THEN
      expect(patchCallBack).toBeCalledWith({'key': 'patch'});
    });

    it('should emit monitor event to the added listener', () => {
      // GIVEN
      const subscriber = new StreamdataLegacySubscriber(streamUrl, token);
      const monitorCallBack = jest.fn();
      subscriber.onMonitor(monitorCallBack);

      // WHEN
      subscriber.open();
      eventSourceMock.sources[proxyUrl].emit(EventType.MONITOR, {data: '{ "key" : "monitor"}'} as MessageEvent);

      // THEN
      expect(monitorCallBack).toBeCalledWith({'key': 'monitor'});
    });

    it('should close the EventSource', () => {
      // GIVEN
      const subscriber = new StreamdataLegacySubscriber(streamUrl, token);
      subscriber.open();

      // WHEN
      subscriber.close();

      // THEN
      expect(subscriber.isConnected()).toBeFalsy();
    });
  });

});
