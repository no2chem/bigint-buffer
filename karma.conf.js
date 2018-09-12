const webpack = require('webpack')
module.exports = function (config) {
  config.set({
    browserNoActivityTimeout: 120000,
    frameworks: ['mocha', 'detectBrowsers'],
    files: [
      './build/src/*.spec.js'
    ],
    preprocessors: {
      './build/src//*.spec.js': ['webpack', 'env']
    },
    webpack : {
      mode: "production",
      devtool: 'inline-source-map',
      module: {
          // Suppress warning from mocha: "Critical dependency: the request of a dependency is an expression"
          // @see https://webpack.js.org/configuration/module/#module-contexts
          exprContextCritical: false
      },
      // Suppress fatal error: Cannot resolve module 'fs'
      // @relative https://github.com/pugjs/pug-loader/issues/8
      // @see https://github.com/webpack/docs/wiki/Configuration#node
      node: {
        fs: 'empty',
        bindings: 'empty'
      }, 
      resolve: {
        extensions: ['.ts', '.js', '.json']
      }, plugins: [ new webpack.NormalModuleReplacementPlugin(
          /\.\/index/,
          './build/src/bromwser.js'
        ),
      ],
    },
    singleRun: true,
    reporters: ['mocha'],
    plugins: [
      'karma-chrome-launcher',
      'karma-env-preprocessor',
      'karma-firefox-launcher',
      'karma-detect-browsers',
      'karma-webpack',
      'karma-mocha',
      'karma-mocha-reporter'
    ],
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    detectBrowsers: {
      enabled: true,
      usePhantomJS: false,
      postDetection: function (availableBrowser) {
        var browsers = ['Chrome']
        return browsers.filter(function (browser) {
          return availableBrowser.indexOf(browser) !== -1
        })
      }
    }
  })
}
