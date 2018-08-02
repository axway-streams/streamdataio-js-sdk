"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var proxy_config_1 = require("../configuration/proxy.config");
var targets_config_1 = require("../configuration/targets.config");
var streamdata_events_1 = require("../sse/streamdata-events");
var json_helper_1 = require("../utils/json-helper");
var listeners_1 = require("../utils/listeners");
var logger_1 = require("../utils/logger");
var preconditions_1 = require("../utils/preconditions");
var StreamdataProxySubscriber = /** @class */ (function () {
    function StreamdataProxySubscriber(_subscriberKey) {
        this._subscriberKey = _subscriberKey;
        // Listeners
        this._openListeners = new listeners_1.Listeners();
        this._dataListeners = new listeners_1.Listeners();
        this._patchListeners = new listeners_1.Listeners();
        this._errorListeners = new listeners_1.Listeners();
        this._monitorListeners = new listeners_1.Listeners();
        // Build internal configuration
        preconditions_1.Preconditions.checkNotNull(this._subscriberKey, 'subscriberKey cannot be null.');
        // SSE
        this._sse = null;
        this._proxy = proxy_config_1.DefaultStreamDataProxyURL;
    }
    Object.defineProperty(StreamdataProxySubscriber.prototype, "proxy", {
        set: function (proxyURL) {
            if (typeof proxyURL === 'string') {
                if (!proxyURL.endsWith('/')) {
                    proxyURL += '/';
                }
                this._proxy = new targets_config_1.URL(proxyURL);
            }
            else {
                this._proxy = proxyURL;
            }
            logger_1.Logger.debug('Set proxy url to: ' + this._proxy);
        },
        enumerable: true,
        configurable: true
    });
    StreamdataProxySubscriber.prototype.open = function () {
        var _this = this;
        // Shutdown the actual sse client
        this.close();
        logger_1.Logger.debug('Opening SSE Stream');
        var streamingUrl = this.getStreamingUrl();
        preconditions_1.Preconditions.checkNotNull(streamingUrl, 'Stream url cannot be null');
        logger_1.Logger.debug('Streaming url built: ' + streamingUrl);
        this._sse = new targets_config_1.EventSource(streamingUrl.toString());
        this._sse.addEventListener(streamdata_events_1.EventType.OPEN, function () {
            logger_1.Logger.debug('SSE Stream opened to [{0}]', streamingUrl);
            _this._openListeners.fire({});
        });
        this._sse.addEventListener(streamdata_events_1.EventType.DATA, function (messageEvent) {
            logger_1.Logger.debug('Received data: [{0}]', messageEvent.data);
            var data = StreamdataProxySubscriber._parseMessageData(messageEvent);
            _this._dataListeners.fire(data);
        });
        this._sse.addEventListener(streamdata_events_1.EventType.ERROR, function (messageEvent) {
            logger_1.Logger.error('Error received, server connection lost, retrying ... [{0}]', messageEvent.data);
            var error = StreamdataProxySubscriber._parseMessageData(messageEvent);
            _this._errorListeners.fire(_this.buildError(error));
        });
        this._sse.addEventListener(streamdata_events_1.EventType.PATCH, function (messageEvent) {
            logger_1.Logger.debug('Received patch: [{0}]', messageEvent.data);
            var patch = StreamdataProxySubscriber._parseMessageData(messageEvent);
            _this._patchListeners.fire(patch);
        });
        this._sse.addEventListener(streamdata_events_1.EventType.MONITOR, function (messageEvent) {
            logger_1.Logger.debug('Received monitor: [{0}]', messageEvent.data);
            var monitor = StreamdataProxySubscriber._parseMessageData(messageEvent);
            _this._monitorListeners.fire(monitor);
        });
        return this;
    };
    StreamdataProxySubscriber._parseMessageData = function (messageEvent) {
        return messageEvent.data ? json_helper_1.JsonHelper.parse(messageEvent.data) : null;
    };
    StreamdataProxySubscriber.prototype.close = function () {
        if (this._sse && (this._sse.readyState === targets_config_1.EventSource.OPEN || this._sse.readyState === targets_config_1.EventSource.CONNECTING)) {
            logger_1.Logger.debug('Closing SSE Stream');
            this._sse.close();
        }
        return this;
    };
    StreamdataProxySubscriber.prototype.onOpen = function (callback, thisArg) {
        this._openListeners.addCallback(callback, thisArg);
        return this;
    };
    StreamdataProxySubscriber.prototype.onError = function (callback, thisArg) {
        this._errorListeners.addCallback(callback, thisArg);
        return this;
    };
    StreamdataProxySubscriber.prototype.onData = function (callback, thisArg) {
        this._dataListeners.addCallback(callback, thisArg);
        return this;
    };
    StreamdataProxySubscriber.prototype.onPatch = function (callback, thisArg) {
        this._patchListeners.addCallback(callback, thisArg);
        return this;
    };
    StreamdataProxySubscriber.prototype.onMonitor = function (callback, thisArg) {
        this._monitorListeners.addCallback(callback, thisArg);
        return this;
    };
    StreamdataProxySubscriber.prototype.isConnected = function () {
        return this._sse && this._sse.readyState === targets_config_1.EventSource.OPEN;
    };
    StreamdataProxySubscriber.X_SD_SUBSCRIBER_KEY = 'X-Sd-Subscriber-Key';
    return StreamdataProxySubscriber;
}());
exports.StreamdataProxySubscriber = StreamdataProxySubscriber;
//# sourceMappingURL=streamdata-proxy-subscriber.js.map