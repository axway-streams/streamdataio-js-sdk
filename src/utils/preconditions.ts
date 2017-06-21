import {Logger} from './logger';

export class Preconditions {
  /**
   * @memberOf Preconditions#
   * check if the value is not null
   * @param {*} value
   * @param {string} message
   */
  public static checkNotNull(value: any, message: string) {
    if (typeof value === 'undefined' || value === null) {
      if (message) {
        throw new Error(message);
      } else {
        throw new Error('value cannot be null');
      }
    }
    return value;
  }

  /**
   * @memberOf Preconditions#
   * log deprecated warning
   * @param {string} functionName
   * @param {string} message
   */
  public static deprecated(functionName: string, message: string) {
    this.checkNotNull(functionName, 'functionName cannot be null');
    this.checkNotNull(message, 'message cannot be null');

    Logger.warn('\'{0}\' is deprecated because \'{1}\'.', functionName, message);

  }

  /**
   * @memberOf Preconditions#
   * check is the provided expression is true
   * @param {*} expression
   * @param {string} message
   */
  public static checkExpression(expression: boolean, message: string) {
    if (!expression) {
      if (message) {
        throw new Error(message);
      } else {
        throw new Error('expression is not valid');
      }
    }
  }
}

