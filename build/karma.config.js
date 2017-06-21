
module.exports = function(config) {
  config.set({
    singleRun: true,
    autoWatch: true,
    
    browsers: [
      'PhantomJS'
    ],

    frameworks: [
      'jasmine'
    ],

    files: [
      '../node_modules/core-js/client/core.js',
      'spec.bundle.js'
    ],

    preprocessors: {
      'spec.bundle.js': ['webpack']
    },

    webpack: require('./webpack-test.config'),

    webpackMiddleware: {
      stats: 'errors-only'
    },

    plugins: [
      require('karma-jasmine'),
      require('karma-phantomjs-launcher'),
      require('karma-webpack')
    ]
  });
};