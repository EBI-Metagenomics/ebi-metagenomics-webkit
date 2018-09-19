define(['charts/interproMatchPie'], function(InterproMatchPie) {
    const apiConfig = {
        API_URL: 'http://localhost:9000/metagenomics/api/v1/',
        SUBFOLDER: '/metagenomics'
    };
    const containerID = 'chart-container';

    /**
     *
     */
    function createDiv() {
        document.body.innerHTML = '<p></p>';
        document.body.innerHTML = ('<div id="' + containerID + '"></div>');
    }

    describe('Taxonomy pie chart', function() {
        context('Data loading source', function() {
            // it('Should load chart from data', function(done) {
            //     this.timeout(5000);
            //     createDiv();
            //     const chart = new InterproMatchPie(containerID, {data: taxonomyData});
            //     chart.loaded.done(() => {
            //         expect($('#' + containerID).html()).to.match(/Archaea.+: 100\.00 %/);
            //         done();
            //     });
            // });
            it('Should fetch data from accession', function(done) {
                this.timeout(20000);
                createDiv();
                const accession = 'MGYA00141547';
                const chart = new InterproMatchPie(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    expect($('.highcharts-point').length).to.equal(11);
                    done();
                });
            });
        });
    });
});
