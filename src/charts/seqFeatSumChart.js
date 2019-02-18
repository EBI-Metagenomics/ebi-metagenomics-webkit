define([
    './genericChart', 'highcharts', 'highcharts/modules/exporting', '../util'
], function(GenericChart, Highcharts, exporting, util) {
    exporting(Highcharts);

    /**
     * Container for GcDistributionChart
     */
    class SeqFeatSumChart extends GenericChart {
        /**
         * Constructor for GcDistributionChart; provide accession OR data to generate chart.
         * @param {string} containerId id (without #) of container
         * @param {object} options to configure chart data source (data or fetch parameters)
         */
        constructor(containerId, options) {
            super(containerId, options);
            this.loaded = $.Deferred();
            this.dataReady.done(() => {
                console.debug('Drawing seq feat sum chart');

                const seqData = this.data['analysis_summary'];
                if (Object.keys(seqData).length === 0) {
                    this.loaded.reject();
                    return;
                }
                const pipelineVersion = this.data['pipeline_version'];

                const unit = this.is_assembly ? 'contigs' : 'reads';
                const capUnit = util.capitalize(unit);
                const secondLabel = capUnit +
                    (parseFloat(pipelineVersion) >= 3.0 ? ' with predicted rRNA'
                        : ' with predicted RNA');
                const categories = [
                    capUnit + ' with predicted CDS',
                    secondLabel,
                    capUnit + ' with InterProScan match',
                    'Predicted CDS',
                    'Predicted CDS with InterProScan match'
                ];

                let series = [
                    seqData['Nucleotide sequences with predicted CDS'],
                    seqData['Nucleotide sequences with predicted RNA'],
                    seqData['Nucleotide sequences with InterProScan match'],
                    seqData['Predicted CDS'],
                    seqData['Predicted CDS with InterProScan match']
                ].map(function(e) {
                    return parseInt(e);
                });

                let options = {
                    chart: {
                        type: 'bar'
                    },
                    title: {
                        text: 'Sequence feature summary'
                    },
                    yAxis: {
                        type: 'logarithmic',
                        title: {
                            text: 'Count (note the logarithmic scale)'
                        }
                    },
                    xAxis: {
                        categories: categories
                    },
                    plotOptions: {
                        series: {
                            stacking: 'normal'
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        pointFormat: '<b>{point.y}</b>'
                    },
                    series: [
                        {
                            data: series,
                            color: '#058dc7'
                        }]
                };
                this.chart = Highcharts.chart(containerId, options);
            }).done(() => {
                this.loaded.resolve();
            }).fail(() => {
                this.loaded.reject();
            });
        }

        /**
         * Fetch relevant models from MGnify API
         * @param {object} params required to fetch data
         * @return {jQuery.promise}
         */
        fetchModel(params) {
            const analysis = new this.api.Analysis({id: params['accession']});
            return analysis.fetch().done(() => {
                this.data = analysis['attributes'];
                this.data['is_assembly'] = analysis['attributes']['experiment-type'] === 'assembly';
            });
        }
    }

    return SeqFeatSumChart;
});
