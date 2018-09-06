define(['api'], function(api) {
    api = api({API_URL: 'http://localhost:9000/metagenomics/api/v1/', SUBFOLDER: '/metagenomics'});
    describe('Sample tests', function() {
        context('Model tests', function() {

            const sampleAccession = 'ERS1474797';
            const model = new api.Sample({id: sampleAccession});
            const fetch = model.fetch().fail((a, b, c) => {
                console.error(a);
                console.error(b);
                console.error(c);
            });
            it('Should have expected fields', function() {
                let expectedAttributes = [
                    'biosample_url',
                    'biome',
                    'biome_icon',
                    'biome_name',
                    'sample_url',
                    'ena_url',
                    'lineage',
                    'metadatas',
                    'runs',

                    'sample_name',
                    'sample_desc',
                    'sample_accession',
                    'last_update',
                    'latitude',
                    'longitude'
                ];
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
                    expect(model.attributes['biosample_url'])
                        .to.equal('https://www.ebi.ac.uk/biosamples/samples/SAMEA27511918');
                    expect(model.attributes['sample_url'])
                        .to.equal('/metagenomics/samples/' + sampleAccession);
                    expect(model.attributes['ena_url'])
                        .to.equal('https://www.ebi.ac.uk/ena/data/view/' + sampleAccession);
                });
            });
            it('Should provide load metadata', function() {
                const sampleAccession = 'ERS434640';
                const model = new api.Sample({id: sampleAccession});
                model.fetch().fail((a, b, c) => {
                    console.error(a);
                    console.error(b);
                    console.error(c);
                }).done(() => {
                    const metadatas = model.attributes['metadatas'];
                    expect(metadatas.length).to.equal(16);
                    metadatas.forEach(function(name) {
                        expect(metadatas[name]).to.not.equal(null);
                    });
                });
            });
        });
        context('Sample collection tests', function() {
            const collection = new api.SamplesCollection();
            const fetch = collection.fetch().fail((a, b, c) => {
                console.error(a);
                console.error(b);
                console.error(c);
            });
            it('Models should have expected fields', function() {
                let expectedAttributes = [
                    'biosample_url',
                    'biome',
                    'biome_icon',
                    'biome_name',
                    'sample_url',
                    'ena_url',
                    'lineage',
                    'metadatas',
                    'runs',

                    'sample_name',
                    'sample_desc',
                    'sample_accession',
                    'last_update',
                    'latitude',
                    'longitude'
                ];
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
    });
});
