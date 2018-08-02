"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (NODE_ENVIRONMENT) {
    exports.URL = require('url').URL;
}
else {
    exports.URL = window && window['URL'];
}
if (NODE_ENVIRONMENT) {
    exports.EventSource = require('eventsource');
}
else {
    exports.EventSource = window && window.EventSource;
}
//# sourceMappingURL=targets.config.js.map