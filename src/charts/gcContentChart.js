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
                this.data = util.tsv2dict(this.data);
                // TODO fix once API no longer returns HTML error pages
                if (!this.data.hasOwnProperty('average_gc_content')) {
                    this.loaded.reject();
                    return;
                }
                const that = this;
                const options = {
                    chart: {
                        type: 'bar',
                        marginTop: 0, // Keep all charts left aligned
                        height: 150
                    },
                    title: false,
                    xAxis: {
                        categories: ['Content'],
                        title: {enabled: false},
                        lineColor: '#595959',
                        tickColor: ''
                    },
                    yAxis: {
                        min: 0,
                        max: 100,
                        title: {enabled: false},
                        plotBands: [
                            { // visualize the standard deviation
                                from: this.data['average_gc_content'] -
                                this.data['standard_deviation_gc_content'],
                                to: this.data['average_gc_content'] +
                                this.data['standard_deviation_gc_content'],
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
                            name: 'GC content',
                            pointPadding: 0.25,
                            color: 'rgb(63, 114, 191)',
                            tooltip: {
                                pointFormatter: function() {
                                    return '<span style="color:' + this.color + '">\u25CF</span> ' +
                                        this.series.name + ': <b>' + (this.y).toFixed(2) +
                                        '%</b><br/>';
                                }
                            },
                            data: [this.data['average_gc_content']]
                        }, {
                            name: 'AT content',
                            color: 'rgb(114, 63, 191)',
                            pointPadding: 0.25,
                            threshold: this.data['average_gc_content'],
                            tooltip: {
                                pointFormatter: function() {
                                    const val = (100 - that.data['average_gc_content']).toFixed(2);
                                    return '<span style="color:' + this.color + '">\u25CF</span> ' +
                                        this.series.name + ': <b>' + val + '%</b><br/>';
                                }
                            },
                            data: [100]
                        }
                    ],
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
            }).fail(() => {
                this.loaded.reject();
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
                if (data[0] === '\n') {
                    return Promise.reject();
                }
                this.data = data;
            });
        }
    }

    return GcContentChart;
});
