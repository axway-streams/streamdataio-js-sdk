import { StreamDataServer } from '../sse/streamDataServer';
export var DefaultStreamDataServer = new StreamDataServer('https', 'streamdata.motwin.net');
export var NoPrefixStreamDataServer = new StreamDataServer('', '');
NoPrefixStreamDataServer.getFullUrl = function (clientUrl) {
    return "" + clientUrl.toString();
};
//# sourceMappingURL=config.js.map