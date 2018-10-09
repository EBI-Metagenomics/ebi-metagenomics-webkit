define([
    '../util', './genericChart', 'highcharts', 'highcharts/modules/exporting'
], function(util, GenericChart, Highcharts, exporting) {
    exporting(Highcharts);

    /**
     * Reformat data into multiple series
     * @param {object} data
     * @return {Array} of data
     */
    function transformData(data) {
        let i = 0;
        const maxColorIndex = util.TAXONOMY_COLOURS.length - 1;
        return data.map(function(e) {
            return {
                name: e.name,
                data: [e.y],
                color: util.TAXONOMY_COLOURS[Math.min(i++, maxColorIndex)]
            };
        });
    }

    /**
     * Generic taxonomy pie chart class, configurable to
     */
    class TaxonomyColumnStacked extends GenericChart {
        /**
         * Instantiate chart
         * @param {string} containerId chart container element
         * @param {[*]} dataOptions
         * @param {[*]} chartOptions
         */
        constructor(containerId, dataOptions, chartOptions) {
            super(containerId, dataOptions);
            this.loaded = $.Deferred();
            if (!chartOptions) {
                chartOptions = {};
            }
            if (!chartOptions.hasOwnProperty('seriesName')) {
                chartOptions['seriesName'] = 'reads';
            }

            this.dataReady.done(() => {
                console.debug('Drawing taxonomy stacked column chart');

                const categories = [];
                this.clusteredData = util.groupTaxonomyData(this.data, 2);
                this.data = transformData(this.clusteredData);
                this.data.forEach(function(e) {
                    categories.push(e.name);
                });
                const sumData = util.sumData(this.clusteredData);
                let titleText;
                if (typeof chartOptions !== 'undefined' && chartOptions.hasOwnProperty('title')) {
                    titleText = chartOptions['title'];
                } else {
                    titleText = '';
                }
                let options = {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'column'
                    },
                    title: {
                        text: titleText
                    },
                    subtitle: {
                        text: 'Total: ' + sumData + ' ' +
                        chartOptions['seriesName']
                    },
                    credits: {
                        enabled: false
                    },
                    tooltip: {
                        formatter() {
                            let perc = 100 * this.y / sumData;
                            return this.series.name + '<br/>' + '<b>' + this.y +
                                '</b> ' + chartOptions['seriesName'] + ' (' + (perc).toFixed(2) +
                                '%)';
                        }
                    },
                    plotOptions: {
                        series: {
                            stacking: 'percent',
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                    yAxis: {
                        min: 0,
                        max: 100
                    },
                    xAxis: {
                        title: {
                            text: null,
                            enabled: false
                        },
                        labels: {
                            enabled: false
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    series: this.data
                };
                this.chart = Highcharts.chart(containerId, options);
            }).done(() => {
                this.loaded.resolve();
            }).fail(() => {
                this.loaded.reject();
            });
        }

        /**
         * Retrieve data from MGnify API
         * @param {{accession: string, type: string}} params
         * @return {jQuery.promise}
         */
        fetchModel(params) {
            const model = new this.api.Taxonomy({id: params['accession'], type: params['type']});
            return model.fetch().then((data) => {
                this.data = data;
            });
        }
    }

    return TaxonomyColumnStacked;
});
