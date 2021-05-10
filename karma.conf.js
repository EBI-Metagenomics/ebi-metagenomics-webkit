// Karma configuration
// Generated on Mon Sep 03 2018 11:53:50 GMT+0200 (CEST)

process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function (config) {
    let configuration = {
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'requirejs', 'chai'],

        client: {
            mocha: {
                timeout: 40000
            }
        },

        // list of files / patterns to load in the browser
        files: [
            { pattern: 'tests/test-main.js', included: true },
            { pattern: 'src/*.js', included: false },
            { pattern: 'tests/*_test.js', included: false },
            { pattern: 'src/charts/*.js', included: false },
            { pattern: 'tests/charts/*_test.js', included: false },
            {
                pattern: 'node_modules/underscore/underscore.js',
                included: false
            },
            { pattern: 'node_modules/backbone/backbone.js', included: false },
            { pattern: 'node_modules/jquery/*/*.js', included: false },
            { pattern: 'node_modules/*/*/*.js', included: false },
            { pattern: 'node_modules/*/*.js', included: false }
        ],

        // list of files / patterns to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/*.js': 'coverage',
            'src/*/*.js': 'coverage',
            '**/*.js': 'env'
        },
        envPreprocessor: ['API_URL'],
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['spec', 'coverage'],
        specReporter: {
            maxLogLines: 5, // limit number of lines logged per test
            suppressErrorSummary: true, // do not print error summary
            suppressFailed: false, // do not print information about failed tests
            suppressPassed: false, // do not print information about passed tests
            suppressSkipped: true, // do not print information about skipped tests
            showSpecTiming: false // print the time elapsed for each spec
        },
        plugins: [
            'karma-mocha',
            'karma-requirejs',
            'karma-chai',
            'karma-chrome-launcher',
            'karma-coverage',
            'karma-env-preprocessor',
            'karma-spec-reporter'
        ],

        coverageReporter: {
            dir: 'coverage/',
            reporters: [{ type: 'lcov' }]
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
        browsers: ['Chrome_without_security'],
        customLaunchers: {
            Chrome_ci: {
                base: 'ChromiumHeadless',
                flags: [
                    '--no-sandbox',
                    '--remote-debugging-port=9222',
                    '--enable-logging',
                    '--user-data-dir=./karma-chrome',
                    '--v=1',
                    '--disable-background-timer-throttling',
                    '--disable-renderer-backgrounding',
                    '--proxy-bypass-list=*',
                    "--proxy-server='direct://'"
                ]
            },
            Chrome_without_security: {
                base: 'Chrome',
                flags: ['--disable-web-security']
            }
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        browserDisconnectTimeout: 20000,
        browserConsoleLogOptions: {
            terminal: true
        }
    };
    if (process.env.TRAVIS || process.env.CI) {
        configuration.browsers = ['Chrome_ci'];
    }

    config.set(configuration);
};
