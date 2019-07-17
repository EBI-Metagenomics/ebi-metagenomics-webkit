define(['charts/genomeKeggModuleColumnChart'], function(GenomeKeggModuleColumnChart) {
    const apiConfig = {
        API_URL: window.__env__['API_URL'],
        SUBFOLDER: '/metagenomics'
    };
    const containerID = 'chart-container';

    describe('Genome Kegg Module Column chart', function() {
        context('Data source tests', function() {
            it('Should fetch data from MGnify api with accession', function(done) {
                this.timeout(2000);
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = 'MGYG-HGUT-00279';
                const chart = new GenomeKeggModuleColumnChart(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    expect($('.highcharts-series-group .highcharts-point').length).to.equal(20);
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point:nth-child(1)')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html())
                        .to.match(/Genome.+Count: 26/);
                    done();
                });
            });
        });
    });
});
