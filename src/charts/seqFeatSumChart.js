define([
    'underscore', './genericChart', 'highcharts', 'highcharts/modules/exporting',
], function(underscore, GenericChart, Highcharts, exporting) {
    const _ = underscore;
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
                const seqData = this.data['analysis_summary'];
                if (Object.keys(seqData).length === 0) {
                    this.loaded.reject();
                    return;
                }

                // This is repeated with the model. I didn't merge the code
                // because the GenericChart method doesn't include the api if
                // the data is passed as parameter. Changing that could cause
                // other problems. Considering how close we are to migrate the whole app
                // I would spend time re-factoring this.
                const isAssembly = _.contains(
                    ['assembly','hybrid_assembly','long_reads_assembly'],
                    this.data['experiment_type']
                );

                // TODO: remove mapping when https://www.ebi.ac.uk/panda/jira/browse/EMG-1672
                let categories = [
                    ' with predicted CDS',
                    ' with predicted RNA',
                    ' with InterProScan match',
                    'Predicted CDS',
                    'Predicted CDS with InterProScan match'
                ];

                const series = [
                    this.getSeriesCategory(seqData, categories[0]),
                    this.getSeriesCategory(seqData, categories[1]),
                    this.getSeriesCategory(seqData, categories[2]),
                    this.getSeriesCategory(seqData, categories[3]),
                    this.getSeriesCategory(seqData, categories[4])
                ].map((d) => parseInt(d));

                const prefix = isAssembly ? 'Contigs' : 'Reads';
                categories[0] = prefix + categories[0];
                categories[1] = prefix + categories[1];
                categories[2] = prefix + categories[2];

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
                    series: [{
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
         * Get the series for a category.
         * This method will check if the series contains "contigs" or "reads".
         * Falling back to "reads" if "contigs" is missingg in seqData && isAssembly
         */
        getSeriesCategory(seqData, category) {
            var series = _.get(seqData, category);
            if (!_.isUndefined(series)) {
                return series;
            }
            series = _.get(seqData, 'Contigs' + category);
            if (!_.isUndefined(series)) {
                return series;
            }
            return _.get(seqData, 'Reads' + category);
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
            });
        }
    }

    return SeqFeatSumChart;
});
