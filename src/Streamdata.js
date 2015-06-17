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
* <p>Create a new instance of the StreamDataEventSource prototype.</p>
*
* <p>The StreamDataEventSource is the main entry point for establishing Server Sent Event connection to remote server.</p>
*
* @param {String} url The targeted REST URI is formatted as follow:
* @param {Array} headers Any specific headers that have to be passed in the query:
* <pre><code>
* protocol://url(:port)(/localpath(?queryparameters))
* </code></pre>
*
* @returns {StreamDataEventSource}
*/
//(function() {
function createEventSource(url, headers, appToken, authStrategy) {
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

    return new StreamdataEventSource(url, headers, appToken, authStrategy);
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
