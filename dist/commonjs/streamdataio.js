"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var streamdata_legacy_subscriber_1 = require("./proxy/streamdata-legacy-subscriber");
var streamdata_topic_subscriber_1 = require("./proxy/streamdata-topic-subscriber");
var streamdata_url_subscriber_1 = require("./proxy/streamdata-url-subscriber");
var logger_1 = require("./utils/logger");
var preconditions_1 = require("./utils/preconditions");
/**
 * Streamdata.io JavaScript SDK
 */
var StreamDataIo = /** @class */ (function () {
    function StreamDataIo() {
    }
    /**
     * @deprecated Since version 2.1.0. Use subscribeToUrl instead.
     *
     * <p>Create a new instance of the <code>StreamdataEventSource</code> prototype.</p>
     *
     * <p>The <code>StreamdataEventSource</code> is the main entry point for establishing Server Sent Event connection to a targeted JSON REST service URL.</p>
     *
     * @param {String} url Mandatory. The targeted REST URL is formatted as follow:
     * <pre><code>protocol://url(:port)(/localpath(?queryparameters))</code></pre>
     *
     * @param {String} appToken Mandatory. The application token to authentify the request
     *
     * @param {Array} headers Optional. Any specific headers that have to be added to the request. It must be an array with the following structure:<code>['Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==']</code>
     *
     * @param {Object} authStrategy Optional. An object which will enable HMAC signature of the request. You can create this object as follow:
     * <pre><code>
     * // setup headers
     * var headers = [];
     * // setup signatureStrategy
     * var signatureStrategy = AuthStrategy.newSignatureStrategy('NmEtYTljN2UtYmM1MGZlMGRiNGFQzYS00MGRkLTkNTZlMDY1','NTEtMTQxNiWIzMDEC00OWNlLThmNGYtY2ExMDJxO00NzNhLTgtZWY0MjOTc2YmUxODFiZDU1NmU0ZDAtYWU5NjYxMGYzNDdi');
     * // instantiate an eventSource
     * var eventSource = streamdataio.createEventSource('http://myRestservice.com/stocks','NmEtYTljN2UtYmM1MGZlMGRiNGFQzYS00MGRkLTkNTZlMDY1',headers,signatureStrategy);
     *
     * </code></pre>
     * @returns {StreamdataEventSource}
     */
    StreamDataIo.createEventSource = function (url, appToken, headers, authStrategy) {
        preconditions_1.Preconditions.deprecated('createEventSource', 'Since version 2.1.0. Use subscribeToUrl instead');
        preconditions_1.Preconditions.checkNotNull(url, 'url cannot be null');
        preconditions_1.Preconditions.checkNotNull(appToken, 'appToken cannot be null');
        if (!(url.lastIndexOf('http://', 0) === 0)
            && !(url.lastIndexOf('https://', 0) === 0)) {
            // if no valid protocol provided for url then add default (http://)
            url = 'http://' + url;
            logger_1.Logger.warn('url has no default protocol defined. Add http:// as a default protocol.');
        }
        return new streamdata_legacy_subscriber_1.StreamdataLegacySubscriber(url, appToken, headers, authStrategy);
    };
    StreamDataIo.subscribeToUrl = function (url, subscriberKey) {
        preconditions_1.Preconditions.checkNotNull(url, 'url cannot be null');
        preconditions_1.Preconditions.checkNotNull(subscriberKey, 'subscriberKey cannot be null');
        if (!(url.lastIndexOf('http://', 0) === 0)
            && !(url.lastIndexOf('https://', 0) === 0)) {
            // if no valid protocol provided for url then add default (http://)
            url = 'http://' + url;
            logger_1.Logger.warn('url has no default protocol defined. Add http:// as a default protocol.');
        }
        return new streamdata_url_subscriber_1.StreamdataUrlSubscriber(url, subscriberKey);
    };
    StreamDataIo.subscribeToTopic = function (topicId, subscriberKey) {
        preconditions_1.Preconditions.checkNotNull(topicId, 'topicId cannot be null');
        preconditions_1.Preconditions.checkNotNull(subscriberKey, 'subscriberKey cannot be null');
        return new streamdata_topic_subscriber_1.StreamdataTopicSubscriber(topicId, subscriberKey);
    };
    return StreamDataIo;
}());
exports.StreamDataIo = StreamDataIo;
//# sourceMappingURL=streamdataio.js.map