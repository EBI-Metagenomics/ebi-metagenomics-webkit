const NO_DATA_MSG = 'N/A';

const ENA_VIEW_URL = 'https://www.ebi.ac.uk/ena/data/view/';
const EUROPE_PMC_ENTRY_URL = 'https://europepmc.org/abstract/MED/';
const DX_DOI_URL = 'http://dx.doi.org/';
const EBI_BIOSAMPLE_URL = 'https://www.ebi.ac.uk/biosamples/';
const MGNIFY_URL = 'https://www.ebi.ac.uk/metagenomics';
// Based off of CommonJS / AMD compatible template:
// https://github.com/umdjs/umd/blob/master/templates/commonjsAdapter.js

define(['backbone', 'underscore', './util'], function(Backbone, underscore, util) {
    const _ = underscore;

    let init = function(options) {
        // Prioritize env variables over options
        const API_URL = (typeof process !== 'undefined' && typeof process.env !== 'undefined')
            ? process.env.API_URL
            : options['API_URL'];
        const subfolder = (typeof process !== 'undefined' && typeof process.env !== undefined)
            ? process.env.DEPLOYMENT_SUBFOLDER
            : options['SUBFOLDER'] || MGNIFY_URL;

        /**
         * Raw jQuery method used when complete set of paginated data is required
         * @param {object} that context for url fetching
         * @return {Promise}
         */
        function multiPageFetch(that) {
            const deferred = $.Deferred();
            let data = [];
            $.get({
                url: that.url(),
                success(response) {
                    try {
                        data = data.concat(response.data);
                        const numPages = response.meta.pagination.pages;
                        if (numPages > 1) {
                            let requests = [];
                            for (let x = 2; x <= numPages; x++) {
                                requests.push($.get(that.url() + '?page=' + x));
                            }
                            $.when(...requests).done(function() {
                                _.each(requests, function(response) {
                                    if (response.hasOwnProperty('responseJSON') &&
                                        response.responseJSON.hasOwnProperty('data')) {
                                        data = data.concat(response.responseJSON.data);
                                    }
                                });
                                deferred.resolve(data);
                            });
                        } else {
                            deferred.resolve(data);
                        }
                    } catch (exception) {
                        deferred.reject();
                    }
                }
            });
            return deferred.promise();
        }

        /**
         * Cluster study download results by type and parts
         * @param {[object]} downloads
         * @return {[object]} grouped downloads
         */
        function clusterStudyDownloads(downloads) {
            const pipelines = {};
            _.each(downloads, function(download) {
                const attr = download.attributes;
                const group = attr['group-type'];
                const pipeline = download.relationships.pipeline.data.id;

                attr['link'] = download.links.self;
                if (!pipelines.hasOwnProperty(pipeline)) {
                    pipelines[pipeline] = {};
                }
                if (!pipelines[pipeline].hasOwnProperty(group)) {
                    pipelines[pipeline][group] = [];
                }

                pipelines[pipeline][group] = pipelines[pipeline][group].concat(download);
            });

            return pipelines;
        }

        let collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});

        /**
         * Reformat included samples in response
         * @param {object} response
         * @return {[object]}
         */
        function collectSamples(response) {
            let samples;
            if (response.hasOwnProperty('included')) {
                samples = response.included.reduce(function(obj, x) {
                    obj[x.id] = Sample.prototype.parse(x);
                    return obj;
                }, {});
            } else {
                samples = [];
            }
            return samples;
        }

        /**
         * Cluster run download results by type and parts
         * @param {[object]} downloads
         * @return {[object]} grouped downloads
         */
        function clusterAnalysisDownloads(downloads) {
            const groups = {};
            _.each(downloads, function(download) {
                const attr = download.attributes;
                const group = attr['group-type'];
                const label = attr.description.label;
                const format = attr['file-format']['name'];
                attr['links'] = [download.links.self];

                if (!groups.hasOwnProperty(group)) {
                    groups[group] = [];
                }
                if (attr['file-format']['compression']) {
                    attr['file-format']['compExtension'] = attr.alias.split('.')
                        .slice(-1)[0];
                }
                let grouped = false;
                _.each(groups[group], function(d) {
                    const groupLabel = d.attributes.description.label;
                    const groupFormat = d.attributes['file-format']['name'];
                    if (groupLabel === label && groupFormat === format) {
                        d.attributes.links = d.attributes.links.concat(download.links.self);
                        grouped = true;
                    }
                });
                if (!grouped) {
                    groups[group] = groups[group].concat(download);
                }
            });
            _.each(groups, function(group) {
                _.each(group, function(entry) {
                    entry.attributes.links.sort(collator.compare);
                });
            });

            return groups;
        }

        // Model for an individual study
        const Study = Backbone.Model.extend({
            url() {
                return API_URL + 'studies/' + this.id;
            },
            parse(d) {
                const data = d.data !== undefined ? d.data : d;
                const attr = data.attributes;
                const biomes = util.simplifyBiomeIcons(
                    data.relationships.biomes.data.map(util.getBiomeIconData));
                let relatedStudies = [];
                if (data.relationships.hasOwnProperty('studies')) {
                    data.relationships.studies.data.forEach((study) => {
                        study.study_url = subfolder + '/studies/' + study.id;
                        relatedStudies.push(study);
                    });
                    // for (let i in relatedStudies) {
                    //     relatedStudies[i].study_url = subfolder + '/studies/' +
                    //         relatedStudies[i].id;
                    // }
                }
                return {
                    // Processed fields
                    biomes: biomes,
                    study_url: subfolder + '/studies/' + attr['accession'],
                    samples_url: subfolder + '/studies/' + attr['accession'] +
                    '#samples-section',
                    ena_url: ENA_VIEW_URL + attr['secondary-accession'],
                    related_studies: relatedStudies,

                    // Standard fields
                    bioproject: attr['bioproject'],
                    samples_count: attr['samples-count'],
                    study_accession: attr['accession'],
                    study_secondary_accession: attr['secondary-accession'],
                    centre_name: attr['centre-name'],
                    public_release_date: attr['public-release-date'],
                    abstract: attr['study-abstract'],
                    study_name: attr['study-name'],
                    data_origination: attr['data-origination'],
                    last_update: util.formatDate(attr['last-update'])
                };
            }
        });

        const StudiesCollection = Backbone.Collection.extend({
            url: API_URL + 'studies',
            model: Study,
            parse(response) {
                return response.data;
            }
        });

        const StudyGeoCoordinates = Backbone.Model.extend({
            url() {
                return API_URL + 'studies/' + this.id +
                    '/geocoordinates?page_size=500';
            }
        });

        const SampleStudiesCollection = Backbone.Collection.extend({
            model: Study,
            initialize(params) {
                this.url = API_URL + 'samples/' + params['sample_accession'] + '/studies';
            },
            parse(response) {
                return response.data;
            }
        });

        const Sample = Backbone.Model.extend({
            url() {
                return API_URL + 'samples/' + this.id;
            },
            parse(d) {
                const data = d.data !== undefined ? d.data : d;
                const attr = data.attributes;

                let metadatas = _.map(attr['sample-metadata'], function(el) {
                    const key = el.key;
                    return {
                        name: key[0].toUpperCase() + key.slice(1),
                        value: el.value,
                        unit: el.unit
                    };
                });

                // Adaption to handle 'includes' on API calls which would wrap the response
                const biome = util.getBiomeIconData(data.relationships.biome.data);
                const biomeName = data.relationships.biome.data.id;
                return {
                    biosample: attr['biosample'],
                    biosample_url: EBI_BIOSAMPLE_URL + 'samples/' + attr['biosample'],
                    biome: biome,
                    biome_icon: util.getBiomeIcon(biomeName),
                    biome_name: util.formatLineage(biomeName, true),
                    sample_name: attr['sample-name'] || NO_DATA_MSG,
                    sample_desc: attr['sample-desc'],
                    sample_url: subfolder + '/samples/' + attr['accession'],
                    ena_url: ENA_VIEW_URL + attr['accession'],
                    sample_accession: attr['accession'] || NO_DATA_MSG,
                    lineage: util.formatLineage(data.relationships.biome.data.id || NO_DATA_MSG,
                        true),
                    metadatas: metadatas,
                    runs: d.included,
                    last_update: util.formatDate(attr['last-update']),
                    latitude: attr.latitude,
                    longitude: attr.longitude
                };
            }
        });

        const SamplesCollection = Backbone.Collection.extend({
            url: API_URL + 'samples',
            model: Sample,
            initialize(data) {
                this.params = data || {};
            },
            parse(response) {
                return response.data;
            }
        });

        const Run = Backbone.Model.extend({
            url() {
                return API_URL + 'runs/' + this.id;
            },
            parse(d) {
                // Adaption to handle 'includes' on API calls which would wrap the response
                const data = d.data !== undefined ? d.data : d;
                const attr = data.attributes;
                const rel = data.relationships;
                const pipelines = rel.pipelines;
                const sampleId = rel.sample.data.id;
                const studyId = rel.study.data.id;
                return {
                    // Processed fields
                    ena_url: ENA_VIEW_URL + attr['accession'],
                    sample_accession: sampleId,
                    sample_url: subfolder + '/samples/' + sampleId,
                    analysis_url: subfolder + '/runs/' + attr.accession,
                    pipeline_versions: pipelines.data.map(function(x) {
                        return x.id;
                    }),
                    analysis_results: 'TAXONOMIC / FUNCTION / DOWNLOAD',
                    study_accession: studyId,
                    study_url: subfolder + '/studies/' + studyId,

                    // Standard fields
                    experiment_type: attr['experiment-type'],
                    run_accession: attr['accession'],
                    secondary_run_accession: attr['secondary-accession'],
                    instrument_model: attr['instrument-model'],
                    instrument_platform: attr['instrument-platform']
                };
            }
        });

        const Assembly = Backbone.Model.extend({
            url() {
                return API_URL + 'assemblies/' + this.id;
            },
            parse(d) {
                // Adaption to handle 'includes' on API calls which would wrap the response
                const data = d.data !== undefined ? d.data : d;
                const attr = data.attributes;
                const rel = data.relationships;
                const pipelines = rel.pipelines;
                const sampleId = rel.sample.data.id;
                const studyId = rel.study.data.id;
                return {
                    assembly_id: attr['accession'],
                    ena_url: ENA_VIEW_URL + attr['accession'],
                    analysis_url: util.subfolder + '/assemblies/' + attr.accession,
                    experiment_type: attr['experiment-type'],
                    runs: runs.data.map(function(x) {
                        return x.id;
                    }),
                    samples: samples.data.map(function(x) {
                        return x.id;
                    }),
                    analysis_results: 'TAXONOMIC / FUNCTION / DOWNLOAD',
                };
            }
        });

        /**
         * Generate Krona URL
         * @param {string} analysisID ENA Run primary accession
         * @param {string} ssuOrLsu subunit type (for pipeline version 4.0 and above)
         * @return {string} url
         */
        function getKronaURL(analysisID, ssuOrLsu) {
            return API_URL + 'analyses/' + analysisID + '/krona' + ssuOrLsu + '?collapse=false';
        }

        const RunsCollection = Backbone.Collection.extend({
            url: API_URL + 'runs',
            model: Run,
            initialize(params) {
                // Project/sample ID
                if (typeof(params) !== 'undefined') {
                    if (params.hasOwnProperty(('study_accession'))) {
                        this.study_accession = params.study_accession;
                    }
                    // Sample ID
                    if (params.hasOwnProperty(('sample_accession'))) {
                        this.sample_accession = params.sample_accession;
                    }
                    this.params = params;
                }
            },
            parse(response) {
                return response.data;
            }
        });

        const AssembliesCollection = Backbone.Collection.extend({
            url: API_URL + 'assemblies',
            model: Assembly,
            initialize(params) {
                // Project/sample ID
                if (typeof(params) !== 'undefined') {
                    if (params.hasOwnProperty(('study_accession'))) {
                        this.study_accession = params.study_accession;
                    }
                    // Sample ID
                    if (params.hasOwnProperty(('sample_accession'))) {
                        this.sample_accession = params.sample_accession;
                    }
                    this.params = params;
                }
            },
            parse(response) {
                return response.data;
            }
        });

        const Biome = Backbone.Model.extend({
            url() {
                return API_URL + 'biomes/' + this.id;
            },
            parse(data) {
                // Work-around when requesting root biome
                if (data.data) {
                    data = data.data;
                }
                const attr = data.attributes;
                const lineage = attr['lineage'];
                return {
                    name: util.lineageToBiome(lineage),
                    icon: util.getBiomeIcon(lineage),
                    lineage: lineage,
                    samples_count: attr['samples-count'],
                    biome_studies_url: subfolder + '/browse?lineage=' + lineage + '#studies'
                };
            }
        });

        const BiomeCollection = Backbone.Collection.extend({
            model: Biome,
            url: API_URL + 'biomes',
            parse(response) {
                return response.data;
            }
        });

        const BiomeWithChildren = Backbone.Collection.extend({
            model: Biome,
            url() {
                return API_URL + 'biomes/' + this.rootLineage + '/children';
            },
            initialize(data) {
                if (data.hasOwnProperty('rootLineage')) {
                    this.rootLineage = data['rootLineage'];
                } else {
                    this.rootLineage = 'root';
                }
            },
            parse(response) {
                return response.data;
            }
        });

        const Analysis = Backbone.Model.extend({
            url() {
                return API_URL + 'analyses/' + this.id;
            },
            parse(d) {
                const data = d.data !== undefined ? d.data : d;
                const attr = data.attributes;
                let studyID = data.relationships.study.data.id;
                let sampleID = data.relationships.sample.data.id;
                let runID = data.relationships.run.data.id;
                attr['analysis-summary'] = _.reduce(attr['analysis-summary'], function(obj, e) {
                    obj[e['key']] = e['value'];
                    return obj;
                }, {});
                return {
                    study_accession: studyID,
                    study_url: subfolder + '/studies/' + studyID,
                    sample_accession: sampleID,
                    sample_url: subfolder + '/samples/' + sampleID,
                    run_accession: runID,
                    run_url: subfolder +
                    (attr['experiment-type'] === 'assembly' ? '/assemblies/' : '/runs/') + runID,
                    analysis_accession: data['id'],
                    analysis_url: subfolder + '/analyses/' + data['id'],
                    experiment_type: attr['experiment-type'],
                    analysis_summary: attr['analysis-summary'],
                    complete_time: attr['complete-time'],
                    instrument_model: attr['instrument-model'],
                    instrument_platform: attr['instrument-platform'],
                    pipeline_version: attr['pipeline-version'],
                    pipeline_url: subfolder + '/pipelines/' + attr['pipeline-version'],
                    download: attr['download']
                };
            }
        });

        const RunAnalyses = Backbone.Collection.extend({
            initialize(data) {
                this.id = data.id;
            },
            url() {
                return API_URL + 'runs/' + this.id + '/analyses';
            },
            parse(d) {
                const data = d.data !== undefined ? d.data : d;
                let analyses = _.map(data, (analysis) => {
                    return Analysis.prototype.parse(analysis);
                });
                analyses = _.filter(analyses, (analysis) => {
                    return analysis['experiment_type'] !== 'assembly';
                });
                return analyses;
            }
        });

        const RunAssemblies = Backbone.Collection.extend({
            initialize(data) {
                this.id = data.id;
            },
            url() {
                return API_URL + 'runs/' + this.id + '/analyses';
            },
            parse(d) {
                const data = d.data !== undefined ? d.data : d;
                let analyses = _.map(data, (analysis) => {
                    return Analysis.prototype.parse(analysis);
                });
                analyses = _.filter(analyses, (analysis) => {
                    return analysis['experiment_type'] === 'assembly';
                });
                return analyses;
            }
        });

        // Retrieve analyses of a study
        const StudyAnalyses = Backbone.Collection.extend({
            initialize(data) {
                this.id = data.id;
                this.assemblies = data.assemblies; // Set to only || exclude || null
            },
            url() {
                return API_URL + 'studies/' + this.id + '/analyses';
            },
            parse(response) {
                let analyses = response.data;
                let samples = collectSamples(response);

                analyses = _.map(analyses, (analysis) => {
                    const sample = samples[analysis.relationships.sample.data.id];
                    analysis = Analysis.prototype.parse(analysis);
                    analysis['biome'] = sample['biome'];
                    analysis['sample_desc'] = sample['sample_desc'];
                    return analysis;
                });
                if (this.assemblies === 'exclude') {
                    analyses = _.filter(analyses, (analysis) => {
                        return analysis['experiment_type'] !== 'assembly';
                    });
                }
                return analyses;
            }
        });

        // Abstract class
        const GenericAnalysisResult = Backbone.Model.extend({
            initialize(params) {
                this.id = params.id;
                this.version = params.version;
                if (params.hasOwnProperty('type')) {
                    this.type = params.type;
                }
            }
        });

        const Taxonomy = GenericAnalysisResult.extend({
            url() {
                return API_URL + 'analyses/' + this.id + '/taxonomy' + this.type;
            },
            fetch() {
                return multiPageFetch(this);
            }
        });

        const InterproIden = GenericAnalysisResult.extend({
            url() {
                return API_URL + 'analyses/' + this.id + '/interpro-identifiers';
            },
            fetch() {
                return multiPageFetch(this);
            }
        });

        const GoSlim = GenericAnalysisResult.extend({
            url() {
                return API_URL + 'analyses/' + this.id + '/go-slim';
            }
        });

        const StudyDownloads = Backbone.Model.extend({
            url() {
                return API_URL + 'studies/' + this.id + '/downloads';
            },
            parse(response) {
                this.attributes.pipelineFiles = clusterStudyDownloads(response.data);
            }
        });

        const AnalysisDownloads = Backbone.Model.extend({
            url() {
                return API_URL + 'analyses/' + this.id + '/downloads';
            },
            parse(response) {
                this.attributes.downloadGroups = clusterAnalysisDownloads(response.data);
            }
        });

        const QcChartData = Backbone.Model.extend({
            initialize(data) {
                this.id = data.id;
                this.type = data.type;
            },
            url() {
                return API_URL + 'analyses/' + this.id + '/' + this.type;
            }
        });

        const QcChartStats = QcChartData.extend({
            initialize(data) {
                this.id = data.id;
                this.type = 'summary';
            },
            parse(data) {
                const rows = data.split('\n');
                let vals = {};
                _.each(rows, function(row) {
                    let keyVal = row.split('\t');
                    vals[keyVal[0]] = parseFloat(keyVal[1]);
                });
                return vals;
            }
        });

        const Publication = Backbone.Model.extend({
            url() {
                return API_URL + 'publications/' + this.id;
            },
            parse(d) {
                const data = d.data !== undefined ? d.data : d;
                const attr = data.attributes;
                let authors = attr['authors'];
                if (authors.length > 50) {
                    authors = authors.split(',').slice(0, 5);
                    authors.push(' et al.');
                    authors = authors.join(',');
                }
                return {
                    pubmedID: attr['pubmed-id'],
                    pubmedCentralID: attr['pubmed-central-id'],
                    title: attr['pub-title'],
                    abstract: attr['abstract'],
                    authors: authors,
                    doi: attr['doi'],
                    isbn: attr['isbn'],
                    publishedYear: attr['published-year'],
                    issue: attr['issue'],
                    volume: attr['volume'],
                    rawPages: attr['raw-pages'],
                    isoJournal: attr['iso-journal'],
                    medicineJournal: attr['medicine-journal'],
                    pubURLsrc: attr['pub-url'],
                    pmc_url: EUROPE_PMC_ENTRY_URL + attr['pubmed-id'],
                    doi_url: DX_DOI_URL + attr['doi'],
                    pubMgnifyURL: subfolder + '/publications/' + attr['pubmed-id'],
                    studiesCount: attr['studies-count'],
                    samplesCount: attr['samples-count']
                };
            }
        });
        const PublicationsCollection = Backbone.Collection.extend({
            model: Publication,
            url: API_URL + 'publications',
            initialize(data) {
                this.params = data || {};
            },
            parse(response) {
                return response.data;
            }
        });

        const PublicationStudies = Backbone.Collection.extend({
            url() {
                return API_URL + 'publications/' + this.id + '/studies';
            },
            model: Study,
            initialize(data) {
                this.id = data['id'];
            },
            parse(response) {
                return response.data;
            }
        });

        return {
            API_URL,
            Study,
            StudiesCollection,
            SampleStudiesCollection,
            Run,
            Assembly,
            RunsCollection,
            AssembliesCollection,
            Biome,
            BiomeCollection,
            BiomeWithChildren,
            Sample,
            SamplesCollection,
            GenericAnalysisResult,
            getKronaURL,
            Analysis,
            RunAnalyses,
            RunAssemblies,
            StudyAnalyses,
            Taxonomy,
            InterproIden,
            GoSlim,
            StudyDownloads,
            AnalysisDownloads,
            StudyGeoCoordinates,
            QcChartData,
            QcChartStats,
            Publication,
            PublicationsCollection,
            PublicationStudies
        };
    };
    return init;
});
