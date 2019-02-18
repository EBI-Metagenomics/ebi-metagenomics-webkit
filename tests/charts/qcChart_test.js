define(['charts/qcChart'], function(QcChart) {
    const apiConfig = {
        API_URL: window.__env__['API_URL'],
        SUBFOLDER: '/metagenomics'
    };
    const containerID = 'chart-container';

    describe('QC charts', function() {
        context('Data source tests', function() {
            beforeEach(function() {
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
            });
            it('Should load chart from raw data', function(done) {
                const data = {
                    'Nucleotide sequences after format-specific filtering': '213741430',
                    'Nucleotide sequences after length filtering': '180329978',
                    'Nucleotide sequences after undetermined bases filtering': '180329978',
                    'Nucleotide sequences with InterProScan match': '12488689',
                    'Nucleotide sequences with predicted CDS': '129224380',
                    'Nucleotide sequences with predicted RNA': '7159621',
                    'Predicted CDS': '129224380',
                    'Predicted CDS with InterProScan match': '12488689',
                    'Submitted nucleotide sequences': '213741460',
                    'Total InterProScan matches': '19762347',
                    'sequence_count': '1997827'
                };
                const chart = new QcChart(containerID, {data: data, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-1 > .highcharts-point:nth-child(1)')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to
                        .match(/Reads remaining:.+213 741 460/);
                    done();
                });
            });
            it('Should fetch data from MGnify api with accession', function(done) {
                const accession = 'MGYA00141547';
                const chart = new QcChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-1 > .highcharts-point:nth-child(1)')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to
                        .match(/Reads remaining:.+213 741 460/);
                    done();
                });
            });
        });
        context('Assembly labels', function() {
            it('Should switch labels from to contigs when displaying an assembly', function(done) {
                this.timeout(20000);
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = 'MGYA00140023';
                const chart = new QcChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    const labelsText = $('#' + containerID + ' .highcharts-xaxis-labels').text();
                    expect(labelsText).to.contain('Contigs subsampled for QC analysis');
                    expect($('#' + containerID + ' .highcharts-title').text())
                        .to
                        .contain('contigs');
                    done();
                });
            });
        });
    });
});
