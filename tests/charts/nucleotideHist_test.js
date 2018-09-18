define(['charts/nucleotideHist', 'api'], function(NucleotideHist, api) {
    const apiConfig = {
        API_URL: 'http://localhost:9000/metagenomics/api/v1/',
        SUBFOLDER: '/metagenomics'
    };
    api = api(apiConfig);
    const containerID = 'chart-container';

    describe('Nucleotide histogram charts', function() {
        context('Data source tests', function() {
            it('Should load histogram from raw data', function(done) {
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const data = 'pos\tN\tG\tC\tT\tA\n' +
                    '1\t0.0\t23.7\t29.48\t23.72\t23.1\n' +
                    '2\t0.0\t27.96\t20.64\t30.28\t21.12\n' +
                    '3\t0.0\t23.9\t22.24\t29.24\t24.61\n' +
                    '4\t0.0\t22.59\t20.05\t26.48\t30.89\n' +
                    '5\t0.0\t24.19\t19.32\t25.66\t30.83\n' +
                    '6\t0.0\t21.99\t20.7\t24.98\t32.33\n' +
                    '7\t0.0\t20.91\t21.67\t33.2\t24.22\n' +
                    '8\t0.0\t22.25\t23.28\t28.2\t26.27\n' +
                    '9\t0.0\t22.69\t24.01\t27.91\t25.39\n' +
                    '10\t0.0\t21.7\t19.51\t26.92\t31.88\n' +
                    '11\t0.0\t24.48\t23.08\t24.72\t27.72\n' +
                    '12\t0.0\t23.63\t23.86\t26.77\t25.74\n' +
                    '13\t0.0\t22.29\t21.75\t28.38\t27.58\n' +
                    '14\t0.0\t22.69\t21.07\t28.41\t27.82\n' +
                    '15\t0.0\t23.17\t21.46\t27.57\t27.8\n' +
                    '16\t0.0\t22.63\t21.5\t27.86\t28.01\n' +
                    '17\t0.0\t22.7\t21.6\t27.24\t28.45\n' +
                    '18\t0.0\t23.09\t21.53\t27.16\t28.22\n' +
                    '19\t0.0\t23.01\t21.51\t27.63\t27.85\n' +
                    '20\t0.0\t23.14\t21.79\t27.11\t27.96\n' +
                    '21\t0.0\t23.05\t21.81\t27.21\t27.93\n' +
                    '22\t0.0\t22.83\t21.64\t27.26\t28.27\n' +
                    '23\t0.0\t23.06\t21.37\t27.14\t28.43\n' +
                    '24\t0.0\t23.22\t21.05\t27.38\t28.36\n' +
                    '25\t0.0\t22.92\t21.47\t27.16\t28.45\n' +
                    '26\t0.0\t23.42\t20.92\t27.42\t28.24\n' +
                    '27\t0.0\t23.42\t21.15\t27.08\t28.35\n' +
                    '28\t0.0\t23.44\t21.17\t27.09\t28.3\n' +
                    '29\t0.0\t23.63\t20.94\t27.44\t28.0\n' +
                    '30\t0.0\t23.26\t21.33\t27.07\t28.34\n' +
                    '31\t0.0\t23.31\t21.06\t27.2\t28.43\n' +
                    '32\t0.0\t23.54\t21.02\t27.3\t28.13\n' +
                    '33\t0.0\t23.49\t21.19\t27.07\t28.25\n' +
                    '34\t0.0\t23.17\t20.97\t27.05\t28.81\n' +
                    '35\t0.0\t23.29\t20.98\t27.3\t28.43\n' +
                    '36\t0.0\t23.7\t20.91\t27.1\t28.29\n' +
                    '37\t0.0\t23.08\t21.26\t27.44\t28.22\n' +
                    '38\t0.0\t23.33\t21.25\t27.5\t27.92\n' +
                    '39\t0.0\t23.64\t21.01\t27.4\t27.95\n' +
                    '40\t0.0\t23.46\t21.02\t27.22\t28.3\n' +
                    '41\t0.0\t23.68\t20.86\t27.07\t28.39\n' +
                    '42\t0.0\t23.65\t21.15\t26.81\t28.39\n' +
                    '43\t0.0\t23.19\t21.25\t27.22\t28.34\n' +
                    '44\t0.0\t23.14\t21.11\t27.44\t28.32\n' +
                    '45\t0.0\t23.24\t21.05\t27.35\t28.37\n' +
                    '46\t0.0\t23.44\t21.16\t27.19\t28.21\n' +
                    '47\t0.0\t23.1\t21.14\t27.04\t28.72\n' +
                    '48\t0.0\t23.36\t21.25\t27.24\t28.15\n' +
                    '49\t0.0\t23.25\t21.52\t27.08\t28.15\n' +
                    '50\t0.0\t23.15\t21.2\t27.22\t28.44\n' +
                    '51\t0.0\t22.72\t21.37\t27.47\t28.43\n' +
                    '52\t0.0\t22.71\t21.48\t27.27\t28.54\n' +
                    '53\t0.01\t23.14\t21.13\t27.13\t28.6\n' +
                    '54\t0.0\t22.9\t21.55\t26.99\t28.56\n' +
                    '55\t0.0\t22.85\t21.33\t27.39\t28.43\n' +
                    '56\t0.0\t23.04\t21.29\t27.45\t28.23\n' +
                    '57\t0.0\t22.91\t21.5\t27.32\t28.27\n' +
                    '58\t0.0\t23.0\t21.47\t27.04\t28.49\n' +
                    '59\t0.0\t23.37\t21.34\t27.0\t28.3\n' +
                    '60\t0.0\t22.97\t21.33\t27.2\t28.5\n' +
                    '61\t0.0\t23.05\t21.47\t27.22\t28.25\n' +
                    '62\t0.0\t23.1\t21.42\t27.27\t28.2\n' +
                    '63\t0.0\t22.91\t21.21\t27.24\t28.63\n' +
                    '64\t0.0\t23.23\t21.23\t27.25\t28.28\n' +
                    '65\t0.0\t23.29\t21.33\t27.21\t28.18\n' +
                    '66\t0.0\t22.61\t21.49\t27.25\t28.64\n' +
                    '67\t0.0\t23.21\t21.35\t27.13\t28.31\n' +
                    '68\t0.0\t23.18\t21.35\t27.28\t28.19\n' +
                    '69\t0.0\t22.94\t21.34\t27.41\t28.31\n' +
                    '70\t0.0\t22.86\t21.61\t27.28\t28.25\n' +
                    '71\t0.0\t22.84\t21.19\t27.43\t28.54\n' +
                    '72\t0.0\t23.13\t21.18\t27.12\t28.57\n' +
                    '73\t0.0\t22.94\t21.14\t27.25\t28.67\n' +
                    '74\t0.0\t23.28\t21.07\t27.03\t28.62\n' +
                    '75\t0.0\t22.78\t21.51\t27.22\t28.49\n' +
                    '76\t0.21\t22.55\t21.27\t27.35\t28.63\n' +
                    '77\t0.0\t23.12\t21.31\t27.09\t28.49\n' +
                    '78\t0.0\t22.67\t21.31\t27.6\t28.41\n' +
                    '79\t0.0\t22.89\t21.18\t27.03\t28.9\n' +
                    '80\t0.0\t23.04\t21.37\t26.9\t28.68\n' +
                    '81\t0.0\t22.86\t21.14\t27.42\t28.58\n' +
                    '82\t0.0\t22.72\t21.41\t27.38\t28.5\n' +
                    '83\t0.0\t22.6\t21.68\t27.33\t28.38\n' +
                    '84\t0.0\t22.97\t21.35\t27.03\t28.65\n' +
                    '85\t0.0\t22.74\t21.46\t27.15\t28.65\n' +
                    '86\t0.0\t22.77\t21.26\t27.23\t28.74\n' +
                    '87\t0.0\t22.7\t21.3\t26.97\t29.03\n' +
                    '88\t0.0\t22.62\t21.43\t27.28\t28.67\n' +
                    '89\t0.0\t23.02\t21.36\t27.14\t28.47\n' +
                    '90\t0.0\t22.74\t21.59\t26.95\t28.73\n' +
                    '91\t0.0\t22.79\t21.48\t27.08\t28.65\n' +
                    '92\t0.0\t23.18\t21.37\t26.84\t28.61\n' +
                    '93\t0.0\t22.63\t21.35\t26.92\t29.09\n' +
                    '94\t0.0\t22.73\t21.31\t27.02\t28.94\n' +
                    '95\t0.0\t22.84\t21.54\t26.77\t28.85\n' +
                    '96\t0.0\t22.86\t21.27\t26.88\t28.99\n' +
                    '97\t0.0\t22.94\t21.41\t26.77\t28.88\n' +
                    '98\t0.0\t22.81\t21.45\t26.75\t28.99\n' +
                    '99\t0.0\t22.31\t21.52\t27.02\t29.15\n' +
                    '100\t0.0\t23.25\t21.76\t26.38\t28.61\n';

                const chart = new NucleotideHist(containerID, {data: data, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    expect($('#'+containerID).html()).to.contain('Nucleotide position histogram');
                    expect($('.highcharts-series').length).to.equal(5);
                    done();
                });
            });
            it('Should fetch data from MGnify api with accession', function(done) {
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = 'MGYA00141547';
                const chart = new NucleotideHist(containerID,
                    {accession: accession, apiConfig: apiConfig});
                chart.loaded.done(() => {
                    expect($('#'+containerID).html()).to.contain('Nucleotide position histogram');
                    expect($('.highcharts-series').length).to.equal(5);
                    done();
                });
            });
            it('Should display subtitle', function(done) {
                document.body.innerHTML = '<p></p>';
                document.body.innerHTML = ('<div id="' + containerID + '"></div>');
                const accession = 'MGYA00141547';
                const chart = new NucleotideHist(containerID,
                    {accession: accession, apiConfig: apiConfig}, {isFromSubset: true});
                chart.loaded.done(() => {
                    expect($('#'+containerID).html()).to.contain('A subset of the sequences');
                    done();
                });
            });
        });
    });
});
