define(['api'], function(api) {
    api = api({API_URL: 'http://localhost:9000/metagenomics/api/v1/', SUBFOLDER: '/metagenomics'});
    describe('Publication tests', function() {
        context('Fetch single model', function() {
            const publicationID = '29312205';
            const model = new api.Publication({id: publicationID});
            const fetch = model.fetch();
            it('Should have expected fields', function() {
                let expectedAttributes = [
                    'pubmedCentralID',
                    'title',
                    'abstract',
                    'authors',
                    'doi',
                    'isbn',
                    'publishedYear',
                    'issue',
                    'volume',
                    'rawPages',
                    'medicineJournal',
                    'pubURLsrc',
                    'pmc_url',
                    'doi_url',
                    'pubMgnifyURL',
                    'studiesCount',
                    'samplesCount'];
                return fetch.always(() => {
                    expectedAttributes.forEach((attr) => {
                        expect(model.attributes).to.have.property(attr);
                        // expect(model.attributes[attr]).to.not.equal(null);
                    });
                });
            });
            it('Should not summarise short author list', function() {
                const exampleAuthor = 'Firstname Lastname, SecondName Lastname';
                const publication = {
                    attributes: {
                        authors: exampleAuthor
                    }
                };
                const summarised = new api.Publication().parse(publication);
                expect(summarised['authors']).to.equal(exampleAuthor);
            });
            it('Should construct urls correctly', function() {
                return fetch.always(() => {
                    expect(model.attributes['pmc_url'])
                        .to.equal('https://europepmc.org/abstract/MED/29312205');
                    expect(model.attributes['doi_url'])
                        .to.equal('http://dx.doi.org/10.3389/fmicb.2017.02499');
                    expect(model.attributes['pubMgnifyURL'])
                        .to.equal('/metagenomics/publications/' + publicationID);
                });
            });
        });
        context('Publication collections', function() {
            const collection = new api.PublicationsCollection();
            const fetch = collection.fetch();
            it('Models should have expected fields', function() {
                let expectedAttributes = [
                    'pubmedCentralID',
                    'title',
                    'abstract',
                    'authors',
                    'doi',
                    'isbn',
                    'publishedYear',
                    'issue',
                    'volume',
                    'rawPages',
                    'medicineJournal',
                    'pubURLsrc',
                    'pmc_url',
                    'doi_url',
                    'pubMgnifyURL',
                    'studiesCount',
                    'samplesCount'];
                return fetch.always(() => {
                    collection.models.forEach((model) => {
                        expectedAttributes.forEach((attr) => {
                            expect(model.attributes).to.have.property(attr);
                        });
                    });
                });
            });
        });
        context('Publication studies', function() {
            it('Should retrieve studies related to publication', function() {
                const publicationID = '29312205';
                const collection = new api.PublicationStudies({id: publicationID});
                return collection.fetch().always(() => {
                    expect(collection.models.length).to.equal(1);
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
                    collection.models.forEach((model) => {
                        expectedAttributes.forEach((attr) => {
                            expect(model.attributes).to.have.property(attr);
                        });
                    });
                });
            });
        });
    });
});
