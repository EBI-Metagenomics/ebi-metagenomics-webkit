define([
    './charts/qcChart',
    './charts/taxonomyPie',
    './charts/taxonomyColumn',
    './charts/taxonomyColumnStacked',
    './charts/nucleotideHist',
    './charts/seqFeatSumChart',
    './charts/gcContentChart',
    './charts/gcDistributionChart',
    './charts/readsLengthHist',
    './charts/seqLengthChart',
    './charts/interproMatchPie',
    './charts/goTermBarChart',
    './charts/goTermPieChart'], function(
    QcChart, TaxonomyPie, TaxonomyColumn, TaxonomyColumnStacked, NucleotideHist, SeqFeatSumChart,
    GcContentChart, GcDistributionChart, ReadsLengthHist, SeqLengthChart, InterproMatchPie,
    GoTermBarChart, GoTermPieChart) {
    return {
        QcChart,
        TaxonomyPie,
        TaxonomyColumn,
        TaxonomyColumnStacked,
        NucleotideHist,
        SeqFeatSumChart,
        GcContentChart,
        GcDistributionChart,
        ReadsLengthHist,
        SeqLengthChart,
        InterproMatchPie,
        GoTermBarChart,
        GoTermPieChart
    };
});
