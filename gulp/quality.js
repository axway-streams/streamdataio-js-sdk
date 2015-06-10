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