define(['api'], function(api) {
    api = api({API_URL: 'http://localhost:9000/metagenomics/api/v1/', SUBFOLDER: '/metagenomics'});
    describe('Analysis tests', function() {
        context('Model tests', function() {
            const analysisAccession = 'MGYA00011845';
            const model = new api.Analysis({id: analysisAccession});
            const fetch = model.fetch();
            it('Models should have expected fields', function() {
                this.timeout(5000);
                let expectedAttributes = [
                    'study_accession',
                    'study_url',
                    'sample_accession',
                    'sample_url',
                    'run_accession',
                    'run_url',
                    'analysis_accession',
                    'analysis_url',
                    'experiment_type',
                    'analysis_summary',
                    'complete_time',
                    'instrument_model',
                    'instrument_platform',
                    'pipeline_version',
                    'pipeline_url',
                    'download'
                ];
                return fetch.always(() => {
                    expectedAttributes.forEach((attr) => {
                        expect(model.attributes).to.have.property(attr);
                    });
                });
            });
            it('Should construct urls correctly', function() {
                return fetch.always(() => {
                    expect(model.attributes['study_url'])
                        .to.equal('/metagenomics/studies/MGYS00000553');
                    expect(model.attributes['sample_url'])
                        .to.equal('/metagenomics/samples/ERS853149');
                    expect(model.attributes['run_url'])
                        .to.equal('/metagenomics/runs/ERR1022502');
                    expect(model.attributes['analysis_url'])
                        .to.equal('/metagenomics/analyses/MGYA00011845');
                    expect(model.attributes['pipeline_url'])
                        .to.equal('/metagenomics/pipelines/2.0');
                });
            });
            it('Should create correct link for run', function() {
                return fetch.always(() => {
                    expect(model.attributes['run_url']).to.match(/\/metagenomics\/runs\/.+/);
                });
            });
            it('Should create correct link for assembly', function() {
                const model = new api.Analysis({id: 'MGYA00140023'});
                return model.fetch().always(() => {
                    expect(model.attributes['run_url']).to.match(/\/metagenomics\/assemblies\/.+/);
                });
            });
        });
        context('Taxonomy', function() {
            it('Should retrieve taxonomy data', function() {
                const taxonomy = new api.Taxonomy({id: 'MGYA00136035', type: '/ssu'});
                taxonomy.fetch().always((taxonomies) => {
                    expect(taxonomies.length).to.equal(490);
                    taxonomies.forEach((tax) => {
                        const attr = tax.attributes;
                        expect(attr).to.contain
                            .keys('count', 'domain', 'hierarchy', 'lineage', 'name', 'parent',
                                'pipeline-version', 'rank');
                    });
                });
            });
        });
        context('Interpro identifiers', function() {
            it('Should retrieve interpro data', function() {
                this.timeout(50000);
                const interproData = new api.InterproIden({id: 'MGYA00141547'});
                return interproData.fetch().always((interproResults) => {
                    expect(interproResults.length).to.equal(10587);
                    interproResults.forEach((tax) => {
                        const attr = tax.attributes;
                        expect(attr).to.contain
                            .keys('accession', 'count', 'description');
                    });
                });
            });
        });
        context('Go-slim annotations', function() {
            it('Should retrieve goslim  data', function() {
                const goSlimData = new api.GoSlim({id: 'MGYA00141547'});
                return goSlimData.fetch().always(() => {
                    const goSlimIdentifiers = goSlimData.attributes.data;
                    expect(goSlimIdentifiers.length).to.equal(116);
                    goSlimIdentifiers.forEach((tax) => {
                        const attr = tax.attributes;
                        expect(attr).to.contain
                            .keys('accession', 'count', 'description', 'lineage');
                    });
                });
            });
        });
        context('Analysis downloads', function() {
            it('Should cluster analysis downloads', function() {
                const downloads = new api.AnalysisDownloads({id: 'MGYA00011845'});
                return downloads.fetch().always(() => {
                    const data = downloads.attributes['downloadGroups'];
                    expect(data).to.contain.keys('Sequence data');
                    for (let groupName in data) {
                        const downloadEntries = data[groupName];
                        downloadEntries.forEach((entry) => {
                            const attr = entry.attributes;
                            expect(attr).to.contain
                                .keys('alias', 'description', 'file-format', 'group-type');
                            expect(attr['group-type'].toLowerCase()).to
                                .equal(groupName.toLowerCase());
                        });
                    }
                });
            });
        });
        context('QCChart data', function() {
            it('Should load valid sequence length data', function() {
                const qcData = new api.QcChartData({id: 'MGYA00141547', type: 'seq-length'});
                return qcData.fetch({dataType: 'text'}).always((response) => {
                    expect(response).to.equal('100\t1997827\n');
                });
            });
            it('Should load valid gc-distribution data', function() {
                const gcData = new api.QcChartData({id: 'MGYA00141547', type: 'gc-distribution'});
                return gcData.fetch({dataType: 'text'}).always((response) => {
                    expect(response).to.match(/(([0-9]*[.])?[0-9]+\t\d+\n)*/);
                });
            });
            it('Should load valid nucleotide-distrib data', function() {
                const nucData = new api.QcChartData(
                    {id: 'MGYA00141547', type: 'nucleotide-distribution'});
                return nucData.fetch({dataType: 'text'}).always((response) => {
                    expect(response).to
                        .match(/((pos\tN\tG\tC\tT\tA\n)(\d+\t([0-9]+[.][0-9]+[\t\n]){5})+)/);
                });
            });
        });
        context('QCChart stats', function() {
            it('Should load summary data', function() {
                const stats = new api.QcChartStats({id: 'MGYA00141547'});
                return stats.fetch({dataType: 'text'}).always((response) => {
                    expect(response).to.match(/(\w+\t([0-9]*[.])?[0-9]+\n?)+/);
                });
            });
        });
        context('Krona url', function() {
            it('Should create valid krona url', function() {
                const analysis = 'MGYA123123';
                const ssu = '/ssu';
                const url = api.getKronaURL(analysis, ssu);
                expect(url).to
                    .equal(api.API_URL + 'analyses/' + analysis + '/krona' + ssu + '?collapse=false');
            });
        });
    });
});
