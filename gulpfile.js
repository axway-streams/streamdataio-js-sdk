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




