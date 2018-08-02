import {URL} from '../configuration/targets.config';
import {StreamdataProxyError} from '../errors/streamdata-proxy-error';
import {Logger} from '../utils/logger';
import {Preconditions} from '../utils/preconditions';
import {StreamdataProxySubscriber} from './streamdata-proxy-subscriber';

export class StreamdataUrlSubscriber extends StreamdataProxySubscriber<StreamdataProxyError> {

  constructor(private _url: string, subscriberKey: string) {
    super(subscriberKey);
    // Build internal configuration
    Preconditions.checkNotNull(this._url, 'url cannot be null.');
  }

  protected getStreamingUrl(): URL {
    let url = new URL(`${this._proxy.toString()}${this._url}`);
    url.searchParams.append(StreamdataProxySubscriber.X_SD_SUBSCRIBER_KEY, encodeURIComponent(this._subscriberKey));
    return url;
  }

  protected buildError(error: any): StreamdataProxyError {
    return new StreamdataProxyError(error);
  }
}



