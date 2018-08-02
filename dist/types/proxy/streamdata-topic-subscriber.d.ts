import { StreamdataProxyError } from '../errors/streamdata-proxy-error';
import { StreamdataProxySubscriber } from './streamdata-proxy-subscriber';
export declare class StreamdataTopicSubscriber extends StreamdataProxySubscriber<StreamdataProxyError> {
    private _topicId;
    constructor(_topicId: string, subscriberKey: string);
    private _version;
    version: string;
    protected getStreamingUrl(): URL;
    protected buildError(error: any): StreamdataProxyError;
}
