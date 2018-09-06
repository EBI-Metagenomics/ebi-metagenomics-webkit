define(['util'], function(apiUtil) {
    describe('Util tests', function() {
        context('simplifyBiomeIcons', function() {
            it('Should merge biomes with duplicate icons', function() {
                const biomes = [
                    {name: 'root:Engineered:Bioreactor', icon: 'engineered_b'},
                    {name: 'root:Engineered:Bioremediation', icon: 'engineered_b'}
                ];
                const simpleBiomes = apiUtil.simplifyBiomeIcons(biomes);
                expect(simpleBiomes.length).to.equal(1);
                expect(simpleBiomes[0]['name'].split(',').length).to.equal(2);
                expect(simpleBiomes[0]['icon']).to.equal('engineered_b');
            });
        });
        context('formatLineage', function() {
            it('Should remove root from lineage', function() {
                expect(apiUtil.formatLineage('root:Engineered:Bioreactor', true)).to
                    .equal('Engineered > Bioreactor');
            });
            it('Should keep root of lineage', function() {
                expect(apiUtil.formatLineage('root:Engineered:Bioreactor', false)).to
                    .equal('root > Engineered > Bioreactor');
            });
        });
    });
});
