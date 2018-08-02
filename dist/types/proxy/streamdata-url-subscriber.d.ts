import { StreamdataProxyError } from '../errors/streamdata-proxy-error';
import { StreamdataProxySubscriber } from './streamdata-proxy-subscriber';
export declare class StreamdataUrlSubscriber extends StreamdataProxySubscriber<StreamdataProxyError> {
    private _url;
    constructor(_url: string, subscriberKey: string);
    protected getStreamingUrl(): URL;
    protected buildError(error: any): StreamdataProxyError;
}
