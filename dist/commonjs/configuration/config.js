"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var streamDataServer_1 = require("../sse/streamDataServer");
exports.DefaultStreamDataServer = new streamDataServer_1.StreamDataServer('https', 'streamdata.motwin.net');
exports.NoPrefixStreamDataServer = new streamDataServer_1.StreamDataServer('', '');
exports.NoPrefixStreamDataServer.getFullUrl = function (clientUrl) {
    return "" + clientUrl.toString();
};
//# sourceMappingURL=config.js.map