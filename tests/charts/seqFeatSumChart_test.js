define(['charts/seqFeatSumChart'], function(SeqFeatSumChart) {
    const apiConfig = {
        API_URL: window.__env__['API_URL'],
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
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                this.timeout(60000);
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
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                this.timeout(60000);
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
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                this.timeout(60000);
                const chart = new SeqFeatSumChart(containerID, {data: data});
                chart.loaded.done(() => {
                    expect($('svg').html()).to
                        .match(/Reads with predicted rRNA/);
                    done();
                });
            });
            it('Should display correct label for pipeline < 3.0', function(done) {
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                this.timeout(60000);
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
        context('Assembly labels', function() {
            it('Should switch labels to contigs when displaying an assembly', function(done) {
                this.timeout(60000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = 'MGYA00140023';
                const chart = new SeqFeatSumChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    const labelsText = $('#' + containerID + ' .highcharts-xaxis-labels').text();
                    expect(labelsText).to.contain('Contigs with predicted CDS');
                    expect(labelsText).to.contain('Contigs with predicted rRNA');
                    expect(labelsText).to.contain('Contigs with InterProScan match');
                    done();
                });
            });
        });
    });
});
