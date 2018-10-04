const MGX_URL = 'https://wwwdev.ebi.ac.uk/ena/registry/metagenome/api/';

define(['backbone', 'underscore', './util'], function(Backbone, underscore, util) {
    const Sequence = Backbone.Model.extend({
        url() {
            return MGX_URL + 'sequences/' + this.id;
        }
    });

    const SequenceDatasets = Backbone.Collection.extend({
        model: Sequence,
        url() {
            return MGX_URL + 'sequences/' + this.sequenceID + '/datasets';
        },
        initialize(params) {
            this.sequenceID = params['id'];
        },
        parse(response) {
            return response['datasets'];
        }

    });
    return {
        Sequence,
        SequenceDatasets
    };
});
