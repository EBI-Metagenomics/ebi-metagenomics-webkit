define(['api'], function(api) {
    api = api({API_URL: 'http://localhost:9000/metagenomics/api/v1/', SUBFOLDER: '/metagenomics'});
    describe('Study tests', function() {
        context('Model tests', function() {
            const studyAcc = 'MGYS00002072';
            const model = new api.Study({id: studyAcc});
            const fetch = model.fetch().fail((a, b, c) => {
                console.error(a);
                console.error(b);
                console.error(c);
            });
            it('Should have expected fields', function() {
                let expectedAttributes = [
                    'biomes',
                    'study_url',
                    'samples_url',
                    'ena_url',
                    'related_studies',

                    'bioproject',
                    'samples_count',
                    'study_accession',
                    'study_secondary_accession',
                    'public_release_date',
                    'centre_name',
                    'abstract',
                    'study_name',
                    'data_origination',
                    'last_update'];
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
                        .to.equal('/metagenomics/studies/' + studyAcc);
                    expect(model.attributes['samples_url'])
                        .to.equal('/metagenomics/studies/' + studyAcc + '#samples-section');
                    expect(model.attributes['ena_url'])
                        .to.equal('https://www.ebi.ac.uk/ena/data/view/ERP019566');
                });
            });
            it('Should provide related studies', function() {
                return fetch.done(() => {
                    const relatedStudies = model.attributes['related_studies'];
                    expect(relatedStudies.length).to.equal(1);
                }).fail((a, b, c) => {
                    console.error('fail');
                });
            });
            it('Should return empty relatedStudies list', function() {
                const studyAcc = 'MGYS00002217';
                const model = new api.Study({id: studyAcc});
                const fetch = model.fetch().done(() => {
                    expect(model.attributes['related_studies'].length).to.equals(0);
                });
            });
        });
        context('Study collections', function() {
            const collection = new api.StudiesCollection();
            const fetch = collection.fetch().fail((a, b, c) => {
                console.error(a);
                console.error(b);
                console.error(c);
            });
            it('Models should have expected fields', function() {
                let expectedAttributes = [
                    'biomes',
                    'study_url',
                    'samples_url',
                    'ena_url',

                    'bioproject',
                    'samples_count',
                    'study_accession',
                    'study_secondary_accession',
                    'centre_name',
                    'abstract',
                    'study_name',
                    'data_origination',
                    'last_update'];
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
            it('Should fetch studies related to sample', function() {
                const sampleAccession = 'ERS1474797';
                const collection = new api.SampleStudiesCollection(
                    {sample_accession: sampleAccession});
                const fetch = collection.fetch().fail((a, b, c) => {
                    console.error(a);
                    console.error(b);
                    console.error(c);
                });
                expect(collection.url).to
                    .equal(api.API_URL + 'samples/' + sampleAccession + '/studies');
                return fetch.done(() => {
                    expect(collection.models.length).to.equal(1);
                    expect(collection.models[0].attributes['study_accession'])
                        .to
                        .equal('MGYS00002072');
                });
            });
        });
        context('Study analyses', function() {
            it('Should only retrieve analyses of the study', function() {
                const studyAcc = 'MGYS00002072';
                const collection = new api.StudyAnalyses({id: studyAcc});
                return collection.fetch({data: $.param({include: 'sample'})}).done(() => {
                    expect(collection.models).to.not.be.empty;
                    collection.models.forEach((model) => {
                        expect(model.attributes['experiment_type']).to.not.equal('assembly');
                    });
                });
            });
            it('Should return empty list as study has no non-assembled analyses', function() {
                const studyAcc = 'MGYS00002062';
                const collection = new api.StudyAnalyses({id: studyAcc, assemblies: 'exclude'});
                return collection.fetch({data: $.param({include: 'sample'})}).done(() => {
                    expect(collection.models).to.be.empty;

                    collection.models.forEach((model) => {
                        expect(model.attributes['experiment_type']).to.not.equal('assembly');
                    });
                });
            });
        });
    });
});
