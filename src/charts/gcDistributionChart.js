define([
    './genericChart', '../util', 'highcharts', 'highcharts/modules/exporting'
], function(GenericChart, util, Highcharts, exporting) {
    exporting(Highcharts);

    function transformSeries(rawdata) {
        return rawdata.split('\n').map(function(line) {
            if (line.trim() !== '') {
                return line.split('\t').map(function(v) {
                    return 1 * v;
                });
            }
        }).reduce(
            function(acc, v) {
                if (v) {
                    let key = Math.min(100, Math.max(0, Math.round(v[0])));
                    acc[key][1] += v[1];
                }
                return acc;
            },
            new Array(101).fill(null).map(function(d, i) {
                return [i, 0];
            }));
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
                try {
                    let urlToFile = util.getModelUrl();

                    const options = {
                        chart: {
                            style: {
                                fontFamily: 'Helvetica'
                            },
                            zoomType: 'x'
                        },
                        title: {
                            text: 'Reads GC distribution',
                            style: {
                                fontSize: 16,
                                fontWeight: 'bold'
                            }
                        },
                        subtitle: {
                            text: ( (typeof chartOptions !== 'undefined' &&
                                chartOptions['isFromSubset'])
                                ? 'A subset of the sequences was used to generate this chart. - '
                                : '') + 'Click and drag in the plot area to zoom in'
                        },
                        yAxis: {
                            title: {text: 'Number of reads'}
                        },
                        xAxis: {
                            min: 0,
                            max: 100,

                            plotBands: (this.data === null) ? [] : [
                                { // visualize the standard deviation
                                    from: this.data['average_gc_content'] -
                                    this.data['standard_deviation_gc_content'],
                                    to: this.data['average_gc_content'] +
                                    this.data['standard_deviation_gc_content'],
                                    color: 'rgba(128, 128, 128, .2)',
                                    borderColor: '#000000',
                                    label: {
                                        text: 'Standard Deviation<br/>\u00B1' +
                                        (this.data['standard_deviation_gc_content'].toFixed(2)),
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
                            }],
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
                    this.loaded.resolve();
                } catch (exception) {
                    console.error(exception);
                    this.loaded.reject();
                }
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
            const gcDistribution = new this.api.QcChartData(
                {id: params['accession'], type: 'gc-distribution'});

            return $.when(summary.fetch({dataType: 'text'}),
                gcDistribution.fetch({dataType: 'text'})
            ).then((...args) => {
                if (args[0][0][0] === '\n' || args[1][0][0] === '\n') {
                    return Promise.reject();
                }
                const seqLengthData = util.tsv2dict(args[0][0]);
                const gcDistData = transformSeries(args[1][0]);
                this.data = seqLengthData;
                this.data['series'] = gcDistData;
            });

        }
    }

    return GcDistributionChart;
});
