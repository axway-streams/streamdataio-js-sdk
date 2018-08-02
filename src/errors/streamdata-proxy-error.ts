export type ErrorCategory = 'ClientException' | 'ServerException' | 'TopicException';

export class StreamdataProxyError {

  private static readonly DEFAULT_CODE: number = 2000;
  private static readonly DEFAULT_MESSAGE: string = 'An unknown error occurred. Please check your console logs for more details.';
  private static readonly DEFAULT_CATEGORY: ErrorCategory = 'ServerException';

  private static readonly JSON_DATETIME_KEY: string = 'datetime';
  private static readonly JSON_CODE_KEY: string = 'code';
  private static readonly JSON_MESSAGE_KEY: string = 'message';
  private static readonly JSON_CATEGORY_KEY: string = 'category';
  /**
   * @deprecated for v1 retrocompatibility
   */
  private static readonly JSON_STATUS_KEY: string = 'status';

  public datetime: string;
  public code: number | string;
  public message: string;
  public category: ErrorCategory;
  public status?: number | string;
  public original?: any;


  constructor(error?: any) {
    this.datetime = !error || !error[StreamdataProxyError.JSON_DATETIME_KEY] ? Date.now().toString() : error[StreamdataProxyError.JSON_DATETIME_KEY];
    this.code = !error || !error[StreamdataProxyError.JSON_CODE_KEY] ? StreamdataProxyError.DEFAULT_CODE : error[StreamdataProxyError.JSON_CODE_KEY];
    this.message = !error || !error[StreamdataProxyError.JSON_MESSAGE_KEY] ? StreamdataProxyError.DEFAULT_MESSAGE : error[StreamdataProxyError.JSON_MESSAGE_KEY];
    this.category = !error || !error[StreamdataProxyError.JSON_CATEGORY_KEY] ? StreamdataProxyError.DEFAULT_CATEGORY : error[StreamdataProxyError.JSON_CATEGORY_KEY];
    this.status = !error || !error[StreamdataProxyError.JSON_STATUS_KEY] ? StreamdataProxyError.DEFAULT_CODE : error[StreamdataProxyError.JSON_STATUS_KEY];
    this.original = error;
  }

  /**
   * @memberOf StreamdataProxyError#
   * @return {boolean} true if error is from server side.
   */
  public get isServer(): boolean {
    return this.category === 'ServerException';
  }

  /**
   * @memberOf StreamdataProxyError#
   * @return {boolean} true if error is from client side.
   */
  public get isClient(): boolean {
    return this.category === 'ClientException';
  }

  /**
   * @memberOf StreamdataProxyError#
   * @return {boolean} true if error is from topic side.
   */
  public get isTopic(): boolean {
    return this.category === 'TopicException';
  }
}

