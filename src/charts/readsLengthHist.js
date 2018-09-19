define([
    './genericChart', '../util', 'highcharts', 'highcharts/modules/exporting'
], function(GenericChart, util, Highcharts, exporting) {
    exporting(Highcharts);

    /**
     * Convert data from string to 2d array and parse values to float
     * @param {string} rawdata
     * @return {[[number, number]]}
     */
    function transformSeries(rawdata) {
        return rawdata.split('\n').filter(function(line) {
            return line.trim() !== '';
        }).map(function(line) {
            return line.split('\t').map(function(v) {
                return 1 * v;
            });
        });
    }

    /**
     * Container for GcDistributionChart
     */
    class GcDistributionChart extends GenericChart {
        /**
         * Constructor for GcDistributionChart; provide accession OR this.data to generate chart.
         * @param {string} containerId id (without #) of container
         * @param {object} dataOptions to configure chart data source
         * @param {object} chartOptions to configure highcharts chart options
         * (this.data or fetch parameters)
         */
        constructor(containerId, dataOptions, chartOptions) {
            super(containerId, dataOptions);
            if (typeof chartOptions === 'undefined') {
                chartOptions = {};
            }
            this.loaded = $.Deferred();
            this.dataReady.done(() => {
                let urlToFile = util.getModelUrl();
                try {
                    let lengthMax = Math.max.apply(null, this.data['series'].map(function(e) {
                        if (e) {
                            return e[0];
                        }
                    }));
                    const options = {
                        chart: {
                            marginLeft: 78,
                            style: {
                                fontFamily: 'Helvetica'
                            },
                            zoomType: 'x'
                        },
                        title: {
                            text: 'Reads length histogram',
                            style: {
                                fontSize: 16,
                                fontWeight: 'bold'
                            }
                        },
                        subtitle: {
                            text: ((chartOptions['isFromSubset'])
                                ? 'A subset of the sequences was used to generate this chart -'
                                : '') + 'Click and drag in the plot area to zoom in'
                        },
                        yAxis: {
                            title: {text: 'Number of reads'}
                        },
                        xAxis: {
                            min: 0,
                            max: 100 * (Math.floor(lengthMax / 100) + 1),
                            plotBands: (this.data === null) ? [] : [
                                { // visualize the standard deviation
                                    from: this.data['average_length'] -
                                    this.data['standard_deviation_length'],
                                    to: this.data['average_length'] +
                                    this.data['standard_deviation_length'],
                                    color: 'rgba(128, 128, 128, .2)',
                                    label: {
                                        text: 'Standard Deviation<br/>\u00B1' +
                                        (this.data['standard_deviation_length'].toFixed(2)),
                                        style: {
                                            color: '#666666',
                                            fontSize: '0.8em'
                                        }
                                    }
                                }]
                        },
                        series: [
                            {
                                name: 'Reads',
                                data: this.data['series'],
                                color: (chartOptions['isFromSubset']) ? '#8dc7c7' : '#058dc7'
                            }
                        ],
                        legend: {enabled: false},
                        credits: false,
                        navigation: {
                            buttonOptions: {
                                height: 32,
                                width: 32,
                                symbolX: 16,
                                symbolY: 16,
                                y: -10
                            }
                        },
                        exporting: util.getExportingStructure(urlToFile)
                    };
                    this.chart = Highcharts.chart(containerId, options);
                } catch (exception) {
                    console.error(exception);
                    this.loaded.reject();
                }
            }).done(() => {
                this.loaded.resolve();
            });
        }

        /**
         * Fetch relevant models from MGnify API
         * @param {object} params required to fetch this.data
         * @return {jQuery.promise}
         */
        fetchModel(params) {
            const summary = new this.api.QcChartData(
                {id: params['accession'], type: 'summary'});
            this.model = new this.api.QcChartData(
                {id: params['accession'], type: 'seq-length'});
            return $.when(summary.fetch({dataType: 'text'}),
                this.model.fetch({dataType: 'text'})
            ).done((...args) => {
                const summaryData = util.tsv2dict(args[0][0]);
                const seqLenData = transformSeries(args[1][0]);
                this.data = summaryData;
                this.data['series'] = seqLenData;
            });
        }
    }

    return GcDistributionChart;
});
