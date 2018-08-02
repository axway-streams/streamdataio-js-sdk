// URL variable
export var URL;
if (NODE_ENVIRONMENT) {
    URL = require('url').URL;
}
else {
    URL = window && window['URL'];
}
// EventSource variable
export var EventSource;
if (NODE_ENVIRONMENT) {
    EventSource = require('eventsource');
}
else {
    EventSource = window && window.EventSource;
}
//# sourceMappingURL=targets.config.js.map