var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { DefaultStreamDataProxyVervion } from '../configuration/proxy.config';
import { URL } from '../configuration/targets.config';
import { StreamdataProxyError } from '../errors/streamdata-proxy-error';
import { Preconditions } from '../utils/preconditions';
import { StreamdataProxySubscriber } from './streamdata-proxy-subscriber';
var StreamdataTopicSubscriber = /** @class */ (function (_super) {
    __extends(StreamdataTopicSubscriber, _super);
    function StreamdataTopicSubscriber(_topicId, subscriberKey) {
        var _this = _super.call(this, subscriberKey) || this;
        _this._topicId = _topicId;
        // Build internal configuration
        Preconditions.checkNotNull(_this._topicId, 'topicId cannot be null.');
        _this.version = DefaultStreamDataProxyVervion;
        return _this;
    }
    Object.defineProperty(StreamdataTopicSubscriber.prototype, "version", {
        set: function (version) {
            this._version = version;
            if (this._version.startsWith('/')) {
                this._version = this._version.substring(1);
            }
            if (this._version.endsWith('/')) {
                this._version = this._version.substring(0, this._version.length - 1);
            }
        },
        enumerable: true,
        configurable: true
    });
    StreamdataTopicSubscriber.prototype.getStreamingUrl = function () {
        var url = new URL("" + this._proxy.toString() + this._version + "/topics/" + this._topicId);
        url.searchParams.append(StreamdataProxySubscriber.X_SD_SUBSCRIBER_KEY, encodeURIComponent(this._subscriberKey));
        return url;
    };
    StreamdataTopicSubscriber.prototype.buildError = function (error) {
        return new StreamdataProxyError(error);
    };
    return StreamdataTopicSubscriber;
}(StreamdataProxySubscriber));
export { StreamdataTopicSubscriber };
//# sourceMappingURL=streamdata-topic-subscriber.js.map