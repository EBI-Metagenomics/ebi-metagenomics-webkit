define([
    './genericChart', '../util', 'highcharts', 'highcharts/modules/exporting'
], function(GenericChart, util, Highcharts, exporting) {
    exporting(Highcharts);

    /**
     * Container for GenomeKeggColumnChart
     */
    class GenomeKeggColumnChart extends GenericChart {
        /**
         * Constructor for GenomeIPRColumnChart; provide accession OR this.data to generate chart.
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

                let total = 0;
                let categories = this.data.map((d) => {return d.name});
                let genomeSeries = this.data.map((d) => {
                    let c = d['genome-count'];
                    total += c;
                    return c;
                });
                let pangenomeSeries = this.data.map((d) => {return d['pangenome-count']});

                let options = {
                    chart: {
                        type: 'column',
                        height: 400,
                        zoomType: 'xy',
                        renderTo: 'container'
                    },
                    title: {
                        text: 'Top 10 KEGG brite categories'
                    },
                    subtitle: {
                        text: 'Total: ' + total +
                        ' KEGG matches - Drag to zoom in/out'
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'KEGG matches'
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
                        formatter() {
                            return this.series.name + '<br/>' + 'Count: ' + this.y;
                        }

                    },
                    series: [
                        {
                            name: 'Genome',
                            data: genomeSeries.slice(0, 10),
                            colors: util.TAXONOMY_COLOURS[1],
                            stack: 'genome'
                        },
                        {
                            name: 'Pan-genome',
                            data: pangenomeSeries.slice(0, 10),
                            colors: util.TAXONOMY_COLOURS[2],
                            stack: 'pan-genome'
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
            const keggs = new this.api.GenomeKeggClasses(
                {id: params['accession']});

            return $.when(keggs.fetch()).done(() => {
                this.data = keggs.data;
            });
        }
    }

    return GenomeKeggColumnChart;
});
