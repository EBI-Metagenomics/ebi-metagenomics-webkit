define(['api'], function(api) {
    api = api({API_URL: 'http://localhost:9000/metagenomics/api/v1/', SUBFOLDER: '/metagenomics'});
    describe('Run tests', function() {
        context('Model tests', function() {
            const runAccession = 'ERR770966';
            const model = new api.Run({id: runAccession});
            const fetch = model.fetch().fail((a, b, c) => {
                console.error(a);
                console.error(b);
                console.error(c);
            });
            it('Should have expected fields', function() {
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
                return fetch.done(() => {
                    expectedAttributes.forEach((attr) => {
                        expect(model.attributes).to.have.property(attr);
                        expect(model.attributes[attr]).to.not.equal(null);
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
                        .to.equal('/metagenomics/studies/MGYS00000462');
                    expect(model.attributes['sample_url'])
                        .to.equal('/metagenomics/samples/ERS667576');
                    expect(model.attributes['ena_url'])
                        .to.equal('https://www.ebi.ac.uk/ena/data/view/' + runAccession);
                });
            });
            // it('Should provide  related studies', function() {
            //     return fetch.done(() => {
            //         const relatedStudies = model.attributes['related_studies'];
            //         expect(relatedStudies.length).to.equal(1);
            //     }).fail((a, b, c) => {
            //         console.error('fail');
            //     });
            // });
            // it('Should return empty relatedStudies list', function() {
            //     const studyAcc = 'MGYS00002217';
            //     const model = new api.Study({id: studyAcc});
            //     const fetch = model.fetch().done(() => {
            //         expect(model.attributes['related_studies'].length).to.equals(0);
            //     });
            // });

        });
        context('Run collection tests', function() {
            const collection = new api.RunsCollection();
            const fetch = collection.fetch().fail((a, b, c) => {
                console.error(a);
                console.error(b);
                console.error(c);
            });
            it('Models should have expected fields', function() {
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
                return fetch.done(() => {
                    collection.models.forEach((model) => {
                        expectedAttributes.forEach((attr) => {
                            expect(model.attributes).to.have.property(attr);
                        });
                    });
                }).fail((a, b, c) => {
                    console.error(a);
                    console.error(b);
                    console.error(c);
                });
            });
        });
        context('Run analyses', function() {
            it('Should only retrieve analyses of experiment type other than assembly', function() {
                const runAccession = 'ERR770966';
                const collection = new api.RunAnalyses({id: runAccession});
                return collection.fetch().fail((a, b, c) => {
                    console.error(a);
                    console.error(b);
                    console.error(c);
                }).done(() => {
                    expect(collection.models).to.not.be.empty;
                    collection.models.forEach((model) => {
                        expect(model.attributes.experiment_type).to.not.equal('assembly');
                    });
                });
            });
            it('Should return empty list as run has no assemblies', function() {
                const runAccession = 'GCA_900217105';
                const collection = new api.RunAnalyses({id: runAccession});
                return collection.fetch().fail((a, b, c) => {
                    console.error(a);
                    console.error(b);
                    console.error(c);
                }).done(() => {
                    expect(collection.models).to.be.empty;
                });
            });
        });
        context('Run assemblies', function() {
            it('Should only retrieve analyses of experiment type assembly', function() {
                const runAccession = 'GCA_900217105';
                const collection = new api.RunAssemblies({id: runAccession});
                return collection.fetch().fail((a, b, c) => {
                    console.error(a);
                    console.error(b);
                    console.error(c);
                }).done(() => {
                    expect(collection.models).to.not.be.empty;
                    collection.models.forEach((model) => {
                        expect(model.attributes.experiment_type).to.equal('assembly');
                    });
                });
            });
            it('Should return empty list as run has no assemblies', function() {
                const runAccession = 'ERR770966';
                const collection = new api.RunAssemblies({id: runAccession});
                return collection.fetch().fail((a, b, c) => {
                    console.error(a);
                    console.error(b);
                    console.error(c);
                }).done(() => {
                    expect(collection.models).to.be.empty;
                });
            });
        });
    });
});
