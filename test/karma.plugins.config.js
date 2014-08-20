module.exports = function(config) {
  config.set({
    basePath: '../',

    frameworks: ['mocha', 'sinon-expect'],

    files: [
        'src/basil.js',
        'src/basil.list.js',
        'src/basil.set.js',
        'test/list.js',
        'test/set.js'
    ],

    exclude: [],

    reporters: ['progress'], // or `dots`

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: false,

    browsers: ['PhantomJS'],

    singleRun: true
  });
};
