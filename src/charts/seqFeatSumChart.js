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
                const seqData = this.data['analysis-summary'];
                if (Object.keys(seqData).length === 0) {
                    this.loaded.reject();
                    return;
                }
                const pipelineVersion = parseFloat(this.data['pipeline-version']);

                const unit = this.data.is_assembly ? 'Contigs' : 'Reads';

                const secondLabel = unit + (pipelineVersion >= 3.0 ? ' with predicted rRNA' : ' with predicted RNA');
                
                const categories = [
                    unit + ' with predicted CDS',
                    secondLabel,
                    unit + ' with InterProScan match',
                    'Predicted CDS',
                    'Predicted CDS with InterProScan match'
                ];

                const series = [
                    seqData['Reads with predicted CDS'],
                    seqData['Reads with predicted RNA'],
                    seqData['Reads with InterProScan match'],
                    seqData['Predicted CDS'],
                    seqData['Predicted CDS with InterProScan match']
                ].map((d) => parseInt(d));

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
