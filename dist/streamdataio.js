/**
 * Copyrights  2015 - Streamdata.io
 *
 * streamdataio-js-sdk - Javascript SDK for Streamdata.io
 * @version v1.0.4
 *
 * @link https://github.com/streamdataio/streamdataio-js-sdk
 *
 * @license Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
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
 */
/*
   * EventSource polyfill version 0.9.6
   * Supported by sc AmvTek srl
   * :email: devel@amvtek.com
 */
;(function (global) {

    if (global.EventSource && !global._eventSourceImportPrefix){
        return;
    }

    var evsImportName = (global._eventSourceImportPrefix||'')+"EventSource";

    var EventSource = function (url, options) {

        if (!url || typeof url != 'string') {
            throw new SyntaxError('Not enough arguments');
        }

        this.URL = url;
        this.setOptions(options);
        var evs = this;
        setTimeout(function(){evs.poll()}, 0);
    };

    EventSource.prototype = {

        CONNECTING: 0,

        OPEN: 1,

        CLOSED: 2,

        defaultOptions: {

            loggingEnabled: false,

            loggingPrefix: "eventsource",

            interval: 500, // milliseconds

            bufferSizeLimit: 1024*1024, // bytes

            silentTimeout: 300000, // milliseconds

            retryInterval: 3000, // milliseconds

            getArgs:{
            },

            xhrHeaders:{
                'Accept': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'X-Requested-With': 'XMLHttpRequest'
            }
        },

        setOptions: function(options){

            var defaults = this.defaultOptions;
            var option;

            // set all default options...
            for (option in defaults){

                if ( defaults.hasOwnProperty(option) ){
                    this[option] = defaults[option];
                }
            }

            // override with what is in options
            for (option in options){

                if (option in defaults && options.hasOwnProperty(option)){
                    this[option] = options[option];
                }
            }

            // if console is not available, force loggingEnabled to false
            if (typeof console === "undefined" || typeof console.log === "undefined") {

                this.loggingEnabled = false;
            }
        },

        log: function(message) {

            if (this.loggingEnabled) {

                console.log("[" + this.loggingPrefix +"]:" + message)
            }
        },

        poll: function() {

            try {

                if (this.readyState == this.CLOSED) {
                    return;
                }

                this.cleanup();
                this.readyState = this.CONNECTING;
                this.cursor = 0;
                this.cache = '';
                this._xhr = new this.XHR(this);
                this.resetNoActivityTimer();

            }
            catch (e) {

                // in an attempt to silence the errors
                this.log('An error occured during polling.');
                this.dispatchEvent('error', { type: 'error', data: e.message });
            }
        },

        pollAgain: function (interval) {

            // schedule poll to be called after interval milliseconds
            var evs = this;
            evs.readyState = evs.CONNECTING;
            evs.dispatchEvent('error', {
                type: 'error',
                data: "Reconnecting "
            });
            this._pollTimer = setTimeout(function(){evs.poll()}, interval||0);
        },


        cleanup: function() {

            this.log('evs cleaning up');
            if (this._pollTimer){
                clearInterval(this._pollTimer);
                this._pollTimer = null;
            }

            if (this._noActivityTimer){
                clearInterval(this._noActivityTimer);
                this._noActivityTimer = null;
            }

            if (this._xhr){
                this._xhr.abort();
                this._xhr = null;
            }
        },

        resetNoActivityTimer: function(){

            if (this.silentTimeout){

                if (this._noActivityTimer){
                    clearInterval(this._noActivityTimer);
                }
                var evs = this;
                this._noActivityTimer = setTimeout(
                        function(){ evs.log('Timeout! silentTImeout:'+evs.silentTimeout); evs.pollAgain(); },
                        this.silentTimeout
                        );
            }
        },

        close: function () {

            this.readyState = this.CLOSED;
            this.log('Closing connection.');
            this.cleanup();
        },

        _onxhrdata: function() {

            var request = this._xhr;

            if (request.isReady() && !request.hasError() ) {
                // reset the timer, as we have activity
                this.resetNoActivityTimer();

                // move this EventSource to OPEN state...
                if (this.readyState == this.CONNECTING) {
                    this.readyState = this.OPEN;
                    this.dispatchEvent('open', { type: 'open' });
                }

                var buffer = request.getBuffer();

                if (buffer.length > this.bufferSizeLimit) {
                    this.log('buffer length > bufferSizeLimit');
                    this.pollAgain();
                }

                if (this.cursor == 0 && buffer.length > 0){

                    // skip byte order mark \uFEFF character if it starts the stream
                    if (buffer.substring(0,1) == '\uFEFF'){
                        this.cursor = 1;
                    }
                }

                var lastMessageIndex = this.lastMessageIndex(buffer);
                if (lastMessageIndex[0] >= this.cursor){

                    var newcursor = lastMessageIndex[1];
                    var toparse = buffer.substring(this.cursor, newcursor);
                    this.parseStream(toparse);
                    this.cursor = newcursor;
                }

                // if request is finished, reopen the connection
                if (request.isDone()) {
                    this.log('request.isDone(). reopening the connection');
                    this.pollAgain(this.interval);
                }
            }
            else if (this.readyState !== this.CLOSED) {

                this.log('this.readyState !== this.CLOSED');
                this.pollAgain(this.interval);

                //MV: Unsure why an error was previously dispatched
            }
        },

        parseStream: function(chunk) {

            // normalize line separators (\r\n,\r,\n) to \n
            // remove white spaces that may precede \n
            chunk = this.cache + this.normalizeToLF(chunk);

            var events = chunk.split('\n\n');

            var i, j, eventType, datas, line, retry;

            for (i=0; i < (events.length - 1); i++) {

                eventType = 'message';
                datas = [];
                parts = events[i].split('\n');

                for (j=0; j < parts.length; j++) {

                    line = this.trimWhiteSpace(parts[j]);

                    if (line.indexOf('event') == 0) {

                        eventType = line.replace(/event:?\s*/, '');
                    }
                    else if (line.indexOf('retry') == 0) {

                        retry = parseInt(line.replace(/retry:?\s*/, ''));
                        if(!isNaN(retry)) {
                            this.interval = retry;
                        }
                    }
                    else if (line.indexOf('data') == 0) {

                        datas.push(line.replace(/data:?\s*/, ''));
                    }
                    else if (line.indexOf('id:') == 0) {

                        this.lastEventId = line.replace(/id:?\s*/, '');
                    }
                    else if (line.indexOf('id') == 0) { // this resets the id

                        this.lastEventId = null;
                    }
                }

                if (datas.length) {
                    // dispatch a new event
                    var event = new MessageEvent(eventType, datas.join('\n'), window.location.origin, this.lastEventId);
                    this.dispatchEvent(eventType, event);
                }
            }

            this.cache = events[events.length - 1];
        },

        dispatchEvent: function (type, event) {
            var handlers = this['_' + type + 'Handlers'];

            if (handlers) {

                for (var i = 0; i < handlers.length; i++) {
                    handlers[i].call(this, event);
                }
            }

            if (this['on' + type]) {
                this['on' + type].call(this, event);
            }

        },

        addEventListener: function (type, handler) {
            if (!this['_' + type + 'Handlers']) {
                this['_' + type + 'Handlers'] = [];
            }

            this['_' + type + 'Handlers'].push(handler);
        },

        removeEventListener: function (type, handler) {
            var handlers = this['_' + type + 'Handlers'];
            if (!handlers) {
                return;
            }
            for (var i = handlers.length - 1; i >= 0; --i) {
                if (handlers[i] === handler) {
                    handlers.splice(i, 1);
                    break;
                }
            }
        },

        _pollTimer: null,

        _noactivityTimer: null,

        _xhr: null,

        lastEventId: null,

        cache: '',

        cursor: 0,

        onerror: null,

        onmessage: null,

        onopen: null,

        readyState: 0,

        // ===================================================================
        // helpers functions
        // those are attached to prototype to ease reuse and testing...

        urlWithParams: function (baseURL, params) {

            var encodedArgs = [];

            if (params){

                var key, urlarg;
                var urlize = encodeURIComponent;

                for (key in params){
                    if (params.hasOwnProperty(key)) {
                        urlarg = urlize(key)+'='+urlize(params[key]);
                        encodedArgs.push(urlarg);
                    }
                }
            }

            if (encodedArgs.length > 0){

                if (baseURL.indexOf('?') == -1)
                    return baseURL + '?' + encodedArgs.join('&');
                return baseURL + '&' + encodedArgs.join('&');
            }
            return baseURL;
        },

        lastMessageIndex: function(text) {

            var ln2 =text.lastIndexOf('\n\n');
            var lr2 = text.lastIndexOf('\r\r');
            var lrln2 = text.lastIndexOf('\r\n\r\n');

            if (lrln2 > Math.max(ln2, lr2)) {
                return [lrln2, lrln2+4];
            }
            return [Math.max(ln2, lr2), Math.max(ln2, lr2) + 2]
        },

        trimWhiteSpace: function(str) {
            // to remove whitespaces left and right of string

            var reTrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;
            return str.replace(reTrim, '');
        },

        normalizeToLF: function(str) {

            // replace \r and \r\n with \n
            return str.replace(/\r\n|\r/g, '\n');
        }

    };

    if (!isOldIE()){

        EventSource.isPolyfill = "XHR";

        // EventSource will send request using XMLHttpRequest
        EventSource.prototype.XHR = function(evs) {

            request = new XMLHttpRequest();
            this._request = request;
            evs._xhr = this;

            // set handlers
            request.onreadystatechange = function(){
                if (request.readyState > 1 && evs.readyState != evs.CLOSED) {
                    if (request.status == 200 || (request.status>=300 && request.status<400)){
                        evs._onxhrdata();
                    }
                    else {
                        evs.pollAgain(evs.retryInterval);
                    }
                }
            };

            request.onprogress = function () {
            };

            request.open('GET', evs.urlWithParams(evs.URL, evs.getArgs), true);

            var headers = evs.xhrHeaders; // maybe null
            for (var header in headers) {
                if (headers.hasOwnProperty(header)){
                    request.setRequestHeader(header, headers[header]);
                }
            }
            if (evs.lastEventId) {
                request.setRequestHeader('Last-Event-Id', evs.lastEventId);
            }

            request.send();
        };

        EventSource.prototype.XHR.prototype = {

            useXDomainRequest: false,

            _request: null,

            _failed: false, // true if we have had errors...

            isReady: function() {


                return this._request.readyState >= 2;
            },

            isDone: function() {

                return (this._request.readyState == 4);
            },

            hasError: function() {

                return (this._failed || (this._request.status >= 400));
            },

            getBuffer: function() {

                var rv = '';
                try {
                    rv = this._request.responseText || '';
                }
                catch (e){}
                return rv;
            },

            abort: function() {

                if ( this._request ) {
                    this._request.abort();
                }
            }
        };
    }
    else {

	EventSource.isPolyfill = "IE_8-9";

        // patch EventSource defaultOptions
        var defaults = EventSource.prototype.defaultOptions;
        defaults.xhrHeaders = null; // no headers will be sent
        defaults.getArgs['evs_preamble'] = 2048 + 8;

        // EventSource will send request using Internet Explorer XDomainRequest
        EventSource.prototype.XHR = function(evs) {

            request = new XDomainRequest();
            this._request = request;

            // set handlers
            request.onprogress = function(){
                request._ready = true;
                evs._onxhrdata();
            };

            request.onload = function(){
                this._loaded = true;
                evs._onxhrdata();
            };

            request.onerror = function(){
                this._failed = true;
                evs.readyState = evs.CLOSED;
                evs.dispatchEvent('error', {
                    type: 'error',
                    data: "XDomainRequest error"
                });
            };

            request.ontimeout = function(){
                this._failed = true;
                evs.readyState = evs.CLOSED;
                evs.dispatchEvent('error', {
                    type: 'error',
                    data: "XDomainRequest timed out"
                });
            };

            // XDomainRequest does not allow setting custom headers
            // If EventSource has enabled the use of GET arguments
            // we add parameters to URL so that server can adapt the stream...
            var reqGetArgs = {};
            if (evs.getArgs) {

                // copy evs.getArgs in reqGetArgs
                var defaultArgs = evs.getArgs;
                    for (var key in defaultArgs) {
                        if (defaultArgs.hasOwnProperty(key)){
                            reqGetArgs[key] = defaultArgs[key];
                        }
                    }
                if (evs.lastEventId){
                    reqGetArgs['evs_last_event_id'] = evs.lastEventId;
                }
            }
            // send the request

            request.open('GET', evs.urlWithParams(evs.URL,reqGetArgs));
            request.send();
        };

        EventSource.prototype.XHR.prototype = {

            useXDomainRequest: true,

            _request: null,

            _ready: false, // true when progress events are dispatched

            _loaded: false, // true when request has been loaded

            _failed: false, // true if when request is in error

            isReady: function() {

                return this._request._ready;
            },

            isDone: function() {

                return this._request._loaded;
            },

            hasError: function() {

                return this._request._failed;
            },

            getBuffer: function() {

                var rv = '';
                try {
                    rv = this._request.responseText || '';
                }
                catch (e){}
                return rv;
            },

            abort: function() {

                if ( this._request){
                    this._request.abort();
                }
            }
        };
    }

    function MessageEvent(type, data, origin, lastEventId) {

        this.bubbles = false;
        this.cancelBubble = false;
        this.cancelable = false;
        this.data = data || null;
        this.origin = origin || '';
        this.lastEventId = lastEventId || '';
        this.type = type || 'message';
    }

    function isOldIE () {

        //return true if we are in IE8 or IE9
        return (window.XDomainRequest && (window.XMLHttpRequest && new XMLHttpRequest().responseType === undefined)) ? true : false;
    }

    global[evsImportName] = EventSource;
})(this);

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
var Exporter = (function() {
  'use strict';

  return {
    /**
     * @function
     * Google Closure Compiler helpers (used only to make the minified file smaller)
     * @param {string} publicPath
     * @param {*} object
     */
    exportSymbol: function(owner, publicPath, object) {
      var tokens = publicPath.split('.');
      var target = owner;
      for (var i = 0; i < tokens.length - 1; i++) {
        target = target[tokens[i]];
      }
      this.exportProperty(target, tokens[tokens.length - 1], object);
    },

    /**
     * @function
     * Google Closure Compiler helpers (used only to make the minified file smaller)
     * @param {Object} owner
     * @param {string} publicName
     * @param {*} object
     */
    exportProperty: function(owner, publicName, object) {
      owner[publicName] = object;
    }

  };
})();

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
var Logger = (function () {
  'use strict';

  var console = window['console'];

  var DEBUG = 3, INFO = 2, WARN = 1, ERROR = 0;
  /**
   * @private
   * @memberOf Logger#
   */
  var level = INFO;

  /**
   * @private
   * @memberOf Logger#
   */
  var _formatLog = function (pattern, args) {
    return pattern.replace(/{(\d+)}/g, function (match, number) {
      var replaced;
      if (args[number] && typeof args[number] === 'object' && args[number] instanceof Error) {
        try {
          replaced = args[number]['message'];
          if (args[number]['stack']) {
            console.error(args[number]['stack']);
          }
        } catch (error) {
          replaced = args[number];
        }
      } else if (args[number] && typeof args[number] === 'object') {
        try {
          if (args[number].toString !== Object.prototype.toString) {
            replaced = args[number].toString();
          } else {
            replaced = JSON.stringify(args[number]);
          }
        } catch (error) {
          replaced = args[number];
        }
      } else if (args[number] && typeof args[number] === 'function') {
        replaced = 'function';
      } else if (args[number]) {
        replaced = args[number];
      } else {
        replaced = match;
      }
      var replacedString = '' + replaced;
      return replacedString.substring(0, Math.min(500, replacedString.length));
    });
  };

  /**
   * @namespace
   */
  return {
    /**
     * @memberOf Logger#
     * @constant {number}
     */
    DEBUG: DEBUG,
    /**
     * @memberOf Logger#
     * @constant {number}
     */
    INFO: INFO,
    /**
     * @memberOf Logger#
     * @constant {number}
     */
    WARN: WARN,
    /**
     * @memberOf Logger#
     * @constant {number}
     */
    ERROR: ERROR,

    /**
     * @memberOf Logger#
     * @param {number} newLevel
     */
    setLevel: function (newLevel) {
      level = newLevel;
    },
    /**
     * @memberOf Logger#
     */
    debug: function () {
      if (level >= DEBUG && console && console.log) {
        console.log(_formatLog(arguments[0], Array.prototype.slice.call(arguments, 1)));
      }
    },
    /**
     * @memberOf Logger#
     */
    info: function () {
      if (level >= INFO && console && console.info) {
        console.info(_formatLog(arguments[0], Array.prototype.slice.call(arguments, 1)));
      }
    },
    /**
     * @memberOf Logger#
     */
    warn: function () {
      if (level >= WARN && console && console.warn) {
        console.warn(_formatLog(arguments[0], Array.prototype.slice.call(arguments, 1)));
      }
    },
    /**
     * @memberOf Logger#
     */
    error: function () {
      if (level >= ERROR && console && console.error) {
        console.error(_formatLog(arguments[0], Array.prototype.slice.call(arguments, 1)));
      }
    }
  };
})();

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
var Preconditions = (function (Logger) {
  'use strict';

  return {
    /**
     * @memberOf Preconditions#
     * check if the value is not null
     * @param {*} value
     * @param {string} message
     */
    checkNotNull: function (value, message) {
      if (typeof value === 'undefined' || value === null) {
        if (message) {
          throw new Error(message);
        } else {
          throw new Error('value cannot be null');
        }
      }
      return value;
    },

    /**
     * @memberOf Preconditions#
     * log deprecated warning
     * @param {string} functionName
     * @param {string} message
     */
    deprecated: function (functionName, message) {
      this.checkNotNull(functionName, 'functionName cannot be null');
      this.checkNotNull(message, 'message cannot be null');

      Logger.warn("Deprecated: function '{0}' is deprecated because '{1}'.", functionName, message);

    },

    /**
     * @memberOf Preconditions#
     * check is the provided expression is true
     * @param {*} expression
     * @param {string} message
     */
    checkState: function (expression, message) {
      if (!expression) {
        if (message) {
          throw new Error(message);
        } else {
          throw new Error('expression is not valid');
        }
      }
    },

    /**
     * @memberOf Preconditions#
     * check is the argument matches the expression
     * @param {*} expression
     * @param {string} message
     */
    checkArgument: function (expression, message) {
      if (!expression) {
        if (message) {
          throw new Error(message);
        } else {
          throw new Error('expression is not valid');
        }
      }
    }
  };
})(Logger);

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
function Listeners(bind) {
    Preconditions.checkNotNull(bind, 'bind cannot be null');

    this._bind      = bind;
    this._listeners = [];
}

Listeners.prototype = {
    /**
    * @memberOf Listeners#
    */
    fire: function() {
        var listeners = this._listeners.slice(); // copy to prevent concurrent modifications
        for(var i = 0, length = listeners.length; i < length; i++) {
            try {
                var listener = listeners[i];
                if(listener) {
                    listener.apply(this._bind, arguments);
                }
            } catch(error) {
                Logger.error('Unable to forward event: {0}', error);
            }
        }
    },
    /**
    * @memberOf Listeners#
    * @param {Function} listener
    */
    add: function(listener) {
        Preconditions.checkNotNull(listener, 'listener cannot be null');
        Preconditions.checkState(this._listeners.indexOf(listener) == -1, 'listener already exists');
        this._listeners.push(listener);
    },
    /**
    * @memberOf Listeners#
    * @param {Function} listener
    */
    remove: function(listener) {
        Preconditions.checkNotNull(listener, 'listener cannot be null');
        var indexOf = this._listeners.indexOf(listener);
        Preconditions.checkState(indexOf >= 0, 'listener not exists');
        this._listeners.splice(indexOf, 1);
    }
};

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

/**
* @constructor
* @param {string} source
* @param {string} type
* @param {string} message
* @param {Object} error
* @param {(boolean|undefined)} isFatal
*/
function StreamdataError(type, message, status, source, isFatal) {
    this._source  = source;
    this._type    = type;
    this._message = message;
    this._fatal   = isFatal || false;
    this._status  = status;

    Exporter.exportProperty(this, 'source', this._source);
    Exporter.exportProperty(this, 'type', this._type);
    Exporter.exportProperty(this, 'message', this._message);
    Exporter.exportProperty(this, 'status', this._status);

}

StreamdataError.prototype = {

    /**
    * @memberOf StreamdataError#
    * @return {boolean} true if error is fatal.
    */
    isFatal: function() {
        return this._fatal;
    },
    /**
    * @memberOf StreamdataError#
    * @return {boolean} true if error is from server side.
    */
    isServer: function() {
        return this._source == 'server';
    },
    /**
    * @memberOf StreamdataError#
    * @return {boolean} true if error is from client side.
    */
    isClient: function() {
        return this._source == 'client';
    },
    /**
    * @memberOf StreamdataError#
    * @return {string} the message that explains the cause of the error.
    */
    getMessage: function() {
        return this._message;
    },
    /**
     * @memberOf StreamdataError#
     * @return {(Object|undefined)} the status value of the error object from the server (error object sent by the server) or from the client (Javascript exception thrown).
     */
    getStatus: function() {
        return this._status;
    },
    /**
     * @memberOf StreamdataError#
     * @return {(Object|undefined)} the type value of the error object from the server (error object sent by the server) or from the client (Javascript exception thrown).
     */
    getType: function() {

        return this._type;
    }

};

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


/**
* Streamdata.io JavaScript SDK
*/

/**
* <p>Create a new instance of the <code>StreamDataEventSource</code> prototype.</p>
*
* <p>The <code>StreamDataEventSource</code> is the main entry point for establishing Server Sent Event connection to a targeted JSON REST service URL.</p>
*
* @param {String} url Mandatory. The targeted REST URL is formatted as follow:
* <pre><code>protocol://url(:port)(/localpath(?queryparameters))</code></pre>
*
* @param {String} token Mandatory. The application token to authentify the request
*
* @param {Array} headers Optional. Any specific headers that have to be added to the request. It must be an array with the following structure:<code>['Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==']</code>
*
* @param {Object} authStrategy Optional. An object which will enable HMAC signature of the request. You can create this object as follow:
* <pre><code>
* // setup headers
* var headers = [];
* // setup signatureStrategy
* var signatureStrategy = AuthStrategy.newSignatureStrategy('NmEtYTljN2UtYmM1MGZlMGRiNGFQzYS00MGRkLTkNTZlMDY1','NTEtMTQxNiWIzMDEC00OWNlLThmNGYtY2ExMDJxO00NzNhLTgtZWY0MjOTc2YmUxODFiZDU1NmU0ZDAtYWU5NjYxMGYzNDdi');
* // instantiate an eventSource
* var eventSource = streamdataio.createEventSource('http://myRestservice.com/stocks','NmEtYTljN2UtYmM1MGZlMGRiNGFQzYS00MGRkLTkNTZlMDY1',headers,signatureStrategy);
*
* </code></pre>
* @returns {StreamDataEventSource}
*/
function createEventSource(url, appToken, headers, authStrategy) {
    Preconditions.checkNotNull(url, 'url cannot be null');
    headers = headers || [];
    authStrategy = authStrategy || null;

    if( !(url.lastIndexOf('http://', 0) == 0)
        &&
        !(url.lastIndexOf('https://', 0) == 0)) {
        // if no valid protocol provided for url then add default (http://)
        url = 'http://' + url;
        Logger.warn('url has no default protocol defined. Add http:// as a default protocol.');
    }

    return new StreamdataEventSource(url, appToken, headers, authStrategy);
}

function Streamdata() {
    var self = this;
}

/**
 * @export
 */
var streamdataio = new Streamdata();

// Logger exports
Exporter.exportProperty(streamdataio, 'Logger', Logger);
Exporter.exportProperty(Logger, 'DEBUG', Logger.DEBUG);
Exporter.exportProperty(Logger, 'INFO', Logger.INFO);
Exporter.exportProperty(Logger, 'WARN', Logger.WARN);
Exporter.exportProperty(Logger, 'ERROR', Logger.ERROR);
Exporter.exportProperty(Logger, 'setLevel', Logger.setLevel);
Exporter.exportProperty(Logger, 'debug', Logger.debug);
Exporter.exportProperty(Logger, 'info', Logger.info);
Exporter.exportProperty(Logger, 'warn', Logger.warn);
Exporter.exportProperty(Logger, 'error', Logger.error);

// streamdataio static methods exports
Exporter.exportProperty(streamdataio, 'createEventSource', createEventSource);

// StreamdataError instance methods exports
Exporter.exportProperty(StreamdataError.prototype, 'isFatal', StreamdataError.prototype.isFatal);
Exporter.exportProperty(StreamdataError.prototype, 'isServer', StreamdataError.prototype.isServer);
Exporter.exportProperty(StreamdataError.prototype, 'isClient', StreamdataError.prototype.isClient);
Exporter.exportProperty(StreamdataError.prototype, 'getMessage', StreamdataError.prototype.getMessage);
Exporter.exportProperty(StreamdataError.prototype, 'getStatus', StreamdataError.prototype.getStatus);
Exporter.exportProperty(StreamdataError.prototype, 'getType', StreamdataError.prototype.getType);

// StreamdataEventSource instance methods exports
Exporter.exportProperty(StreamdataEventSource.prototype, 'open', StreamdataEventSource.prototype.connect);
Exporter.exportProperty(StreamdataEventSource.prototype, 'onOpen', StreamdataEventSource.prototype.onOpen);
Exporter.exportProperty(StreamdataEventSource.prototype, 'onError', StreamdataEventSource.prototype.onError);
Exporter.exportProperty(StreamdataEventSource.prototype, 'onData', StreamdataEventSource.prototype.onData);
Exporter.exportProperty(StreamdataEventSource.prototype, 'onPatch', StreamdataEventSource.prototype.onPatch);
Exporter.exportProperty(StreamdataEventSource.prototype, 'onMonitor', StreamdataEventSource.prototype.onMonitor);

Exporter.exportProperty(StreamdataEventSource.prototype, 'isConnected', StreamdataEventSource.prototype.isConnected);
