export class UrlHelper {

  public static urlToString(protocol: string, hostname: string, port?: string | number): string {

    let url = protocol;
    if (!protocol.endsWith('://')) {
      url += '://';
    }
    url += hostname;
    if (!this._isEmptyPort(port)) {
      url += ':';
      url += port;
    }
    return url;
  }

  private static _isEmptyPort(port: string | number): boolean {

    if (this._isNumber(port)) {
      return !port || port === 0;
    }
    if (this._isString(port)) {
      return !port || 0 === port.length;
    }
    return true;
  }

  private static _isNumber(x: any): x is number {
    return typeof x === 'number';
  }

  private static _isString(x: any): x is string {
    return typeof x === 'string';
  }
}
