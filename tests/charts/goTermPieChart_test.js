define(['charts/goTermPieChart'], function(GoTermPieChart) {
    const apiConfig = {
        API_URL: 'http://localhost:9000/metagenomics/api/v1/',
        SUBFOLDER: '/metagenomics'
    };
    const containerID = 'chart-container';

    describe('Go Term Pie chart', function() {
        context('Data source tests', function() {
            it('Should fetch data from MGnify api with accession', function(done) {
                this.timeout(60000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = 'MGYA00141547';
                const chart = new GoTermPieChart(containerID,
                    {accession: accession, apiConfig: apiConfig, lineage: 'biological_process'},
                    {title: 'Biological process'});
                chart.loaded.done(() => {
                    expect($('path.highcharts-point').length).to.equal(11);
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point:nth-child(1)')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to
                        .match(/translation.+760 621.+ annotations/);
                    done();
                });
            });
        });
    });
});
