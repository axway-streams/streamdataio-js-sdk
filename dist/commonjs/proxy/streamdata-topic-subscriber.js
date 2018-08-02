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
var streamdata_proxy_error_1 = require("../errors/streamdata-proxy-error");
var preconditions_1 = require("../utils/preconditions");
var streamdata_proxy_subscriber_1 = require("./streamdata-proxy-subscriber");
var StreamdataTopicSubscriber = /** @class */ (function (_super) {
    __extends(StreamdataTopicSubscriber, _super);
    function StreamdataTopicSubscriber(_topicId, subscriberKey) {
        var _this = _super.call(this, subscriberKey) || this;
        _this._topicId = _topicId;
        // Build internal configuration
        preconditions_1.Preconditions.checkNotNull(_this._topicId, 'topicId cannot be null.');
        _this.version = proxy_config_1.DefaultStreamDataProxyVervion;
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
        var url = new targets_config_1.URL("" + this._proxy.toString() + this._version + "/topics/" + this._topicId);
        url.searchParams.append(streamdata_proxy_subscriber_1.StreamdataProxySubscriber.X_SD_SUBSCRIBER_KEY, encodeURIComponent(this._subscriberKey));
        return url;
    };
    StreamdataTopicSubscriber.prototype.buildError = function (error) {
        return new streamdata_proxy_error_1.StreamdataProxyError(error);
    };
    return StreamdataTopicSubscriber;
}(streamdata_proxy_subscriber_1.StreamdataProxySubscriber));
exports.StreamdataTopicSubscriber = StreamdataTopicSubscriber;
//# sourceMappingURL=streamdata-topic-subscriber.js.map