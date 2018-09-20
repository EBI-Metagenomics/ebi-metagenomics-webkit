define([
    './genericChart', 'underscore', '../util', 'highcharts', 'highcharts/modules/exporting'
], function(GenericChart, _, util, Highcharts, exporting) {
    exporting(Highcharts);

    function transformData(data) {
        data = data.map(function(d) {
            const attr = d.attributes;
            return {name: attr['description'], y: attr['count']};
        });
        data = _.sortBy(data, function(d) {
            return d.y;
        }).reverse();
        data[10] = data.slice(10).reduce(function(others, d) {
            others.y += d.y;
            return others;
        }, {name: 'Others', y: 0});
        return data.slice(0, 11);
    }

    /**
     * Container for GoTermPieChart
     */
    class GoTermPieChart extends GenericChart {
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
                const categories = [];
                this.data = transformData(this.data);
                let total = 0;
                this.data.forEach(function(e) {
                    categories.push(e.name);
                    total += e.y;
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
                    subtitle: {
                        text: 'Total: ' + total + ' annotations'
                    },
                    tooltip: {
                        pointFormat: '<b>{point.y}</b> {series.name} ({point.percentage:.2f}%)'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true,
                            colors: util.TAXONOMY_COLOURS
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    series: [
                        {
                            name: 'annotations',
                            colorByPoint: true,
                            data: this.data
                        }],
                    legend: {
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
                    }
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

    return GoTermPieChart;
});
