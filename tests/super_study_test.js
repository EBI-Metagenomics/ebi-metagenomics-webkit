define(['api'], function(api) {
    api = api({API_URL: window.__env__['API_URL'], SUBFOLDER: '/metagenomics'});

    describe('Super Study tests', function() {
        context('Model tests', function() {
            const superStudyId = 1;
            const model = new api.SuperStudy({id: superStudyId});
            const fetch = model.fetch();

            it('Should have expected fields', function() {
                let expectedAttributes = [
                    'superstudy_id',
                    'superstudy_url',
                    'superstudy_title',
                    'superstudy_description',
                    'superstudy_image_url',
                ];
                return fetch.always(() => {
                    expectedAttributes.forEach((attr) => {
                        expect(model.attributes).to.have.property(attr);
                        expect(model.attributes[attr]).to.not.equal(null);
                    });
                });
            });

            it('Should construct urls correctly', function() {
                return fetch.always(() => {
                    expect(model.attributes['superstudy_url'])
                        .to.equal('/metagenomics/super-studies/' + superStudyId);
                });
            });

            if('Should have the correct image property', function() {
                return fetch.always(() => {
                    expect(model.attributes['superstudy_image_url'])
                        .to.have.string('/super-studies-img/' + superStudyId + '/test_6sWQrNG.jpg');
                });
            })

            it('Should fetch the flagship studies for the Super Study', function() {
                const collection = new api.SuperStudyFlagshipStudiesCollection(
                    {super_study_id: superStudyId});
                const fetch = collection.fetch();

                expect(collection.url).to
                    .equal(api.API_URL + 'super-studies/' + superStudyId + '/flagship-studies');

                return fetch.always(() => {
                    expect(collection.models.length).to.equal(4);
                    expect(collection.models[0].attributes['study_accession'])
                        .to
                        .equal('MGYS00002072');
                });
            });

            it('Should fetch the related studies for the Super Study', function() {
                const collection = new api.SuperStudyRelatedStudiesCollection(
                    {super_study_id: superStudyId});
                const fetch = collection.fetch();

                expect(collection.url).to
                    .equal(api.API_URL + 'super-studies/' + superStudyId + '/related-studies');

                return fetch.always(() => {
                    expect(collection.models.length).to.equal(25);
                    expect(collection.models[0].attributes['study_accession'])
                        .to
                        .equal('MGYS00001729');
                    expect(collection.models[1].attributes['study_accession'])
                        .to
                        .equal('MGYS00001724');
                });
            });
        });
    });
});
