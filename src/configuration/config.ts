import {StreamDataServer} from '../sse/streamDataServer';
import {StreamDataUrl} from '../sse/streamDataUrl';

export const DefaultStreamDataServer = new StreamDataServer('https', 'streamdata.motwin.net');
export const NoPrefixStreamDataServer = new StreamDataServer('', '');
NoPrefixStreamDataServer.getFullUrl = (clientUrl: StreamDataUrl): string => {
    return `${clientUrl.toString()}`;
}