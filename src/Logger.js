var Logger = (function () {
  'use strict';

  var console = window['console'];

  var DEBUG = 3, INFO = 2, WARN = 1, ERROR = 0;
  /**
   * @private
   * @memberOf Logger#
   */
  var level = INFO;

  /**
   * @private
   * @memberOf Logger#
   */
  var _formatLog = function (pattern, args) {
    return pattern.replace(/{(\d+)}/g, function (match, number) {
      var replaced;
      if (args[number] && typeof args[number] === 'object' && args[number] instanceof Error) {
        try {
          replaced = args[number]['message'];
          if (args[number]['stack']) {
            console.error(args[number]['stack']);
          }
        } catch (error) {
          replaced = args[number];
        }
      } else if (args[number] && typeof args[number] === 'object') {
        try {
          if (args[number].toString !== Object.prototype.toString) {
            replaced = args[number].toString();
          } else {
            replaced = JSON.stringify(args[number]);
          }
        } catch (error) {
          replaced = args[number];
        }
      } else if (args[number] && typeof args[number] === 'function') {
        replaced = 'function';
      } else if (args[number]) {
        replaced = args[number];
      } else {
        replaced = match;
      }
      var replacedString = '' + replaced;
      return replacedString.substring(0, Math.min(500, replacedString.length));
    });
  };

  /**
   * @namespace
   */
  return {
    /**
     * @memberOf Logger#
     * @constant {number}
     */
    DEBUG: DEBUG,
    /**
     * @memberOf Logger#
     * @constant {number}
     */
    INFO: INFO,
    /**
     * @memberOf Logger#
     * @constant {number}
     */
    WARN: WARN,
    /**
     * @memberOf Logger#
     * @constant {number}
     */
    ERROR: ERROR,

    /**
     * @memberOf Logger#
     * @param {number} newLevel
     */
    setLevel: function (newLevel) {
      level = newLevel;
    },
    /**
     * @memberOf Logger#
     */
    debug: function () {
      if (level >= DEBUG && console && console.log) {
        console.log(_formatLog(arguments[0], Array.prototype.slice.call(arguments, 1)));
      }
    },
    /**
     * @memberOf Logger#
     */
    info: function () {
      if (level >= INFO && console && console.info) {
        console.info(_formatLog(arguments[0], Array.prototype.slice.call(arguments, 1)));
      }
    },
    /**
     * @memberOf Logger#
     */
    warn: function () {
      if (level >= WARN && console && console.warn) {
        console.warn(_formatLog(arguments[0], Array.prototype.slice.call(arguments, 1)));
      }
    },
    /**
     * @memberOf Logger#
     */
    error: function () {
      if (level >= ERROR && console && console.error) {
        console.error(_formatLog(arguments[0], Array.prototype.slice.call(arguments, 1)));
      }
    }
  };
})();