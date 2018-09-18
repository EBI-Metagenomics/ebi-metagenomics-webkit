/**
 * Extend reference array of colours such that last colour is duplicated for
 * additional data point
 * @param {[string]} colours
 * @param {[*]} data
 * @return {[string]} of colours with length === length of data
 */
function duplicateLastColor(colours, data) {
    let newColours = [];
    let i = 0;
    while (i < data.length) {
        newColours.push(colours[Math.min(i, colours.length - 1)]);
        i++;
    }
    return newColours;
}

define([
    '../util', './genericChart', 'highcharts', 'highcharts/modules/exporting'
], function(util, GenericChart, Highcharts, exporting) {
    exporting(Highcharts);

    /**
     * Generic taxonomy pie chart class, configurable to
     */
    class TaxonomyPie extends GenericChart {
        /**
         * Instantiate chart
         * @param {string} containerId chart container element
         * @param {[*]} dataOptions
         * @param {[*]} chartOptions
         */
        constructor(containerId, dataOptions, chartOptions) {
            super(containerId, dataOptions);
            this.groupingDepth = dataOptions['groupingDepth'] || 0;
            this.loaded = $.Deferred();

            this.dataReady.done(() => {
                const categories = [];
                this.clusteredData = util.groupTaxonomyData(this.data, this.groupingDepth);
                this.data = util.groupAfterN(this.clusteredData, 10);
                this.data.forEach(function(e) {
                    categories.push(e.name);
                });
                let options = {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    title: {
                        text: typeof chartOptions !== 'undefined' ? chartOptions['title'] : ''
                    },
                    tooltip: {
                        pointFormat: '<b>{point.y}</b> {series.name} ({point.percentage:.2f}%)'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.2f} %',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor)
                                    || 'black'
                                }
                            },
                            colors: duplicateLastColor(util.TAXONOMY_COLOURS, this.data)
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    series: [
                        {
                            name: typeof chartOptions !== 'undefined'
                                ? chartOptions['seriesName']
                                : '',
                            colorByPoint: true,
                            data: this.data
                        }]
                };
                // if (chartOptions) {
                //     options = $.extend(true, options, chartOptions);
                // }
                if (typeof chartOptions !== 'undefined') {
                    if (typeof chartOptions['subtitle'] === 'undefined' ||
                        chartOptions['subtitle']) {
                        options.subtitle = {
                            text: 'Total: ' + util.sumData(this.data) + ' ' +
                            chartOptions['seriesName']
                        };
                    }
                    if (chartOptions['legend']) {
                        options.legend = {
                            title: {
                                text: 'Click to hide'
                            },
                            align: 'right',
                            verticalAlign: 'middle',
                            layout: 'vertical',
                            labelFormatter() {
                                if (this.name.length > 15) {
                                    return this.name.slice(0, 15) + '...';
                                } else {
                                    return this.name;
                                }
                            }
                        };
                        options.plotOptions.pie.showInLegend = true;
                    }
                }
                this.chart = Highcharts.chart(containerId, options);
                this.loaded.resolve();
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

    return TaxonomyPie;
});
