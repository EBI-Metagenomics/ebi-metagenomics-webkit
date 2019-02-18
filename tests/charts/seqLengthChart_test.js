define(['charts/seqLengthChart'], function(SeqLengthChart) {
    const apiConfig = {
        API_URL: window.__env__['API_URL'],
        SUBFOLDER: '/metagenomics'
    };
    const containerID = 'chart-container';

    describe('Sequence length chart', function() {
        context('Data source tests', function() {
            beforeEach(function() {
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
            });
            it('Should load chart from raw data', function(done) {
                const data = {
                    'bp_count': 199782700,
                    'sequence_count': 1997827,
                    'average_length': 100.000,
                    'standard_deviation_length': 0.000,
                    'length_min': 100,
                    'length_max': 100,
                    'average_gc_content': 44.513,
                    'standard_deviation_gc_content': 10.890,
                    'average_gc_ratio': 1.453,
                    'standard_deviation_gc_ratio': 2.647,
                    'ambig_char_count': 4505,
                    'ambig_sequence_count': 4202,
                    'average_ambig_chars': 0.002
                };
                const chart = new SeqLengthChart(containerID, {data: data});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-1 > .highcharts-point:nth-child(1)')
                        .trigger('mouseover');
                    expect($('.highcharts-point').length).to.equal(3);
                    done();
                });
            });
            it('Should fetch data from MGnify api with accession', function(done) {
                const accession = 'MGYA00141547';
                const chart = new SeqLengthChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-1 > .highcharts-point:nth-child(1)')
                        .trigger('mouseover');
                    expect($('.highcharts-point').length).to.equal(3);
                    done();
                });
            });
        });
    });
});
