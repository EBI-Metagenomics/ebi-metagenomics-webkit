define(['api'], function(api) {
    api = api({API_URL: window.__env__['API_URL'], SUBFOLDER: '/metagenomics'});

    let expectedAttributes = [
        'ena_url',
        'sample_accession',
        'sample_url',
        'analysis_url',
        'pipeline_versions',

        'analysis_results',
        'study_accession',
        'study_url',
        'experiment_type',
        'run_accession',
        'secondary_run_accession',
        'instrument_platform',
        'instrument_model'];
    describe('Run tests', function() {
        context('Model tests', function() {
            const runAccession = 'ERR770966';
            const model = new api.Run({id: runAccession});
            const fetch = model.fetch();
            it('Should have expected fields', function() {
                return fetch.always(() => {
                    expectedAttributes.forEach((attr) => {
                        expect(model.attributes).to.have.property(attr);
                        expect(model.attributes[attr]).to.not.equal(null);
                    });
                });
            });
            it('Should construct urls correctly', function() {
                return fetch.always(() => {
                    expect(model.attributes['study_url'])
                        .to.equal('/metagenomics/studies/MGYS00000462');
                    expect(model.attributes['sample_url'])
                        .to.equal('/metagenomics/samples/ERS667576');
                    expect(model.attributes['ena_url'])
                        .to.equal('https://www.ebi.ac.uk/ena/browser/view/' + runAccession);
                });
            });
        });
        context('Run collection tests', function() {
            const collection = new api.RunsCollection();
            const fetch = collection.fetch();
            it('Models should have expected fields', function() {
                return fetch.always(() => {
                    collection.models.forEach((model) => {
                        expectedAttributes.forEach((attr) => {
                            expect(model.attributes).to.have.property(attr);
                        });
                    });
                });
            });
            it('Should set parameters for future use', function() {
                const studyAcc = 'ERP001736';
                const sampleAcc = 'ERS1231123';
                const collection = new api.RunsCollection(
                    {study_accession: studyAcc, sample_accession: sampleAcc});
                expect(collection.params).to.not.equal(null);
                expect(collection.study_accession).to.equal(studyAcc);
                expect(collection.sample_accession).to.equal(sampleAcc);
            });
        });
        context('Run analyses', function() {
            it('Should only retrieve analyses of experiment type other than assembly', function() {
                const runAccession = 'ERR770966';
                const collection = new api.RunAnalyses({id: runAccession});
                return collection.fetch().always(() => {
                    expect(collection.models).to.not.be.empty;
                    collection.models.forEach((model) => {
                        expect(model.attributes.experiment_type).to.not.equal('assembly');
                    });
                });
            });
        });
        context('Run assemblies', function() {
            it('Should only retrieve analyses of experiment type assembly', function() {
                const runAccession = 'ERR476942';
                const collection = new api.RunAssemblies({id: runAccession});
                return collection.fetch().always(() => {
                    expect(collection.models).to.not.be.empty;
                    collection.models.forEach((model) => {
                        expect(model.attributes.experiment_type).to.equal('assembly');
                    });
                });
            });
            it('Should return empty list as run has no assemblies', function() {
                const runAccession = 'ERR770966';
                const collection = new api.RunAssemblies({id: runAccession});
                return collection.fetch().always(() => {
                    expect(collection.models).to.be.empty;
                });
            });
        });
    });
});
