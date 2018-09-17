define(['charts/qcChart', 'api'], function(QcChart, api) {
    const apiConfig = {
        API_URL: 'http://localhost:9000/metagenomics/api/v1/',
        SUBFOLDER: '/metagenomics'
    };
    api = api(apiConfig);
    const containerID = 'chart-container';

    describe('QC charts', function() {
        context('Data source tests', function() {
            it('Should load qc chart from raw data', function(done) {
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
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
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
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
    });
});
