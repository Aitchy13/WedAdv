const webpack = require("webpack");

const webpackConfig = require("./webpack.config");

webpackConfig.devtool = false;

module.exports = (config) => {
  config.set({


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["jasmine"],


    // list of files / patterns to load in the browser
    files: [
      "**/*.spec.ts",
      {
        pattern: "src/app/engine/audio/sound-test.wav",
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
      "src/**/*.ts": ["webpack", "sourcemap"]
    },

    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve,
      devtool: webpackConfig.devtool,
      plugins: [
        new webpack.SourceMapDevToolPlugin({
          filename: null,
          test: /\.(ts|js)($|\?)/i
        })
      ]
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

    plugins: [
      "karma-chrome-launcher",
      "karma-jasmine",
      "karma-webpack",
      "karma-sourcemap-loader"
    ],

    customLaunchers: {
      ChromeDebugging: {
        base: "Chrome",
        flags: [ "--remote-debugging-port=9333" ],
        debug: true
      }
    },


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ["ChromeDebugging"],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
