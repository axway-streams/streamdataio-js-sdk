var StreamDataError = /** @class */ (function () {
    function StreamDataError(type, message, status, source, original) {
        this.type = type;
        this.message = message;
        this.status = status;
        this.original = original;
        this.source = source ? source : 'server';
    }
    StreamDataError.createDefault = function (original) {
        return new StreamDataError(StreamDataError.DEFAULT_TYPE, StreamDataError.DEFAULT_MESSAGE, StreamDataError.DEFAULT_STATUS, StreamDataError.DEFAULT_SOURCE, original);
    };
    Object.defineProperty(StreamDataError.prototype, "isServer", {
        /**
         * @memberOf StreamdataError#
         * @return {boolean} true if error is from server side.
         */
        get: function () {
            return this.source === 'server';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StreamDataError.prototype, "isClient", {
        /**
         * @memberOf StreamdataError#
         * @return {boolean} true if error is from client side.
         */
        get: function () {
            return this.source === 'client';
        },
        enumerable: true,
        configurable: true
    });
    StreamDataError.DEFAULT_TYPE = 'UnknownError';
    StreamDataError.DEFAULT_MESSAGE = 'An error occured. Please check your console logs for more details.';
    StreamDataError.DEFAULT_STATUS = 1000;
    StreamDataError.DEFAULT_SOURCE = 'server';
    return StreamDataError;
}());
export { StreamDataError };
//# sourceMappingURL=streamDataError.js.map