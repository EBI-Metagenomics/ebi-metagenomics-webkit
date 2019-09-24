define([
    '../util', 'highcharts', 'highcharts/modules/exporting'
], function(util, Highcharts, exporting) {
    exporting(Highcharts);

    /**
     * Container for GenericColumnChart.
     * This chart needs that the data is provided, it won't load anything by
     * itself.
     * It is intended as simple wrapped of Highcharts.
     * FIXME: add tests
     */
    class GenericColumnChart {
        /**
         * Constructor for GenericColumnChart
         * @param {string} containerId id (without #) of container
         * @param {object} chartOptions hightcharts options
         */
        constructor(containerId, chartOptions) {
            this.containerId = containerId;
            this.chartOptions = chartOptions;
            let options = {
                chart: {
                    type: 'column',
                    height: 400,
                    zoomType: 'xy',
                    renderTo: 'container'
                },
                title: {
                    text: this.chartOptions.title,
                },
                yAxis: this.chartOptions.yAxis,
                xAxis: this.chartOptions.xAxis,
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
                tooltip: this.chartOptions.tooltip,
                series: this.chartOptions.series
            };
            this.chart = Highcharts.chart(this.containerId, options);
        }
    }

    return GenericColumnChart;
});