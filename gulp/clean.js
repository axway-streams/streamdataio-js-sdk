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
var sequence = require('run-sequence');
var path = require('path');
var del = require('del');

var paths = gulp.config.paths;

gulp.task('clean:dist', function(cb) {
    return del([paths.dist], cb);
});

gulp.task('clean:tmp', function(cb) {
    return del([paths.tmp], cb);
});

gulp.task('clean:doc', function(cb) {
  return del([paths.doc],cb);
});


gulp.task('clean', function(callback) {
    sequence('clean:dist', 'clean:tmp', 'clean:doc',  callback);
});
