define(['charts/taxonomyColumnStacked'], function(TaxonomyColumnStacked) {
    const taxonomyData = [
        {
            'type': 'organisms',
            'id': 'Archaea::Euryarchaeota:Halobacteria:Halobacteriales:Halobacteriaceae',
            'attributes': {
                'count': 7,
                'lineage': 'Archaea::Euryarchaeota:Halobacteria:Halobacteriales:Halobacteriaceae',
                'hierarchy': {
                    'super kingdom': 'Archaea',
                    'kingdom': '',
                    'phylum': 'Euryarchaeota',
                    'class': 'Halobacteria',
                    'order': 'Halobacteriales',
                    'family': 'Halobacteriaceae'
                },
                'domain': 'Archaea',
                'name': 'Halobacteriaceae',
                'parent': 'Halobacteriales',
                'rank': 'family',
                'pipeline-version': '4.0'
            }
        },
        {
            'type': 'organisms',
            'id': 'Archaea::Euryarchaeota:Halobacteria:Halobacteriales:Halobacteriaceae:Halococcus',
            'attributes': {
                'count': 6,
                'lineage': 'Archaea::Euryarchaeota:Halobacteria:Halobacteriales:' +
                'Halobacteriaceae:Halococcus',
                'hierarchy': {
                    'super kingdom': 'Archaea',
                    'kingdom': '',
                    'phylum': 'Euryarchaeota',
                    'class': 'Halobacteria',
                    'order': 'Halobacteriales',
                    'family': 'Halobacteriaceae',
                    'genus': 'Halococcus'
                },
                'domain': 'Archaea',
                'name': 'Halococcus',
                'parent': 'Halobacteriaceae',
                'rank': 'genus',
                'pipeline-version': '4.0'
            }
        }
    ];
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

    describe('Taxonomy stacked column chart', function() {
        context('Data loading source', function() {
            it('Should load taxonomy column from data', function(done) {
                this.timeout(5000);
                createDiv();
                const chart = new TaxonomyColumnStacked(containerID, {data: taxonomyData});
                chart.loaded.always(() => {
                    expect($('#' + containerID).html()).to.match(/Total:\s+13 reads/);
                    done();
                });
            });
            it('Should fetch data from accession', function(done) {
                this.timeout(5000);
                createDiv();
                const accession = 'MGYA00141547';
                const chart = new TaxonomyColumnStacked(containerID,
                    {accession: accession, type: '/ssu', apiConfig: apiConfig});
                chart.loaded.done(() => {
                    expect($('#' + containerID).html()).to.match(/Total:\s+1916873 reads/);
                    done();
                });
            });
        });
        context('Chart parametrisation', function() {
            it('Should display title', function(done) {
                const title = 'Phylum composition';
                this.timeout(5000);
                createDiv();
                const accession = 'MGYA00141547';
                const chart = new TaxonomyColumnStacked(containerID,
                    {accession: accession, type: '/ssu', apiConfig: apiConfig, groupingDepth: 2},
                    {title: title});
                chart.loaded.done(() => {
                    expect($('#' + containerID).html()).to.contain(title);
                    done();
                });
            });
            it('Should not display title', function(done) {
                const title = 'Phylum composition';
                this.timeout(5000);
                createDiv();
                const accession = 'MGYA00141547';
                const chart = new TaxonomyColumnStacked(containerID,
                    {accession: accession, type: '/ssu', apiConfig: apiConfig, groupingDepth: 2});
                chart.loaded.done(() => {
                    expect($('#' + containerID).html()).not.to.contain(title);
                    done();
                });
            });
            it('Should display series name', function(done) {
                const seriesName = 'reads';
                this.timeout(5000);
                createDiv();
                const accession = 'MGYA00141547';
                const chart = new TaxonomyColumnStacked(containerID,
                    {accession: accession, type: '/ssu', apiConfig: apiConfig, groupingDepth: 2},
                    {seriesName: seriesName});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point:nth-child(1)')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to.contain(seriesName);
                    done();
                });
            });
        });
    });
});
