define([], function() {
    // Define the module value by returning a value.
    return {
        QcChart: require('./charts/qcChart'),
        TaxonomyPie: require('./charts/taxonomyPie'),
        TaxonomyColumn: require('./charts/taxonomyColumn'),
        TaxonomyColumnStacked: require('./charts/taxonomyColumnStacked'),
        NucleotideHist: require('./charts/nucleotideHist'),
        SeqFeatSumChart: require('./charts/seqFeatSumChart'),
        GcContentChart: require('./charts/gcContentChart'),
        GcDistributionChart: require('./charts/gcDistributionChart'),
        // ReadsLengthHist: require('./charts/readsLengthHist'),
        // SeqLengthChart: require('./charts/seqLengthChart')
    };
});
