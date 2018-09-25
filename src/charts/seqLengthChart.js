define([
    './genericChart', '../util', 'highcharts', 'highcharts/modules/exporting'
], function(GenericChart, util, Highcharts, exporting) {
    exporting(Highcharts);

    /**
     * Container for GcDistributionChart
     */
    class GcContentChart extends GenericChart {
        /**
         * Constructor for GcDistributionChart; provide accession OR this.data to generate chart.
         * @param {string} containerId id (without #) of container
         * @param {object} options to configure chart this.data source
         * (this.data or fetch parameters)
         */
        constructor(containerId, options) {
            super(containerId, options);
            this.loaded = $.Deferred();
            this.dataReady.done(() => {
                console.debug('Drawing seq length chart');

                const options = {
                    chart: {
                        type: 'bar',
                        marginTop: 0, // Keep all charts left aligned
                        height: 120
                    },
                    title: false,
                    xAxis: {
                        categories: ['Minimum', 'Average', 'Maximum'],
                        title: {enabled: false},
                        lineColor: '#595959',
                        tickColor: ''
                    },
                    yAxis: {
                        min: 0,
                        max: 100 * (Math.floor(this.data['length_max'] / 100) + 1),
                        title: {text: 'Sequence length (bp)'},
                        plotBands: [
                            { // visualize the standard deviation
                                from: this.data['average_length'] -
                                this.data['standard_deviation_length'],
                                to: this.data['average_length'] +
                                this.data['standard_deviation_length'],
                                color: 'rgba(128, 128, 128, .2)'
                            }]
                    },
                    plotOptions: {
                        series: {
                            grouping: false,
                            shadow: false,
                            borderWidth: 0
                        }
                    },
                    series: [
                        {
                            name: 'Length',
                            data: [
                                {
                                    y: this.data['length_min'],
                                    x: 0,
                                    color: 'rgb(114, 191, 63)'
                                },
                                {
                                    y: this.data['average_length'],
                                    x: 1,
                                    color: 'rgb(63, 114, 191)'
                                },
                                {
                                    y: this.data['length_max'],
                                    x: 2,
                                    color: 'rgb(114, 63, 191)'
                                }
                            ],
                            pointPadding: -0.2,
                            tooltip: {
                                pointFormatter: function() {
                                    return '<span style="color:' + this.color +
                                        '">\u25CF</span> ' +
                                        this.category + ': <b>' + (this.y).toFixed(2) +
                                        '</b><br/>';
                                }
                            }
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
                    exporting: {enabled: false}
                };
                this.chart = Highcharts.chart(containerId, options);
                this.loaded.resolve();
            });
        }

        /**
         * Fetch relevant models from MGnify API
         * @param {object} params required to fetch this.data
         * @return {jQuery.promise}
         */
        fetchModel(params) {
            const seqLength = new this.api.QcChartData(
                {id: params['accession'], type: 'summary'});

            return $.when(seqLength.fetch({dataType: 'text'})).then((data) => {
                if (data[0]==='\n'){
                    return Promise.reject();
                }
                this.data = util.tsv2dict(data);
            });
        }
    }

    return GcContentChart;
});
