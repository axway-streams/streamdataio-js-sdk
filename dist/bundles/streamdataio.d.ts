// Generated by dts-bundle v0.7.2

export interface StreamDataAuthStrategy {
    signUrl(url: string): string;
}

export const DefaultStreamDataServer: StreamDataServer;

export type StreamDataSource = 'server' | 'client';
export class StreamDataError {
        static readonly DEFAULT_TYPE: string;
        static readonly DEFAULT_MESSAGE: string;
        static readonly DEFAULT_STATUS: number;
        static readonly DEFAULT_SOURCE: StreamDataSource;
        static createDefault(original: any): StreamDataError;
        type: string;
        message: string;
        status: number | string;
        source: string;
        original: any;
        constructor(type: string, message: string, status: number | string, source?: StreamDataSource, original?: any);
        /**
            * @memberOf StreamdataError#
            * @return {boolean} true if error is from server side.
            */
        readonly isServer: boolean;
        /**
            * @memberOf StreamdataError#
            * @return {boolean} true if error is from client side.
            */
        readonly isClient: boolean;
}

export class Listeners<T> {
        /**
            * @memberOf Listeners#
            */
        fire(data: T): void;
        /**
            * @memberOf Listeners#
            * @param callback
            * @param context
            */
        add(callback: (data: T) => void, context?: any): void;
        /**
            * @memberOf Listeners#
            * @param callback
            * @param context
            */
        remove(callback: (data: T) => void, context?: any): void;
}
export interface Listener<T> {
        callback: (data: T) => void;
        context?: any;
}

/**
    * Streamdata.io JavaScript SDK
    */
export class StreamDataIo {
        /**
            * <p>Create a new instance of the <code>StreamDataEventSource</code> prototype.</p>
            *
            * <p>The <code>StreamDataEventSource</code> is the main entry point for establishing Server Sent Event connection to a targeted JSON REST service URL.</p>
            *
            * @param {String} url Mandatory. The targeted REST URL is formatted as follow:
            * <pre><code>protocol://url(:port)(/localpath(?queryparameters))</code></pre>
            *
            * @param {String} token Mandatory. The application token to authentify the request
            *
            * @param {Array} headers Optional. Any specific headers that have to be added to the request. It must be an array with the following structure:<code>['Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==']</code>
            *
            * @param {Object} authStrategy Optional. An object which will enable HMAC signature of the request. You can create this object as follow:
            * <pre><code>
            * // setup headers
            * var headers = [];
            * // setup signatureStrategy
            * var signatureStrategy = AuthStrategy.newSignatureStrategy('NmEtYTljN2UtYmM1MGZlMGRiNGFQzYS00MGRkLTkNTZlMDY1','NTEtMTQxNiWIzMDEC00OWNlLThmNGYtY2ExMDJxO00NzNhLTgtZWY0MjOTc2YmUxODFiZDU1NmU0ZDAtYWU5NjYxMGYzNDdi');
            * // instantiate an eventSource
            * var eventSource = streamdataio.createEventSource('http://myRestservice.com/stocks','NmEtYTljN2UtYmM1MGZlMGRiNGFQzYS00MGRkLTkNTZlMDY1',headers,signatureStrategy);
            *
            * </code></pre>
            * @returns {StreamDataEventSource}
            */
        static createEventSource(url: string, appToken: string, headers: string[], authStragety?: StreamDataAuthStrategy): StreamData;
}
export const createEventSource: typeof StreamDataIo.createEventSource;

export interface Event {
}
export interface OpenEvent extends Event {
}
export interface DataEvent extends Event {
    readonly data: string;
}
export interface PatchEvent extends Event {
    readonly patch: any;
}
export interface MonitorEvent extends Event {
    readonly data: any;
}
export interface ErrorEvent extends Event {
    readonly error: any;
}

export class StreamDataEventSource {
    constructor(url: string);
    close(): void;
    addOpenListener(onOpenCallback: (event: OpenEvent) => void, context?: any): void;
    addErrorListener(onErrorCallback: (event: ErrorEvent) => void, context?: any): void;
    addDataListener(onDataCallback: (event: DataEvent) => void, context?: any): void;
    addPatchListener(onPatchCallback: (event: PatchEvent) => void, context?: any): void;
    addMonitorListener(onMonitorCallback: (event: MonitorEvent) => void, context?: any): void;
    isConnected(): boolean;
}
export class EventType {
    static readonly OPEN: string;
    static readonly ERROR: string;
    static readonly DATA: string;
    static readonly PATCH: string;
    static readonly MONITOR: string;
}

export class StreamDataServer {
    protocol: string;
    hostname: string;
    port: string;
    constructor(protocol: string, hostname: string, port?: string);
    toString(): string;
    getFullUrl(clientUrl: StreamDataUrl): string;
}

export class StreamDataUrl {
    clientUrl: string;
    constructor(url: string, token: string, headers?: string[]);
    toString(): string;
}

export class StreamData {
    server: StreamDataServer;
    constructor(url: string, appToken: string, headers?: string[], authStragety?: StreamDataAuthStrategy);
    open(): StreamData;
    close(): StreamData;
    onOpen(callback: (data: any) => void, context?: any): this;
    onError(callback: (data: StreamDataError) => void, context?: any): this;
    onData(callback: (data: any) => void, context?: any): this;
    onPatch(callback: (data: any) => void, context?: any): this;
    onMonitor(callback: (data: any) => void, context?: any): this;
    isConnected(): boolean;
}

export class JsonHelper {
    static validate(stringObj: string): boolean;
    static parse(stringObj: string): any;
    static stringify(obj: any): string;
}

export enum LogLevel {
        ERROR = 0,
        WARN = 1,
        INFO = 2,
        DEBUG = 3,
}
export class Logger {
        /**
            * @private
            * @memberOf Logger#
            */
        static _console: Console;
        /**
            * @memberOf Logger#
            * @param {number} newlevel
            */
        static setLevel(newLevel: LogLevel): void;
        static debug(msg: string, ...args: any[]): void;
        static info(msg: string, ...args: any[]): void;
        static warn(msg: string, ...args: any[]): void;
        static error(msg: string, ...args: any[]): void;
}

export class Preconditions {
        /**
            * @memberOf Preconditions#
            * check if the value is not null
            * @param {*} value
            * @param {string} message
            */
        static checkNotNull(value: any, message: string): any;
        /**
            * @memberOf Preconditions#
            * log deprecated warning
            * @param {string} functionName
            * @param {string} message
            */
        static deprecated(functionName: string, message: string): void;
        /**
            * @memberOf Preconditions#
            * check is the provided expression is true
            * @param {*} expression
            * @param {string} message
            */
        static checkExpression(expression: boolean, message: string): void;
}

export class UrlHelper {
    static urlToString(protocol: string, hostname: string, port?: string | number): string;
}

