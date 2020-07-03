define(['charts/seqFeatSumChart'], function(SeqFeatSumChart) {
    const apiConfig = {
        API_URL: window.__env__['API_URL'],
        SUBFOLDER: '/metagenomics'
    };
    const containerID = 'chart-container';

// MGYA00009824 RAW read version 2
// MGYA00141547 RAW read version 4
// MGYA00554532 RAW read version 5

    const data_raw_read_v2 = {
        "pipeline-version": "2.0",
        "accession": "MGYA00009824",
        "experiment-type": "metagenomic",
        "analysis-summary": {
            "Submitted nucleotide sequences": "751041",
            "Nucleotide sequences after format-specific filtering": "749939",
            "Nucleotide sequences after length filtering": "723880",
            "Nucleotide sequences after undetermined bases filtering": "723880",
            "Reads with predicted CDS": "707869",
            "Reads with InterProScan match": "344467",
            "Predicted CDS": "740289",
            "Predicted CDS with InterProScan match": "346885",
            "Total InterProScan matches": "617202",
            "Reads with predicted RNA": "728"
        }
    };

    const data_raw_read_v4 = {
        "pipeline-version": "4.0",
        "accession": "MGYA00141547",
        "experiment-type": "metatranscriptomic",
        "analysis-summary": {
            "Nucleotide sequences after format-specific filtering": "213741430",
            "Nucleotide sequences after length filtering": "180329978",
            "Nucleotide sequences after undetermined bases filtering": "180329978",
            "Reads with InterProScan match": "12488689",
            "Reads with predicted CDS": "129224380",
            "Reads with predicted RNA": "7159621",
            "Predicted CDS": "129224380",
            "Predicted CDS with InterProScan match": "12488689",
            "Submitted nucleotide sequences": "213741460",
            "Total InterProScan matches": "19762347"
        }
    };

    const data_raw_read_v5 = {
        "pipeline-version": "5.0",
        "accession": "MGYA00554532",
        "experiment-type": "metagenomic",
        "analysis-summary": {
            "Nucleotide sequences after format-specific filtering": "522412",
            "Nucleotide sequences after length filtering": "522412",
            "Nucleotide sequences after undetermined bases filtering": "522412",
            "Predicted CDS": "560528",
            "Predicted CDS with InterProScan match": "259732",
            "Predicted LSU sequences": "2794",
            "Predicted SSU sequences": "1506",
            "Reads with InterProScan match": "254106",
            "Reads with predicted CDS": "493412",
            "Reads with predicted RNA": "10812",
            "Submitted nucleotide sequences": "522561",
            "Total InterProScan matches": "537011"
        }
    };

// MGYA00004410 Assembly version 1
// MGYA00521048 Assembly version 4.1
// MGYA00554532 Assembly version 5

    const data_assembly_v1 = {
        "pipeline-version": "1.0",
        "accession": "MGYA00004410",
        "experiment-type": "assembly",
        "analysis-summary": {
            "Nucleotide sequences after clustering": "808659",
            "Nucleotide sequences after format-specific filtering": "844717",
            "Nucleotide sequences after length filtering": "844717",
            "Nucleotide sequences after repeat masking and filtering": "808391",
            "Nucleotide sequences after undetermined bases filtering": "844717",
            "Predicted CDS": "925953",
            "Predicted CDS with InterProScan match": "573798",
            "Contigs with InterProScan match": "520603",
            "Contigs with predicted CDS": "800289",
            "Contigs with predicted RNA": "1390",
            "Submitted nucleotide sequences": "844717",
            "Total InterProScan matches": "1335369"
        }
    };

    const data_assembly_v4_1 = {
        "pipeline-version": "4.1",
        "accession": "MGYA00521048",
        "experiment-type": "assembly",
        "analysis-summary": {
            "Nucleotide sequences after format-specific filtering": "96021",
            "Nucleotide sequences after length filtering": "96021",
            "Nucleotide sequences after undetermined bases filtering": "96021",
            "Predicted CDS": "289486",
            "Predicted CDS with InterProScan match": "222033",
            "Predicted LSU sequences": "120",
            "Predicted SSU sequences": "73",
            "Contigs with InterProScan match": "85344",
            "Contigs with predicted CDS": "95901",
            "Contigs with predicted RNA": "193",
            "Submitted nucleotide sequences": "96021",
            "Total InterProScan matches": "761972"
        }
    };

    const data_assembly_v5 = {
        "pipeline-version": "5.0",
        "accession": "MGYA00536622",
        "experiment-type": "assembly",
        "analysis-summary": {
            "Submitted nucleotide sequences": "3315",
            "Nucleotide sequences after format-specific filtering": "3315",
            "Nucleotide sequences after length filtering": "3315",
            "Nucleotide sequences after undetermined bases filtering": "3315",
            "Predicted CDS": "7261",
            "Predicted CDS with InterProScan match": "4372",
            "Total InterProScan matches": "14138",
            "Contigs with InterProScan match": "1",
            "Contigs with predicted CDS": "1",
            "Contigs with predicted RNA": "57"
        }
    };

    describe('Seq feat chart charts', function() {
        context('Data source tests', function() {
            it('Should load raw data', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new SeqFeatSumChart(containerID, {data: data_raw_read_v4});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to
                        .match(/Predicted CDS with InterProScan match.+12 488 689/);
                    done();
                });
            });
            it('Should fetch data from MGnify api with accession', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = data_raw_read_v4['accession'];
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
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new SeqFeatSumChart(containerID, {data: data_raw_read_v4});
                chart.loaded.done(() => {
                    expect($('svg').html()).to
                        .match(/Reads with predicted rRNA/);
                    done();
                });
            });
            it('Should display correct label for pipeline < 3.0', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const modData = data_raw_read_v4;
                modData['pipeline-version'] = '2.0';
                const chart = new SeqFeatSumChart(containerID, {data: modData});
                chart.loaded.done(() => {
                    expect($('svg').html()).to
                        .match(/Reads with predicted RNA/);
                    done();
                });
            });
        });
        // context('Assembly labels', function() {
        //     it('Should switch labels to contigs when displaying an assembly', function(done) {
        //         this.timeout(20000);
        //         document.body.innerHTML = '<p></p>';
        //         document.body.innerHTML = ('<div id="' + containerID + '"></div>');
        //         const accession = 'MGYA00140023';
        //         const chart = new SeqFeatSumChart(containerID,
        //             {accession: accession, apiConfig: apiConfig});
        //         chart.loaded.done(() => {
        //             const $svg = $('svg').html();
        //             expect($svg).to.contain('Contigs with predicted CDS');
        //             expect($svg).to.contain('Contigs with predicted rRNA');
        //             expect($svg).to.contain('Contigs with InterProScan match');
        //             done();
        //         });
        //     });
        // });
    });
});
