import {StreamdataAuthStrategy} from '../auth/streamdata-auth-strategy';
import {LegacyStreamDataProxy} from '../configuration/proxy.config';
import {URL} from '../configuration/targets.config';
import {StreamdataLegacyError} from '../errors/streamdata-legacy-error';
import {Logger} from '../utils/logger';
import {Preconditions} from '../utils/preconditions';
import {StreamdataProxySubscriber} from './streamdata-proxy-subscriber';

export class StreamdataLegacySubscriber extends StreamdataProxySubscriber<StreamdataLegacyError> {

  private static readonly X_SD_HEADER = 'X-Sd-Header';
  private static readonly X_SD_TOKEN = 'X-Sd-Token';

  constructor(private _url: string, appToken: string, private _headers?: string[], private _authStrategy?: StreamdataAuthStrategy) {
    super(appToken);
    // Build internal configuration
    Preconditions.checkNotNull(this._url, 'url cannot be null.');
    this.proxy = LegacyStreamDataProxy;
  }

  protected getStreamingUrl(): URL {
    let signedUrl = this._authStrategy ? this._authStrategy.signUrl(this._url) : this._url;
    let url = new URL(`${this._proxy.toString()}${signedUrl}`);
    this._headers && this._headers.forEach((header) =>
      url.searchParams.append(StreamdataLegacySubscriber.X_SD_HEADER, encodeURIComponent(header))
    );
    url.searchParams.append(StreamdataLegacySubscriber.X_SD_TOKEN, encodeURIComponent(this._subscriberKey));
    return url;
  }

  protected buildError(error: any): StreamdataLegacyError {
    if (error['status'] || error['cause'] || error['message']) {
      return new StreamdataLegacyError(error['status'], error['cause'], error['message'], error['timestamp'], error['source']);
    } else {
      return StreamdataLegacyError.createDefault(error);
    }
  }
}



