// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

// karma.conf.js
module.exports = function (config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '../../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
        'bower_components/cryptojslib/rollups/hmac-sha512.js',
        'bower_components/cryptojslib/rollups/aes.js',
        'bower_components/cryptojslib/components/mode-ecb.js',
        'bower_components/cryptojslib/components/enc-base64.js',
        'node_modules/streamdataio-js-sdk-auth/dist/streamdataio-auth.min.js',

        'src/Logger.js',
        'src/Preconditions.js',
        'src/Listeners.js',
        'src/Exporter.js',
        'src/StreamdataError.js',
        'src/StreamdataEventSource.js',
        'src/Streamdata.js',
        'test/spec/**/!(karma.conf).js'
    ],

    // list of files / patterns to exclude
    exclude: ['test/conf/**/*.js'],

    // web server port
    port: 9876,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_DEBUG,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS_custom'],

    // you can define custom flags
    customLaunchers: {
      'PhantomJS_custom': {
        base: 'PhantomJS',
        options: {
          windowName: 'my-window',
          settings: {
            webSecurityEnabled: false
          }
        }
      }
    },
    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    // coverage reporter generates the coverage
    reporters: ['progress', 'coverage'],

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'src/**/*.js': ['coverage']
    },

    // optionally, configure the reporter
    coverageReporter: {
      dir : './dist/coverage/',
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' },
        { type: 'cobertura', subdir: '.', file: 'cobertura.xml' }
      ]
    }
  });
};
