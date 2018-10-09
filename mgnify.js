// Calling define with a dependency array and a factory function
define(['./src/api', './src/charts', './src/util'], function(api, charts, util) {
    // Define the module value by returning a value.
    return {
        api,
        charts,
        util
    };
});
