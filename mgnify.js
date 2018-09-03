// Calling define with a dependency array and a factory function
define([], function() {
    // Define the module value by returning a value.
    return {
        api: require('./src/api'),
        util: require('./src/util')
    };
});
