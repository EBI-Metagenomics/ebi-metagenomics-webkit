define(['charts/readsLengthHist'], function(ReadsLengthHist) {
    const apiConfig = {
        API_URL: 'http://localhost:9000/metagenomics/api/v1/',
        SUBFOLDER: '/metagenomics'
    };
    const containerID = 'chart-container';
    const data = {
        'bp_count': 199782700,
        'sequence_count': 1997827,
        'average_length': 100,
        'standard_deviation_length': 0,
        'length_min': 100,
        'length_max': 100,
        'average_gc_content': 44.513,
        'standard_deviation_gc_content': 10.89,
        'average_gc_ratio': 1.453,
        'standard_deviation_gc_ratio': 2.647,
        'ambig_char_count': 4505,
        'ambig_sequence_count': 4202,
        'average_ambig_chars': 0.002,
        'series': [[100, 1997827]]
    };
    describe('Reads length hist chart', function() {
        context('Data source tests', function() {
            it('Should load from raw data', function(done) {
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new ReadsLengthHist(containerID, {data: data});
                chart.loaded.done(() => {
                    expect($('.highcharts-point').length).to.equal(1);
                    done();
                });
            });
            it('Should fetch data from MGnify api with accession', function(done) {
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = 'MGYA00141547';
                const chart = new ReadsLengthHist(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    expect($('.highcharts-point').length).to.equal(1);
                    done();
                });
            });
            it('Should display subset subtitle', function(done) {
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = 'MGYA00141547';
                const chart = new ReadsLengthHist(containerID,
                    {accession: accession, apiConfig: apiConfig}, {isFromSubset: true});
                chart.loaded.done(() => {
                    expect($('svg').html()).to.contain('A subset of the sequences was used');
                    done();
                });
            });
        });
    });
});
