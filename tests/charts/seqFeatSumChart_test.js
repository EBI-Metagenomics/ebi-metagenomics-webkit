define(['charts/seqFeatSumChart'], function(SeqFeatSumChart) {
    const apiConfig = {
        API_URL: window.__env__['API_URL'],
        SUBFOLDER: '/metagenomics'
    };
    const containerID = 'chart-container';

// MGYA00000763 RAW read version 1
// MGYA00009824 RAW read version 2
// MGYA00085620 RAW read version 3
// MGYA00141547 RAW read version 4
// MGYA00554532 RAW read version 5

    const data_raw_read_v1 = {
        "pipeline_version": "1.0",
        "accession": "MGYA00000763",
        "experiment_type": "metagenomic",
        "analysis_summary": {
            "Reads with predicted CDS": "90376",
            "Reads with InterProScan match": "18261",
            "Predicted CDS": "90796",
            "Predicted CDS with InterProScan match": "18270",
            "Reads with predicted RNA": "131"
        }
    };

    const data_raw_read_v2 = {
        "pipeline_version": "2.0",
        "accession": "MGYA00009824",
        "experiment_type": "metagenomic",
        "analysis_summary": {
            "Reads with predicted CDS": "707869",
            "Reads with InterProScan match": "344467",
            "Predicted CDS": "740289",
            "Predicted CDS with InterProScan match": "346885",
            "Reads with predicted RNA": "728"
        }
    };

    const data_raw_read_v3 = {
        "pipeline_version": "3.0",
        "accession": "MGYA00085620",
        "experiment_type": "metagenomic",
        "analysis_summary": {
            "Reads with predicted CDS": "4106564",
            "Reads with InterProScan match": "1108750",
            "Predicted CDS": "4108694",
            "Predicted CDS with InterProScan match": "1108785",
            "Reads with predicted RNA": "24239"
        }
    };

    const data_raw_read_v4 = {
        "pipeline_version": "4.0",
        "accession": "MGYA00141547",
        "experiment_type": "metatranscriptomic",
        "analysis_summary": {
            "Reads with InterProScan match": "12488689",
            "Reads with predicted CDS": "129224380",
            "Reads with predicted RNA": "7159621",
            "Predicted CDS": "129224380",
            "Predicted CDS with InterProScan match": "12488689"
        }
    };

    const data_raw_read_v5 = {
        "pipeline_version": "5.0",
        "accession": "MGYA00554532",
        "experiment_type": "metagenomic",
        "analysis_summary": {
            "Predicted CDS": "560528",
            "Predicted CDS with InterProScan match": "259732",
            "Reads with InterProScan match": "254106",
            "Reads with predicted CDS": "493412",
            "Reads with predicted RNA": "10812"
        }
    };

// MGYA00004410 Assembly version 1
// MGYA00521048 Assembly version 4.1
// MGYA00554532 Assembly version 5

    const data_assembly_v1 = {
        "pipeline_version": "1.0",
        "accession": "MGYA00004410",
        "experiment_type": "assembly",
        "analysis_summary": {
            "Predicted CDS": "925953",
            "Predicted CDS with InterProScan match": "573798",
            "Contigs with InterProScan match": "520603",
            "Contigs with predicted CDS": "800289",
            "Contigs with predicted RNA": "1390"
        }
    };

    const data_assembly_v2 = {
        "pipeline_version": "2.0",
        "accession": "MGYA00065487",
        "experiment_type": "assembly",
        "analysis_summary": {
            "Predicted CDS": "359078",
            "Predicted CDS with InterProScan match": "135272",
            "Contigs with InterProScan match": "126513",
            "Contigs with predicted CDS": "333488",
            "Contigs with predicted RNA": "259"
        }
    };

    const data_assembly_v3 = {
        "pipeline_version": "3.0",
        "accession": "MGYA00131957",
        "experiment_type": "assembly",
        "analysis_summary": {
            "Predicted CDS": "1431",
            "Predicted CDS with InterProScan match": "1042",
            "Contigs with InterProScan match": "77",
            "Contigs with predicted CDS": "82",
            "Contigs with predicted RNA": "2"
        }
    };

    const data_assembly_v4_1 = {
        "pipeline_version": "4.1",
        "accession": "MGYA00521048",
        "experiment_type": "assembly",
        "analysis_summary": {
            "Predicted CDS": "289486",
            "Predicted CDS with InterProScan match": "222033",
            "Contigs with InterProScan match": "85344",
            "Contigs with predicted CDS": "95901",
            "Contigs with predicted RNA": "193"
        }
    };

    const data_assembly_v5 = {
        "pipeline_version": "5.0",
        "accession": "MGYA00536622",
        "experiment_type": "assembly",
        "analysis_summary": {
            "Predicted CDS": "7261",
            "Predicted CDS with InterProScan match": "4372",
            "Contigs with InterProScan match": "1",
            "Contigs with predicted CDS": "1",
            "Contigs with predicted RNA": "57"
        }
    };

    const raw_read_dataset = {
        "1": data_raw_read_v1,
        "2": data_raw_read_v1
    }

    describe('Sequence feature summary chart', function() {

        context('Test RAW read - predefined test data source - version 1', function() {
            it('Should load correct left hand side labels', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new SeqFeatSumChart(containerID, {data: data_raw_read_v1});
                chart.loaded.done(() => {
                    const $svg = $('svg').html();
                    expect($svg).to.contain('Reads with predicted CDS');
                    expect($svg).to.contain('Reads with predicted RNA');
                    expect($svg).to.contain('Reads with InterProScan match');
                    expect($svg).to.contain('Predicted CDS');
                    expect($svg).to.contain('Predicted CDS with InterProScan match');
                    done();
                });
            });
            it('Should load correct tooltip counts', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new SeqFeatSumChart(containerID, {data: data_raw_read_v1});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to
                        .match(/Predicted CDS with InterProScan match.+18 270/);
                    done();
                });
            });
        });

        context('Test RAW read - predefined test data source - version 2', function() {
            it('Should load correct left hand side labels', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new SeqFeatSumChart(containerID, {data: data_raw_read_v2});
                chart.loaded.done(() => {
                    const $svg = $('svg').html();
                    expect($svg).to.contain('Reads with predicted CDS');
                    expect($svg).to.contain('Reads with predicted RNA');
                    expect($svg).to.contain('Reads with InterProScan match');
                    expect($svg).to.contain('Predicted CDS');
                    expect($svg).to.contain('Predicted CDS with InterProScan match');
                    done();
                });
            });
            it('Should load correct tooltip counts', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new SeqFeatSumChart(containerID, {data: data_raw_read_v2});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to
                        .match(/Predicted CDS with InterProScan match.+346 885/);
                    done();
                });
            });
        });

        context('Test RAW read - predefined test data source - version 3', function() {
            it('Should load correct left hand side labels', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new SeqFeatSumChart(containerID, {data: data_raw_read_v3});
                chart.loaded.done(() => {
                    const $svg = $('svg').html();
                    expect($svg).to.contain('Reads with predicted CDS');
                    expect($svg).to.contain('Reads with predicted RNA');
                    expect($svg).to.contain('Reads with InterProScan match');
                    expect($svg).to.contain('Predicted CDS');
                    expect($svg).to.contain('Predicted CDS with InterProScan match');
                    done();
                });
            });
            it('Should load correct tooltip counts', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new SeqFeatSumChart(containerID, {data: data_raw_read_v3});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to
                        .match(/Predicted CDS with InterProScan match.+1 108 785/);
                    done();
                });
            });
        });

        context('Test RAW read - predefined test data source - version 4', function() {
            it('Should load correct left hand side labels', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new SeqFeatSumChart(containerID, {data: data_raw_read_v4});
                chart.loaded.done(() => {
                    const $svg = $('svg').html();
                    expect($svg).to.contain('Reads with predicted CDS');
                    expect($svg).to.contain('Reads with predicted RNA');
                    expect($svg).to.contain('Reads with InterProScan match');
                    expect($svg).to.contain('Predicted CDS');
                    expect($svg).to.contain('Predicted CDS with InterProScan match');
                    done();
                });
            });
            it('Should load correct tooltip counts', function(done) {
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
        });
        context('Test RAW read - predefined test data source - version 5', function() {
            it('Should load correct left hand side labels', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new SeqFeatSumChart(containerID, {data: data_raw_read_v5});
                chart.loaded.done(() => {
                    const $svg = $('svg').html();
                    expect($svg).to.contain('Reads with predicted CDS');
                    expect($svg).to.contain('Reads with predicted RNA');
                    expect($svg).to.contain('Reads with InterProScan match');
                    expect($svg).to.contain('Predicted CDS');
                    expect($svg).to.contain('Predicted CDS with InterProScan match');
                    done();
                });
            });
            it('Should load correct tooltip counts', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new SeqFeatSumChart(containerID, {data: data_raw_read_v5});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to
                        .match(/Predicted CDS with InterProScan match.+259 732/);
                    done();
                });
            });
        });
        context('Test RAW read - API - version 1', function() {
            it('Should load correct left hand side labels', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = data_raw_read_v1['accession'];
                const chart = new SeqFeatSumChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    const $svg = $('svg').html();
                    expect($svg).to.contain('Reads with predicted CDS');
                    expect($svg).to.contain('Reads with predicted RNA');
                    expect($svg).to.contain('Reads with InterProScan match');
                    expect($svg).to.contain('Predicted CDS');
                    expect($svg).to.contain('Predicted CDS with InterProScan match');
                    done();
                });
            });
            it('Should load correct tooltip counts', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = data_raw_read_v1['accession'];
                const chart = new SeqFeatSumChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to
                        .match(/Predicted CDS with InterProScan match.+18 270/);
                    done();
                });
            });
        });
        context('Test RAW read - API - version 2', function() {
            it('Should load correct left hand side labels', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = data_raw_read_v2['accession'];
                const chart = new SeqFeatSumChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    const $svg = $('svg').html();
                    expect($svg).to.contain('Reads with predicted CDS');
                    expect($svg).to.contain('Reads with predicted RNA');
                    expect($svg).to.contain('Reads with InterProScan match');
                    expect($svg).to.contain('Predicted CDS');
                    expect($svg).to.contain('Predicted CDS with InterProScan match');
                    done();
                });
            });
            it('Should load correct tooltip counts', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = data_raw_read_v2['accession'];
                const chart = new SeqFeatSumChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to
                        .match(/Predicted CDS with InterProScan match.+346 885/);
                    done();
                });
            });
        });
        context('Test RAW read - API - version 3', function() {
            it('Should load correct left hand side labels', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = data_raw_read_v3['accession'];
                const chart = new SeqFeatSumChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    const $svg = $('svg').html();
                    expect($svg).to.contain('Reads with predicted CDS');
                    expect($svg).to.contain('Reads with predicted RNA');
                    expect($svg).to.contain('Reads with InterProScan match');
                    expect($svg).to.contain('Predicted CDS');
                    expect($svg).to.contain('Predicted CDS with InterProScan match');
                    done();
                });
            });
            it('Should load correct tooltip counts', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = data_raw_read_v3['accession'];
                const chart = new SeqFeatSumChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to
                        .match(/Predicted CDS with InterProScan match.+1 108 785/);
                    done();
                });
            });
        });
        context('Test RAW read - API - version 4', function() {
            it('Should load correct left hand side labels', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = data_raw_read_v4['accession'];
                const chart = new SeqFeatSumChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    const $svg = $('svg').html();
                    expect($svg).to.contain('Reads with predicted CDS');
                    expect($svg).to.contain('Reads with predicted RNA');
                    expect($svg).to.contain('Reads with InterProScan match');
                    expect($svg).to.contain('Predicted CDS');
                    expect($svg).to.contain('Predicted CDS with InterProScan match');
                    done();
                });
            });
            it('Should load correct tooltip counts', function(done) {
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
        });
        context('Test RAW read - API - version 5', function() {
            it('Should load correct left hand side labels', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = data_raw_read_v5['accession'];
                const chart = new SeqFeatSumChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    const $svg = $('svg').html();
                    expect($svg).to.contain('Reads with predicted CDS');
                    expect($svg).to.contain('Reads with predicted RNA');
                    expect($svg).to.contain('Reads with InterProScan match');
                    expect($svg).to.contain('Predicted CDS');
                    expect($svg).to.contain('Predicted CDS with InterProScan match');
                    done();
                });
            });
            it('Should load correct tooltip counts', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = data_raw_read_v5['accession'];
                const chart = new SeqFeatSumChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to
                        .match(/Predicted CDS with InterProScan match.+259 732/);
                    done();
                });
            });
        });
        context('Test Assembly - predefined test data source - version 1', function() {
            it('Should load correct left hand side labels', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new SeqFeatSumChart(containerID, {data: data_assembly_v1});
                chart.loaded.done(() => {
                    const $svg = $('svg').html();
                    expect($svg).to.contain('Contigs with predicted CDS');
                    expect($svg).to.contain('Contigs with predicted RNA');
                    expect($svg).to.contain('Contigs with InterProScan match');
                    expect($svg).to.contain('Predicted CDS');
                    expect($svg).to.contain('Predicted CDS with InterProScan match');
                    done();
                });
            });
            it('Should load correct tooltip counts', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new SeqFeatSumChart(containerID, {data: data_assembly_v1});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to
                        .match(/Predicted CDS with InterProScan match.+573 798/);
                    done();
                });
            });
        });
        context('Test Assembly - predefined test data source - version 4.1', function() {
            it('Should load correct tooltip counts', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new SeqFeatSumChart(containerID, {data: data_assembly_v4_1});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to
                        .match(/Predicted CDS with InterProScan match.+222 033/);
                    done();
                });
            });
        });
        context('Test Assembly - predefined test data source - version 5', function() {
            it('Should load correct tooltip counts', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new SeqFeatSumChart(containerID, {data: data_assembly_v5});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to
                        .match(/Predicted CDS with InterProScan match.+4 372/);
                    done();
                });
            });
        });
        context('Test Assembly - API - version 1', function() {
            it('Should load correct left hand side labels', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = data_assembly_v1['accession'];
                const chart = new SeqFeatSumChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    const $svg = $('svg').html();
                    expect($svg).to.contain('Contigs with predicted CDS');
                    expect($svg).to.contain('Contigs with predicted RNA');
                    expect($svg).to.contain('Contigs with InterProScan match');
                    expect($svg).to.contain('Predicted CDS');
                    expect($svg).to.contain('Predicted CDS with InterProScan match');
                    done();
                });
            });
            it('Should load correct tooltip counts', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = data_assembly_v1['accession'];
                const chart = new SeqFeatSumChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to
                        .match(/Predicted CDS with InterProScan match.+573 798/);
                    done();
                });
            });
        });
        context('Test Assembly - API - version 2', function() {
            it('Should load correct left hand side labels', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = data_assembly_v2['accession'];
                const chart = new SeqFeatSumChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    const $svg = $('svg').html();
                    expect($svg).to.contain('Contigs with predicted CDS');
                    expect($svg).to.contain('Contigs with predicted RNA');
                    expect($svg).to.contain('Contigs with InterProScan match');
                    expect($svg).to.contain('Predicted CDS');
                    expect($svg).to.contain('Predicted CDS with InterProScan match');
                    done();
                });
            });
            it('Should load correct tooltip counts', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = data_assembly_v2['accession'];
                const chart = new SeqFeatSumChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to
                        .match(/Predicted CDS with InterProScan match.+135 272/);
                    done();
                });
            });
        });
        context('Test Assembly - API - version 3', function() {
            it('Should load correct left hand side labels', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = data_assembly_v3['accession'];
                const chart = new SeqFeatSumChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    const $svg = $('svg').html();
                    expect($svg).to.contain('Contigs with predicted CDS');
                    expect($svg).to.contain('Contigs with predicted RNA');
                    expect($svg).to.contain('Contigs with InterProScan match');
                    expect($svg).to.contain('Predicted CDS');
                    expect($svg).to.contain('Predicted CDS with InterProScan match');
                    done();
                });
            });
            it('Should load correct tooltip counts', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = data_assembly_v3['accession'];
                const chart = new SeqFeatSumChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to
                        .match(/Predicted CDS with InterProScan match.+1 042/);
                    done();
                });
            });
        });
        context('Test Assembly - API - version 4.1', function() {
            it('Should load correct left hand side labels', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = data_assembly_v4_1['accession'];
                const chart = new SeqFeatSumChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    const $svg = $('svg').html();
                    expect($svg).to.contain('Contigs with predicted CDS');
                    expect($svg).to.contain('Contigs with predicted RNA');
                    expect($svg).to.contain('Contigs with InterProScan match');
                    expect($svg).to.contain('Predicted CDS');
                    expect($svg).to.contain('Predicted CDS with InterProScan match');
                    done();
                });
            });
            it('Should load correct tooltip counts', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = data_assembly_v4_1['accession'];
                const chart = new SeqFeatSumChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to
                        .match(/Predicted CDS with InterProScan match.+222 033/);
                    done();
                });
            });
        });
        context('Test Assembly - API - version 5', function() {
            it('Should load correct left hand side labels', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = data_assembly_v5['accession'];
                const chart = new SeqFeatSumChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    const $svg = $('svg').html();
                    expect($svg).to.contain('Contigs with predicted CDS');
                    expect($svg).to.contain('Contigs with predicted RNA');
                    expect($svg).to.contain('Contigs with InterProScan match');
                    expect($svg).to.contain('Predicted CDS');
                    expect($svg).to.contain('Predicted CDS with InterProScan match');
                    done();
                });
            });
            it('Should load correct tooltip counts', function(done) {
                this.timeout(20000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = data_assembly_v5['accession'];
                const chart = new SeqFeatSumChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to
                        .match(/Predicted CDS with InterProScan match.+4 372/);
                    done();
                });
            });
        });
    });
});
