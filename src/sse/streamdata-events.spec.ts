import {EventType} from './streamdata-events';

describe('EventType', () => {
  it('should have event type OPEN', () => {
    // GIVEN
    let eventType = EventType.OPEN;

    // THEN
    expect(eventType).toEqual('open');
  });

  it('should have event type ERROR', () => {
    // GIVEN
    let eventType = EventType.ERROR;

    // THEN
    expect(eventType).toEqual('error');
  });

  it('should have event type DATA', () => {
    // GIVEN
    let eventType = EventType.DATA;

    // THEN
    expect(eventType).toEqual('data');
  });

  it('should have event type PATCH', () => {
    // GIVEN
    let eventType = EventType.PATCH;

    // THEN
    expect(eventType).toEqual('patch');
  });

  it('should have event type MONITOR', () => {
    // GIVEN
    let eventType = EventType.MONITOR;

    // THEN
    expect(eventType).toEqual('monitor');
  });
});
