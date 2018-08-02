"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var targets_config_1 = require("../configuration/targets.config");
var streamdata_proxy_error_1 = require("../errors/streamdata-proxy-error");
var preconditions_1 = require("../utils/preconditions");
var streamdata_proxy_subscriber_1 = require("./streamdata-proxy-subscriber");
var StreamdataUrlSubscriber = /** @class */ (function (_super) {
    __extends(StreamdataUrlSubscriber, _super);
    function StreamdataUrlSubscriber(_url, subscriberKey) {
        var _this = _super.call(this, subscriberKey) || this;
        _this._url = _url;
        // Build internal configuration
        preconditions_1.Preconditions.checkNotNull(_this._url, 'url cannot be null.');
        return _this;
    }
    StreamdataUrlSubscriber.prototype.getStreamingUrl = function () {
        var url = new targets_config_1.URL("" + this._proxy.toString() + this._url);
        url.searchParams.append(streamdata_proxy_subscriber_1.StreamdataProxySubscriber.X_SD_SUBSCRIBER_KEY, encodeURIComponent(this._subscriberKey));
        return url;
    };
    StreamdataUrlSubscriber.prototype.buildError = function (error) {
        return new streamdata_proxy_error_1.StreamdataProxyError(error);
    };
    return StreamdataUrlSubscriber;
}(streamdata_proxy_subscriber_1.StreamdataProxySubscriber));
exports.StreamdataUrlSubscriber = StreamdataUrlSubscriber;
//# sourceMappingURL=streamdata-url-subscriber.js.map