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
