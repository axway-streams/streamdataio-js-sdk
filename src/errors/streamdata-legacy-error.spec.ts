import {StreamdataLegacyError} from './streamdata-legacy-error';

describe('StreamdataLegacyError', () => {

  it('should have a status as string', () => {
    // GIVEN
    let error = new StreamdataLegacyError('status', null, null);

    // THEN
    expect(error.status).toEqual('status');
  });

  it('should have a status as number', () => {
    // GIVEN
    let error = new StreamdataLegacyError(502, null, null);

    // THEN
    expect(error.status).toEqual(502);
  });
  it('should have a cause', () => {
    // GIVEN
    let error = new StreamdataLegacyError(null, 'cause', null);

    // THEN
    expect(error.cause).toEqual('cause');
  });

  it('should have a message', () => {
    // GIVEN
    let error = new StreamdataLegacyError(null, null, 'message');

    // THEN
    expect(error.message).toEqual('message');
  });

  it('should be fulfilled', () => {
    // GIVEN
    let error = new StreamdataLegacyError(502, 'cause', 'message');

    // THEN
    expect(error.cause).toEqual('cause');
    expect(error.message).toEqual('message');
    expect(error.status).toEqual(502);
    expect(error.source).toEqual('server');
    expect(error.isServer).toEqual(true);
    expect(error.isClient).toEqual(false);
  });

  it('should be fulfilled with client source', () => {
    // GIVEN
    let error = new StreamdataLegacyError(502, 'cause', 'message', Date.now().toString(), 'client');

    // THEN
    expect(error.cause).toEqual('cause');
    expect(error.message).toEqual('message');
    expect(error.status).toEqual(502);
    expect(error.source).toEqual('client');
    expect(error.isServer).toEqual(false);
    expect(error.isClient).toEqual(true);
  });

  it('should be fulfilled with default value and no original', () => {
    // GIVEN
    let error = StreamdataLegacyError.createDefault();

    // THEN
    expect(error.cause).toEqual(StreamdataLegacyError.DEFAULT_CAUSE);
    expect(error.message).toEqual(StreamdataLegacyError.DEFAULT_MESSAGE);
    expect(error.status).toEqual(StreamdataLegacyError.DEFAULT_STATUS);
    expect(error.source).toEqual(StreamdataLegacyError.DEFAULT_SOURCE);
    expect(error.original).toBeUndefined();
    expect(error.isServer).toEqual(true);
    expect(error.isClient).toEqual(false);
  });

  it('should be fulfilled with default value and original error', () => {
    // GIVEN
    let original = new Error('originel');

    // WHEN
    let error = StreamdataLegacyError.createDefault(original);

    // THEN
    expect(error.cause).toEqual(StreamdataLegacyError.DEFAULT_CAUSE);
    expect(error.message).toEqual(StreamdataLegacyError.DEFAULT_MESSAGE);
    expect(error.status).toEqual(StreamdataLegacyError.DEFAULT_STATUS);
    expect(error.source).toEqual(StreamdataLegacyError.DEFAULT_SOURCE);
    expect(error.original).toEqual(original);
    expect(error.isServer).toEqual(true);
    expect(error.isClient).toEqual(false);
  });
});
