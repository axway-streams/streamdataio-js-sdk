var StreamdataLegacyError = /** @class */ (function () {
    function StreamdataLegacyError(status, cause, message, timestamp, source, original) {
        this.status = status;
        this.cause = cause;
        this.message = message;
        this.timestamp = timestamp ? timestamp : Date.now().toString();
        this.source = source ? source : 'server';
        this.original = original;
    }
    Object.defineProperty(StreamdataLegacyError.prototype, "isServer", {
        /**
         * @memberOf StreamdataLegacyError#
         * @return {boolean} true if error is from server side.
         */
        get: function () {
            return this.source === 'server';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StreamdataLegacyError.prototype, "isClient", {
        /**
         * @memberOf StreamdataLegacyError#
         * @return {boolean} true if error is from client side.
         */
        get: function () {
            return this.source === 'client';
        },
        enumerable: true,
        configurable: true
    });
    StreamdataLegacyError.createDefault = function (original) {
        return new StreamdataLegacyError(StreamdataLegacyError.DEFAULT_STATUS, StreamdataLegacyError.DEFAULT_CAUSE, StreamdataLegacyError.DEFAULT_MESSAGE, Date.now().toString(), StreamdataLegacyError.DEFAULT_SOURCE, original);
    };
    StreamdataLegacyError.DEFAULT_CAUSE = 'UnknownError';
    StreamdataLegacyError.DEFAULT_MESSAGE = 'An error occured. Please check your console logs for more details.';
    StreamdataLegacyError.DEFAULT_STATUS = 1000;
    StreamdataLegacyError.DEFAULT_SOURCE = 'server';
    return StreamdataLegacyError;
}());
export { StreamdataLegacyError };
//# sourceMappingURL=streamdata-legacy-error.js.map