define([
    './genericChart', '../util', 'highcharts', 'highcharts/modules/exporting'
], function(GenericChart, util, Highcharts, exporting) {
    exporting(Highcharts);

    /**
     * Container for AnalysisKeggColumnChart
     * FIXME: add tests
     */
    class AnalysisKeggColumnChart extends GenericChart {
        /**
         * Constructor for AnalysisKeggColumnChart
         * @param {string} containerId id (without #) of container
         * @param {object} dataOptions to configure chart data source
         */
        constructor(containerId, dataOptions) {
            super(containerId, dataOptions);
            this.containerId = containerId;
            this.loaded = $.Deferred();
            this.dataReady.done(() => {
                this.render(dataOptions.accession);
            });
        }

        /**
         * Render the chart
         */
        render(accession) {
            if (this.data.length === 0) {
                this.loaded.reject();
                return;
            }
            let categories = this.data.map((d) => d.accession);
            let categoriesDescriptions = this.data.reduce((memo, d) => {
                memo[d.accession] = d.description;
                return memo;
            }, {});
            let series = this.data.map((d) => d.completeness);
            let options = {
                chart: {
                    type: 'column',
                    height: 400,
                    zoomType: 'xy',
                    renderTo: 'container'
                },
                title: {
                    text: 'KEGG module categories'
                },
                yAxis: {
                    min: 0,
                    max: 100,
                    title: {
                        text: 'Completeness (%)'
                    },
                    labels: {
                        format: '{value} %'
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
                    enabled: true
                },
                tooltip: {
                    formatter() {
                        const description = categoriesDescriptions[this.key];
                        let tooltip = this.series.name + '<br/>Completeness: ' + this.y + '%';
                        if (description) {
                            tooltip += '<br />KEGG Module: ' + description;
                        }
                        return tooltip;
                    }

                },
                series: [{
                    name: 'Analysis ' + accession,
                    data: series,
                    colors: util.TAXONOMY_COLOURS[1]
                }]
            };
            this.chart = Highcharts.chart(this.containerId, options);
            this.loaded.resolve();
        }

        /**
         * Flatten the data
         * @param {Object} rawData 
         */
        normalizeData(rawData) {
            if (!rawData) {
                return;
            }
            return rawData.map((d) => {
                return d.attributes;
            });
        }

        /**
         * Fetch relevant models from MGnify API
         * @param {object} params required to fetch this.data
         * @return {jQuery.promise}
         */
        fetchModel(params) {
            const that = this;
            const keggs = new this.api.KeggModule(
                {id: params['accession']});

            return $.when(keggs.fetch()).done(() => {
                that.data = that.normalizeData(keggs.attributes.data);
            });
        }
    }

    return AnalysisKeggColumnChart;
});