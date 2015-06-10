'use strict';

var gulp = require('gulp');
var paths = gulp.config.paths;

gulp.task('watch', function() {
    gulp.watch(paths.source, ['lint']);
});
