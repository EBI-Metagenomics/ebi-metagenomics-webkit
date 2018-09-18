define(['highcharts', '../util', './genericChart'], function(Highcharts, util, GenericChart) {
    /**
     * Container for nucleotide histogram chart
     */
    class NucleotideHist extends GenericChart {
        /**
         * 
         * @param containerId
         * @param dataOptions
         * @param chartOptions
         */
        constructor(containerId, dataOptions, chartOptions) {
            super(containerId, dataOptions);
            this.loaded = $.Deferred();

            this.dataReady.done(() => {
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
                dataOptions = {
                    chart: {
                        // renderTo: 'nucleotide',
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
                        text: (typeof chartOptions !== 'undefined' && chartOptions['isFromSubset'])
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
                    exporting: util.getExportingStructure(
                        typeof chartOptions !== 'undefined' ? chartOptions['urlToFile'] : '')
                };
                this.chart = new Highcharts.Chart(containerId, dataOptions);
                this.loaded.resolve();
            });
        }

        fetchModel(params) {
            const model = new this.api.QcChartData(
                {id: params['accession'], type: 'nucleotide-distribution'});
            return model.fetch({dataType: 'text'}).then((data) => {
                this.data = data;
            });
        }
    }

    return NucleotideHist;
});
