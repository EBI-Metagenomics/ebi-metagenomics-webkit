let tests = [];
for (let file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        // if (/tests\/run_test\.js$/.test(file)) {
        if (/tests\/.*_test\.js$/.test(file)) {
            // if (/tests\/charts\/seqFeatSumChart_test\.js$/.test(file)) {
                tests.push(file);
            // }
        }
    }
}
requirejs.config({
    baseUrl: '/base',
    paths: {
        'api': './src/api',
        'util': './src/util',
        'charts': './src/charts',
        'jquery': './node_modules/jquery/dist/jquery',
        'backbone': './node_modules/backbone/backbone',
        'underscore': './node_modules/underscore/underscore',
        'highcharts/modules/offline-exporting':
            './node_modules/highcharts/modules/offline-exporting',
        'highcharts/modules/exporting': './node_modules/highcharts/modules/exporting',
        'highcharts': './node_modules/highcharts/highcharts'
    },
    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: mocha.run
});
