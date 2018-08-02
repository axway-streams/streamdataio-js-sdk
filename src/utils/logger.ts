import {JsonHelper} from './json-helper';

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
  public static console = console;

  /**
   * @private
   * @memberOf Logger#
   */
  public static level = LogLevel.INFO;


  public static debug(msg: string, ...args: any[]) {
    if (this.level >= LogLevel.DEBUG && this.console) {
      let debugMessage = this._formatLog(LogLevel.DEBUG, msg, args);
      if (this.console.debug) {
        this.console.debug(debugMessage);
      } else {
        this.console.log(debugMessage);
      }
    }
  }

  public static info(msg: string, ...args: any[]) {
    if (this.level >= LogLevel.INFO && this.console && this.console.info) {
      this.console.info(this._formatLog(LogLevel.INFO, msg, args));
    }
  }

  public static warn(msg: string, ...args: any[]) {
    if (this.level >= LogLevel.WARN && this.console && this.console.warn) {
      this.console.warn(this._formatLog(LogLevel.WARN, msg, args));
    }
  }

  public static error(msg: string, ...args: any[]) {
    if (this.level >= LogLevel.ERROR && this.console && this.console.error) {
      this.console.error(this._formatLog(LogLevel.ERROR, msg, args));
    }
  }


  /**
   * @private
   * @memberOf Logger#
   */
  private static _formatLog(level: LogLevel, pattern: string, args: any[]) {
    let replaceStr = pattern.replace(/{(\d+)}/g, (match, index) => {
      let replaced;
      if (args[index] && typeof args[index] === 'object' && args[index] instanceof Error) {
        if (args[index]['stack']) {
          replaced = args[index]['stack'];
        } else {
          replaced = `${args[index]['name']}: ${args[index]['message']}`;
        }
      } else if (args[index] && typeof args[index] === 'object') {
        replaced = JsonHelper.stringify(args[index]);
      } else if (args[index] && typeof args[index] === 'function') {
        replaced = 'function';
      } else if (args[index]) {
        replaced = args[index];
      } else {
        replaced = match;
      }
      return replaced;
    });
    return `[${LogLevel[level]}] ${replaceStr}`;
  }
}
