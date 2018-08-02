export type StreamDataSource = 'server' | 'client';

export class StreamdataLegacyError {

  public static readonly DEFAULT_CAUSE: string = 'UnknownError';
  public static readonly DEFAULT_MESSAGE: string = 'An error occured. Please check your console logs for more details.';
  public static readonly DEFAULT_STATUS: number = 1000;
  public static readonly DEFAULT_SOURCE: StreamDataSource = 'server';
  public status: number | string;
  public cause: string;
  public message: string;
  public timestamp: string;
  public source: string;
  public original: any;

  constructor(status: number | string, cause: string, message: string, timestamp?: string, source?: StreamDataSource, original?: any) {
    this.status = status;
    this.cause = cause;
    this.message = message;
    this.timestamp = timestamp ? timestamp : Date.now().toString();
    this.source = source ? source : 'server';
    this.original = original;
  }

  /**
   * @memberOf StreamdataLegacyError#
   * @return {boolean} true if error is from server side.
   */
  public get isServer(): boolean {
    return this.source === 'server';
  }

  /**
   * @memberOf StreamdataLegacyError#
   * @return {boolean} true if error is from client side.
   */
  public get isClient(): boolean {
    return this.source === 'client';
  }

  public static createDefault(original?: any) {
    return new StreamdataLegacyError(
      StreamdataLegacyError.DEFAULT_STATUS,
      StreamdataLegacyError.DEFAULT_CAUSE,
      StreamdataLegacyError.DEFAULT_MESSAGE,
      Date.now().toString(),
      StreamdataLegacyError.DEFAULT_SOURCE,
      original);
  }
}

