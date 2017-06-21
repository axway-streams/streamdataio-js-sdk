import {JsonHelper} from './jsonHelper';
export enum LogLevel {
  ERROR,
  WARN,
  INFO,
  DEBUG
}

export class Logger {

  /**
   * @private
   * @memberOf Logger#
   */
  public static _console = console;

  /**
   * @private
   * @memberOf Logger#
   */
  private static _level = LogLevel.INFO;

  /**
   * @memberOf Logger#
   * @param {number} newlevel
   */
  public static setLevel(newLevel: LogLevel) {
    this._level = newLevel;
  }

  public static debug(msg: string, ...args: any[]) {
    if (this._level >= LogLevel.DEBUG && this._console && this._console.log) {
      this._console.log(this._formatLog(msg, args));
    }
  }

  public static info(msg: string, ...args: any[]) {
    if (this._level >= LogLevel.INFO && this._console && this._console.info) {
      this._console.info(this._formatLog(msg, args));
    }
  }

  public static warn(msg: string, ...args: any[]) {
    if (this._level >= LogLevel.WARN && this._console && this._console.warn) {
      this._console.warn(this._formatLog(msg, args));
    }
  }

  public static error(msg: string, ...args: any[]) {
    if (this._level >= LogLevel.ERROR && this._console && this._console.error) {
      this._console.error(this._formatLog(msg, args));
    }
  }

  /**
   * @private
   * @memberOf Logger#
   */
  private static _formatLog(pattern: string, args: any[]) {
    return pattern.replace ? pattern.replace(/{(\d+)}/g, function (match, index) {
      var replaced;
      if (args[index] && typeof args[index] === 'object' && args[index] instanceof Error) {
        try {
          replaced = args[index]['message'];
          if (args[index]['stack']) {
            console.error(args[index]['stack']);
          }
        } catch (error) {
          replaced = args[index];
        }
      } else if (args[index] && typeof args[index] === 'object') {
        try {
          if (args[index].toString !== Object.prototype.toString) {
            replaced = args[index].toString();
          } else {
            replaced = JsonHelper.stringify(args[index]);
          }
        } catch (error) {
          replaced = args[index];
        }
      } else if (args[index] && typeof args[index] === 'function') {
        replaced = 'function';
      } else if (args[index]) {
        replaced = args[index];
      } else {
        replaced = match;
      }
      var replacedString = '' + replaced;
      return replacedString.substring(0, Math.min(500, replacedString.length));
    }) : pattern;
  }
}
