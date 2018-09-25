define(['charts/seqFeatSumChart'], function(SeqFeatSumChart) {
    const apiConfig = {
        API_URL: 'http://localhost:9000/metagenomics/api/v1/',
        SUBFOLDER: '/metagenomics'
    };
    const containerID = 'chart-container';

    const data = {
        'pipeline_version': '4.0',
        'analysis_summary': {
            'Nucleotide sequences after format-specific filtering': '213741430',
            'Nucleotide sequences after length filtering': '180329978',
            'Nucleotide sequences after undetermined bases filtering': '180329978',
            'Nucleotide sequences with InterProScan match': '12488689',
            'Nucleotide sequences with predicted CDS': '129224380',
            'Nucleotide sequences with predicted RNA': '7159621',
            'Predicted CDS': '129224380',
            'Predicted CDS with InterProScan match': '12488689',
            'Submitted nucleotide sequences': '213741460',
            'Total InterProScan matches': '19762347'
        }
    };

    describe('Seq feat chart charts', function() {
        context('Data source tests', function() {
            it('Should load raw data', function(done) {
                this.timeout(60000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new SeqFeatSumChart(containerID, {data: data});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to
                        .match(/Predicted CDS with InterProScan match.+12 488 689/);
                    done();
                });
            });
            it('Should fetch data from MGnify api with accession', function(done) {
                this.timeout(60000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = 'MGYA00141547';
                const chart = new SeqFeatSumChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to
                        .match(/Predicted CDS with InterProScan match.+12 488 689/);
                    done();
                });
            });
            it('Should display correct label for pipeline >= 3.0', function(done) {
                this.timeout(60000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new SeqFeatSumChart(containerID, {data: data});
                chart.loaded.done(() => {
                    expect($('svg').html()).to
                        .match(/Reads with predicted rRNA/);
                    done();
                });
            });
            it('Should display correct label for pipeline < 3.0', function(done) {
                this.timeout(60000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const modData = data;
                modData['pipeline_version'] = '2.0';
                const chart = new SeqFeatSumChart(containerID, {data: modData});
                chart.loaded.done(() => {
                    expect($('svg').html()).to
                        .match(/Reads with predicted RNA/);
                    done();
                });
            });
        });
    });
});