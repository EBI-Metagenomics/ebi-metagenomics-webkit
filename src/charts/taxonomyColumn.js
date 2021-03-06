define([
    '../util', './genericChart', 'highcharts', 'highcharts/modules/exporting'
], function(util, GenericChart, Highcharts, exporting) {
    exporting(Highcharts);

    /**
     * Generic taxonomy pie chart class, configurable to
     */
    class TaxonomyColumn extends GenericChart {

        /**
         * Instantiate chart
         * @param {string} containerId chart container element
         * @param {object} dataOptions parameters to fetch or provide chart data
         * @param {object} chartOptions parameters to customise highcharts chart options
         */
        constructor(containerId, dataOptions, chartOptions) {
            let numColumns = 10;
            if (chartOptions && chartOptions['numColumns']) {
                numColumns = chartOptions['numColumns'];
            }
            super(containerId, dataOptions);
            this.groupingDepth = dataOptions['groupingDepth'] || 0;
            this.loaded = $.Deferred();

            this.dataReady.done(() => {
                console.debug('Drawing taxonomy column chart');

                const categories = [];
                this.clusteredData = util.groupTaxonomyData(this.data, this.groupingDepth);
                this.dataSummary = this.clusteredData.slice(0, numColumns);
                this.dataSummary.forEach(function(e) {
                    categories.push(e.name);
                });
                let options = {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'column'
                    },
                    title: {
                        text: typeof chartOptions !== 'undefined' ? chartOptions['title'] : ''
                    },
                    credits: {
                        enabled: false
                    },
                    series: [
                        {
                            colorByPoint: true,
                            data: this.dataSummary,
                            colors: util.TAXONOMY_COLOURS
                        }],
                    xAxis: {
                        categories: categories,
                        title: {
                            text: null
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Number of sequences',
                            align: 'high'
                        },
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    tooltip: {
                        formatter() {
                            let perc = 100 * this.y / util.sumData(this.series.data);
                            return this.x + '<br/>' + '<b>' + this.y +
                                '</b> ' + chartOptions['seriesName'] + ' (' + (perc).toFixed(2) +
                                '%)';
                        }
                    },
                    legend: {
                        enabled: false
                    }
                };
                if (typeof chartOptions !== 'undefined') {
                    if (typeof chartOptions['subtitle'] === 'undefined' ||
                        chartOptions['subtitle']) {
                        options.subtitle = {
                            text: 'Total: ' + util.sumData(this.clusteredData) + ' ' +
                            chartOptions['seriesName']
                        };
                    }
                }
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

    return TaxonomyColumn;
});
