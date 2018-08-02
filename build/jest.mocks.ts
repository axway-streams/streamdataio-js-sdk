import {EventSource} from '../src/configuration/targets.config';

Object.defineProperty(global, 'NODE_ENVIRONMENT', {value: false});

const EventSourceMock = require('eventsourcemock');
// eventsourcemock doesn't define those constants
EventSourceMock.default.CONNECTING = 0;
EventSourceMock.default.OPEN = 1;
EventSourceMock.default.CLOSED = 2;
Object.defineProperty(window, 'EventSource', {
  value: EventSourceMock.default
});

// console.log = jest.fn();
console.debug = jest.fn();
console.info = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();