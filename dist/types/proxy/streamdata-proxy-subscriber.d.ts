export declare abstract class StreamdataProxySubscriber<E> {
    protected _subscriberKey: string;
    protected static readonly X_SD_SUBSCRIBER_KEY: string;
    private _openListeners;
    private _dataListeners;
    private _patchListeners;
    private _errorListeners;
    private _monitorListeners;
    private _sse;
    protected constructor(_subscriberKey: string);
    protected _proxy: URL;
    proxy: string | URL;
    open(): StreamdataProxySubscriber<E>;
    private static _parseMessageData;
    close(): StreamdataProxySubscriber<E>;
    onOpen(callback: (data: any) => void, thisArg?: any): StreamdataProxySubscriber<E>;
    onError(callback: (data: E) => void, thisArg?: any): StreamdataProxySubscriber<E>;
    onData(callback: (data: any) => void, thisArg?: any): StreamdataProxySubscriber<E>;
    onPatch(callback: (data: any) => void, thisArg?: any): StreamdataProxySubscriber<E>;
    onMonitor(callback: (data: any) => void, thisArg?: any): StreamdataProxySubscriber<E>;
    isConnected(): boolean;
    protected abstract getStreamingUrl(): URL;
    protected abstract buildError(error: any): E;
}
