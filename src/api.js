const NO_DATA_MSG = 'N/A';

const ENA_VIEW_URL = 'https://www.ebi.ac.uk/ena/data/view/';
const EUROPE_PMC_ENTRY_URL = 'https://europepmc.org/abstract/MED/';
const DX_DOI_URL = 'http://dx.doi.org/';
const EBI_BIOSAMPLE_URL = 'https://www.ebi.ac.uk/biosamples/';
const MGNIFY_URL = 'https://www.ebi.ac.uk/metagenomics';

const IMG_URL = ' https://img.jgi.doe.gov/cgi-bin/m/main.cgi?section=TaxonDetail&page=taxonDetail&taxon_oid=';
const NCBI_ASSEMBLY_URL = 'https://www.ncbi.nlm.nih.gov/assembly/';
const NCBI_SAMPLE_URL = 'https://www.ncbi.nlm.nih.gov/biosample/?term=';
const NCBI_PROJECT_URL = 'https://www.ncbi.nlm.nih.gov/bioproject/';
const PATRIC_URL = 'https://www.patricbrc.org/view/Genome/';

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
        function multiPageFetch(that, reqData) {
            const deferred = $.Deferred();
            let data = [];
            $.get({
                url: that.url(),
                data: reqData,
                success(response) {
                    try {
                        data = data.concat(response.data);
                        const numPages = response.meta.pagination.pages;
                        if (numPages > 1) {
                            let requests = [];
                            for (let x = 2; x <= numPages; x++) {
                                requests.push(
                                    $.get({
                                        url: that.url() + '?page=' + x,
                                        data: reqData
                                    })
                                );
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
            const filteredDownloads =_.filter(downloads, (dl) => {
                const attributes = dl.attributes;
                const passed = attributes &&
                    _.has(attributes, 'description') &&
                    _.has(attributes, 'file-format');
                if (!passed && console && console.warn) {
                    console.warn('Download entry has missing values.')
                }
                return passed;
            });
            _.each(filteredDownloads, (download) => {
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
                    is_public: attr['is-public'],

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
            },
            fetch() {
                return multiPageFetch(this);
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

        const SuperStudy = Backbone.Model.extend({
            url() {
                return API_URL + 'super-studies/' + this.id;
            },
            parse(d) {
                const data = d.data !== undefined ? d.data : d;
                const attr = data.attributes;
                const url = subfolder + '/super-studies/' + attr['super-study-id'];
                return {
                    // Standard fields
                    superstudy_id: attr['super-study-id'],
                    superstudy_url: url,
                    superstudy_title: attr['title'],
                    superstudy_description: attr['description'],
                    superstudy_image_url: attr['image-url'],
                };
            }
        });

        const SuperStudiesCollection = Backbone.Collection.extend({
            url: API_URL + 'super-studies',
            model: SuperStudy,
            parse(response) {
                return response.data;
            }
        });

        const SuperStudyFlagshipStudiesCollection = Backbone.Collection.extend({
            model: Study,
            initialize(params) {
                this.url = API_URL + 'super-studies/' + params['super_study_id']
                           + '/flagship-studies';
            },
            parse(response) {
                return response.data;
            }
        });

        const SuperStudyRelatedStudiesCollection = Backbone.Collection.extend({
            model: Study,
            initialize(params) {
                this.url = API_URL + 'super-studies/' + params['super_study_id']
                           + '/related-studies';
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
                // const pipelines = rel.pipelines;
                // const sampleId = rel.samples.data.id;
                // const studyId = rel.study.data.id;
                return {
                    assembly_id: attr['accession'],
                    ena_url: ENA_VIEW_URL + attr['accession'],
                    analysis_url: subfolder + '/assemblies/' + attr.accession,
                    experiment_type: attr['experiment-type'],
                    runs: rel.runs.data.map(function(x) {
                        return {id: x.id, url: subfolder + '/runs/' + x.id};
                    }),
                    samples: rel.samples.data.map(function(x) {
                        return {id: x.id, url: subfolder + '/samples/' + x.id};
                    }),
                    analysis_results: 'TAXONOMIC / FUNCTION / DOWNLOAD',
                    pipeline_versions: rel.pipelines.data.map(function(x) {
                        return x.id;
                    }),
                    wgs_id: attr['wgs-accession'],
                    legacy_id: attr['legacy-accession']
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

        const AssemblyAnalyses = Backbone.Collection.extend({
            initialize(data) {
                this.id = data.id;
            },
            url() {
                return API_URL + 'assemblies/' + this.id + '/analyses';
            },
            parse(d) {
                const data = d.data !== undefined ? d.data : d;
                return _.map(data, (analysis) => {
                    return Analysis.prototype.parse(analysis);
                });
            }
        });

        let AnalysesContig = Backbone.Model.extend({
            parse(data) {
                return {
                    contig_id: data.attributes['contig-id'],
                    length: data.attributes.length,
                    coverage: data.attributes.coverage,
                    has_cog: data.attributes['has-cog'],
                    has_kegg: data.attributes['has-kegg'],
                    has_pfam: data.attributes['has-pfam'],
                    has_interpro: data.attributes['has-interpro'],
                    has_go: data.attributes['has-go'],
                    has_antismash: data.attributes['has-antismash'],
                    // TODO: this property is not used at the moment.
                    // has_kegg_modules: data.attributes['has-kegg-modules'],
                };
            }
        });
        
        let ContigCollection = Backbone.Collection.extend({
            model: AnalysesContig,
            initialize(options) {
                this.accession = options.accession;
            },
            url() {
                return API_URL + 'analyses/' + this.accession + '/contigs';
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
            initialize(data) {
                this.id = data.id;
                this.params = data.params;
            },
            url() {
                if (this.params) {
                    return API_URL + 'analyses/' + this.id + '?' + $.param(this.params);
                } else {
                    return API_URL + 'analyses/' + this.id;
                }
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
                let assemblyID = data.relationships.assembly.data.id;
                let pipelineVersion = parseFloat(attr['pipeline-version']);
                if (_.isNumber(pipelineVersion)) {
                    pipelineVersion = pipelineVersion.toFixed(1);
                }

                return {
                    study_accession: studyID,
                    study_url: subfolder + '/studies/' + studyID,
                    sample_accession: sampleID,
                    sample_url: subfolder + '/samples/' + sampleID,
                    run_accession: runID,
                    run_url: subfolder + '/runs/' + runID,
                    assembly_accession: assemblyID,
                    assembly_url: subfolder + '/assemblies/' + assemblyID,
                    analysis_accession: data['id'],
                    analysis_url: subfolder + '/analyses/' + data['id'],
                    experiment_type: attr['experiment-type'],
                    analysis_summary: attr['analysis-summary'],
                    complete_time: attr['complete-time'],
                    instrument_model: attr['instrument-model'],
                    instrument_platform: attr['instrument-platform'],
                    pipeline_version: pipelineVersion,
                    pipeline_url: subfolder + '/pipelines/' + attr['pipeline-version'],
                    download: attr['download'],
                    included: d.included,
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
                return API_URL + 'runs/' + this.id + '/assemblies';
            },
            parse(d) {
                const data = d.data !== undefined ? d.data : d;
                return _.map(data, (analysis) => {
                    return Assembly.prototype.parse(analysis);
                });
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

        const TaxonomyOverview = Backbone.Model.extend({
            initialize(id) {
                this.id = id;
            },
            url() {
                return API_URL + 'analyses/' + this.id + '/taxonomy/overview';
            },
            parse(response) {
                return response.data;
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

        const KeggModule = GenericAnalysisResult.extend({
            url() {
                return API_URL + 'analyses/' + this.id + '/kegg-modules';
            }
        });

        const KeggOrtholog = GenericAnalysisResult.extend({
            url() {
                return API_URL + 'analyses/' + this.id + '/kegg-orthologs';
            }
        });

        const GenomeProperties = GenericAnalysisResult.extend({
            url() {
                return API_URL + 'analyses/' + this.id + '/genome-properties';
            }
        });

        const AntiSMASHGeneCluster = GenericAnalysisResult.extend({
            url() {
                return API_URL + 'analyses/' + this.id + '/antismash-gene-clusters';
            }
        });

        const Pfam = GenericAnalysisResult.extend({
            url() {
                return API_URL + 'analyses/' + this.id + '/pfam-entries';
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
            },
            load(data) {
                this.attributes.downloadGroups = clusterAnalysisDownloads(data);
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

        const Genome = Backbone.Model.extend({
            url() {
                return API_URL + 'genomes/' + this.id;
            },
            parse(d) {
                const data = d.data !== undefined ? d.data : d;
                const attr = data.attributes;
                const biome = util.getBiomeIconData(data.relationships.biome.data);
                const biomeName = data.relationships.biome.data.id;
                return {
                    accession: attr['accession'],
                    ena_genome_accession: attr['ena-genome-accession'],
                    ena_sample_accession: attr['ena-sample-accession'],
                    ena_study_accession: attr['ena-study-accession'],
                    ena_genome_url: ENA_VIEW_URL + attr['ena-genome-accession'],
                    ena_sample_url: ENA_VIEW_URL + attr['ena-sample-accession'],
                    ena_study_url: ENA_VIEW_URL + attr['ena-study-accession'],

                    img_genome_accession: attr['igm-genome-accession'],
                    img_genome_url: IMG_URL + attr['igm-genome-accession'],

                    ncbi_genome_accession: attr['ncbi-genome-accession'],
                    ncbi_genome_url: NCBI_ASSEMBLY_URL + attr['ncbi-genome-accession'],

                    ncbi_sample_accession: attr['ncbi-sample-accession'],
                    ncbi_sample_url: NCBI_SAMPLE_URL + attr['ncbi-sample-accession'],

                    ncbi_study_accession: attr['ncbi-study-accession'],
                    ncbi_study_url: NCBI_PROJECT_URL + attr['ncbi-study-accession'],

                    patric_genome_accession: attr['patric-genome-accession'],
                    patric_url: PATRIC_URL + attr['patric-genome-accession'],

                    taxon_lineage: attr['taxon-lineage'],
                    biome: biome,
                    biome_icon: util.getBiomeIcon(biomeName),
                    biome_name: util.formatLineage(biomeName, true),

                    geographic_origin: attr['geographic-origin'],
                    geographic_range: attr['geographic-range'],

                    completeness: attr['completeness'],
                    contamination: attr['contamination'],
                    length: attr['length'],
                    num_contigs: attr['num-contigs'],
                    n_50: attr['n-50'],
                    gc_content: attr['gc-content'],
                    type: attr['type'],
                    rna_5s: attr['rna-5s'],
                    rna_16s: attr['rna-16s'],
                    rna_23s: attr['rna-23s'],
                    trnas: attr['trnas'],
                    nc_rnas: attr['nc-rnas'],
                    num_proteins: attr['num-proteins'],
                    eggnog_cov: attr['eggnog-coverage'],
                    ipr_cov: attr['ipr-coverage'],
                    num_genomes_total: attr['num-genomes-total'],
                    num_genomes_nr: attr['num-genomes-non-redundant'],

                    pangenome_size: attr['pangenome-size'],
                    pangenome_core_size: attr['pangenome-core-size'],
                    pangenome_accessory_size: attr['pangenome-accessory-size'],
                    pangenome_eggnog_cov: attr['pangenome-eggnog-coverage'],
                    pangenome_ipr_cov: attr['pangenome-ipr-coverage'],

                    last_updated: util.formatDate(attr['last-update']),
                    first_created: util.formatDate(attr['first-created']),
                    genome_url: subfolder + '/genomes/' + attr['accession']
                };
            }
        });

        const GenomesCollection = Backbone.Collection.extend({
            url: API_URL + 'genomes',
            model: Genome,
            parse(response) {
                return response.data;
            }
        });

        const Release = Backbone.Model.extend({
            url() {
                return API_URL + 'release/' + this.id;
            },
            parse(response) {
                const attr = response.attributes;
                return {
                    version: attr['version'],
                    last_updated: util.formatDate(attr['last-update']),
                    first_created: util.formatDate(attr['first-created']),
                    num_genomes: attr['genome-count']
                };
            }
        });
        const Releases = Backbone.Collection.extend({
            url: API_URL + 'release',
            model: Release,
            parse(response) {
                return response.data;
            }
        });

        const ReleaseGenomes = GenomesCollection.extend({
            url() {
                return API_URL + 'release/' + this.id + '/genomes';
            }
        });

        const GenomeDownloads = Backbone.Model.extend({
            url() {
                return API_URL + 'genomes/' + this.id + '/downloads';
            },
            parse(response) {
                this.attributes.genomeFiles = clusterAnalysisDownloads(response.data);
            }
        });

        const GenomeDatasetCollection = Backbone.Collection.extend({
            initialize(params) {
                this.id = params['id'];
                this.pangenome = params['pangenome'];
            },
            fetch() {
                const that = this;
                let reqData = {'page_size': 100};
                if (this.pangenome) {
                    reqData['pangenome'] = this.pangenome;
                }
                return multiPageFetch(this, reqData).done((data) => {
                    return that.parse(data);
                });
            }
        });
        const GenomeKeggClasses = GenomeDatasetCollection.extend({
            url() {
                return API_URL + 'genomes/' + this.id + '/kegg-class';
            },

            parse(data) {
                data = data.map(function(kegg) {
                    return kegg['attributes'];
                });
                this.data = data;
                return data;
            }
        });
        const GenomeKeggModules = GenomeDatasetCollection.extend({
            url() {
                return API_URL + 'genomes/' + this.id + '/kegg-module';
            },

            parse(data) {
                data = data.map(function(kegg) {
                    return kegg['attributes'];
                });
                this.data = data;
                return data;
            }
        });
        const GenomeCogs = GenomeDatasetCollection.extend({
            url() {
                return API_URL + 'genomes/' + this.id + '/cogs';
            },
            parse(data) {
                data = data.map(function(cog) {
                    return cog.attributes;
                });
                this.data = data;
                return data;
            }
        });

        const GenomeSet = Backbone.Model.extend({
            url() {
                return API_URL + 'genomeset/' + this.id;
            },
            parse(response) {
                return response.attributes;
            }
        });
        const GenomeSets = Backbone.Collection.extend({
            url: API_URL + 'genomeset',
            model: GenomeSet,
            parse(response) {
                return response.data;
            }
        });

        const ReleaseDownloads = Backbone.Model.extend({
            url() {
                return API_URL + 'release/' + this.id + '/downloads';
            },
            parse(response) {
                this.attributes.files = clusterAnalysisDownloads(response.data);
            }
        });

        return {
            API_URL,
            SuperStudy,
            SuperStudiesCollection,
            SuperStudyFlagshipStudiesCollection,
            SuperStudyRelatedStudiesCollection,
            Study,
            StudiesCollection,
            SampleStudiesCollection,
            Run,
            Assembly,
            RunsCollection,
            AssembliesCollection,
            AssemblyAnalyses,
            Biome,
            BiomeCollection,
            BiomeWithChildren,
            Sample,
            SamplesCollection,
            GenericAnalysisResult,
            getKronaURL,
            Analysis,
            AnalysesContig,
            ContigCollection,
            RunAnalyses,
            RunAssemblies,
            StudyAnalyses,
            Taxonomy,
            TaxonomyOverview,
            InterproIden,
            GoSlim,
            KeggModule,
            KeggOrtholog,
            Pfam,
            GenomeProperties,
            AntiSMASHGeneCluster,
            StudyDownloads,
            AnalysisDownloads,
            StudyGeoCoordinates,
            QcChartData,
            QcChartStats,
            Publication,
            PublicationsCollection,
            PublicationStudies,
            Genome,
            GenomesCollection,
            GenomeDownloads,
            GenomeKeggClasses,
            GenomeKeggModules,
            GenomeCogs,
            Release,
            Releases,
            ReleaseGenomes,
            GenomeSet,
            GenomeSets,
            ReleaseDownloads
        };
    };
    return init;
});
