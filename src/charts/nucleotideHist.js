define([
    '../util', './genericChart', 'highcharts', 'highcharts/modules/exporting'
], function(util, GenericChart, Highcharts, exporting) {
    exporting(Highcharts);

    /**
     * Container for nucleotide histogram chart
     */
    class NucleotideHist extends GenericChart {
        /**
         *
         * @param {string} containerId for HTML element into which chart will be inserted
         * @param {object} dataOptions parameters to fetch or provide chart data
         * @param {object} chartOptions parameters to customise highcharts chart options
         */
        constructor(containerId, dataOptions, chartOptions) {
            super(containerId, dataOptions);
            this.loaded = $.Deferred();

            this.dataReady.then(() => {
                let data = {'pos': [], 'A': [], 'G': [], 'T': [], 'C': [], 'N': []};
                let colors = {
                    'A': 'rgb(16, 150, 24)',
                    'G': 'rgb(255, 153, 0)',
                    'C': 'rgb(51, 102, 204)',
                    'T': 'rgb(220, 57, 18)',
                    'N': 'rgb(138, 65, 23)'
                };
                let headers = null;
                this.data.split('\n').forEach(function(line) {
                    if (headers === null) {
                        headers = line.split('\t');
                    } else {
                        line.split('\t').forEach(function(v, i) {
                            data[headers[i]].push(v * 1);
                        });
                    }
                });
                let urlToFile;
                if (typeof this.model !== 'undefined') {
                    if (typeof this.model.url === 'function') {
                        urlToFile = this.model.url();
                    } else {
                        urlToFile = this.model.url;
                    }
                } else {
                    urlToFile = '';
                }
                const options = {
                    chart: {
                        renderTo: containerId,
                        type: 'area',
                        style: {
                            fontFamily: 'Helvetica'
                        }
                    },
                    title: {
                        text: 'Nucleotide position histogram',
                        style: {
                            fontSize: 16,
                            fontWeight: 'bold'
                        }
                    },
                    subtitle: {
                        text: (typeof chartOptions !== 'undefined' &&
                            chartOptions['isFromSubset'])
                            ? 'A subset of the sequences was used to generate this chart'
                            : undefined
                    },
                    xAxis: {
                        categories: data['pos'],
                        tickmarkPlacement: 'on',
                        title: {enabled: false}
                    },
                    yAxis: {
                        min: 0,
                        max: 100,
                        title: {enabled: false}
                    },
                    plotOptions: {
                        area: {
                            stacking: 'normal',
                            lineColor: '#666666',
                            lineWidth: 1,
                            marker: {
                                lineWidth: 1,
                                lineColor: '#666666'
                            }
                        }
                    },
                    tooltip: {shared: true},
                    series: ['A', 'T', 'C', 'G', 'N'].map(function(d) {
                        return {
                            name: d,
                            data: data[d],
                            color: colors[d]
                        };
                    }),
                    credits: false,
                    navigation: {
                        buttonOptions: {
                            height: 32,
                            width: 32,
                            symbolX: 16,
                            symbolY: 16,
                            y: -10
                        }
                    },
                    exporting: util.getExportingStructure(urlToFile)
                };
                this.chart = new Highcharts.Chart(options);
            }).done(() =>{
                this.loaded.resolve();
            }).fail(() => {
                this.loaded.reject();
            });
        }

        /**
         * Fetch relevant models from MGnify API
         * @param {object} params required to fetch data
         * @return {jQuery.promise}
         */
        fetchModel(params) {
            this.model = new this.api.QcChartData(
                {id: params['accession'], type: 'nucleotide-distribution'});
            return this.model.fetch({dataType: 'text'}).then((data) => {
                this.data = data;
            });
        }
    }

    return NucleotideHist;
});
