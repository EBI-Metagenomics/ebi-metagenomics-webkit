// Karma configuration
// Generated on Mon Sep 03 2018 11:53:50 GMT+0200 (CEST)

process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
    let configuration = {

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'requirejs', 'chai'],

        // list of files / patterns to load in the browser
        files: [
            {pattern: 'tests/test-main.js', included: true},
            {pattern: 'src/*.js', included: false},
            {pattern: 'tests/*_test.js', included: false},
            {pattern: 'node_modules/underscore/underscore.js', included: false},
            {pattern: 'node_modules/backbone/backbone.js', included: false},
            {pattern: 'node_modules/jquery/*/*.js', included: false},
            {pattern: 'node_modules/*/*/*.js', included: false},
            {pattern: 'node_modules/*/*.js', included: false}
        ],

        // list of files / patterns to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/*.js': 'coverage'
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],

        plugins: [
            'karma-mocha',
            'karma-requirejs',
            'karma-chai',
            'karma-chrome-launcher',
            'karma-coverage'
        ],

        coverageReporter: {
            dir: 'coverage/',
            reporters: [
                {type: 'lcov'}]
        },
        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],
        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        browserDisconnectTimeout: 5000
    };
    if (process.env.TRAVIS) {
        configuration.browsers = ['Chrome_travis_ci'];
    }

    config.set(configuration);
};
