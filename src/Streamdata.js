/**
 *
 *    Copyright 2015 streamdata.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
"use strict";
var streamDataEventSource_1 = require("./sse/streamDataEventSource");
var listeners_1 = require("./events/listeners");
var preconditions_1 = require("./utils/preconditions");
var logger_1 = require("./utils/logger");
var config_1 = require("./configuration/config");
var streamDataError_1 = require("./errors/streamDataError");
var streamDataUrl_1 = require("./sse/streamDataUrl");
var StreamData = (function () {
    function StreamData(url, appToken, headers) {
        // Build internal configuration
        preconditions_1.Preconditions.checkNotNull(url, 'url cannot be null.');
        preconditions_1.Preconditions.checkNotNull(appToken, 'appToken cannot be null.');
        this._url = url;
        this._token = appToken;
        this._headers = headers ? headers : [];
        // Init listeners
        this._openListeners = new listeners_1.Listeners();
        this._dataListeners = new listeners_1.Listeners();
        this._patchListeners = new listeners_1.Listeners();
        this._errorListeners = new listeners_1.Listeners();
        this._monitorListeners = new listeners_1.Listeners();
        // SSE
        this._sse = null;
        this.server = config_1.DefaultStreamDataServer;
    }
    StreamData.prototype.open = function () {
        preconditions_1.Preconditions.checkNotNull(this._url, 'url cannot be null');
        this.close();
        var decoratedUrl = this._decorate(this._url, this._headers);
        if (decoratedUrl) {
            this._sse = new streamDataEventSource_1.StreamDataEventSource(decoratedUrl);
            this._sse.addOpenListener(function (event) {
                logger_1.Logger.debug('SSE Stream Opened to ' + this._url + 'event: ' + event);
                this._openListeners.fire();
            }, this);
            this._sse.addErrorListener(function (event) {
                if (this._sse.readyState !== 0 || !this._isConnected) {
                    logger_1.Logger.debug('Error with SSE at ' + event + ': closing the stream.');
                    this._sse.close();
                    this._errorListeners.fire(this._buildErrorMessage(event.error));
                }
                else {
                    logger_1.Logger.info('SSE server connection lost, retrying ...');
                }
            }, this);
            this._sse.addDataListener(function (event) {
                logger_1.Logger.debug('Received data:' + event.data);
                this._dataListeners.fire(event.data);
            }, this);
            this._sse.addPatchListener(function (event) {
                logger_1.Logger.debug('Received patch:' + event.patch);
                this._dataListeners.fire(event.patch);
            }, this);
            this._sse.addMonitorListener(function (event) {
                logger_1.Logger.debug('Received monitor:' + event.data);
                this._dataListeners.fire(event.data);
            }, this);
        }
        return this;
    };
    StreamData.prototype.close = function () {
        this._sse.close();
        return this;
    };
    StreamData.prototype.onOpen = function (callback, context) {
        preconditions_1.Preconditions.checkNotNull(callback, 'listener cannot be null');
        this._openListeners.add(callback, context);
        return this;
    };
    StreamData.prototype.onError = function (callback, context) {
        preconditions_1.Preconditions.checkNotNull(callback, 'listener cannot be null');
        this._errorListeners.add(callback, context);
        return this;
    };
    StreamData.prototype.onData = function (callback, context) {
        preconditions_1.Preconditions.checkNotNull(callback, 'listener cannot be null');
        this._dataListeners.add(callback, context);
        return this;
    };
    StreamData.prototype.onPatch = function (callback, context) {
        preconditions_1.Preconditions.checkNotNull(callback, 'listener cannot be null');
        this._patchListeners.add(callback, context);
        return this;
    };
    StreamData.prototype.onMonitor = function (callback, context) {
        preconditions_1.Preconditions.checkNotNull(callback, 'listener cannot be null');
        this._monitorListeners.add(callback, context);
        return this;
    };
    StreamData.prototype.isConnected = function () {
        return this._sse.isConnected();
    };
    StreamData.prototype._decorate = function (url, headers) {
        preconditions_1.Preconditions.checkNotNull(url, 'url cannot be null');
        var clientUrl = new streamDataUrl_1.StreamDataUrl(url, this._token, headers);
        var streamdataUrl = this.server.getFullUrl(clientUrl);
        logger_1.Logger.debug('converted url :' + streamdataUrl);
        return streamdataUrl;
    };
    StreamData.prototype._buildErrorMessage = function (error) {
        logger_1.Logger.error(error);
        if (error['cause'] || error['message'] || error['status']) {
            return new streamDataError_1.StreamDataError(error['cause'], error['message'], error['status'], 'server');
        }
        else {
            return streamDataError_1.DefaultStreamDataError;
        }
    };
    return StreamData;
}());
exports.StreamData = StreamData;
