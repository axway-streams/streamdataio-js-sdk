var StreamdataProxyError = /** @class */ (function () {
    function StreamdataProxyError(error) {
        this.datetime = !error || !error[StreamdataProxyError.JSON_DATETIME_KEY] ? Date.now().toString() : error[StreamdataProxyError.JSON_DATETIME_KEY];
        this.code = !error || !error[StreamdataProxyError.JSON_CODE_KEY] ? StreamdataProxyError.DEFAULT_CODE : error[StreamdataProxyError.JSON_CODE_KEY];
        this.message = !error || !error[StreamdataProxyError.JSON_MESSAGE_KEY] ? StreamdataProxyError.DEFAULT_MESSAGE : error[StreamdataProxyError.JSON_MESSAGE_KEY];
        this.category = !error || !error[StreamdataProxyError.JSON_CATEGORY_KEY] ? StreamdataProxyError.DEFAULT_CATEGORY : error[StreamdataProxyError.JSON_CATEGORY_KEY];
        this.status = !error || !error[StreamdataProxyError.JSON_STATUS_KEY] ? StreamdataProxyError.DEFAULT_CODE : error[StreamdataProxyError.JSON_STATUS_KEY];
        this.original = error;
    }
    Object.defineProperty(StreamdataProxyError.prototype, "isServer", {
        /**
         * @memberOf StreamdataProxyError#
         * @return {boolean} true if error is from server side.
         */
        get: function () {
            return this.category === 'ServerException';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StreamdataProxyError.prototype, "isClient", {
        /**
         * @memberOf StreamdataProxyError#
         * @return {boolean} true if error is from client side.
         */
        get: function () {
            return this.category === 'ClientException';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StreamdataProxyError.prototype, "isTopic", {
        /**
         * @memberOf StreamdataProxyError#
         * @return {boolean} true if error is from topic side.
         */
        get: function () {
            return this.category === 'TopicException';
        },
        enumerable: true,
        configurable: true
    });
    StreamdataProxyError.DEFAULT_CODE = 2000;
    StreamdataProxyError.DEFAULT_MESSAGE = 'An unknown error occurred. Please check your console logs for more details.';
    StreamdataProxyError.DEFAULT_CATEGORY = 'ServerException';
    StreamdataProxyError.JSON_DATETIME_KEY = 'datetime';
    StreamdataProxyError.JSON_CODE_KEY = 'code';
    StreamdataProxyError.JSON_MESSAGE_KEY = 'message';
    StreamdataProxyError.JSON_CATEGORY_KEY = 'category';
    /**
     * @deprecated for v1 retrocompatibility
     */
    StreamdataProxyError.JSON_STATUS_KEY = 'status';
    return StreamdataProxyError;
}());
export { StreamdataProxyError };
//# sourceMappingURL=streamdata-proxy-error.js.map