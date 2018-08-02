// Webpack Defined Plugin Variable
declare let NODE_ENVIRONMENT: boolean;

// URL variable
export let URL: any;
if (NODE_ENVIRONMENT) {
  URL = require('url').URL;
} else {
  URL = window && window['URL'];
}

// EventSource variable
export let EventSource: any;
if (NODE_ENVIRONMENT) {
  EventSource = require('eventsource');
} else {
  EventSource = window && (<EventSourceWindow>window).EventSource;
}

interface EventSourceWindow extends Window {
  EventSource: EventSource;
}