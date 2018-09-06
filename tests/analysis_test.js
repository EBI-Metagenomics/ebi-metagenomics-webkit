define(['api'], function(api) {
    api = api({API_URL: 'http://localhost:9000/metagenomics/api/v1/', SUBFOLDER: '/metagenomics'});
    describe('Analysis tests', function() {
        context('Model tests', function() {
            const analysisAccession = 'MGYA00011845';
            const model = new api.Analysis({id: analysisAccession});
            const fetch = model.fetch().fail((a, b, c) => {
                console.error(a);
                console.error(b);
                console.error(c);
            });
            it('Models should have expected fields', function() {
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
                return fetch.done(() => {
                    expectedAttributes.forEach((attr) => {
                        expect(model.attributes).to.have.property(attr);
                    });
                }).fail((a, b, c) => {
                    console.error(a);
                    console.error(b);
                    console.error(c);
                });
            });
            it('Should construct urls correctly', function() {
                return fetch.done(() => {
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
                return fetch.done(() => {
                    expect(model.attributes['run_url']).to.match(/\/metagenomics\/runs\/.+/);
                });
            });
            it('Should create correct link for assembly', function() {
                const model = new api.Analysis({id: 'MGYA00140023'});
                return model.fetch().done(() => {
                    expect(model.attributes['run_url']).to.match(/\/metagenomics\/assemblies\/.+/);
                }).fail((a, b, c) => {
                    console.error(a);
                    console.error(b);
                    console.error(c);
                });
            });
        });
        // context('Taxonomy', function() {
        //     it('Should retrieve taxonomy data', function() {
        //         const taxonomy = new api.Taxonomy({id: 'MGYA00011845', type: '/ssu'});
        //         taxonomy.fetch().done(() => {
        //             console.log(taxonomy);
        //         });
        //     });
        // });
    });

});
