export declare type StreamDataSource = 'server' | 'client';
export declare class StreamdataLegacyError {
    static readonly DEFAULT_CAUSE: string;
    static readonly DEFAULT_MESSAGE: string;
    static readonly DEFAULT_STATUS: number;
    static readonly DEFAULT_SOURCE: StreamDataSource;
    status: number | string;
    cause: string;
    message: string;
    timestamp: string;
    source: string;
    original: any;
    constructor(status: number | string, cause: string, message: string, timestamp?: string, source?: StreamDataSource, original?: any);
    /**
     * @memberOf StreamdataLegacyError#
     * @return {boolean} true if error is from server side.
     */
    readonly isServer: boolean;
    /**
     * @memberOf StreamdataLegacyError#
     * @return {boolean} true if error is from client side.
     */
    readonly isClient: boolean;
    static createDefault(original?: any): StreamdataLegacyError;
}
