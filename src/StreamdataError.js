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
