module.exports = function(config) {
  config.set({
    basePath: '../',

    frameworks: ['mocha', 'sinon-expect', 'detectBrowsers'],

    detectBrowsers: {
      enabled: true,
      usePhantomJS: true
    },

    files: [
        'src/*.js',
        'test/test.js'
    ],

    exclude: [],

    reporters: ['progress'], // or `dots`

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: false,

    // All the available browsers are launched by detectBrowsers
    // This is just a fallback
    browsers: ['PhantomJS'],

    singleRun: true
  });
};
