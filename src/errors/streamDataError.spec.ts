import {StreamDataError} from "errors/streamDataError";
describe('StreamDataError', () => {
  it('should have a type', () => {
    let error = new StreamDataError('type', null, null);

    expect(error.type).toBe('type');
  });

  it('should have a message', () => {
    let error = new StreamDataError(null, 'message', null);

    expect(error.message).toBe('message');
  });

  it('should have a status as string', () => {
    let error = new StreamDataError(null, null, 'status');

    expect(error.status).toBe('status');
  });

  it('should have a status as number', () => {
    let error = new StreamDataError(null, null, 502);

    expect(error.status).toBe(502);
  });

  it('should be completed', () => {
    let error = new StreamDataError('type', 'message', 502);

    expect(error.type).toBe('type');
    expect(error.message).toBe('message');
    expect(error.status).toBe(502);
    expect(error.source).toBe('server');
    expect(error.isServer).toBe(true);
    expect(error.isClient).toBe(false);
  });

  it('should be completed with client source', () => {
    let error = new StreamDataError('type', 'message', 502, 'client');

    expect(error.type).toBe('type');
    expect(error.message).toBe('message');
    expect(error.status).toBe(502);
    expect(error.source).toBe('client');
    expect(error.isServer).toBe(false);
    expect(error.isClient).toBe(true);
  });
});
