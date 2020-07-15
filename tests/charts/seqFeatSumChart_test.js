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
            "Reads with predicted RNA": "131",
            "Reads with InterProScan match": "18261",
            "Predicted CDS": "90796",
            "Predicted CDS with InterProScan match": "18270"
        }
    };

    const data_raw_read_v2 = {
        "pipeline_version": "2.0",
        "accession": "MGYA00009824",
        "experiment_type": "metagenomic",
        "analysis_summary": {
            "Reads with predicted CDS": "707869",
            "Reads with predicted RNA": "728",
            "Reads with InterProScan match": "344467",
            "Predicted CDS": "740289",
            "Predicted CDS with InterProScan match": "346885",
        }
    };

    const data_raw_read_v3 = {
        "pipeline_version": "3.0",
        "accession": "MGYA00085620",
        "experiment_type": "metagenomic",
        "analysis_summary": {
            "Reads with predicted CDS": "4106564",
            "Reads with predicted RNA": "24239",
            "Reads with InterProScan match": "1108750",
            "Predicted CDS": "4108694",
            "Predicted CDS with InterProScan match": "1108785",
        }
    };

    const data_raw_read_v4 = {
        "pipeline_version": "4.0",
        "accession": "MGYA00141547",
        "experiment_type": "metatranscriptomic",
        "analysis_summary": {
            "Reads with predicted CDS": "129224380",
            "Reads with predicted RNA": "7159621",
            "Reads with InterProScan match": "12488689",
            "Predicted CDS": "129224380",
            "Predicted CDS with InterProScan match": "12488689"
        }
    };

    const data_raw_read_v5 = {
        "pipeline_version": "5.0",
        "accession": "MGYA00554532",
        "experiment_type": "metagenomic",
        "analysis_summary": {
            "Reads with predicted CDS": "493412",
            "Reads with predicted RNA": "10812",
            "Reads with InterProScan match": "254106",
            "Predicted CDS": "560528",
            "Predicted CDS with InterProScan match": "259732"
        }
    };

// MGYA00004410 Assembly version 1
// MGYA00065487 Assembly version 2
// MGYA00131957 Assembly version 3
// MGYA00521048 Assembly version 4.1
// MGYA00536622 Assembly version 5

    const data_assembly_v1 = {
        "pipeline_version": "1.0",
        "accession": "MGYA00004410",
        "experiment_type": "assembly",
        "analysis_summary": {
            "Contigs with predicted CDS": "800289",
            "Contigs with predicted RNA": "1390",
            "Contigs with InterProScan match": "520603",
            "Predicted CDS": "925953",
            "Predicted CDS with InterProScan match": "573798"
        }
    };

    const data_assembly_v2 = {
        "pipeline_version": "2.0",
        "accession": "MGYA00065487",
        "experiment_type": "assembly",
        "analysis_summary": {
            "Contigs with predicted CDS": "333488",
            "Contigs with predicted RNA": "259",
            "Contigs with InterProScan match": "126513",
            "Predicted CDS": "359078",
            "Predicted CDS with InterProScan match": "135272"
        }
    };

    const data_assembly_v3 = {
        "pipeline_version": "3.0",
        "accession": "MGYA00131957",
        "experiment_type": "assembly",
        "analysis_summary": {
            "Contigs with predicted CDS": "82",
            "Contigs with predicted RNA": "2",
            "Contigs with InterProScan match": "77",
            "Predicted CDS": "1431",
            "Predicted CDS with InterProScan match": "1042"
        }
    };

    const data_assembly_v4_1 = {
        "pipeline_version": "4.1",
        "accession": "MGYA00521048",
        "experiment_type": "assembly",
        "analysis_summary": {
            "Contigs with predicted CDS": "95901",
            "Contigs with predicted RNA": "193",
            "Contigs with InterProScan match": "85344",
            "Predicted CDS": "289486",
            "Predicted CDS with InterProScan match": "222033"
        }
    };

    const data_assembly_v5 = {
        "pipeline_version": "5.0",
        "accession": "MGYA00536622",
        "experiment_type": "assembly",
        "analysis_summary": {
            "Contigs with predicted CDS": "1",
            "Contigs with predicted RNA": "57",
            "Contigs with InterProScan match": "1",
            "Predicted CDS": "7261",
            "Predicted CDS with InterProScan match": "4372"
        }
    };

    const default_timeout = 25000

    describe('Sequence feature summary chart', function() {

        context('Test RAW read - predefined test data source - version 1', function() {
            it('Should load correct left hand side labels', function(done) {
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
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new SeqFeatSumChart(containerID, {data: data_raw_read_v1});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point').each(function( index ) {
                      $(this).trigger('mouseover');
                      var key = Object.keys(data_raw_read_v1["analysis_summary"])[index];
                      expect($('.highcharts-tooltip').text()).to.have.string(key);
                    });
                    done();
                });
            });
        });

        context('Test RAW read - predefined test data source - version 2', function() {
            it('Should load correct left hand side labels', function(done) {
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
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new SeqFeatSumChart(containerID, {data: data_raw_read_v2});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point').each(function( index ) {
                      $(this).trigger('mouseover');
                      var key = Object.keys(data_raw_read_v2["analysis_summary"])[index];
                      expect($('.highcharts-tooltip').text()).to.have.string(key);
                    });
                    done();
                });
            });
        });

        context('Test RAW read - predefined test data source - version 3', function() {
            it('Should load correct left hand side labels', function(done) {
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
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new SeqFeatSumChart(containerID, {data: data_raw_read_v3});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point').each(function( index ) {
                      $(this).trigger('mouseover');
                      var key = Object.keys(data_raw_read_v3["analysis_summary"])[index];
                      expect($('.highcharts-tooltip').text()).to.have.string(key);
                    });
                    done();
                });
            });
        });

        context('Test RAW read - predefined test data source - version 4', function() {
            it('Should load correct left hand side labels', function(done) {
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
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new SeqFeatSumChart(containerID, {data: data_raw_read_v4});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point').each(function( index ) {
                      $(this).trigger('mouseover');
                      var key = Object.keys(data_raw_read_v4["analysis_summary"])[index];
                      expect($('.highcharts-tooltip').text()).to.have.string(key);
                    });
                    done();
                });
            });
        });
        context('Test RAW read - predefined test data source - version 5', function() {
            it('Should load correct left hand side labels', function(done) {
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
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new SeqFeatSumChart(containerID, {data: data_raw_read_v5});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point').each(function( index ) {
                      $(this).trigger('mouseover');
                      var key = Object.keys(data_raw_read_v5["analysis_summary"])[index];
                      expect($('.highcharts-tooltip').text()).to.have.string(key);
                    });
                    done();
                });
            });
        });
        context('Test Assembly - predefined test data source - version 1', function() {
            it('Should load correct left hand side labels', function(done) {
                this.timeout(default_timeout);
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
                this.timeout(default_timeout);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new SeqFeatSumChart(containerID, {data: data_assembly_v1});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point').each(function( index ) {
                      $(this).trigger('mouseover');
                      var key = Object.keys(data_assembly_v1["analysis_summary"])[index];
                      expect($('.highcharts-tooltip').text()).to.have.string(key);
                    });
                    done();
                });
            });
        });
        context('Test Assembly - predefined test data source - version 4.1', function() {
            it('Should load correct tooltip counts', function(done) {
                this.timeout(default_timeout);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new SeqFeatSumChart(containerID, {data: data_assembly_v4_1});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point').each(function( index ) {
                      $(this).trigger('mouseover');
                      var key = Object.keys(data_assembly_v4_1["analysis_summary"])[index];
                      expect($('.highcharts-tooltip').text()).to.have.string(key);
                    });
                    done();
                });
            });
        });
        context('Test Assembly - predefined test data source - version 5', function() {
            it('Should load correct tooltip counts', function(done) {
                this.timeout(default_timeout);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const chart = new SeqFeatSumChart(containerID, {data: data_assembly_v5});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point').each(function( index ) {
                      $(this).trigger('mouseover');
                      var key = Object.keys(data_assembly_v5["analysis_summary"])[index];
                      expect($('.highcharts-tooltip').text()).to.have.string(key);
                    });
                    done();
                });
            });
        });
//        FIXME: None of the following tests pass in Travis because of timeout
//        FIXME: Please note, that these should work locally
//        API tests
//        context('Test RAW read - API - version 1', function() {
//            it('Should load correct left hand side labels', function(done) {
//                this.timeout(default_timeout);
//                document.body.innerHTML = '<p></p>';
//                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
//                const accession = data_raw_read_v1['accession'];
//                const chart = new SeqFeatSumChart(containerID,
//                    {accession: accession, apiConfig: apiConfig});
//                chart.loaded.done(() => {
//                    const $svg = $('svg').html();
//                    expect($svg).to.contain('Reads with predicted CDS');
//                    expect($svg).to.contain('Reads with predicted RNA');
//                    expect($svg).to.contain('Reads with InterProScan match');
//                    expect($svg).to.contain('Predicted CDS');
//                    expect($svg).to.contain('Predicted CDS with InterProScan match');
//                    done();
//                });
//            });
//            it('Should load correct tooltip counts', function(done) {
//                this.timeout(default_timeout);
//                document.body.innerHTML = '<p></p>';
//                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
//                const accession = data_raw_read_v1['accession'];
//                const chart = new SeqFeatSumChart(containerID,
//                    {accession: accession, apiConfig: apiConfig});
//                chart.loaded.done(() => {
//                    $('.highcharts-series.highcharts-series-0 > .highcharts-point').each(function( index ) {
//                      $(this).trigger('mouseover');
//                      var key = Object.keys(data_raw_read_v1["analysis_summary"])[index];
//                      expect($('.highcharts-tooltip').text()).to.have.string(key);
//                    });
//                    done();
//                });
//            });
//        });
//        context('Test RAW read - API - version 2', function() {
//            it('Should load correct left hand side labels', function(done) {
//                this.timeout(default_timeout);
//                document.body.innerHTML = '<p></p>';
//                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
//                const accession = data_raw_read_v2['accession'];
//                const chart = new SeqFeatSumChart(containerID,
//                    {accession: accession, apiConfig: apiConfig});
//                chart.loaded.done(() => {
//                    const $svg = $('svg').html();
//                    expect($svg).to.contain('Reads with predicted CDS');
//                    expect($svg).to.contain('Reads with predicted RNA');
//                    expect($svg).to.contain('Reads with InterProScan match');
//                    expect($svg).to.contain('Predicted CDS');
//                    expect($svg).to.contain('Predicted CDS with InterProScan match');
//                    done();
//                });
//            });
//            it('Should load correct tooltip counts', function(done) {
//                this.timeout(default_timeout);
//                document.body.innerHTML = '<p></p>';
//                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
//                const accession = data_raw_read_v2['accession'];
//                const chart = new SeqFeatSumChart(containerID,
//                    {accession: accession, apiConfig: apiConfig});
//                chart.loaded.done(() => {
//                    $('.highcharts-series.highcharts-series-0 > .highcharts-point').each(function( index ) {
//                      $(this).trigger('mouseover');
//                      var key = Object.keys(data_raw_read_v2["analysis_summary"])[index];
//                      expect($('.highcharts-tooltip').text()).to.have.string(key);
//                    });
//                    done();
//                });
//            });
//        });
//        context('Test RAW read - API - version 3', function() {
//            it('Should load correct left hand side labels', function(done) {
//                this.timeout(default_timeout);
//                document.body.innerHTML = '<p></p>';
//                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
//                const accession = data_raw_read_v3['accession'];
//                const chart = new SeqFeatSumChart(containerID,
//                    {accession: accession, apiConfig: apiConfig});
//                chart.loaded.done(() => {
//                    const $svg = $('svg').html();
//                    expect($svg).to.contain('Reads with predicted CDS');
//                    expect($svg).to.contain('Reads with predicted RNA');
//                    expect($svg).to.contain('Reads with InterProScan match');
//                    expect($svg).to.contain('Predicted CDS');
//                    expect($svg).to.contain('Predicted CDS with InterProScan match');
//                    done();
//                });
//            });
//            it('Should load correct tooltip counts', function(done) {
//                this.timeout(default_timeout);
//                document.body.innerHTML = '<p></p>';
//                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
//                const accession = data_raw_read_v3['accession'];
//                const chart = new SeqFeatSumChart(containerID,
//                    {accession: accession, apiConfig: apiConfig});
//                chart.loaded.done(() => {
//                    $('.highcharts-series.highcharts-series-0 > .highcharts-point').each(function( index ) {
//                      $(this).trigger('mouseover');
//                      var key = Object.keys(data_raw_read_v3["analysis_summary"])[index];
//                      expect($('.highcharts-tooltip').text()).to.have.string(key);
//                    });
//                    done();
//                });
//            });
//        });
//        context('Test RAW read - API - version 4', function() {
//            it('Should load correct left hand side labels', function(done) {
//                this.timeout(default_timeout);
//                document.body.innerHTML = '<p></p>';
//                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
//                const accession = data_raw_read_v4['accession'];
//                const chart = new SeqFeatSumChart(containerID,
//                    {accession: accession, apiConfig: apiConfig});
//                chart.loaded.done(() => {
//                    const $svg = $('svg').html();
//                    expect($svg).to.contain('Reads with predicted CDS');
//                    expect($svg).to.contain('Reads with predicted RNA');
//                    expect($svg).to.contain('Reads with InterProScan match');
//                    expect($svg).to.contain('Predicted CDS');
//                    expect($svg).to.contain('Predicted CDS with InterProScan match');
//                    done();
//                });
//            });
//            it('Should load correct tooltip counts', function(done) {
//                this.timeout(default_timeout);
//                document.body.innerHTML = '<p></p>';
//                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
//                const accession = data_raw_read_v4['accession'];
//                const chart = new SeqFeatSumChart(containerID,
//                    {accession: accession, apiConfig: apiConfig});
//                chart.loaded.done(() => {
//                    $('.highcharts-series.highcharts-series-0 > .highcharts-point').each(function( index ) {
//                      $(this).trigger('mouseover');
//                      var key = Object.keys(data_raw_read_v4["analysis_summary"])[index];
//                      expect($('.highcharts-tooltip').text()).to.have.string(key);
//                    });
//                    done();
//                });
//            });
//        });
//        context('Test RAW read - API - version 5', function() {
//            it('Should load correct left hand side labels', function(done) {
//                this.timeout(default_timeout);
//                document.body.innerHTML = '<p></p>';
//                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
//                const accession = data_raw_read_v5['accession'];
//                const chart = new SeqFeatSumChart(containerID,
//                    {accession: accession, apiConfig: apiConfig});
//                chart.loaded.done(() => {
//                    const $svg = $('svg').html();
//                    expect($svg).to.contain('Reads with predicted CDS');
//                    expect($svg).to.contain('Reads with predicted RNA');
//                    expect($svg).to.contain('Reads with InterProScan match');
//                    expect($svg).to.contain('Predicted CDS');
//                    expect($svg).to.contain('Predicted CDS with InterProScan match');
//                    done();
//                });
//            });
//            it('Should load correct tooltip counts', function(done) {
//                this.timeout(default_timeout);
//                document.body.innerHTML = '<p></p>';
//                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
//                const accession = data_raw_read_v5['accession'];
//                const chart = new SeqFeatSumChart(containerID,
//                    {accession: accession, apiConfig: apiConfig});
//                chart.loaded.done(() => {
//                    $('.highcharts-series.highcharts-series-0 > .highcharts-point').each(function( index ) {
//                      $(this).trigger('mouseover');
//                      var key = Object.keys(data_raw_read_v5["analysis_summary"])[index];
//                      expect($('.highcharts-tooltip').text()).to.have.string(key);
//                    });
//                    done();
//                });
//            });
//        });
//
//        context('Test Assembly - API - version 1', function() {
//            it('Should load correct left hand side labels', function(done) {
//                this.timeout(default_timeout);
//                document.body.innerHTML = '<p></p>';
//                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
//                const accession = data_assembly_v1['accession'];
//                const chart = new SeqFeatSumChart(containerID,
//                    {accession: accession, apiConfig: apiConfig});
//                chart.loaded.done(() => {
//                    const $svg = $('svg').html();
//                    expect($svg).to.contain('Contigs with predicted CDS');
//                    expect($svg).to.contain('Contigs with predicted RNA');
//                    expect($svg).to.contain('Contigs with InterProScan match');
//                    expect($svg).to.contain('Predicted CDS');
//                    expect($svg).to.contain('Predicted CDS with InterProScan match');
//                    done();
//                });
//            });
//            it('Should load correct tooltip counts', function(done) {
//                this.timeout(default_timeout);
//                document.body.innerHTML = '<p></p>';
//                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
//                const accession = data_assembly_v1['accession'];
//                const chart = new SeqFeatSumChart(containerID,
//                    {accession: accession, apiConfig: apiConfig});
//                chart.loaded.done(() => {
//                    $('.highcharts-series.highcharts-series-0 > .highcharts-point').each(function( index ) {
//                      $(this).trigger('mouseover');
//                      var key = Object.keys(data_assembly_v1["analysis_summary"])[index];
//                      expect($('.highcharts-tooltip').text()).to.have.string(key);
//                    });
//                    done();
//                });
//            });
//        });
//        context('Test Assembly - API - version 2', function() {
//            it('Should load correct left hand side labels', function(done) {
//                this.timeout(default_timeout);
//                document.body.innerHTML = '<p></p>';
//                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
//                const accession = data_assembly_v2['accession'];
//                const chart = new SeqFeatSumChart(containerID,
//                    {accession: accession, apiConfig: apiConfig});
//                chart.loaded.done(() => {
//                    const $svg = $('svg').html();
//                    expect($svg).to.contain('Contigs with predicted CDS');
//                    expect($svg).to.contain('Contigs with predicted RNA');
//                    expect($svg).to.contain('Contigs with InterProScan match');
//                    expect($svg).to.contain('Predicted CDS');
//                    expect($svg).to.contain('Predicted CDS with InterProScan match');
//                    done();
//                });
//            });
//            it('Should load correct tooltip counts', function(done) {
//                this.timeout(default_timeout);
//                document.body.innerHTML = '<p></p>';
//                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
//                const accession = data_assembly_v2['accession'];
//                const chart = new SeqFeatSumChart(containerID,
//                    {accession: accession, apiConfig: apiConfig});
//                chart.loaded.done(() => {
//                    $('.highcharts-series.highcharts-series-0 > .highcharts-point').each(function( index ) {
//                      $(this).trigger('mouseover');
//                      var key = Object.keys(data_assembly_v2["analysis_summary"])[index];
//                      expect($('.highcharts-tooltip').text()).to.have.string(key);
//                    });
//                    done();
//                });
//            });
//        });
//        context('Test Assembly - API - version 3', function() {
//            it('Should load correct left hand side labels', function(done) {
//                this.timeout(default_timeout);
//                document.body.innerHTML = '<p></p>';
//                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
//                const accession = data_assembly_v3['accession'];
//                const chart = new SeqFeatSumChart(containerID,
//                    {accession: accession, apiConfig: apiConfig});
//                chart.loaded.done(() => {
//                    const $svg = $('svg').html();
//                    expect($svg).to.contain('Contigs with predicted CDS');
//                    expect($svg).to.contain('Contigs with predicted RNA');
//                    expect($svg).to.contain('Contigs with InterProScan match');
//                    expect($svg).to.contain('Predicted CDS');
//                    expect($svg).to.contain('Predicted CDS with InterProScan match');
//                    done();
//                });
//            });
//            it('Should load correct tooltip counts', function(done) {
//                this.timeout(default_timeout);
//                document.body.innerHTML = '<p></p>';
//                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
//                const accession = data_assembly_v3['accession'];
//                const chart = new SeqFeatSumChart(containerID,
//                    {accession: accession, apiConfig: apiConfig});
//                chart.loaded.done(() => {
//                    $('.highcharts-series.highcharts-series-0 > .highcharts-point').each(function( index ) {
//                      $(this).trigger('mouseover');
//                      var key = Object.keys(data_assembly_v3["analysis_summary"])[index];
//                      expect($('.highcharts-tooltip').text()).to.have.string(key);
//                    });
//                    done();
//                });
//            });
//        });
//        context('Test Assembly - API - version 4.1', function() {
//            it('Should load correct left hand side labels', function(done) {
//                this.timeout(default_timeout);
//                document.body.innerHTML = '<p></p>';
//                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
//                const accession = data_assembly_v4_1['accession'];
//                const chart = new SeqFeatSumChart(containerID,
//                    {accession: accession, apiConfig: apiConfig});
//                chart.loaded.done(() => {
//                    const $svg = $('svg').html();
//                    expect($svg).to.contain('Contigs with predicted CDS');
//                    expect($svg).to.contain('Contigs with predicted RNA');
//                    expect($svg).to.contain('Contigs with InterProScan match');
//                    expect($svg).to.contain('Predicted CDS');
//                    expect($svg).to.contain('Predicted CDS with InterProScan match');
//                    done();
//                });
//            });
//            it('Should load correct tooltip counts', function(done) {
//                this.timeout(default_timeout);
//                document.body.innerHTML = '<p></p>';
//                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
//                const accession = data_assembly_v4_1['accession'];
//                const chart = new SeqFeatSumChart(containerID,
//                    {accession: accession, apiConfig: apiConfig});
//                chart.loaded.done(() => {
//                    $('.highcharts-series.highcharts-series-0 > .highcharts-point').each(function( index ) {
//                      $(this).trigger('mouseover');
//                      var key = Object.keys(data_assembly_v4_1["analysis_summary"])[index];
//                      expect($('.highcharts-tooltip').text()).to.have.string(key);
//                    });
//                    done();
//                });
//            });
//        });
//        context('Test Assembly - API - version 5', function() {
//            it('Should load correct left hand side labels', function(done) {
//                this.timeout(default_timeout);
//                document.body.innerHTML = '<p></p>';
//                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
//                const accession = data_assembly_v5['accession'];
//                const chart = new SeqFeatSumChart(containerID,
//                    {accession: accession, apiConfig: apiConfig});
//                chart.loaded.done(() => {
//                    const $svg = $('svg').html();
//                    expect($svg).to.contain('Contigs with predicted CDS');
//                    expect($svg).to.contain('Contigs with predicted RNA');
//                    expect($svg).to.contain('Contigs with InterProScan match');
//                    expect($svg).to.contain('Predicted CDS');
//                    expect($svg).to.contain('Predicted CDS with InterProScan match');
//                    done();
//                });
//            });
//            it('Should load correct tooltip counts', function(done) {
//                this.timeout(default_timeout);
//                document.body.innerHTML = '<p></p>';
//                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
//                const accession = data_assembly_v5['accession'];
//                const chart = new SeqFeatSumChart(containerID,
//                    {accession: accession, apiConfig: apiConfig});
//                chart.loaded.done(() => {
//                    $('.highcharts-series.highcharts-series-0 > .highcharts-point').each(function( index ) {
//                      $(this).trigger('mouseover');
//                      var key = Object.keys(data_assembly_v5["analysis_summary"])[index];
//                      expect($('.highcharts-tooltip').text()).to.have.string(key);
//                    });
//                    done();
//                });
//            });
//        });
    });
});
