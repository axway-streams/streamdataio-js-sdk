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
