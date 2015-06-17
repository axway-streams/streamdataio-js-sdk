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
var paths = gulp.config.paths;

var jshint = require('gulp-jshint'),
    cache = require('gulp-cached');

gulp.task('lint', function() {
    return gulp.src(paths.source)
        .pipe(cache('linting'))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('lint-gulp', function() {
    return gulp.src(['gulp.js', 'gulp/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});
