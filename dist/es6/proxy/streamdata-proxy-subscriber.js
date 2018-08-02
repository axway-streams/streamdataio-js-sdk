import { DefaultStreamDataProxyURL } from '../configuration/proxy.config';
import { EventSource, URL } from '../configuration/targets.config';
import { EventType } from '../sse/streamdata-events';
import { JsonHelper } from '../utils/json-helper';
import { Listeners } from '../utils/listeners';
import { Logger } from '../utils/logger';
import { Preconditions } from '../utils/preconditions';
var StreamdataProxySubscriber = /** @class */ (function () {
    function StreamdataProxySubscriber(_subscriberKey) {
        this._subscriberKey = _subscriberKey;
        // Listeners
        this._openListeners = new Listeners();
        this._dataListeners = new Listeners();
        this._patchListeners = new Listeners();
        this._errorListeners = new Listeners();
        this._monitorListeners = new Listeners();
        // Build internal configuration
        Preconditions.checkNotNull(this._subscriberKey, 'subscriberKey cannot be null.');
        // SSE
        this._sse = null;
        this._proxy = DefaultStreamDataProxyURL;
    }
    Object.defineProperty(StreamdataProxySubscriber.prototype, "proxy", {
        set: function (proxyURL) {
            if (typeof proxyURL === 'string') {
                if (!proxyURL.endsWith('/')) {
                    proxyURL += '/';
                }
                this._proxy = new URL(proxyURL);
            }
            else {
                this._proxy = proxyURL;
            }
            Logger.debug('Set proxy url to: ' + this._proxy);
        },
        enumerable: true,
        configurable: true
    });
    StreamdataProxySubscriber.prototype.open = function () {
        var _this = this;
        // Shutdown the actual sse client
        this.close();
        Logger.debug('Opening SSE Stream');
        var streamingUrl = this.getStreamingUrl();
        Preconditions.checkNotNull(streamingUrl, 'Stream url cannot be null');
        Logger.debug('Streaming url built: ' + streamingUrl);
        this._sse = new EventSource(streamingUrl.toString());
        this._sse.addEventListener(EventType.OPEN, function () {
            Logger.debug('SSE Stream opened to [{0}]', streamingUrl);
            _this._openListeners.fire({});
        });
        this._sse.addEventListener(EventType.DATA, function (messageEvent) {
            Logger.debug('Received data: [{0}]', messageEvent.data);
            var data = StreamdataProxySubscriber._parseMessageData(messageEvent);
            _this._dataListeners.fire(data);
        });
        this._sse.addEventListener(EventType.ERROR, function (messageEvent) {
            Logger.error('Error received, server connection lost, retrying ... [{0}]', messageEvent.data);
            var error = StreamdataProxySubscriber._parseMessageData(messageEvent);
            _this._errorListeners.fire(_this.buildError(error));
        });
        this._sse.addEventListener(EventType.PATCH, function (messageEvent) {
            Logger.debug('Received patch: [{0}]', messageEvent.data);
            var patch = StreamdataProxySubscriber._parseMessageData(messageEvent);
            _this._patchListeners.fire(patch);
        });
        this._sse.addEventListener(EventType.MONITOR, function (messageEvent) {
            Logger.debug('Received monitor: [{0}]', messageEvent.data);
            var monitor = StreamdataProxySubscriber._parseMessageData(messageEvent);
            _this._monitorListeners.fire(monitor);
        });
        return this;
    };
    StreamdataProxySubscriber._parseMessageData = function (messageEvent) {
        return messageEvent.data ? JsonHelper.parse(messageEvent.data) : null;
    };
    StreamdataProxySubscriber.prototype.close = function () {
        if (this._sse && (this._sse.readyState === EventSource.OPEN || this._sse.readyState === EventSource.CONNECTING)) {
            Logger.debug('Closing SSE Stream');
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
        return this._sse && this._sse.readyState === EventSource.OPEN;
    };
    StreamdataProxySubscriber.X_SD_SUBSCRIBER_KEY = 'X-Sd-Subscriber-Key';
    return StreamdataProxySubscriber;
}());
export { StreamdataProxySubscriber };
//# sourceMappingURL=streamdata-proxy-subscriber.js.map