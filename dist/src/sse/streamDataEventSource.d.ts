import { DataEvent, ErrorEvent, MonitorEvent, OpenEvent, PatchEvent } from 'sse/streamDataEvents';
export declare class StreamDataEventSource {
    private readonly _sse;
    constructor(url: string);
    close(): void;
    addOpenListener(onOpenCallback: (event: OpenEvent) => void, context?: any): void;
    addErrorListener(onErrorCallback: (event: ErrorEvent) => void, context?: any): void;
    addDataListener(onDataCallback: (event: DataEvent) => void, context?: any): void;
    addPatchListener(onPatchCallback: (event: PatchEvent) => void, context?: any): void;
    addMonitorListener(onMonitorCallback: (event: MonitorEvent) => void, context?: any): void;
    isConnected(): boolean;
}
