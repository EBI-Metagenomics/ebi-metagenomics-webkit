define(['api'], function(api) {
    api = api({API_URL: 'http://localhost:9000/metagenomics/api/v1/', SUBFOLDER: '/metagenomics'});

    let expectedAttributes = [
        'assembly_id',
        'ena_url',
        'analysis_url',
        'experiment_type',
        'runs',
        'samples',
        'analysis_results',
        'pipeline_versions',
        'wgs_id',
        'legacy_id'];
    describe('Assembly tests', function() {
        context('Model tests', function() {
            const assemblyAccession = 'ERZ477708';
            const model = new api.Assembly({id: assemblyAccession});
            const fetch = model.fetch();
            it('Should have expected fields', function() {
                return fetch.always(() => {
                    expectedAttributes.forEach((attr) => {
                        expect(model.attributes).to.have.property(attr);
                        expect(model.attributes[attr]).to.not.equal(null);
                    });
                });
            });
        });
        context('Assembly collection tests', function() {
            const collection = new api.AssembliesCollection();
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
                const collection = new api.AssembliesCollection(
                    {study_accession: studyAcc, sample_accession: sampleAcc});
                expect(collection.params).to.not.equal(null);
                expect(collection.study_accession).to.equal(studyAcc);
                expect(collection.sample_accession).to.equal(sampleAcc);
            });
        });
        context('Assembly analyses', function() {
            it('Should only retrieve analyses of experiment type other than assembly', function() {
                const assemblyAccession = 'ERR770966';
                const collection = new api.AssemblyAnalyses({id: assemblyAccession});
                return collection.fetch().always(() => {
                    expect(collection.models).to.not.be.empty;
                    collection.models.forEach((model) => {
                        expect(model.attributes.experiment_type).to.not.equal('assembly');
                    });
                });
            });
        });
        context('Assembly assemblies', function() {
            it('Should only retrieve analyses of experiment type assembly', function() {
                const assemblyAccession = 'SRR873599';
                const collection = new api.AssemblyAssemblies({id: assemblyAccession});
                return collection.fetch().always(() => {
                    expect(collection.models).to.not.be.empty;
                    collection.models.forEach((model) => {
                        expect(model.attributes.experiment_type).to.equal('assembly');
                    });
                });
            });
            it('Should return empty list as assembly has no assemblies', function() {
                const assemblyAccession = 'ERR770966';
                const collection = new api.AssemblyAssemblies({id: assemblyAccession});
                return collection.fetch().always(() => {
                    expect(collection.models).to.be.empty;
                });
            });
        });
    });
});