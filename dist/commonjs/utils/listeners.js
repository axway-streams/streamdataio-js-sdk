"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("./logger");
var preconditions_1 = require("./preconditions");
var Listeners = /** @class */ (function () {
    function Listeners() {
        this._listeners = [];
    }
    Object.defineProperty(Listeners.prototype, "listeners", {
        /**
         * Return the registered listeners
         *
         * @memberOf Listeners#
         */
        get: function () {
            return this._listeners;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param data
     * @memberOf Listeners#
     */
    Listeners.prototype.fire = function (data) {
        var listeners = this._listeners.slice(); // copy to prevent concurrent modifications
        listeners.forEach(function (listener) {
            var callback = listener.callback;
            var thisArg = listener.thisArg;
            try {
                if (thisArg) {
                    callback.apply(thisArg, [data]);
                }
                else {
                    callback(data);
                }
            }
            catch (error) {
                logger_1.Logger.error('Unable to fire event: {0}', error);
            }
        });
    };
    /**
     * @memberOf Listeners#
     * @param callback
     * @param thisArg
     */
    Listeners.prototype.addCallback = function (callback, thisArg) {
        var listener = {
            callback: callback,
            thisArg: thisArg
        };
        return this.add(listener);
    };
    /**
     * @memberOf Listeners#
     * @param listener
     */
    Listeners.prototype.add = function (listener) {
        preconditions_1.Preconditions.checkNotNull(listener, 'listener cannot be null');
        preconditions_1.Preconditions.checkNotNull(listener.callback, 'callback cannot be null');
        preconditions_1.Preconditions.checkExpression(this._listeners.indexOf(listener) === -1, 'listener already exists');
        this._listeners.push(listener);
        return listener;
    };
    /**
     * @memberOf Listeners#
     * @param listener
     */
    Listeners.prototype.remove = function (listener) {
        preconditions_1.Preconditions.checkNotNull(listener, 'listener cannot be null');
        var indexOf = this._listeners.indexOf(listener);
        preconditions_1.Preconditions.checkExpression(indexOf >= 0, 'listener doesn\'t exist');
        this._listeners.splice(indexOf, 1);
    };
    return Listeners;
}());
exports.Listeners = Listeners;
//# sourceMappingURL=listeners.js.map