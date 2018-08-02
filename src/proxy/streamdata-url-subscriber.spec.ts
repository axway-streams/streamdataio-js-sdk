import {EventType} from '../sse/streamdata-events';
import {StreamdataUrlSubscriber} from './streamdata-url-subscriber';

describe('StreamdataUrlSubscriber', () => {

  const eventSourceMock = require('eventsourcemock');
  const subscriberKey = 'subscriber-key';
  const streamUrl = 'http://stream';
  const proxyUrl = `https://proxy.streamdata.io/${streamUrl}?X-Sd-Subscriber-Key=${subscriberKey}`;

  describe('Constructor', () => {

    it('should initialize a StreamdataUrlSubscriber', () => {
      // GIVEN
      const subscriber = new StreamdataUrlSubscriber(streamUrl, subscriberKey);
      // THEN
      expect(subscriber).toBeDefined();
    });

  });

  describe('Listeners', () => {

    it('should emit open event to the added listener', () => {
      // GIVEN
      const subscriber = new StreamdataUrlSubscriber(streamUrl, subscriberKey);
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
      const subscriber = new StreamdataUrlSubscriber(streamUrl, subscriberKey);
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

    it('should emit data event to the added listener', () => {
      // GIVEN
      const subscriber = new StreamdataUrlSubscriber(streamUrl, subscriberKey);
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
      const subscriber = new StreamdataUrlSubscriber(streamUrl, subscriberKey);
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
      const subscriber = new StreamdataUrlSubscriber(streamUrl, subscriberKey);
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
      const subscriber = new StreamdataUrlSubscriber(streamUrl, subscriberKey);
      subscriber.open();

      // WHEN
      subscriber.close();

      // THEN
      expect(subscriber.isConnected()).toBeFalsy();
    });
  });

});
