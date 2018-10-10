define([
    './genericChart', '../util', 'highcharts', 'highcharts/modules/exporting'
], function(GenericChart, util, Highcharts, exporting) {
    exporting(Highcharts);

    /**
     * Container for GoTermPieChart
     */
    class GoTermBarChart extends GenericChart {
        /**
         * Constructor for GcDistributionChart; provide accession OR this.data to generate chart.
         * @param {string} containerId id (without #) of container
         * @param {object} dataOptions to configure chart data source
         * @param {object} chartOptions to configure chart
         * (this.data or fetch parameters)
         */
        constructor(containerId, dataOptions, chartOptions) {
            super(containerId, dataOptions);
            this.loaded = $.Deferred();
            const validLineages = [
                'biological_process',
                'molecular_function',
                'cellular_component'];
            if (validLineages.indexOf(
                    dataOptions['lineage']) === -1) {
                console.error('Go Term chart lineage is not valid, should be one of ' +
                    validLineages);
                return;
            }
            this.dataReady.done(() => {
                if (this.data.length === 0) {
                    this.loaded.reject();
                    return;
                }

                let series = [];
                let categories = [];
                let total = 0;
                this.data.forEach(function(d) {
                    d = d.attributes;
                    categories.push(d.description);
                    series.push(d.count);
                    total += d.count;
                });

                let options = {
                    chart: {
                        type: 'bar',
                        height: 800,
                        zoomType: 'xy',
                        renderTo: 'container'
                    },
                    title: {
                        text: chartOptions['title']
                    },
                    subtitle: {
                        text: 'Total: ' + total +
                        ' annotations - Drag to zoom in/out'
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Annotations'
                        }
                    },
                    xAxis: {
                        categories: categories
                    },
                    plotOptions: {
                        series: {
                            stacking: 'normal'
                        },
                        bar: {
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
                        pointFormat: '<b>{point.y}</b> {series.name}'
                    },
                    series: [
                        {
                            name: 'annotations',
                            data: series,
                            color: chartOptions['color']
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
            const seqLength = new this.api.GoSlim(
                {id: params['accession']});

            return $.when(seqLength.fetch()).done(() => {
                this.data = seqLength.attributes.data.filter(function(d) {
                    return d.attributes.lineage === params['lineage'];
                });
            });
        }
    }

    return GoTermBarChart;
});
