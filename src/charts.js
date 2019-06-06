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
    './charts/goTermPieChart',
    './charts/genomeKeggColumnChart',
    './charts/genomeIprColumnChart',
    './charts/genomeCogColumnChart',
    './charts/genomeEggNogColumnChart'
], function(
    QcChart, TaxonomyPie, TaxonomyColumn, TaxonomyColumnStacked, NucleotideHist, SeqFeatSumChart,
    GcContentChart, GcDistributionChart, ReadsLengthHist, SeqLengthChart, InterproMatchPie,
    GoTermBarChart, GoTermPieChart, GenomeKeggColumnChart, GenomeIprColumnChart,
    GenomeCogColumnChart, GenomeEggNogColumnChart) {
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
        GoTermPieChart,
        GenomeKeggColumnChart,
        GenomeIprColumnChart,
        GenomeCogColumnChart,
        GenomeEggNogColumnChart
    };
});
