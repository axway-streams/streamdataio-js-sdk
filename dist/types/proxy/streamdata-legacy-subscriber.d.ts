import { StreamdataAuthStrategy } from '../auth/streamdata-auth-strategy';
import { StreamdataLegacyError } from '../errors/streamdata-legacy-error';
import { StreamdataProxySubscriber } from './streamdata-proxy-subscriber';
export declare class StreamdataLegacySubscriber extends StreamdataProxySubscriber<StreamdataLegacyError> {
    private _url;
    private _headers?;
    private _authStrategy?;
    private static readonly X_SD_HEADER;
    private static readonly X_SD_TOKEN;
    constructor(_url: string, appToken: string, _headers?: string[], _authStrategy?: StreamdataAuthStrategy);
    protected getStreamingUrl(): URL;
    protected buildError(error: any): StreamdataLegacyError;
}
