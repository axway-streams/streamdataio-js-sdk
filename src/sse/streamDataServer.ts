import {UrlHelper} from 'utils/urlHelper';
import {StreamDataUrl} from 'sse/streamDataUrl';

export class StreamDataServer {

  public protocol: string;
  public hostname: string;
  public port: string;

  constructor(protocol: string, hostname: string, port?: string) {
    this.protocol = protocol;
    this.hostname = hostname;
    this.port = port;
  }

  public toString(): string {
    return UrlHelper.urlToString(this.protocol, this.hostname, this.port);
  }

  public getFullUrl(clientUrl: StreamDataUrl): string {
    return `${this.toString()}/${clientUrl.toString()}`;
  }
}
