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
 * @fileOverview  streamdata.io javascript sdk
 * @author Motwin
 * @version 1.0
 *
 * @see Streamdata
 * @see StreamdataError
 * @see StreamdataEventSource
 */

/**
 * <p><code>StreamdataError</code> provides error details when an error is thrown while processing a Server Sent Event.</p>
 * 
 * <p>This object is provided by the <code>onError</code> callback.</p>
 * 
 * @constructor
 */
var StreamdataError = function() {};

/**
 * Returns true if error is fatal.
 * @return {boolean} true if error is fatal.
 */
StreamdataError.prototype.isFatal = function() { return false; };

/**
 * Returns true if error is from server side.
 * @return {boolean} true if error is from server side.
 */
StreamdataError.prototype.isServer = function() { return false; };

/**
 * Returns true if error is from client side.
 * @return {boolean} true if error is from client side.
 */
StreamdataError.prototype.isClient = function() { return false; };

/**
 * Returns the message that explains the cause of the error.
 * @return {string} the message that explains the cause of the error.
 */
StreamdataError.prototype.getMessage = function() { return ''; };

/**
 * Returns the error object.
 * @return {(Object|undefined)} the error object from the server (error object sent by the server) or from the client (JavaScript exception thrown).
 */
StreamdataError.prototype.getError = function() { return null; };

/**
 * @memberOf StreamdataError#
 * @return {(Object|undefined)} the status value of the error object from the server (error object sent by the server) or from the client (Javascript exception thrown).
 */
StreamdataError.prototype.getStatus = function() { return null; };

/**
 * <p>The <code>StreamdataEventSource</code> object is the main entry point to establish a connection to a targeted JSON REST service URL.</p>
 *
 * <p>Use <code>streamdataio.createEventSource(url,token[,headers][,authStrategy])</code> to create new instance.</p>
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
 * @constructor
 */
function StreamdataEventSource() {}

/**
 * <p>Open <code>StreamdataEventSource</code> connection to the URL.</p>
 *
 * <p>The <code>StreamdataEventSource</code> will auto reconnect if the connection is lost until <code>close()</code> is called.</p>
 *
 * @returns {StreamdataEventSource}
 */
StreamdataEventSource.prototype.open = function() { return this; };

/**
 * <p>Close <code>StreamdataEventSource</code> connection.</p>
 *
 * <p>The <code>StreamdataEventSource</code> will disconnect and close the connection.</p>
 *
 * @returns {StreamdataEventSource}
 */
StreamdataEventSource.prototype.close = function() { return this; };


/**
 * <p>Register a callback called when the client application opened successfully a <code>StreamdataEventSource</code>.<p>
 *
 * @example
 * eventSource.onOpen(function() {
 *   // callback code
 * });
 *
 * @param {Function} callback the function to call.
 * @returns {StreamdataEventSource}
 */
StreamdataEventSource.prototype.onOpen = function(callback) { return this; };

/**
 * <p>Register a callback called when the client application experienced an error.</p>
 *
 * @example
 * eventSource.onError(function(aError) {
 *   // callback code
 *   // aError.getMessage();
 * });
 * @param {Function} callback the function to notify.
 * @param {aError} callback.aError the <code>StreamdataError</code> received in case of error.
 * @returns {StreamdataEventSource}
 */
StreamdataEventSource.prototype.onError = function(callback) { return this; };

/**
 * <p>Register a callback called  when the client application received initial data (snapshot) from the server.</p>
 *
 * @example
 * eventSource.onData(function(data) {
 *   // callback code
 * });
 * @param {Function} callback the function to notify.
 * @param {data} callback.data the Json object sent by the server containing initial data (snapshot) in Json format.
 * @returns {StreamdataEventSource}
 */
StreamdataEventSource.prototype.onData = function(callback) { return this; };

/**
 * <p>Register a callback called  when the client application received incremental update data (patch) from the server.</p>
 *
 * @example
 * eventSource.onPatch(function(patch) {
 *   // callback code
 * });
 * @param {Function} callback the function to notify.
 * @param {patch} callback.patch the Json object sent by the server containing incremental update data (patch) in Json patch format.
 * @returns {StreamdataEventSource}
 */
StreamdataEventSource.prototype.onPatch = function(callback) { return this; };

/**
 * <p>Register a callback called  when the client application received monitor data from the server.</p>
 *
 * @example
 * eventSource.onMonitor(function(monitor) {
 *   // callback code
 * });
 * @param {Function} callback the function to notify.
 * @param {monitor} callback.monitor the Json object sent by the server containing monitor data in Json format.
 * @returns {StreamdataEventSource}
 */
StreamdataEventSource.prototype.onMonitor = function(callback) { return this; };

/**
 * <p>check the connection status of the StreamdataEventSource.</p>
 *
 * @example
 * if (eventSource.isConnected()) {
 *   // perform required action
 * };
 * @returns true if {StreamdataEventSource} is connected, false otherwise.
 */
StreamdataEventSource.prototype.isConnected = function() { return this; };

/**
 * <p> streamdata.io sdk provides a way to connect to a remote server and monitor the connection state.
 * <p>A singleton instance is provided as a <code>streamdataio</code> global variable and  gives access to the entire streamdata.io SDK API.</p>
 * Connecting is achieved with the call to <code>streamdataio.createEventSource(url)</code>.
 * This method returns a <code>StreamdataEventSource</code> object which handles connection to the remote server, and provides mechanism to monitor the connection state.</p>
 * 
 * @constructor
 */
function Streamdata() {}

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
 Streamdata.prototype.createEventSource = function(url, token, headers, authStrategy) { return new StreamDataEventSource(url, headers); };

/**
 * <p> streamdata.io sdk provides a way to connect to a remote server and monitor the connection state.
 * <p>A singleton instance is provided as a <code>streamdataio</code> global variable and  gives access to the entire streamdata.io SDK API.</p>
 * Connecting is achieved with the call to <code>streamdataio.createEventSource(url)</code>.
 *
 */
var streamdataio = new Streamdata();