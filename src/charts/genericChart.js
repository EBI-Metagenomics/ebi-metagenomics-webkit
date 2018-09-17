define(['../api'], function(api) {
    /**
     *
     */
    class GenericChart {
        /**
         *
         * @param containerId
         * @param options
         */
        constructor(containerId, options) {
            this.dataReady = $.Deferred();
            if (typeof options['accession'] !== 'undefined') {
                this.api = api(options['apiConfig']);
                this.model = this.fetchModel(options).done(() => {
                    this.dataReady.resolve();
                });
            } else {
                this.data = options['data'];
                this.dataReady.resolve();
            }
        }

        /**
         *
         */
        fetchModel() {
            console.error('Method is not implemented or superclass instantiated!');
        }
    }

    return GenericChart;
});
