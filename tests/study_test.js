define(['api'], function(api) {
    api = api({API_URL: window.__env__['API_URL'], SUBFOLDER: '/metagenomics'});
    describe('Study tests', function() {
        context('Model tests', function() {
            const studyAcc = 'MGYS00002072';
            const model = new api.Study({id: studyAcc});
            const fetch = model.fetch();
            it('Should have expected fields', function() {
                let expectedAttributes = [
                    'biomes',
                    'study_url',
                    'samples_url',
                    'ena_url',
                    'related_studies',
                    'is_public',

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
                        .to.equal('/metagenomics/studies/' + studyAcc);
                    expect(model.attributes['samples_url'])
                        .to.equal('/metagenomics/studies/' + studyAcc + '#samples-section');
                    expect(model.attributes['ena_url'])
                        .to.equal('https://www.ebi.ac.uk/ena/browser/view/ERP019566');
                });
            });
            it('Should provide related studies', function() {
                return fetch.always(() => {
                    const relatedStudies = model.attributes['related_studies'];
                    expect(relatedStudies.length).to.equal(1);
                });
            });
            it('Should return empty relatedStudies list', function() {
                const studyAcc = 'MGYS00002217';
                const model = new api.Study({id: studyAcc});
                return model.fetch().always(() => {
                    expect(model.attributes['related_studies'].length).to.equals(0);
                });
            });
        });
        context('Study collections', function() {
            const collection = new api.StudiesCollection();
            const fetch = collection.fetch();
            it('Models should have expected fields', function() {
                let expectedAttributes = [
                    'biomes',
                    'study_url',
                    'samples_url',
                    'ena_url',
                    'is_public',

                    'bioproject',
                    'samples_count',
                    'study_accession',
                    'study_secondary_accession',
                    'centre_name',
                    'abstract',
                    'study_name',
                    'data_origination',
                    'last_update'];
                return fetch.always(() => {
                    collection.models.forEach((model) => {
                        expectedAttributes.forEach((attr) => {
                            expect(model.attributes).to.have.property(attr);
                        });
                    });
                });
            });
            it('Should fetch studies related to sample', function() {
                const sampleAccession = 'ERS1474797';
                const collection = new api.SampleStudiesCollection(
                    {sample_accession: sampleAccession});
                const fetch = collection.fetch();
                expect(collection.url).to
                    .equal(api.API_URL + 'samples/' + sampleAccession + '/studies');
                return fetch.always(() => {
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
                return collection.fetch({data: $.param({include: 'sample'})}).always(() => {
                    expect(collection.models).to.not.be.empty;
                    collection.models.forEach((model) => {
                        expect(model.attributes['experiment_type']).to.not.equal('assembly');
                    });
                });
            });
            it('Should return empty list as study has no non-assembled analyses', function() {
                const studyAcc = 'MGYS00002062';
                const collection = new api.StudyAnalyses({id: studyAcc, assemblies: 'exclude'});
                return collection.fetch({data: $.param({include: 'sample'})}).always(() => {
                    expect(collection.models).to.be.empty;

                    collection.models.forEach((model) => {
                        expect(model.attributes['experiment_type']).to.not.equal('assembly');
                    });
                });
            });
        });
        context('Study downloads', function() {
            it('Should cluster study downloads', function() {
                const downloads = new api.StudyDownloads({id: 'MGYS00000462'});
                return downloads.fetch().always(() => {
                    const data = downloads.attributes['pipelineFiles'];
                    let pipelineVersions = ['2.0', '4.0'];
                    expect(data).to.contain.keys(...pipelineVersions);
                    pipelineVersions.forEach((version) => {
                        for (let groupName in data[version]) {
                            if (data[version].hasOwnProperty(groupName)) {
                                const downloadEntries = data[version][groupName];
                                downloadEntries.forEach((entry) => {
                                    const attr = entry.attributes;
                                    expect(attr).to.contain
                                        .keys('alias', 'description', 'file-format', 'group-type');
                                    expect(attr['group-type'].toLowerCase()).to
                                        .equal(groupName.toLowerCase());
                                });
                            }
                        }
                    });
                });
            });
        });
        context('Study geocoordinates', function() {
            it('Should return all coordinates of samples in study', function() {
                const geoCoords = new api.StudyGeoCoordinates({id: 'MGYS00002072'});
                return geoCoords.fetch().always(() => {
                    const data = geoCoords.attributes.data;
                    expect(data.length).to.equal(3);
                    data.forEach((coord) => {
                        expect(coord['attributes']['latitude']).to.not.equal(null);
                        expect(coord['attributes']['longitude']).to.not.equal(null);
                    });
                });
            });
        });
    });
});
