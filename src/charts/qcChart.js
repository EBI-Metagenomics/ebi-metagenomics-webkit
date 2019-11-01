define([
    './genericChart', 'highcharts', 'highcharts/modules/exporting', '../util'
], function(GenericChart, Highcharts, exporting, util) {
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
            this.analysesModel = options.analysesModel; // Analyses with the data loaded
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

                const unit = this.data.is_assembly ? 'contigs' : 'reads';
                const capUnit = util.capitalize(unit);
                let chartOptions = {
                    chart: {
                        type: 'bar'
                    },
                    title: {
                        text: 'Number of sequence ' +
                        unit +
                        ' per QC step'
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Count'
                        }
                    },
                    xAxis: {
                        categories: [
                            'Initial ' + unit,
                            'Trimming',
                            'Length filtering',
                            'Ambiguous base filtering',
                            capUnit + ' subsampled for QC analysis']
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
                            name: capUnit + ' filtered out',
                            data: filtered,
                            color: '#CCCCD3'
                        }, {
                            name: capUnit + ' remaining',
                            data: remaining,
                            color: '#058DC7'
                        }, {
                            name: capUnit + ' after sampling',
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
            const qcStats = new this.api.QcChartStats({id: params['accession']});
            // TODO: clean this.
            const that = this;
            if (params.analysesModel) {
                const analysis = params.analysesModel;
                that.data = analysis.get('analysis_summary');
                that.data.is_assembly = analysis.get('experiment_type') === 'assembly';
                if (parseFloat(analysis.get('pipeline_version')) > 3.0) {
                    return qcStats.fetch({dataType: 'text'}).then(() => {
                        that.data.sequence_count = qcStats.get('sequence_count');
                    });
                } else {
                    return $.when();
                }
            } else {
                const analysis = new this.api.Analysis({id: params['accession']});
                return analysis.fetch().then(() => {
                    that.data = analysis['attributes']['analysis_summary'];
                    that.data['is_assembly'] = analysis['attributes']['experiment_type'] === 'assembly';
                    if (parseFloat(analysis['attributes']['pipeline_version']) > 3.0) {
                        return qcStats.fetch({dataType: 'text'});
                    } else {
                        return true;
                    }
                }).then(() => {
                    that.data['sequence_count'] = qcStats['attributes']['sequence_count'];
                });    
            }
        }
    }

    return QCChart;
});
