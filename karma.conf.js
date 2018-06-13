// Karma configuration
// Generated on Fri Apr 27 2018 23:24:10 GMT+0100 (BST)
const webpackConfig = require("./webpack.config");

module.exports = (config) => {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "./src",


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["jasmine"],


    // list of files / patterns to load in the browser
    files: [
      "**/*.spec.ts",
      {
        pattern: "app/engine/audio/sound-test.wav",
        watched: true,
        served: true,
        included: false
      }
    ],


    // list of files / patterns to exclude
    exclude: [
    ],

    mime: {
      "text/x-typescript": ["ts", "tsx"]
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      "**/*.ts": ["webpack"]
    },

    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve,
      devtool: webpackConfig.devtool
    },

    webpackMiddleware: {
      stats: "errors-only"
    },

    // test results reporter to use
    // possible values: "dots", "progress"
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["progress"],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ["Chrome"],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
