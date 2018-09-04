/*
-- Query: SELECT * FROM PIPELINE_RELEASE
LIMIT 0, 50000

-- Date: 2018-02-20 11:13
*/
INSERT INTO `PIPELINE_RELEASE` (`PIPELINE_ID`,`DESCRIPTION`,`CHANGES`,`RELEASE_VERSION`,`RELEASE_DATE`) VALUES (1,'Initial version','N/A','1.0','2009-12-09');
INSERT INTO `PIPELINE_RELEASE` (`PIPELINE_ID`,`DESCRIPTION`,`CHANGES`,`RELEASE_VERSION`,`RELEASE_DATE`) VALUES (2,NULL,'Major upgrade. Updated the following binaries: InterProScan, FragGeneScan, QIIME','2.0','2015-02-15');
INSERT INTO `PIPELINE_RELEASE` (`PIPELINE_ID`,`DESCRIPTION`,`CHANGES`,`RELEASE_VERSION`,`RELEASE_DATE`) VALUES (3,'Release of version 3.0','Major upgrade. Updated the following binaries: InterProScan, FragGeneScan, QIIME, Trimmomatic. Added new steps for producing quality control statistics and for tRNA selection.','3.0','2016-06-30');
INSERT INTO `PIPELINE_RELEASE` (`PIPELINE_ID`,`DESCRIPTION`,`CHANGES`,`RELEASE_VERSION`,`RELEASE_DATE`) VALUES (4,'Release of version 4.0','Major upgrade. rRNASelector, which was previously used to identify 16S rRNA genes by the pipeline, was replaced with Infernal using a library of competing ribosomal RNA hidden Markov models. This allows accurate identification of both large and small subunit ribosomal ribonucleic acid genes, including the eukaryotic 18S rRNA gene. The QIIME taxonomic classification component was replaced with MapSeq. , which provides fast and accurate classification of reads, and provides corresponding confidence scores for assignment at each taxonomic level. The Greengenes reference database was replaced with SILVA SSU / LSU version 128, enabling classification of eukaryotes, remapped to a 7-level taxonomy. Prodigal version 2.6.3 was added to run alongside FragGeneScan as part of a combined gene caller when processing assembled sequences. InterProScan was updated to version 5.25 (based on InterPro release 64.0).','4.0','2017-09-04');
INSERT INTO `PIPELINE_RELEASE` (`PIPELINE_ID`,`DESCRIPTION`,`CHANGES`,`RELEASE_VERSION`,`RELEASE_DATE`) VALUES (5,'Release of version 4.1','Minor upgrade. Upgraded SeqPrep to v1.2. Upgraded MAPseq to v1.2.2. Rebuilt taxonomic reference database based on SILVA v132. Taxonomic assignments now also available in HDF5 format.','4.1','2018-01-17');
