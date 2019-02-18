define(['charts/gcContentChart'], function(GcContentChart) {
    const apiConfig = {
        API_URL: window.__env__['API_URL'],
        SUBFOLDER: '/metagenomics'
    };
    const containerID = 'chart-container';

    describe('GC Content chart', function() {
        context('Data source tests', function() {
            it('Should load chart from raw data', function(done) {
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const data = 'bp_count\t199782700\n' +
                    'sequence_count\t1997827\n' +
                    'average_length\t100.000\n' +
                    'standard_deviation_length\t0.000\n' +
                    'length_min\t100\n' +
                    'length_max\t100\n' +
                    'average_gc_content\t44.513\n' +
                    'standard_deviation_gc_content\t10.890\n' +
                    'average_gc_ratio\t1.453\n' +
                    'standard_deviation_gc_ratio\t2.647\n' +
                    'ambig_char_count\t4505\n' +
                    'ambig_sequence_count\t4202\n' +
                    'average_ambig_chars\t0.002\n';
                const chart = new GcContentChart(containerID, {data: data});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-1 > .highcharts-point:nth-child(1)')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to
                        .match(/AT content.+:.+55\.49%/);
                    done();
                });
            });
            it('Should fetch data from MGnify api with accession', function(done) {
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = 'MGYA00141547';
                const chart = new GcContentChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-1 > .highcharts-point:nth-child(1)')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to
                        .match(/AT content.+:.+55\.49%/);
                    done();
                });
            });
        });
    });
});
