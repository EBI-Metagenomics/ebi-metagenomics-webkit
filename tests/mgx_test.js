// define(['mgx'], function(mgx) {
//     context('Sequences', function() {
//         it('Should fetch sequence by ID', function(done) {
//             let sequence = new mgx.Sequence({id: 'ERR700144'});
//             sequence.fetch().done(() => {
//                 expect(sequence.models.length).to.equal(2);
//                 sequence.models.forEach((e) => {
//                     expect(e).to.have.all
//                         .keys('registryID', 'brokerID', 'sourceID', 'endPoint', 'status',
//                             'sequenceID', 'sequenceStatus', 'firstCreated', 'lastModified');
//                 });
//                 done();
//             });
//         });
//     });
// });
