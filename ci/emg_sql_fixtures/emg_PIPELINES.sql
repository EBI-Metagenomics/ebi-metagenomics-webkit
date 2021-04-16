-- MySQL dump 10.13  Distrib 5.7.28, for Linux (x86_64)
--
-- Host: mysql-vm-022.ebi.ac.uk    Database: emg
-- ------------------------------------------------------
-- Server version	5.6.36-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `PIPELINE_RELEASE`
--

DROP TABLE IF EXISTS `PIPELINE_RELEASE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PIPELINE_RELEASE` (
  `PIPELINE_ID` smallint(6) NOT NULL,
  `DESCRIPTION` text CHARACTER SET utf8,
  `CHANGES` text CHARACTER SET utf8 NOT NULL,
  `RELEASE_VERSION` varchar(20) CHARACTER SET utf8 NOT NULL,
  `RELEASE_DATE` date NOT NULL,
  PRIMARY KEY (`PIPELINE_ID`),
  UNIQUE KEY `PIPELINE_RELEASE_PIPELINE_ID_RELEASE_VERSION_d40fe384_uniq` (`PIPELINE_ID`,`RELEASE_VERSION`),
  FULLTEXT KEY `pipeline_description_ts_idx` (`DESCRIPTION`),
  FULLTEXT KEY `pipeline_changes_ts_idx` (`CHANGES`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
--
-- Table structure for table `PIPELINE_RELEASE_TOOL`
--

DROP TABLE IF EXISTS `PIPELINE_RELEASE_TOOL`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PIPELINE_RELEASE_TOOL` (
  `PIPELINE_ID` smallint(6) NOT NULL,
  `TOOL_ID` smallint(6) NOT NULL,
  `TOOL_GROUP_ID` decimal(6,3) NOT NULL,
  `HOW_TOOL_USED_DESC` longtext CHARACTER SET utf8,
  PRIMARY KEY (`PIPELINE_ID`,`TOOL_ID`),
  UNIQUE KEY `pipeline_tool_group_uqidx` (`PIPELINE_ID`,`TOOL_GROUP_ID`),
  UNIQUE KEY `PIPELINE_RELEASE_TOOL_PIPELINE_ID_TOOL_ID_8b32b863_uniq` (`PIPELINE_ID`,`TOOL_ID`),
  UNIQUE KEY `PIPELINE_RELEASE_TOOL_PIPELINE_ID_TOOL_GROUP_ID_d3d9c1b2_uniq` (`PIPELINE_ID`,`TOOL_GROUP_ID`),
  KEY `PIPELINE_RELEASE_TOOL_TOOL_ID_cf450cf4_fk_PIPELINE_TOOL_TOOL_ID` (`TOOL_ID`),
  CONSTRAINT `PIPELINE_RELEASE_TOOL_PIPELINE_ID_2804b066_fk` FOREIGN KEY (`PIPELINE_ID`) REFERENCES `PIPELINE_RELEASE` (`PIPELINE_ID`),
  CONSTRAINT `PIPELINE_RELEASE_TOOL_TOOL_ID_cf450cf4_fk_PIPELINE_TOOL_TOOL_ID` FOREIGN KEY (`TOOL_ID`) REFERENCES `PIPELINE_TOOL` (`TOOL_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PIPELINE_RELEASE_TOOL`
--

LOCK TABLES `PIPELINE_RELEASE_TOOL` WRITE;
/*!40000 ALTER TABLE `PIPELINE_RELEASE_TOOL` DISABLE KEYS */;
INSERT INTO `PIPELINE_RELEASE_TOOL` VALUES (1,1,1.100,'Low quality trimming (low quality ends and sequences with > 10% undetermined nucleotides removed).'),(1,2,3.000,'Reads with predicted coding sequences (pCDS) above 60 nucleotides in length.'),(1,3,4.000,'Matches are generated against predicted CDS, using a sub set of databases (Pfam, TIGRFAM, PRINTS, PROSITE patterns, Gene3d) from InterPro release 31.0. A summary of Gene Ontology (GO) terms derived from InterPro matches to your sample is provided. It is generated using a reduced list of GO terms called GO slim (version <a href=\"https://www.ebi.ac.uk/metagenomics/geneontology/subsets/goslim_metagenomics_may2012.obo\" class=\"ext\">goslim_goa 2012</a>).'),(1,4,1.300,'Duplicate sequences removed - clustered on 99% identity for LS454 or on 50 nucleotides prefix identity (using pick_otus.py script in Qiime v1.15).'),(1,5,1.400,'Repeat masked - removed reads with 50% or more nucleotides masked.'),(1,6,2.000,'Prokaryotic rRNA reads are filtered. We use the hidden Markov models to identify rRNA sequences.'),(1,7,5.000,'16s rRNA are annotated using the Greengenes reference database (default de novo OTU picking protocol with Greengenes 12.10 reference with reverse strand matching enabled).'),(1,8,1.200,'Sequences < 100 nucleotides in length removed.'),(2,1,1.100,'Low quality trimming (low quality ends and sequences with > 10% undetermined nucleotides removed).'),(2,2,3.000,'Reads with predicted coding sequences (pCDS) above 60 nucleotides in length.'),(2,9,2.000,'Prokaryotic rRNA reads are filtered. We use the hidden Markov models to identify rRNA sequences.'),(2,10,5.000,'16s rRNA are annotated using the Greengenes reference database (default closed-reference OTU picking protocol with Greengenes 13.8 reference with reverse strand matching enabled).'),(2,11,1.200,'Sequences < 100 nucleotides in length removed.'),(2,12,4.000,'Matches are generated against predicted CDS, using a sub set of databases (Pfam, TIGRFAM, PRINTS, PROSITE patterns, Gene3d) from InterPro release 31.0. A summary of Gene Ontology (GO) terms derived from InterPro matches to your sample is provided. It is generated using a reduced list of GO terms called GO slim (version <a href=\"https://www.ebi.ac.uk/metagenomics/geneontology/subsets/goslim_metagenomics_may2012.obo\" class=\"ext\">goslim_goa 2012</a>).'),(3,11,1.200,'Sequences < 100 nucleotides in length removed.'),(3,13,5.000,'16s rRNA are annotated using the Greengenes reference database (default closed-reference OTU picking protocol with Greengenes 13.8 reference with reverse strand matching enabled).'),(3,14,4.000,'Matches are generated against predicted CDS, using a sub set of databases (Pfam, TIGRFAM, PRINTS, PROSITE patterns, Gene3d) from InterPro release 58.0. A summary of Gene Ontology (GO) terms derived from InterPro matches to your sample is provided. It is generated using a reduced list of GO terms called GO slim (version <a href=\"http://www.geneontology.org/ontology/subsets/goslim_metagenomics.obo\" class=\"ext\">goslim_goa</a>).'),(3,15,1.100,'Low quality trimming (low quality ends and sequences with > 10% undetermined nucleotides removed).'),(3,16,3.000,'Reads with predicted coding sequences (pCDS) above 60 nucleotides in length.'),(3,17,0.000,'Paired-end overlapping reads are merged - we do not perform assembly.'),(3,18,2.000,'Identification and masking of ncRNAs.'),(4,11,1.200,'Sequences < 100 nucleotides in length removed.'),(4,15,1.100,'Low quality trimming (low quality ends and sequences with > 10% undetermined nucleotides removed). Adapter sequences removed using Biopython SeqIO package.'),(4,16,3.100,'Run as a combined gene caller component, giving priority to Prodigal predictions in the case of assembled sequences or FragGeneScan for short reads (all predictions from the higher priority caller are used, supplemented by any non-overlapping regions predicted by the other).'),(4,17,0.000,'Paired-end overlapping reads are merged - if you want your data assembled, email us.'),(4,19,4.000,'Matches are generated against predicted CDS, using a sub set of databases (Pfam, TIGRFAM, PRINTS, PROSITE patterns, Gene3d) from InterPro release 64.0. A summary of Gene Ontology (GO) terms derived from InterPro matches to your sample is provided. It is generated using a reduced list of GO terms called GO slim (version <a href=\"http://www.geneontology.org/ontology/subsets/goslim_metagenomics.obo\" class=\"ext\">goslim_goa</a>).'),(4,20,3.200,''),(4,21,2.100,'Identification of ncRNAs.'),(4,22,5.000,'SSU and LSU rRNA are annotated using SILVAs SSU/LSU version 128 reference database, enabling classification of eukaryotes, remapped to a 8-level taxonomy.'),(4,23,2.200,'Removes lower scoring overlaps from cmsearch --tblout files.'),(5,11,1.200,'Sequences < 100 nucleotides in length removed.'),(5,15,1.100,'Low quality trimming (low quality ends and sequences with > 10% undetermined nucleotides removed). Adapter sequences removed using Biopython SeqIO package.'),(5,16,3.100,'Run as a combined gene caller component, giving priority to Prodigal predictions in the case of assembled sequences or FragGeneScan for short reads (all predictions from the higher priority caller are used, supplemented by any non-overlapping regions predicted by the other).'),(5,19,4.000,'Matches are generated against predicted CDS, using a sub set of databases (Pfam, TIGRFAM, PRINTS, PROSITE patterns, Gene3d) from InterPro release 64.0. A summary of Gene Ontology (GO) terms derived from InterPro matches to your sample is provided. It is generated using a reduced list of GO terms called GO slim (version <a href=\"http://www.geneontology.org/ontology/subsets/goslim_metagenomics.obo\" class=\"ext\">goslim_goa</a>).'),(5,20,3.200,''),(5,21,2.100,'Identification of ncRNAs.'),(5,23,2.200,'Removes lower scoring overlaps from cmsearch --tblout files.'),(5,24,0.000,'Paired-end overlapping reads are merged - if you want your data assembled, email us.'),(5,25,5.000,'SSU and LSU rRNA are annotated using SILVAs SSU/LSU version 132 reference database, enabling classification of eukaryotes, remapped to a 8-level taxonomy.');
/*!40000 ALTER TABLE `PIPELINE_RELEASE_TOOL` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PIPELINE_TOOL`
--

DROP TABLE IF EXISTS `PIPELINE_TOOL`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PIPELINE_TOOL` (
  `TOOL_ID` smallint(6) NOT NULL AUTO_INCREMENT,
  `TOOL_NAME` varchar(30) CHARACTER SET utf8 DEFAULT NULL,
  `DESCRIPTION` longtext CHARACTER SET utf8,
  `WEB_LINK` varchar(500) CHARACTER SET utf8 DEFAULT NULL,
  `VERSION` varchar(30) CHARACTER SET utf8 DEFAULT NULL,
  `EXE_COMMAND` varchar(500) CHARACTER SET utf8 DEFAULT NULL,
  `INSTALLATION_DIR` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `CONFIGURATION_FILE` longtext CHARACTER SET utf8,
  `NOTES` text CHARACTER SET utf8,
  PRIMARY KEY (`TOOL_ID`),
  UNIQUE KEY `PIPELINE_TOOL_TOOL_NAME_VERSION_97623d54_uniq` (`TOOL_NAME`,`VERSION`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-01-27 12:35:06