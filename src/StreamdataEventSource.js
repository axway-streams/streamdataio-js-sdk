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
function StreamdataEventSource(url, appToken, headers, authStrategy) {
    Preconditions.checkNotNull(url, 'url cannot be null.');
    Preconditions.checkNotNull(appToken, 'appToken cannot be null.');
    Preconditions.checkArgument(authStrategy === null || authStrategy === undefined || authStrategy.hasOwnProperty('signUrl'),
        'authStrategy does not implement signUrl() function.');

    headers = headers || [];
    authStrategy = authStrategy === undefined ? null : authStrategy;

    var self = this;
    self.streamdataConfig = {
        'PROTOCOL': 'https://',
        'HOST': 'streamdata.motwin.net',
        'PORT': ''
    };

    self._sse = null;
    self._isConnected = false;
    self._url = url;
    self._openListeners = new Listeners(self);
    self._dataListeners = new Listeners(self);
    self._patchListeners = new Listeners(self);
    self._errorListeners = new Listeners(self);
    self._monitorListeners = new Listeners(self);
    self._headers = headers;
    self._defaultErrorMessage = {
        'type': 'UnknownError',
        'status': 1000,
        'message': 'An error occured. Please check your console logs for more details.',
        'source': 'server'
    };
    self._bufferSizeLimit = 1024 * 1024;
    self._loggingEnabled = false;
    self.polyfillOptions = {bufferSizeLimit: self._bufferSizeLimit, loggingEnabled: self._loggingEnabled};

    self.open = function () {
        Preconditions.checkNotNull(self._url, 'url cannot be null');
        self.close();
        var decoratedUrl = self._decorate(self._url, self._headers);
        if (decoratedUrl) {

            if (self._isPolyFill()){
                self._sse = new EventSource(decoratedUrl,self.polyfillOptions);
            } else {
                self._sse = new EventSource(decoratedUrl);
            }

            self._sse.addEventListener('open', function (event) {
                Logger.debug('SSE Stream Opened to ' + self._url + 'event: ' + JSON.stringify(event));
                self._isConnected = true;
                self._openListeners.fire();
            });

            self._sse.addEventListener('error', function (event) {
                if (self._sse.readyState !== 0 || !self._isConnected ) {
                    Logger.debug('Error with SSE at ' + event + ': closing the stream.');
                    self._sse.close();
                    self._isConnected = false;
                    self._errorListeners.fire(self._buildErrorMessage(event, true));
                }
                else {
                    Logger.info('SSE server connection lost, retrying ...');
                }
            });

            self._sse.addEventListener('data', function (event) {
                Logger.debug('Received data:' + event.data);
                self._dataListeners.fire(JSON.parse(event.data));
            });

            self._sse.addEventListener('patch', function (event) {
                Logger.debug('Received patch:' + event.data);
                self._patchListeners.fire(JSON.parse(event.data));
            });

            self._sse.addEventListener('monitor', function (event) {
                Logger.debug('Received monitor:' + event.data);
                self._monitorListeners.fire(JSON.parse(event.data));
            });
        }
        return this;
    };

    self.close = function () {
        if (self._isConnected && self._sse !== null) {
            Logger.info('Closing the SSE Stream.');
            self._sse.close();
            self._isConnected = false;
        }
        return this;
    };

    self._decorate = function (url, headers) {
        Preconditions.checkNotNull(url, 'url cannot be null');
        headers = headers || [];

        var parser = document.createElement('a');
        parser.href = url;

        // handle the userinfo (see https://en.wikipedia.org/wiki/URI_scheme#Examples)
        var endIndex = url.indexOf(parser.hostname);
        var userInfo = url.substring(parser.protocol.length + 2, endIndex);

        //var urlToEncode = parser.protocol + '//' + userInfo + parser.hostname + ((parser.port === "") ? '' : ':' + parser.port) + ((parser.pathname.indexOf('/') == 0) ? '' : '/') + parser.pathname + parser.search;
        var urlToEncode = parser.protocol + '//' + userInfo + parser.hostname + ((parser.port != '0' && parser.port != '' && parser.port != '80' && parser.port != '443'  ) ? ':' + parser.port : '') + ((parser.pathname.indexOf('/') == 0) ? '' : '/') + parser.pathname + parser.search;

        var signedUrl = authStrategy === null ? urlToEncode : authStrategy['signUrl'](urlToEncode);

        var streamDataQueryParams = self._buildStreamDataQueryParams(headers);
        var queryParams = '';

        if (streamDataQueryParams.length > 0) {
            var signedParser = document.createElement('a');
            signedParser.href = signedUrl;

            queryParams = ((signedParser.search.indexOf('?') === -1) ? '?' : '&' ) + streamDataQueryParams.join('&');

        }

        var streamdataUrl = self.streamdataConfig.PROTOCOL
            + self.streamdataConfig.HOST + (self.isEmpty(self.streamdataConfig.PORT) ? '' : ':') + self.streamdataConfig.PORT
            + '/' + signedUrl + queryParams;

        Logger.debug('converted url :' + streamdataUrl);

        return streamdataUrl;
    };

    self._buildStreamDataQueryParams = function (headers) {
        headers = headers || [];

        var headersParams = self._buildHeadersAsQueryParams(headers);
        var appTokenHeader = 'X-Sd-Token=' + encodeURIComponent(appToken);

        headersParams.push(appTokenHeader);
        return headersParams;
    };

    self._buildHeadersAsQueryParams = function (headers) {
        headers = headers || [];

        return headers.map(function (item) {
            return 'X-Sd-Header=' + encodeURIComponent(item);
        });
    };

    self._buildErrorMessage = function (event, isFatal) {
        Preconditions.checkNotNull(event, 'event cannot be null');

        var err = self._defaultErrorMessage;
        try {
            var exception = JSON.parse(event.data);

            err.type = exception['cause'];
            err.message = exception['message'];
            err.status = exception['status'];

        } catch (error) {
            err = self._defaultErrorMessage;
        }
        err.source = 'server';

        console.log(JSON.stringify(err));

        return new StreamdataError(err.type, err.message, err.status, err.source, isFatal);
    };

    self.isEmpty = function (str) {
        return (!str || 0 === str.length);
    };

    self._isPolyFill = function(){
        // detect what kind of EventSource we have
        var isPolyfill = EventSource.isPolyfill;

        switch (isPolyfill) {
            case undefined:
                return false;

            case "XHR":
                return true;

            case "IE_8-9":
                return true;

            default:
                return false;
        }
    }
}

StreamdataEventSource.prototype = {
    onOpen: function (listener) {
        Preconditions.checkNotNull(listener, 'listener cannot be null');
        this._openListeners.add(listener);
        return this;
    },

    onError: function (listener) {
        Preconditions.checkNotNull(listener, 'listener cannot be null');
        this._errorListeners.add(listener);
        return this;
    },

    onData: function (listener) {
        Preconditions.checkNotNull(listener, 'listener cannot be null');
        this._dataListeners.add(listener);
        return this;
    },

    onPatch: function (listener) {
        Preconditions.checkNotNull(listener, 'listener cannot be null');
        this._patchListeners.add(listener);
        return this;
    },

    onMonitor: function (listener) {
        Preconditions.checkNotNull(listener, 'listener cannot be null');
        this._monitorListeners.add(listener);
        return this;
    },

    isConnected: function () {
        return this._isConnected;
    }

};
