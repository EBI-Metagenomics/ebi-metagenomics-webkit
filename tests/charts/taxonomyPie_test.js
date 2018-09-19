define(['charts/taxonomyPie'], function(TaxonomyPie) {
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

    describe('Taxonomy pie chart', function() {
        context('Data loading source', function() {
            it('Should load taxonomy pie from data', function(done) {
                this.timeout(10000);
                createDiv();
                const chart = new TaxonomyPie(containerID, {data: taxonomyData});
                chart.loaded.done(() => {
                    expect($('#' + containerID).html()).to.match(/Archaea.+: 100\.00 %/);
                    done();
                });
            });
            it('Should fetch data from accession', function(done) {
                this.timeout(10000);
                createDiv();
                const accession = 'MGYA00136035';
                const chart = new TaxonomyPie(containerID,
                    {accession: accession, type: '/ssu', apiConfig: apiConfig});
                chart.loaded.done(() => {
                    expect($('#' + containerID).html()).to.match(/Bacteria.+: 77\.35 %/);
                    done();
                });
            });
        });
        context('Chart parametrisation', function() {
            it('Should group at default depth (0)', function(done) {
                this.timeout(10000);
                createDiv();
                const accession = 'MGYA00136035';
                const chart = new TaxonomyPie(containerID,
                    {accession: accession, type: '/ssu', apiConfig: apiConfig});
                chart.loaded.done(() => {
                    expect($('#' + containerID).html()).to.match(/Bacteria.+: 77\.35 %/);
                    done();
                });
            });
            it('Should group at depth 2', function(done) {
                this.timeout(10000);
                createDiv();
                const accession = 'MGYA00136035';
                const chart = new TaxonomyPie(containerID,
                    {accession: accession, type: '/ssu', apiConfig: apiConfig, groupingDepth: 2});
                chart.loaded.done(() => {
                    expect($('#' + containerID).html()).to.match(/Spirochaetes.+: 12\.53 %/);
                    done();
                });
            });
            it('Should display title', function(done) {
                const title = 'Domain composition';
                this.timeout(10000);
                createDiv();
                const accession = 'MGYA00136035';
                const chart = new TaxonomyPie(containerID,
                    {accession: accession, type: '/ssu', apiConfig: apiConfig, groupingDepth: 2},
                    {title: title});
                chart.loaded.done(() => {
                    expect($('#' + containerID).html()).to.contain(title);
                    done();
                });
            });
            it('Should display series name', function(done) {
                const seriesName = 'reads';
                this.timeout(10000);
                createDiv();
                const accession = 'MGYA00136035';
                const chart = new TaxonomyPie(containerID,
                    {accession: accession, type: '/ssu', apiConfig: apiConfig, groupingDepth: 2},
                    {seriesName: seriesName});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point:nth-child(1)')
                        .trigger('mouseover');
                    expect($('.highcharts-tooltip').html()).to.contain(seriesName);
                    done();
                });
            });
            it('Should display legend', function(done) {
                this.timeout(10000);
                createDiv();
                const accession = 'MGYA00136035';
                const chart = new TaxonomyPie(containerID,
                    {accession: accession, type: '/ssu', apiConfig: apiConfig, groupingDepth: 2},
                    {legend: true});
                chart.loaded.done(() => {
                    $('.highcharts-series.highcharts-series-0 > .highcharts-point:nth-child(1)')
                        .trigger('mouseover');
                    expect($('.highcharts-legend').html()).to.contain('Bacteroidetes');
                    done();
                });
            });
        });
    });
});
