const Backbone = require('backbone');
export const API_URL = process.env.API_URL;
const NO_DATA_MSG = 'N/A';
const util = require('./util');
const _ = require('underscore');

const ENA_VIEW_URL = 'https://www.ebi.ac.uk/ena/data/view/';
const EUROPE_PMC_ENTRY_URL = 'https://europepmc.org/abstract/MED/';
const DX_DOI_URL = 'http://dx.doi.org/';
const EBI_BIOSAMPLE_URL = 'https://www.ebi.ac.uk/biosamples/';

// Model for an individual study
export const Study = Backbone.Model.extend({
    url() {
        return API_URL + 'studies/' + this.id;
    },
    parse(d) {
        const data = d.data !== undefined ? d.data : d;
        const attr = data.attributes;
        const biomes = util.simplifyBiomeIcons(
            data.relationships.biomes.data.map(util.getBiomeIconData));
        let relatedStudies;
        if (data.relationships.hasOwnProperty('studies')) {
            relatedStudies = data.relationships.studies.data;
            for (let i in relatedStudies) {
                if (Object.prototype.hasOwnProperty.call(relatedStudies, i)) {
                    relatedStudies[i].study_link = util.subfolder + '/studies/' +
                        relatedStudies[i].id;
                }
            }
        } else {
            relatedStudies = [];
        }
        return {
            bioproject: attr['bioproject'],
            biomes: biomes,
            study_link: util.subfolder + '/studies/' + attr['accession'],
            samples_link: util.subfolder + '/studies/' + attr['accession'] + '#samples-section',
            study_name: attr['study-name'],
            samples_count: attr['samples-count'],
            study_id: data.id,
            study_accession: attr['secondary-accession'],
            last_update: util.formatDate(attr['last-update']),
            abstract: attr['study-abstract'],
            ena_url: ENA_VIEW_URL + attr['secondary-accession'],
            related_studies: relatedStudies
        };
    }
});

// Model for a collection of studies,
export const StudiesCollection = Backbone.Collection.extend({
    url: API_URL + 'studies',
    model: Study,
    initialize(params, url) {
        if (url) {
            this.url = url;
        }
        if (params) {
            this.params = params;
        }
    },
    parse(response) {
        return response.data;
    }
});

export const Run = Backbone.Model.extend({
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
            run_id: attr['accession'],
            ena_url: ENA_VIEW_URL + attr['accession'],
            sample_id: sampleId,
            sample_url: util.subfolder + '/samples/' + sampleId,
            analysis_url: util.subfolder + '/runs/' + attr.accession,
            experiment_type: attr['experiment-type'],
            instrument_model: attr['instrument-model'],
            instrument_platform: attr['instrument-platform'],
            pipeline_versions: pipelines.data.map(function(x) {
                return x.id;
            }),
            analysis_results: 'TAXONOMIC / FUNCTION / DOWNLOAD',
            study_id: studyId,
            study_url: util.subfolder + '/studies/' + studyId
        };
    }
});

/**
 * Generate Krona URL
 * @param {string} analysisID ENA Run primary accession
 * @param {string} ssuOrLsu subunit type (for pipeline version 4.0 and above)
 * @return {string} url
 */
export function getKronaURL(analysisID, ssuOrLsu) {
    return API_URL + 'analyses/' + analysisID + '/krona' + ssuOrLsu;
}

export const RunsCollection = Backbone.Collection.extend({
    url: API_URL + 'runs',
    model: Run,
    initialize(data) {
        // Project/sample ID
        // if (data.hasOwnProperty(('study_accession'))) {
        //     this.study_accession = data.study_accession;
        // }
        // // Sample ID
        // if (data.hasOwnProperty(('sample_accession'))) {
        //     this.sample_accession = data.sample_accession;
        // }
        this.params = data;
    },
    parse(response) {
        return response.data;
    }
});

export const Biome = Backbone.Model.extend({
    url() {
        let base = API_URL + 'biomes';
        if (this.isNew()) {
            base += (base.charAt(base.length - 1) === '/' ? '' : '/') + this.lineage;
        }
        return base;
    },
    initialize(data) {
        this.lineage = data['lineage'];
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
            biome_studies_link: util.subfolder + '/browse?lineage=' + lineage + '#studies'
        };
    }
});

export const BiomeCollection = Backbone.Collection.extend({
    model: Biome,
    url: API_URL + 'biomes',
    parse(response) {
        return response.data;
    }
});

export const BiomeWithChildren = Backbone.Collection.extend({
    model: Biome,
    url() {
        return API_URL + 'biomes/' + this.rootLineage + '/children';
    },
    initialize(data) {
        if (data) {
            this.rootLineage = data['rootLineage'];
        } else {
            this.rootLineage = 'root';
        }
    },
    fetchWithRoot() {
        const that = this;
        let rootBiome = new Biome({lineage: this.rootLineage});
        const deferred = $.Deferred();
        rootBiome.fetch({
            success(rootData) {
                let baseDepth = (rootData.attributes.lineage.match(/:/g) || []).length;
                that.fetch({
                    data: $.param({
                        depth_gte: baseDepth + 1,
                        depth_lte: baseDepth + 3,
                        page_size: 100
                    }),
                    success(data) {
                        deferred.resolve(data);
                    }
                });
            }
        });
        return deferred;
    },
    parse(response) {
        return response.data;
    }
});

export const Sample = Backbone.Model.extend({
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
                value: el.value
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
            sample_url: util.subfolder + '/samples/' + attr['accession'],
            ena_url: ENA_VIEW_URL + attr['accession'],
            sample_accession: attr['accession'] || NO_DATA_MSG,
            lineage: util.formatLineage(data.relationships.biome.data.id || NO_DATA_MSG, true),
            metadatas: metadatas,
            runs: d.included,
            last_update: util.formatDate(attr['last-update']),
            latitude: attr.latitude,
            longitude: attr.longitude
        };
    }
});

export const SamplesCollection = Backbone.Collection.extend({
    url: API_URL + 'samples',
    model: Sample,
    initialize(data) {
        this.params = data || {};
    },
    parse(response) {
        return response.data;
    }
});

export const RunPipelineObject = Backbone.Model.extend({
    initialize(params) {
        this.id = params.id;
        this.version = params.version;
        if (params.hasOwnProperty('type')) {
            this.type = params.type;
        }
    }
});

export const Analysis = Backbone.Model.extend({
    url() {
        return API_URL + 'analyses/' + this.id;
    },
    parse(d) {
        const data = d.data !== undefined ? d.data : d;
        const attr = data.attributes;
        let studyID;
        if (data.relationships.hasOwnProperty('study')) {
            studyID = data.relationships.study.data.id;
        } else {
            studyID = null;
        }
        let sampleID;
        if (data.relationships.hasOwnProperty('sample')) {
            sampleID = data.relationships.sample.data.id;
        } else {
            sampleID = null;
        }
        let runID;
        if (data.relationships.hasOwnProperty('run')) {
            runID = data.relationships.run.data.id;
        } else {
            runID = null;
        }
        attr['analysis-summary'] = _.reduce(attr['analysis-summary'], function(obj, e) {
            obj[e['key']] = e['value'];
            return obj;
        }, {});
        return {
            study_accession: studyID,
            study_url: util.subfolder + '/studies/' + studyID,
            sample_accession: sampleID,
            sample_url: util.subfolder + '/samples/' + sampleID,
            run_accession: runID,
            run_url: util.subfolder +
            (attr['experiment_type'] === 'assembly' ? '/assemblies/' : '/runs/') + runID,
            analysis_accession: data['id'],
            analysis_url: util.subfolder + '/analyses/' + d['id'],
            experiment_type: attr['experiment-type'],
            analysis_summary: attr['analysis-summary'],
            complete_time: attr['complete-time'],
            instrument_model: attr['instrument-model'],
            instrument_platform: attr['instrument-platform'],
            pipeline_version: attr['pipeline-version'],
            download: attr['download']
        };
    }
});

export const RunAnalyses = Backbone.Collection.extend({
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

export const RunAssemblies = Backbone.Collection.extend({
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

// Retrieve analyses of a study
export const StudyAnalyses = Backbone.Collection.extend({
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
        if (this.assemblies === 'only') {
            analyses = _.filter(analyses, (analysis) => {
                return analysis['experiment_type'] === 'assembly';
            });
        } else if (this.assemblies === 'exclude') {
            analyses = _.filter(analyses, (analysis) => {
                return analysis['experiment_type'] !== 'assembly';
            });
        }
        return analyses;
    }
});

// Retrieve assemblies of a study
export const StudyAssemblies = Backbone.Collection.extend({
    initialize(data) {
        this.id = data.id;
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
        analyses = _.filter(analyses, (analysis) => {
            return analysis['experiment_type'] === 'assembly';
        });
        return analyses;
    }
});

/**
 * Raw jQuery method used when complete set of paginated data is required
 * @return {Promise}
 */
function multiPageFetch(that) {
    const deferred = $.Deferred();
    let data = [];
    $.get({
        url: that.url(),
        success(response) {
            data = data.concat(response.data);
            const numPages = response.meta.pagination.pages;
            if (numPages > 1) {
                let requests = [];
                for (let x = 2; x <= numPages; x++) {
                    requests.push($.get(that.url() + '?page=' + x));
                }
                $.when(...requests).done(function() {
                    _.each(requests, function(response) {
                        if (response.responseJSON === undefined ||
                            response.responseJSON.data === undefined) {
                        } else {
                            data = data.concat(response.responseJSON.data);
                        }
                    });
                    deferred.resolve(data);
                });
            } else {
                deferred.resolve(data);
            }
        }
    });
    return deferred.promise();
}

export const Taxonomy = RunPipelineObject.extend({
    url() {
        return API_URL + 'analyses/' + this.id + '/taxonomy' + this.type;
    },
    fetch() {
        return multiPageFetch(this);
    }
});

export const InterproIden = RunPipelineObject.extend({
    url() {
        return API_URL + 'analyses/' + this.id + '/interpro-identifiers';
    },
    fetch() {
        return multiPageFetch(this);
    }
});

export const GoSlim = RunPipelineObject.extend({
    url() {
        return API_URL + 'analyses/' + this.id + '/go-slim';
    }
});

export const Publication = Backbone.Model.extend({
    parse(d) {
        const data = d.data !== undefined ? d.data : d;
        const attrs = data.attributes;
        let authors = attrs['authors'];
        if (authors.length > 50) {
            authors = authors.split(',').slice(0, 5);
            authors.push(' et al.');
            authors = authors.join(',');
        }
        return {
            pubmed_id: attrs['pubmed-id'],
            title: attrs['pub-title'],
            authors: authors,
            doi: attrs['doi'],
            pmc_url: EUROPE_PMC_ENTRY_URL + attrs['pubmed-id'],
            doi_url: DX_DOI_URL + attrs['doi'],
            year: attrs['published-year'],
            volume: attrs['volume']
        };
    }
});

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
        let grouped = false;
        _.each(groups[group], function(d) {
            const groupLabel = d.attributes.description.label;
            const groupFormat = d.attributes['file-format']['name'];
            if (groupLabel === label && groupFormat === format) {
                d.attributes.links = d.attributes.links.concat(download.links.self);
                if (attr['file-format']['compression']) {
                    d.attributes['file-format']['compExtension'] = attr.alias.split('.').slice(-1);
                }
                grouped = true;
            }
        });
        if (!grouped) {
            groups[group] = groups[group].concat(download);
        }
    });

    return groups;
}

export const StudyDownloads = Backbone.Model.extend({
    url() {
        return API_URL + 'studies/' + this.id + '/downloads';
    },
    parse(response) {
        this.attributes.pipelineFiles = clusterStudyDownloads(response.data);
    }
});

export const AnalysisDownloads = Backbone.Model.extend({
    url() {
        return API_URL + 'analyses/' + this.id + '/downloads';
    },
    parse(response) {
        this.attributes.downloadGroups = clusterAnalysisDownloads(response.data);
    }
});

export const StudyGeoCoordinates = Backbone.Model.extend({
    url() {
        return API_URL + 'studies/' + this.attributes.study_accession +
            '/geocoordinates?page_size=500';
    }
});

export const QcChartData = Backbone.Model.extend({
    initialize(data) {
        this.id = data.id;
        this.type = data.type;
    },
    url() {
        return API_URL + 'analyses/' + this.id + '/' + this.type;
    }
});

export const QcChartStats = QcChartData.extend({
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