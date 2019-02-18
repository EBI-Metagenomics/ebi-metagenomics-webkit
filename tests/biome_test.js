define(['api'], function(api) {
    api = api({API_URL: window.__env__['API_URL'], SUBFOLDER: '/metagenomics'});
    describe('Biomes tests', function() {
        context('Model tests', function() {
            const lineage = 'root:Engineered';
            const model = new api.Biome({id: lineage});
            const fetch = model.fetch();
            it('Should have expected fields', function() {
                let expectedAttributes = [
                    'name',
                    'icon',
                    'lineage',
                    'samples_count',
                    'biome_studies_url'];
                return fetch.always(() => {
                    expectedAttributes.forEach((attr) => {
                        expect(model.attributes).to.have.property(attr);
                        expect(model.attributes[attr]).to.not.equal(null);
                    });
                });
            });
            it('Should construct urls correctly', function() {
                return fetch.always(() => {
                    expect(model.attributes['biome_studies_url'])
                        .to.equal('/metagenomics/browse?lineage=' + lineage + '#studies');
                });
            });
            let expectedAttributes = [
                'name',
                'icon',
                'lineage',
                'samples_count',
                'biome_studies_url'];
            describe('Biome collection tests', function() {
                const collection = new api.BiomeCollection();
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
            });
            describe('BiomeWithChildren collection tests', function() {
                it('Should default to root biome', function() {
                    const collection = new api.BiomeWithChildren({});
                    return collection.fetch().always(() => {
                        collection.models.forEach((model) => {
                            expectedAttributes.forEach((attr) => {
                                expect(model.attributes).to.have.property(attr);
                            });
                        });
                    });
                });
                it('Should return lineage with children', function() {
                    const lineage = 'root:Engineered';
                    const collection = new api.BiomeWithChildren({rootLineage: lineage});
                    return collection.fetch().always(() => {
                        collection.models.forEach((model) => {
                            expectedAttributes.forEach((attr) => {
                                expect(model.attributes).to.have.property(attr);
                                expect(model.attributes.lineage).to.match(/root:Engineered[:.*]?/);
                            });
                        });
                    });
                });
            });
        });
    });
});
