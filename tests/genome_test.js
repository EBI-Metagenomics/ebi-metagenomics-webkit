let expectedAttributes = [
    'accession',
    'length',
    'num_contigs',
    'n_50',
    'gc_content',
    'type',
    'completeness',
    'contamination',
    'rna_5s',
    'rna_16s',
    'rna_23s',
    'trna_s',
    'num_genomes',
    'num_proteins',
    'pangenome_size',
    'core_prop',
    'accessory_prop',
    'ipr_prop',
    'last_updated',
    'first_created',
    'genome_url'];

define(['api'], function(api) {
    api = api({API_URL: window.__env__['API_URL'], SUBFOLDER: '/metagenomics'});
    describe('Genome tests', function() {
        context('Model tests', function() {
            const genomeAcc = 'GUT_GENOME000001';
            const model = new api.Genome({id: genomeAcc});
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
        context('Collection tests', function() {
            const collection = new api.GenomesCollection();
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
        context('Kegg tests', function() {
            const collection = new api.GenomeKeggs({id: 'GUT_GENOME000001'});
            const fetch = collection.fetch();
            it('Should have correct number of kegg matches', function() {
                return fetch.always(() => {
                    expect(collection.data.length).to.eq(43);
                });
            });
            it('Should have correct fields for keggs', function() {
                const expectedFields = ['brite_id', 'name', 'count'];
                return fetch.always(() => {
                    const firstKegg = collection.data[0];
                    expectedFields.forEach((attr) => {
                        expect(firstKegg).to.have.property(attr);
                    });
                });
            });
            it('Should be ordered by decreasing count', function() {
                return fetch.always(() => {
                    let prevCount = collection.data[0].count;
                    collection.data.slice(1).forEach((attr) => {
                        const newCount = attr.count;
                        expect(Math.min(prevCount, newCount)).to.eq(newCount);
                        prevCount = newCount;
                    });
                });
            });
        });
        context('EggNog tests', function() {
            const collection = new api.GenomeEggNogs({id: 'GUT_GENOME000001'});
            const fetch = collection.fetch();
            it('Should have correct number of eggnog matches', function() {
                return fetch.always(() => {
                    expect(collection.data.length).to.eq(11);
                });
            });
            it('Should have correct fields for eggnog', function() {
                const expectedFields = ['host', 'organism', 'description', 'count'];
                return fetch.always(() => {
                    const firstEggnog = collection.data[0];
                    expectedFields.forEach((attr) => {
                        expect(firstEggnog).to.have.property(attr);
                    });
                });
            });
            it('Should be ordered by decreasing count', function() {
                return fetch.always(() => {
                    let prevCount = collection.data[0].count;
                    collection.data.slice(1).forEach((attr) => {
                        const newCount = attr.count;
                        expect(Math.min(prevCount, newCount)).to.eq(newCount);
                        prevCount = newCount;
                    });
                });
            });
        });
        context('IPR tests', function() {
            const collection = new api.GenomeIprs({id: 'GUT_GENOME000001'});
            const fetch = collection.fetch();
            it('Should have correct number of ipr matches', function() {
                return fetch.always(() => {
                    expect(collection.data.length).to.eq(11);
                });
            });
            it('Should have correct fields for ipr', function() {
                const expectedFields = ['ipr_accession', 'ipr_url', 'count'];
                return fetch.always(() => {
                    const firstIPRMatch = collection.data[0];
                    expectedFields.forEach((attr) => {
                        expect(firstIPRMatch).to.have.property(attr);
                    });
                });
            });
            it('Should be ordered by decreasing count', function() {
                return fetch.always(() => {
                    let prevCount = collection.data[0].count;
                    collection.data.slice(1).forEach((attr) => {
                        const newCount = attr.count;
                        expect(Math.min(prevCount, newCount)).to.eq(newCount);
                        prevCount = newCount;
                    });
                });
            });
        });
        context('Cog tests', function() {
            const collection = new api.GenomeCogs({id: 'GUT_GENOME000001'});
            const fetch = collection.fetch();
            it('Should have correct number of cog matches', function() {
                return fetch.always(() => {
                    expect(collection.data.length).to.eq(22);
                });
            });
            it('Should have correct fields for cog', function() {
                const expectedFields = ['name', 'description', 'count'];
                return fetch.always(() => {
                    const firstCog = collection.data[0];
                    expectedFields.forEach((attr) => {
                        expect(firstCog).to.have.property(attr);
                    });
                });
            });
            it('Should be ordered by decreasing count', function() {
                return fetch.always(() => {
                    let prevCount = collection.data[0].count;
                    collection.data.slice(1).forEach((attr) => {
                        const newCount = attr.count;
                        expect(Math.min(prevCount, newCount)).to.eq(newCount);
                        prevCount = newCount;
                    });
                });
            });
        });
    });
});
