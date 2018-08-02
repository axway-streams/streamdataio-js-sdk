export declare type ErrorCategory = 'ClientException' | 'ServerException' | 'TopicException';
export declare class StreamdataProxyError {
    private static readonly DEFAULT_CODE;
    private static readonly DEFAULT_MESSAGE;
    private static readonly DEFAULT_CATEGORY;
    private static readonly JSON_DATETIME_KEY;
    private static readonly JSON_CODE_KEY;
    private static readonly JSON_MESSAGE_KEY;
    private static readonly JSON_CATEGORY_KEY;
    /**
     * @deprecated for v1 retrocompatibility
     */
    private static readonly JSON_STATUS_KEY;
    datetime: string;
    code: number | string;
    message: string;
    category: ErrorCategory;
    status?: number | string;
    original?: any;
    constructor(error?: any);
    /**
     * @memberOf StreamdataProxyError#
     * @return {boolean} true if error is from server side.
     */
    readonly isServer: boolean;
    /**
     * @memberOf StreamdataProxyError#
     * @return {boolean} true if error is from client side.
     */
    readonly isClient: boolean;
    /**
     * @memberOf StreamdataProxyError#
     * @return {boolean} true if error is from topic side.
     */
    readonly isTopic: boolean;
}
