define(['charts/goTermBarChart'], function(GoTermBarChart) {
    const apiConfig = {
        API_URL: window.__env__['API_URL'],
        SUBFOLDER: '/metagenomics'
    };
    const containerID = 'chart-container';

    describe('Go Term Bar chart', function() {
        context('Data source tests', function() {
            it('Should fetch data from MGnify api with accession', function(done) {
                this.timeout(60000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = 'MGYA00141547';
                const chart = new GoTermBarChart(containerID,
                    {accession: accession, apiConfig: apiConfig, lineage: 'biological_process'},
                    {title: 'Biological process'});
                chart.loaded.done(() => {
                    expect($('.highcharts-point').length).to.equal(43);
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point:nth-child(1)')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to
                        .match(/biological process.+308 157.+ annotations/);
                    done();
                });
            });
        });
    });
});
