define([
    './genericChart', 'highcharts', 'highcharts/modules/exporting'
], function(GenericChart, Highcharts, exporting) {
    exporting(Highcharts);

    /**
     * Container for GcDistributionChart
     */
    class QCChart extends GenericChart {
        /**
         * Constructor for GcDistributionChart; provide accession OR data to generate chart.
         * @param {string} containerId id (without #) of container
         * @param {object} options to configure chart data source (data or fetch parameters)
         */
        constructor(containerId, options) {
            super(containerId, options);
            this.loaded = $.Deferred();
            this.dataReady.done(() => {
                console.debug('Drawing QC chart');

                let remaining = [0, 0, 0, 0, 0];
                let filtered = [0, 0, 0, 0, 0];
                let subsampled = [0, 0, 0, 0, 0];

                subsampled[4] = parseInt(this.data['sequence_count']);
                remaining[0] = parseInt(this.data['Submitted nucleotide sequences']);
                remaining[1] = parseInt(
                    this.data['Nucleotide sequences after format-specific filtering']);
                remaining[2] = parseInt(this.data['Nucleotide sequences after length filtering']);
                remaining[3] = parseInt(
                    this.data['Nucleotide sequences after undetermined bases filtering']);
                filtered[2] = remaining[1] - remaining[2];
                filtered[1] = remaining[0] - remaining[1];
                filtered[4] = remaining[3] - remaining[4] - subsampled[4];

                let chartOptions = {
                    chart: {
                        type: 'bar'
                    },
                    title: {
                        text: 'Number of sequence reads per QC step'
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Count'
                        }
                    },
                    xAxis: {
                        categories: [
                            'Initial reads',
                            'Trimming',
                            'Length filtering',
                            'Ambiguous base filtering',
                            'Reads subsampled for QC analysis']
                    },
                    plotOptions: {
                        series: {
                            stacking: 'normal'
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    series: [
                        {
                            name: 'Reads filtered out',
                            data: filtered,
                            color: '#CCCCD3'
                        }, {
                            name: 'Reads remaining',
                            data: remaining,
                            color: '#058DC7'
                        }, {
                            name: 'Reads after sampling',
                            data: subsampled,
                            color: '#8dc7c7'
                        }]
                };
                this.chart = Highcharts.chart(containerId, chartOptions);
            }).done(() => {
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
            const analysis = new this.api.Analysis({id: params['accession']});
            const qcStats = new this.api.QcChartStats({id: params['accession']});

            let fetchAnalysis = analysis.fetch().done(() => {
                console.log(analysis);
                if (parseFloat(analysis.attributes.pipeline_version) > 3.0) {
                    fetchAnalysis.then(qcStats.fetch({dataType: 'text'})).done(() => {

                    });
                }
                this.data = analysis['attributes']['analysis_summary'];
            });
            return fetchAnalysis.promise();
        }
    }

    return QCChart;
});
