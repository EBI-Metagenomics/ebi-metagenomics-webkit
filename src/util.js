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

    return {
        TAXONOMY_COLOURS,
        lineageToBiome,
        formatDate,
        formatLineage,
        simplifyBiomeIcons,
        getBiomeIconData,
        getBiomeIcon,
        groupTaxonomyData,
        groupAfterN,
        sumData
    };
});
