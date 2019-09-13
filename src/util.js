const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

define(['underscore'], function(_) {

    const TAXONOMY_COLOURS = [
        '#058dc7',
        '#82d23d',
        '#e26736',
        '#fbe300',
        '#24cbe5',
        '#c49ecc',
        '#ffc08a',
        '#708090',
        '#6af9c4',
        '#caae74',
        '#cccccc'
    ];

    /**
     * Get sum of property values in array
     * @param {[object]} arr array of objects
     * @param {string} prop property to sum over
     * @return {number} sum of property vlaues in array
     */
    function sumProp(arr, prop) {
        let total = 0;
        for (let i = 0, _len = arr.length; i < _len; i++) {
            total += arr[i][prop];
        }
        return total;
    }

    /**
     * Retrieve biome from lineage
     * @param {string} lineage
     * @return {string}
     */
    function lineageToBiome(lineage) {
        return lineage.split(':').splice(-1);
    }

    /**
     * Format datestr for readability
     * @param {string} dateStr
     * @return {string}
     */
    function formatDate(dateStr) {
        let d = new Date(dateStr);
        return d.getDate() + '-' + MONTHS[d.getMonth()] + '-' + d.getFullYear();
    }

    /**
     * Format lineage by removing root and replacing ':' with '>'
     * @param {string} lineage
     * @param {boolean} removeRoot
     * @return {string}
     */
    function formatLineage(lineage, removeRoot) {
        let splitLineage = lineage.split(':');
        if (removeRoot) {
            splitLineage = splitLineage.slice(1);
        }
        return splitLineage.join(' > ');
    }

    /**
     * Simplify a list of biomes by grouping them by biome icon
     * @param {[object]} biomes list of biomes
     * @return {[object]} list of biomes grouped by biome icon
     */
    function simplifyBiomeIcons(biomes) {
        const groupedBiomes = {};
        biomes.forEach(function(b) {
            if (groupedBiomes.hasOwnProperty(b.icon)) {
                groupedBiomes[b.icon].push(b.name);
            } else {
                groupedBiomes[b.icon] = [b.name];
            }
        });
        const icons = [];
        Object.keys(groupedBiomes).forEach(function(biomeIcon) {
            const biomes = groupedBiomes[biomeIcon].sort().join(', ');
            icons.push({name: biomes, icon: biomeIcon});
        });
        return icons;
    }

    /**
     * Retrieve icon and name from biome object
     * @param {object} biomeData
     * @return {{name: string, icon}}
     */
    function getBiomeIconData(biomeData) {
        const name = biomeData.id;
        return {name: formatLineage(name, true), icon: getBiomeIcon(name)};
    }

    const biomeIconMapD2 = {
        'root:engineered': 'engineered_b'
    };
    const biomeIconMapD3 = {
        'root:engineered:wastewater': 'wastewater_b',
        'root:environmental:air': 'air_b',
        'root:host-associated:amphibia': 'amphibian_b',
        'root:host-associated:arthropoda': 'arthropoda_b',
        'root:host-associated:fish': 'fish_b',
        'root:host-associated:human': 'human_host_b',
        'root:host-associated:insecta': 'insect_b',
        'root:host-associated:mammals': 'mammals_b',
        'root:host-associated:mollusca': 'mollusca_b',
        'root:host-associated:plants': 'plant_host_b',
        'root:host-associated:porifera': 'porifera_b'

    };
    const biomeIconMapD4 = {
        'root:environmental:aquatic:freshwater': 'freshwater_b',
        'root:environmental:aquatic:marine': 'marine_b',
        'root:environmental:aquatic:thermal springs': 'hotspring_b',
        'root:environmental:terrestrial:soil': 'soil_b',
        'root:environmental:terrestrial:volcanic': 'vulcano_b',
        'root:host-associated:human:digestive system': 'human_gut_b',
        'root:host-associated:human:skin': 'skin_b'
    };

    const biomeIconMapD5 = {
        'root:environmental:aquatic:freshwater:drinking water': 'drinking_water_b',
        'root:environmental:aquatic:freshwater:groundwater': 'groundwater_b',
        'root:environmental:aquatic:freshwater:ice': 'ice_b',
        'root:environmental:aquatic:freshwater:lake': 'lake_b',
        'root:environmental:aquatic:freshwater:lotic': 'river_b',
        'root:environmental:aquatic:marine:hydrothermal vents': 'hydrothermal_vents_b',
        'root:environmental:terrestrial:soil:wetlands': 'wetlands_b',
        'root:host-associated:human:digestive system:oral': 'mouth_b',
        'root:host-associated:human:respiratory system:pulmonary system': 'lung_b',
        'root:host-associated:mammals:nervous system:brain': 'brain_b'
    };

    const biomeIconMapD6 = {
        'root:environmental:aquatic:freshwater:groundwater:cave water': 'cave_b',
        'root:environmental:aquatic:freshwater:ice:glacier': 'glacier_b',
        'root:environmental:terrestrial:soil:grasslands': 'grassland_b',
        'root:environmental:terrestrial:soil:loam:forest soil': 'forest_b',
        'root:environmental:terrestrial:soil:sand:desert': 'desert_b'
    };

    /**
     * Retrieve biome icon for a lineage
     * @param {string} lineage
     * @return {string} css class for biome
     */
    function getBiomeIcon(lineage) {
        const lineageList = lineage.split(':').map(function(x) {
            return x.toLowerCase();
        });

        const lineageD2 = lineageList.slice(0, 2).join(':');
        const lineageD3 = lineageList.slice(0, 3).join(':');
        const lineageD4 = lineageList.slice(0, 4).join(':');
        const lineageD5 = lineageList.slice(0, 5).join(':');
        const lineageD6 = lineageList.slice(0, 6).join(':');

        return biomeIconMapD6[lineageD6] || biomeIconMapD5[lineageD5] ||
            biomeIconMapD4[lineageD4] ||
            biomeIconMapD3[lineageD3] || biomeIconMapD2[lineageD2] || (function() {
                console.debug('Could not match lineage "' + lineage + '" with any biome icons');
                return 'default_b';
            }());
    }

    /**
     * Cluster data by depth
     * @param {[*]} data
     * @param {number} depth
     * @return {[*]}≈
     */
    function clusterData(data, depth) {
        let clusteredData = {};
        _.each(data, function(d) {
            const attr = d.attributes;
            let lineage = attr.lineage.split(':');
            // Remove empty strings
            let category;
            if (lineage.length < depth) {
                category = lineage[lineage.length - 1];
            } else {
                category = lineage[depth];
            }

            if (depth > 0 &&
                ['', 'Bacteria', 'Eukaryota', 'other_sequences', undefined].indexOf(category) >
                -1) {
                if (lineage[0] === 'Bacteria') {
                    category = 'Unassigned Bacteria';
                } else {
                    category = 'Unassigned';
                }
            }
            if (lineage[0] === 'Unusigned' && lineage.length === 1) {
                category = 'Unassigned';
            }

            let val = attr.count;
            if (clusteredData.hasOwnProperty(category)) {
                clusteredData[category]['v'] += val;
            } else {
                clusteredData[category] = {
                    v: val,
                    l: lineage
                };
            }
        });
        clusteredData = _.map(clusteredData, function(values, k) {
            return {
                name: k,
                y: values.v,
                lineage: values.l
            };
        });
        return clusteredData;
    }

    /**
     * Group taxonomy data by lineage at depth and sort by decreasing value
     * @param {[object]} data
     * @param {int} depth of lineage at which to group data
     * @return {[object]} sorted list of data grouped and summed by lineage
     */
    function groupTaxonomyData(data, depth) {
        return _.sortBy(clusterData(data, depth), function(o) {
            return o.y;
        }).reverse();
    }

    /**
     * Group all data after index n into single category
     * @param {[*]} clusteredData
     * @param {number} n index after which to group data
     * @return {[*]} grouped data
     */
    function groupAfterN(clusteredData, n) {
        if (clusteredData.length > n) {
            const top10 = clusteredData.slice(0, n);
            const others = {
                name: 'Other',
                lineage: [],
                y: 0
            };
            _.each(clusteredData.slice(n, clusteredData.length), function(d) {
                others.y += d.y;
                if (others.lineage.indexOf(d.lineage[0]) === -1) {
                    others.lineage.push(d.lineage[0]);
                }
            });
            others.lineage = others.lineage.join(', ');
            top10.push(others);
            clusteredData = top10;
        }
        return clusteredData;
    }

    /**
     * Sum data by parameter
     * @param {[object]} data
     * @return {number} sum of parameters y in array
     */
    function sumData(data) {
        let sum = 0;
        data.forEach(function(e) {
            sum += e.y;
        });
        return sum;
    }

    /**
     * Generate button menu for chart downloads
     * @param {string} urlToFile
     * @param {string} content
     * @return {object}
     */
    function getExportingStructure(urlToFile, content) {
        return {
            buttons: {
                contextButton: {
                    menuItems: [
                        {
                            text: 'Download data',
                            onclick: function() {
                                if (typeof content === 'undefined') {
                                    window.location = urlToFile;
                                } else {
                                    let element = document.createElement('a');
                                    element.setAttribute('href', 'data:text/plain;charset=utf-8,' +
                                        encodeURIComponent(content));
                                    element.setAttribute('download', urlToFile);

                                    element.style.display = 'none';
                                    document.body.appendChild(element);

                                    element.click();

                                    document.body.removeChild(element);
                                }
                            }
                        }, {
                            separator: true
                        }, {
                            textKey: 'printChart',
                            onclick: function() {
                                this.print();
                            }
                        }, {
                            separator: true
                        }, {
                            textKey: 'downloadPNG',
                            onclick: function() {
                                this.exportChart({
                                    width: 1200,
                                    filename: 'sq_sum_bar_chart'
                                    // externalRunId need to be added to the model -
                                    // NOTE the name is common between QC and Functional
                                });
                            }
                        }, {
                            textKey: 'downloadJPEG',
                            onclick: function() {
                                this.exportChart({
                                    width: 1200,
                                    filename: 'sq_sum_bar_chart',
                                    // externalRunId need to be added to the model -
                                    // NOTE the name is common between QC and Functional
                                    type: 'image/jpeg'
                                });
                            }
                        }, {
                            textKey: 'downloadPDF',
                            onclick: function() {
                                this.exportChart({
                                    filename: 'sq_sum_bar_chart',
                                    // externalRunId need to be added to the model -
                                    // NOTE the name is common between QC and Functional
                                    type: 'application/pdf'
                                });
                            }
                        }, {
                            textKey: 'downloadSVG',
                            onclick: function() {
                                this.exportChart({
                                    filename: 'sq_sum_bar_chart',
                                    // externalRunId need to be added to the model -
                                    // NOTE the name is common between QC and Functional
                                    type: 'image/svg+xml'
                                });
                            }
                        }]
                }
            }
        };
    }

    /**
     * Convert a two-column tab-seperated-value string into dictionary
     * @param {string} str representing tab seperated values
     * @return {object}
     */
    function tsv2dict(str) {
        return str.split('\n').reduce((map, row) => {
            row = row.split('\t');
            if (row[0].length > 0) {
                map[row[0]] = parseFloat(row[1]);
            }
            return map;
        }, {});
    }

    /**
     * Retrieve model url from Backbone model
     * @return {string}
     */
    function getModelUrl() {
        let urlToFile;
        if (typeof this.model !== 'undefined') {
            if (typeof this.model.url === 'function') {
                urlToFile = this.model.url();
            } else {
                urlToFile = this.model.url;
            }
        } else {
            urlToFile = '';
        }
        return urlToFile;
    }

    /**
     * Extend reference array of colours such that last colour is duplicated for
     * additional data point
     * @param {[string]} colours
     * @param {[*]} data
     * @return {[string]} of colours with length === length of data
     */
    function duplicateLastColor(colours, data) {
        let newColours = [];
        let i = 0;
        while (i < data.length) {
            newColours.push(colours[Math.min(i, colours.length - 1)]);
            i++;
        }
        return newColours;
    }

    /**
     * Capitalises a string
     * @param {string} str to capitalise
     * @return {string} capitalised str
     */
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // function hasCategory(dataset, category) {
    //     for (let d of dataset) {
    //         if (d.name === category) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }
    //
    // function sortByName(a, b) {
    //     return a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
    // }
    //
    // function sortByCount(a, b){
    //     return a.count < b.count ? -1 : (a.count > b.count ? 1 : 0);
    // }
    //
    // function addMissingCategories(genome, pangenome) {
    //     let newGenome = [];
    //     let newPangenome = [];
    //     for (let d of genome) {
    //         if (!hasCategory(pangenome, d.name)) {
    //             let d2 = d;
    //             d2['count'] = 0;
    //             d2['pangenome'] = true;
    //             newPangenome.push(d2);
    //         }
    //         newGenome.push(d);
    //     }
    //
    //     for (let d of pangenome) {
    //         if (!hasCategory(newGenome, d.name)) {
    //             let d2 = d;
    //             d2['count'] = 0;
    //             d2['pangenome'] = false;
    //             newGenome.push(d2);
    //         }
    //         newPangenome.push(d);
    //     }
    //     newGenome = newGenome.sort(sortByCount).reverse();
    //     const order = newGenome.map((o) => {return o.name});
    //     newPangenome = newPangenome.sort((a, b) => {
    //         const ai = order.indexOf(a.name);
    //         const bi = order.indexOf(b.name);
    //         return ai < bi ? -1 : (ai > bi ? 1 : 0);
    //     });
    //     return {
    //         'genome': newGenome,
    //         'pangenome': newPangenome
    //     };
    // }
    //
    // function splitPangenomeData(data) {
    //     const genome = [];
    //     const pangenome = [];
    //     for (let d of data) {
    //         if (d.pangenome) {
    //             pangenome.push(d);
    //         } else {
    //             genome.push(d);
    //         }
    //     }
    //     return addMissingCategories(genome, pangenome);
    // }

    return {
        TAXONOMY_COLOURS,
        sumProp,
        lineageToBiome,
        formatDate,
        formatLineage,
        simplifyBiomeIcons,
        getBiomeIconData,
        getBiomeIcon,
        groupTaxonomyData,
        groupAfterN,
        sumData,
        getExportingStructure,
        tsv2dict,
        getModelUrl,
        duplicateLastColor,
        capitalize
    };
});
