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
'use strict';

var gulp = require('gulp');

gulp.config = {
    paths: {
        sources: [
                 './src/Exporter.js',
                 './src/Logger.js',
                 './src/Preconditions.js',
                 './src/Listeners.js',
                 './src/StreamdataEventSource.js',
                 './src/StreamdataError.js',
                 './src/Streamdata.js'
                 ],
        libs: [
            './bower_components/eventsource-polyfill/dist/eventsource.js'
        ],
        dist: './dist/',
        libsDistFile: './dist/libs.js',
        doc: './jsdoc/',
        test: './test/**/*.js',
        tmp:  './tmp/'
    }
};

require('require-dir')('./gulp');

gulp.task('default', ['build']);
