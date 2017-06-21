export type StreamDataSource = 'server' | 'client';

export class StreamDataError {

  public static readonly DEFAULT_TYPE: string = 'UnknownError';
  public static readonly DEFAULT_MESSAGE: string = 'An error occured. Please check your console logs for more details.';
  public static readonly DEFAULT_STATUS: number = 1000;
  public static readonly DEFAULT_SOURCE: StreamDataSource = 'server';

  public static createDefault(original: any) {
    return new StreamDataError(StreamDataError.DEFAULT_TYPE, StreamDataError.DEFAULT_MESSAGE, StreamDataError.DEFAULT_STATUS, StreamDataError.DEFAULT_SOURCE, original);
  }

  public type: string;
  public message: string;
  public status: number | string;
  public source: string;
  public original: any;

  constructor(type: string, message: string, status: number | string, source?: StreamDataSource, original?: any) {
    this.type = type;
    this.message = message;
    this.status = status;
    this.original = original;
    this.source = source ? source : 'server';
  }

  /**
   * @memberOf StreamdataError#
   * @return {boolean} true if error is from server side.
   */
  public get isServer(): boolean {
    return this.source === 'server';
  }

  /**
   * @memberOf StreamdataError#
   * @return {boolean} true if error is from client side.
   */
  public get isClient(): boolean {
    return this.source === 'client';
  }
}

