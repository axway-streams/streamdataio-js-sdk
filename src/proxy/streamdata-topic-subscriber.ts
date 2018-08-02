import {DefaultStreamDataProxyVervion} from '../configuration/proxy.config';
import {URL} from '../configuration/targets.config';
import {StreamdataProxyError} from '../errors/streamdata-proxy-error';
import {Logger} from '../utils/logger';
import {Preconditions} from '../utils/preconditions';
import {StreamdataProxySubscriber} from './streamdata-proxy-subscriber';

export class StreamdataTopicSubscriber extends StreamdataProxySubscriber<StreamdataProxyError> {

  constructor(private _topicId: string, subscriberKey: string) {
    super(subscriberKey);
    // Build internal configuration
    Preconditions.checkNotNull(this._topicId, 'topicId cannot be null.');

    this.version = DefaultStreamDataProxyVervion;
  }

  private _version: string;

  public set version(version: string) {
    this._version = version;
    if (this._version.startsWith('/')) {
      this._version = this._version.substring(1);
    }
    if (this._version.endsWith('/')) {
      this._version = this._version.substring(0, this._version.length - 1);
    }
  }

  protected getStreamingUrl(): URL {
    let url = new URL(`${this._proxy.toString()}${this._version}/topics/${this._topicId}`);
    url.searchParams.append(StreamdataProxySubscriber.X_SD_SUBSCRIBER_KEY, encodeURIComponent(this._subscriberKey));
    return url;
  }

  protected buildError(error: any): StreamdataProxyError {
    return new StreamdataProxyError(error);
  }
}
