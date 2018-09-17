define([], function() {
    // Define the module value by returning a value.
    return {
        QcChart: require('./charts/qcChart'),
        TaxonomyPie: require('./charts/taxonomyPie')
    };
});
