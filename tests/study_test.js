// let process = require('process');
//
// process.env.API_URL = 'http://localhost:9000/metagenomics/api/v1/';
// let assert = require('assert');

// class GenericModelValidation {
//     constructor(Model, exampleId, expectedAttributes) {
//         const that = this;
//         this.model = new Model({id: exampleId});
//         cy.log(JSON.stringify(expectedAttributes));
//         cy.log(1);
//         this.model.fetch();
//         cy.log('Done');
//         cy.log(expectedAttributes);
//         expectedAttributes.forEach(function(i, attr) {
//             cy.log(i, attr)
//             expect(that.model.attributes[attr]).to.exist;
//             cy.log(attr, that.model.attributes);
//             cy.log('Has attribute: ' + attr);
//         });
//         cy.log(2);
//
//     }
// }

define(['api'], function(api) {
    api = api({API_URL: 'http://localhost:9000/metagenomics/api/v1/'});
    describe('Unit tests', function() {
        it('Study test', function() {
            let model = new api.Study({id: 'MGYS00002217'});
            let expectedAttributes = [
                'biomes',
                'study_link',
                'samples_link',
                'ena_url',
                'related_studies',
                'bioproject',
                'samples_count',
                'study_accession',
                'study_secondary_accession',
                'centre_name',
                'abstract',
                'study_name',
                'data_origination',
                'last_update'];
            return model.fetch().done(() => {
                expectedAttributes.forEach(function(attr) {
                    expect(model.attributes).to.have.property(attr);
                });
            }).fail((a, b, c) => {
                console.error(a);
                console.error(b);
                console.error(c);
            });
        });
    });
});
