// Calling define with a dependency array and a factory function
define([], function() {
    // Define the module value by returning a value.
    const api = require('./lib/api');
    return {
        api: api
    };
});
