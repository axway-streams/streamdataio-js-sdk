export class StreamDataUrl {

  private static readonly X_SD_HEADER = 'X-Sd-Header';
  private static readonly X_SD_TOKEN = 'X-Sd-Token';

  public clientUrl: string;

  constructor(url: string, token: string, headers?: string[]) {

    // Sanitize client url
    this.clientUrl = url;

    // Build stream data query from header
    let streamDataQuery = headers ? headers.map(function (header) {
      return `${StreamDataUrl.X_SD_HEADER}=${encodeURIComponent(header)}`;
    }) : [];
    streamDataQuery.push(`${StreamDataUrl.X_SD_TOKEN}=${encodeURIComponent(token)}`);

    // Add stream data query to target url
    if (streamDataQuery.length > 0) {
      this.clientUrl += (this.clientUrl.indexOf('?') === -1) ? '?' : '&';
      this.clientUrl += streamDataQuery.join('&');
    }
  }

  public toString(): string {
    return this.clientUrl;
  }

}
