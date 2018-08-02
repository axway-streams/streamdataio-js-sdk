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
var proxy_config_1 = require("../configuration/proxy.config");
var targets_config_1 = require("../configuration/targets.config");
var streamdata_legacy_error_1 = require("../errors/streamdata-legacy-error");
var preconditions_1 = require("../utils/preconditions");
var streamdata_proxy_subscriber_1 = require("./streamdata-proxy-subscriber");
var StreamdataLegacySubscriber = /** @class */ (function (_super) {
    __extends(StreamdataLegacySubscriber, _super);
    function StreamdataLegacySubscriber(_url, appToken, _headers, _authStrategy) {
        var _this = _super.call(this, appToken) || this;
        _this._url = _url;
        _this._headers = _headers;
        _this._authStrategy = _authStrategy;
        // Build internal configuration
        preconditions_1.Preconditions.checkNotNull(_this._url, 'url cannot be null.');
        _this.proxy = proxy_config_1.LegacyStreamDataProxy;
        return _this;
    }
    StreamdataLegacySubscriber.prototype.getStreamingUrl = function () {
        var signedUrl = this._authStrategy ? this._authStrategy.signUrl(this._url) : this._url;
        var url = new targets_config_1.URL("" + this._proxy.toString() + signedUrl);
        this._headers && this._headers.forEach(function (header) {
            return url.searchParams.append(StreamdataLegacySubscriber.X_SD_HEADER, encodeURIComponent(header));
        });
        url.searchParams.append(StreamdataLegacySubscriber.X_SD_TOKEN, encodeURIComponent(this._subscriberKey));
        return url;
    };
    StreamdataLegacySubscriber.prototype.buildError = function (error) {
        if (error['status'] || error['cause'] || error['message']) {
            return new streamdata_legacy_error_1.StreamdataLegacyError(error['status'], error['cause'], error['message'], error['timestamp'], error['source']);
        }
        else {
            return streamdata_legacy_error_1.StreamdataLegacyError.createDefault(error);
        }
    };
    StreamdataLegacySubscriber.X_SD_HEADER = 'X-Sd-Header';
    StreamdataLegacySubscriber.X_SD_TOKEN = 'X-Sd-Token';
    return StreamdataLegacySubscriber;
}(streamdata_proxy_subscriber_1.StreamdataProxySubscriber));
exports.StreamdataLegacySubscriber = StreamdataLegacySubscriber;
//# sourceMappingURL=streamdata-legacy-subscriber.js.map