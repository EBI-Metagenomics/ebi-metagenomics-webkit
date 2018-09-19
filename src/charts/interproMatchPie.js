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
         */
        constructor(containerId, dataOptions) {
            super(containerId, dataOptions);
            this.groupingDepth = dataOptions['groupingDepth'] || 0;
            this.loaded = $.Deferred();

            this.dataReady.done(() => {
                let totalCount = this.data.sum('y');

                let options = {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    title: {
                        text: 'InterPro match summary'
                    },
                    subtitle: {
                        text: 'Total: ' + totalCount + ' reads'
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
                            colors: util.duplicateLastColor(util.TAXONOMY_COLOURS, this.data)
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    series: [
                        {
                            name: 'pCDS matched',
                            colorByPoint: true,
                            data: this.data
                        }]
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
            const model = new this.api.InterproIden({id: params['accession']});
            return model.fetch().then((data) => {
                this.raw_data = data;
                data = data.map(function(d) {
                    const attr = d.attributes;
                    return {
                        name: attr['description'],
                        y: attr['count']
                    };
                });
                let sumOthers = data.slice(10).sum('y');
                const others = {
                    name: 'Other',
                    y: sumOthers
                };
                this.data = data.slice(0, 10);
                this.data.push(others);
            });
        }
    }

    return TaxonomyPie;
});
