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
import { URL } from '../configuration/targets.config';
import { StreamdataProxyError } from '../errors/streamdata-proxy-error';
import { Preconditions } from '../utils/preconditions';
import { StreamdataProxySubscriber } from './streamdata-proxy-subscriber';
var StreamdataUrlSubscriber = /** @class */ (function (_super) {
    __extends(StreamdataUrlSubscriber, _super);
    function StreamdataUrlSubscriber(_url, subscriberKey) {
        var _this = _super.call(this, subscriberKey) || this;
        _this._url = _url;
        // Build internal configuration
        Preconditions.checkNotNull(_this._url, 'url cannot be null.');
        return _this;
    }
    StreamdataUrlSubscriber.prototype.getStreamingUrl = function () {
        var url = new URL("" + this._proxy.toString() + this._url);
        url.searchParams.append(StreamdataProxySubscriber.X_SD_SUBSCRIBER_KEY, encodeURIComponent(this._subscriberKey));
        return url;
    };
    StreamdataUrlSubscriber.prototype.buildError = function (error) {
        return new StreamdataProxyError(error);
    };
    return StreamdataUrlSubscriber;
}(StreamdataProxySubscriber));
export { StreamdataUrlSubscriber };
//# sourceMappingURL=streamdata-url-subscriber.js.map