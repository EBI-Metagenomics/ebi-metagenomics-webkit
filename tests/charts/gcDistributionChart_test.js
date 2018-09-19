define(['charts/gcDistributionChart'], function(GcDistributionChart) {
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
        'series': [
            [
                0,
                2891],
            [
                1,
                1311],
            [
                2,
                274],
            [
                3,
                55],
            [
                4,
                45]]
    };
    describe('GC Distribution chart', function() {
        context('Data source tests', function() {
            it('Should load chart from raw data', function(done) {
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new GcDistributionChart(containerID, {data: data});
                chart.loaded.done(() => {
                    expect($('.highcharts-point').length).to.equal(5);
                    done();
                });
            });
            it('Should fetch data from MGnify api with accession', function(done) {
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = 'MGYA00141547';
                const chart = new GcDistributionChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    expect($('.highcharts-point').length).to.equal(101);
                    done();
                });
            });
        });
    });
});
