define(['../api'], function(api) {
    /**
     * Generic chart class to
     */
    class GenericChart {
        /**
         * Class constructor to load / fetch data
         * @param {string} containerId for HTML element into which chart will be inserted
         * @param {object} options required to fetch underlying data from MGnify api
         * or provide it directly
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
         * Abstract class, subclasses must implement a method of fetching the data from MGnify API
         * @param {object} params
         */
        fetchModel(params) {
            console.error('Method is not implemented or superclass instantiated!');
        }
    }

    return GenericChart;
});
