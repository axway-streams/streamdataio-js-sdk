import { JsonHelper } from './json-helper';
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 3] = "DEBUG";
})(LogLevel || (LogLevel = {}));
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.debug = function (msg) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.level >= LogLevel.DEBUG && this.console) {
            var debugMessage = this._formatLog(LogLevel.DEBUG, msg, args);
            if (this.console.debug) {
                this.console.debug(debugMessage);
            }
            else {
                this.console.log(debugMessage);
            }
        }
    };
    Logger.info = function (msg) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.level >= LogLevel.INFO && this.console && this.console.info) {
            this.console.info(this._formatLog(LogLevel.INFO, msg, args));
        }
    };
    Logger.warn = function (msg) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.level >= LogLevel.WARN && this.console && this.console.warn) {
            this.console.warn(this._formatLog(LogLevel.WARN, msg, args));
        }
    };
    Logger.error = function (msg) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.level >= LogLevel.ERROR && this.console && this.console.error) {
            this.console.error(this._formatLog(LogLevel.ERROR, msg, args));
        }
    };
    /**
     * @private
     * @memberOf Logger#
     */
    Logger._formatLog = function (level, pattern, args) {
        var replaceStr = pattern.replace(/{(\d+)}/g, function (match, index) {
            var replaced;
            if (args[index] && typeof args[index] === 'object' && args[index] instanceof Error) {
                if (args[index]['stack']) {
                    replaced = args[index]['stack'];
                }
                else {
                    replaced = args[index]['name'] + ": " + args[index]['message'];
                }
            }
            else if (args[index] && typeof args[index] === 'object') {
                replaced = JsonHelper.stringify(args[index]);
            }
            else if (args[index] && typeof args[index] === 'function') {
                replaced = 'function';
            }
            else if (args[index]) {
                replaced = args[index];
            }
            else {
                replaced = match;
            }
            return replaced;
        });
        return "[" + LogLevel[level] + "] " + replaceStr;
    };
    /**
     * @private
     * @memberOf Logger#
     */
    Logger.console = console;
    /**
     * @private
     * @memberOf Logger#
     */
    Logger.level = LogLevel.INFO;
    return Logger;
}());
export { Logger };
//# sourceMappingURL=logger.js.map