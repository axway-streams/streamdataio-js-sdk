import { StreamDataError } from 'errors/streamDataError';
import { StreamDataServer } from 'sse/streamDataServer';
import { StreamDataAuthStrategy } from 'auth/streamDataAuthStrategy';
export declare class StreamData {
    private _url;
    private _appToken;
    private _headers?;
    private _authStrategy?;
    private _openListeners;
    private _dataListeners;
    private _patchListeners;
    private _errorListeners;
    private _monitorListeners;
    private _sse;
    server: StreamDataServer;
    constructor(_url: string, _appToken: string, _headers?: string[], _authStrategy?: StreamDataAuthStrategy);
    open(): StreamData;
    close(): StreamData;
    onOpen(callback: (data: any) => void, context?: any): this;
    onError(callback: (data: StreamDataError) => void, context?: any): this;
    onData(callback: (data: any) => void, context?: any): this;
    onPatch(callback: (data: any) => void, context?: any): this;
    onMonitor(callback: (data: any) => void, context?: any): this;
    isConnected(): boolean;
    private _decorate;
    private static _buildErrorMessage;
}
