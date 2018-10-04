// Calling define with a dependency array and a factory function
define(['./src/api', './src/mgx', './src/charts', './src/util'], function(api, mgx, charts, util) {
    // Define the module value by returning a value.
    return {
        api,
        mgx,
        charts,
        util
    };
});
