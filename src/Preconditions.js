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
