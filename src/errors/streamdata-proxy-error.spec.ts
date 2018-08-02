import {StreamdataProxyError} from './streamdata-proxy-error';

describe('StreamdataProxyError', () => {
  it('should have a datetime', () => {
    // GIVEN
    let datetime = Date.now().toString();
    let errorObj = {
      'datetime': datetime
    };

    // WHEN
    let error = new StreamdataProxyError(errorObj);

    // THEN
    expect(error.datetime).toEqual(datetime);
  });

  it('should have a code as number', () => {
    // GIVEN
    let errorObj = {
      'code': 1000
    };

    // WHEN
    let error = new StreamdataProxyError(errorObj);
    // THEN
    expect(error.code).toEqual(1000);
  });

  it('should have a message ', () => {
    // GIVEN
    let errorObj = {
      'message': 'message'
    };

    // WHEN
    let error = new StreamdataProxyError(errorObj);

    // THEN
    expect(error.message).toEqual('message');
  });

  it('should have a category', () => {
    // GIVEN
    let errorObj = {
      'category': 'ClientException'
    };
    // WHEN
    let error = new StreamdataProxyError(errorObj);
    // THEN
    expect(error.isClient).toBe(true);
    expect(error.isServer).toBe(false);
    expect(error.isTopic).toBe(false);

    // GIVEN
    errorObj = {
      'category': 'ServerException'
    };
    // WHEN
    error = new StreamdataProxyError(errorObj);
    // THEN
    expect(error.category).toEqual('ServerException');
    expect(error.isClient).toBe(false);
    expect(error.isServer).toBe(true);
    expect(error.isTopic).toBe(false);

    // GIVEN
    errorObj = {
      'category': 'TopicException'
    };
    // WHEN
    error = new StreamdataProxyError(errorObj);
    // THEN
    expect(error.category).toEqual('TopicException');
    expect(error.isClient).toBe(false);
    expect(error.isServer).toBe(false);
    expect(error.isTopic).toBe(true);

  });
  it('should have a status', () => {
    // GIVEN
    let errorObj = {
      'status': 1000
    };
    // WHEN
    let error = new StreamdataProxyError(errorObj);
    // THEN
    expect(error.status).toEqual(1000);
  });

  it('should be completed', () => {
    // GIVEN
    let datetime = Date.now().toString();
    let errorObj = {
      'datetime': datetime,
      'code': 1000,
      'message': 'message',
      'category': 'ClientException',
      'status': 1000
    };
    // WHEN
    let error = new StreamdataProxyError(errorObj);
    // THEN
    expect(error.datetime).toEqual(datetime);
    expect(error.code).toEqual(1000);
    expect(error.message).toEqual('message');
    expect(error.category).toEqual('ClientException');
    expect(error.status).toEqual(1000);
    expect(error.isClient).toEqual(true);
    expect(error.isServer).toEqual(false);
    expect(error.isTopic).toEqual(false);
  });
});
