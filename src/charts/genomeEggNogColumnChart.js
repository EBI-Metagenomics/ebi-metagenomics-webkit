define([
    './genericChart', '../util', 'highcharts', 'highcharts/modules/exporting', 'underscore'
], function(GenericChart, util, Highcharts, exporting, _) {
    exporting(Highcharts);

    /**
     * Container for GenomeEggNogColumnChart
     */
    class GenomeEggNogColumnChart extends GenericChart {
        /**
         * Constructor for GenomeEggNogColumnChart; provide accession OR this.data to generate chart.
         * @param {string} containerId id (without #) of container
         * @param {object} dataOptions to configure chart data source
         * @param {object} chartOptions to configure chart
         * (this.data or fetch parameters)
         */
        constructor(containerId, dataOptions, chartOptions) {
            super(containerId, dataOptions);
            this.loaded = $.Deferred();
            this.dataReady.done(() => {
                if (this.data.length === 0) {
                    this.loaded.reject();
                    return;
                }

                let series = [];
                let categories = [];
                let total = 0;
                console.log(this.data);
                this.data.forEach(function(d) {
                    if (d.description !== 'Other') {
                        categories.push(d.description);
                        series.push(d.count);
                    }
                    total += d.count;
                });
                let sortLastOther = function(v) {
                    return v.description === 'Other' ? Number.MIN_VALUE : v.count;
                };
                this.data = _.sortBy(this.data, sortLastOther).reverse();

                let options = {
                    chart: {
                        type: 'column',
                        height: 400,
                        zoomType: 'xy',
                        renderTo: 'container'
                    },
                    title: {
                        text: 'Top 10 EggNOG matches '
                    },
                    subtitle: {
                        text: 'Total: ' + total +
                        ' EggNOG matches - Drag to zoom in/out'
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'EggNOG matches'
                        }
                    },
                    xAxis: {
                        categories: categories
                    },
                    plotOptions: {
                        series: {
                            stacking: 'normal'
                        },
                        column: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            colors: util.TAXONOMY_COLOURS
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        pointFormat: '<b>Count: {point.y}</b>'
                    },
                    series: [
                        {
                            colorByPoint: true,
                            data: series.slice(0, 10),
                            colors: util.TAXONOMY_COLOURS
                        }]
                };
                this.chart = Highcharts.chart(containerId, options);
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
            const EggNogs = new this.api.GenomeEggNogs(
                {id: params['accession']});

            return $.when(EggNogs.fetch()).done(() => {
                this.data = EggNogs.data;
            });
        }
    }

    return GenomeEggNogColumnChart;
});
