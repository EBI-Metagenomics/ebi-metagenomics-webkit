let expectedGenomeAttributes = [
    'accession',
    'ena_genome_accession',
    'ena_sample_accession',
    'ena_study_accession',
    'ena_genome_url',
    'ena_sample_url',
    'ena_study_url',
    'img_genome_accession',
    'img_genome_url',
    'ncbi_genome_accession',
    'ncbi_sample_accession',
    'ncbi_study_accession',
    'patric_genome_accession',
    'patric_url',
    'taxon_lineage',
    'taxincons',
    'biome',
    'biome_icon',
    'biome_name',
    'geographic_origin',
    'geographic_range',
    'completeness',
    'contamination',
    'length',
    'num_contigs',
    'n_50',
    'gc_content',
    'type',
    'rna_5s',
    'rna_16s',
    'rna_23s',
    'trnas',
    'nc_rnas',
    'num_proteins',
    'eggnog_cov',
    'ipr_cov',
    'num_genomes_total',
    'num_genomes_nr',
    'pangenome_size',
    'pangenome_core_size',
    'pangenome_accessory_size',
    'pangenome_eggnog_cov',
    'pangenome_ipr_cov',
    'last_updated',
    'first_created',
    'genome_url'
];

expectedCatalogueAttributes = [
    'catalogue_id',
    'catalogue_url',
    'catalogue_name',
    'catalogue_description',
    'catalogue_version',
    'genome_count',
    'last_updated',
    'biome',
    'biome_icon',
    'biome_name',
    'protein_catalogue_name',
    'protein_catalogue_description'
]

define(['api'], function(api) {
    api = api({API_URL: window.__env__['API_URL'], SUBFOLDER: '/metagenomics'});
    describe('Genome tests', function() {
        context('Model tests', function() {
            const genomeAcc = 'MGYG-HGUT-00279';
            const model = new api.Genome({id: genomeAcc});
            const fetch = model.fetch();
            it('Should have expected fields', function() {
                return fetch.always(() => {
                    expectedGenomeAttributes.forEach((attr) => {
                        expect(model.attributes).to.have.property(attr);
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
                        expectedGenomeAttributes.forEach((attr) => {
                            expect(model.attributes).to.have.property(attr);
                        });
                    });
                });
            });
        });
        context('Kegg Module tests', function() {
            const collection = new api.GenomeKeggModules({id: 'MGYG-HGUT-00279'});
            const fetch = collection.fetch();
            it('Should have correct number of kegg matches', function() {
                return fetch.always(() => {
                    expect(collection.data.length).to.eq(163);
                });
            });
            it('Should have correct fields for keggs', function() {
                const expectedFields = ['name', 'description', 'genome-count', 'pangenome-count'];
                return fetch.always(() => {
                    const firstKegg = collection.data[0];
                    expectedFields.forEach((attr) => {
                        expect(firstKegg).to.have.property(attr);
                    });
                });
            });
            it('Should be ordered by decreasing count', function() {
                return fetch.always(() => {
                    let prevCount = collection.data[0]['genome-count'];
                    collection.data.slice(1).forEach((attr) => {
                        const newCount = attr['genome-count'];
                        expect(Math.min(prevCount, newCount)).to.eq(newCount);
                        prevCount = newCount;
                    });
                });
            });
        });
        context('Cog tests', function() {
            const collection = new api.GenomeCogs({id: 'MGYG-HGUT-00279'});
            const fetch = collection.fetch();
            it('Should have correct number of cog matches', function() {
                return fetch.always(() => {
                    expect(collection.data.length).to.eq(22);
                });
            });
            it('Should have correct fields for cog', function() {
                const expectedFields = ['name', 'description', 'genome-count', 'pangenome-count'];
                return fetch.always(() => {
                    const firstCog = collection.data[0];
                    expectedFields.forEach((attr) => {
                        expect(firstCog).to.have.property(attr);
                    });
                });
            });
            it('Should be ordered by decreasing count', function() {
                return fetch.always(() => {
                    let prevCount = collection.data[0]['genome-count'];
                    collection.data.slice(1).forEach((attr) => {
                        const newCount = attr['genome-count'];
                        expect(Math.min(prevCount, newCount)).to.eq(newCount);
                        prevCount = newCount;
                    });
                });
            });
        });
        context('Catalogue model tests', function() {
            const catalogueId = 'human-gut-v1-0';
            const model = new api.GenomeCatalogue({id: catalogueId});
            const fetch = model.fetch();
            it('Should have expected fields', function() {
                return fetch.always(() => {
                    expectedCatalogueAttributes.forEach((attr) => {
                        expect(model.attributes).to.have.property(attr);
                    });
                });
            });
        });
        context('Catalogue collection tests', function() {
            const collection = new api.GenomeCataloguesCollection();
            const fetch = collection.fetch();
            it('Models should have expected fields', function() {
                return fetch.always(() => {
                    collection.models.forEach((model) => {
                        expectedCatalogueAttributes.forEach((attr) => {
                            expect(model.attributes).to.have.property(attr);
                        });
                    });
                });
            });
        });
        context('Catalogue Genome collection tests', function() {
            const catalogueId = 'human-gut-v1-0';
            const collection = new api.GenomeCatalogueGenomeCollection({catalogue_id: catalogueId});
            const fetch = collection.fetch();
            it('Genome models should have expected fields', function() {
                return fetch.always(() => {
                    collection.models.forEach((model) => {
                        expectedGenomeAttributes.forEach((attr) => {
                            expect(model.attributes).to.have.property(attr);
                        });
                    });
                });
            });
        });
    });

});
