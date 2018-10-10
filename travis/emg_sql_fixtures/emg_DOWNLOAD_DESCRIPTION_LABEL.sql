-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: 127.0.0.1    Database: emg
-- ------------------------------------------------------
-- Server version	5.7.20

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
-- Dumping data for table `DOWNLOAD_DESCRIPTION_LABEL`
--

LOCK TABLES `DOWNLOAD_DESCRIPTION_LABEL` WRITE;
/*!40000 ALTER TABLE `DOWNLOAD_DESCRIPTION_LABEL` DISABLE KEYS */;
INSERT INTO `DOWNLOAD_DESCRIPTION_LABEL` VALUES (1,'Processed nucleotide reads','Processed nucleotide reads'),(2,'All reads that have predicted CDS','Processed reads with pCDS'),(3,'All reads with an interproscan match','Processed reads with annotation'),(4,'All reads with a predicted CDS but no interproscan match','Processed reads without annotation'),(5,'All predicted CDS','Predicted CDS'),(6,'Predicted coding sequences with InterPro match (FASTA)','Predicted CDS with annotation'),(7,'Predicted CDS without annotation','Predicted CDS without annotation'),(8,'Predicted open reading frames without annotation (FASTA)','Predicted ORF without annotation'),(9,'All reads encoding 5S rRNA','Reads encoding 5S rRNA'),(10,'All reads encoding 16S rRNA','Reads encoding 16S rRNA'),(11,'All reads encoding 23S rRNA','Reads encoding 23S rRNA'),(12,'OTUs and taxonomic assignments','OTUs, reads and taxonomic assignments'),(13,'Phylogenetic tree (Newick format)','Phylogenetic tree'),(14,'All reads encoding SSU rRNA','Reads encoding SSU rRNA'),(15,'OTUs and taxonomic assignments for SSU rRNA','OTUs, reads and taxonomic assignments for SSU rRNA'),(16,'All reads encoding LSU rRNA','Reads encoding LSU rRNA'),(17,'OTUs and taxonomic assignments for LSU rRNA','OTUs, reads and taxonomic assignments for LSU rRNA'),(18,'InterPro matches (TSV)','InterPro matches'),(19,'Complete GO annotation','Complete GO annotation'),(20,'GO slim annotation','GO slim annotation'),(21,'tRNAs predicted using HMMER tools','Predicted tRNAs'),(22,'Phylum level taxonomies (TSV)','Phylum level taxonomies'),(23,'Taxonomic assignments (TSV)','Taxonomic assignments'),(24,'Taxonomic diversity metrics (TSV.','Taxonomic diversity metrics'),(25,'Taxonomic diversity metrics SSU rRNA (TSV).','Taxonomic diversity metrics SSU'),(26,'Taxonomic diversity metrics LSU rRNA (TSV)','Taxonomic diversity metrics LSU'),(27,'Phylum level taxonomies SSU (TSV)','Phylum level taxonomies SSU'),(28,'Phylum level taxonomies LSU (TSV)','Phylum level taxonomies LSU'),(29,'Taxonomic assignments SSU (TSV)','Taxonomic assignments SSU'),(30,'Taxonomic assignments LSU (TSV)','Taxonomic assignments LSU'),(31,'PCA for runs (based on phylum proportions)','PCA for runs (based on phylum proportions)'),(32,'Taxa abundance distribution','Taxa abundance distribution'),(33,'Predicted Alphaproteobacteria transfer-messenger RNA (RF01849)','Predicted alpha tmRNA'),(34,'Predicted Archaeal signal recognition particle RNA (RF01857)','Predicted Archaea SRP RNA'),(35,'Predicted Bacterial large signal recognition particle RNA (RF01854)','Predicted Bacteria large SRP RNA'),(36,'Predicted Bacterial small signal recognition particle RNA (RF00169)','Predicted Bacteria small SRP RNA'),(37,'Predicted Betaproteobacteria transfer-messenger RNA (RF01850)','Predicted beta tmRNA'),(38,'Predicted Cyanobacteria transfer-messenger RNA (RF01851)','Predicted cyano tmRNA'),(39,'Predicted Dictyostelium signal recognition particle RNA (RF01570)','Predicted Dictyostelium SRP RNA'),(40,'Predicted Fungal signal recognition particle RNA (RF01502)','Predicted Fungi SRP RNA'),(41,'Predicted Metazoan signal recognition particle RNA (RF00017)','Predicted Metazoa SRP RNA'),(42,'Predicted Mitochondrion-encoded tmRNA (RF02544)','Predicted mt-tmRNA'),(43,'Predicted Plant signal recognition particle RNA (RF01855)','Predicted Plant SRP RNA'),(44,'Predicted Protozoan signal recognition particle RNA (RF01856)','Predicted Protozoa SRP RNA'),(45,'Predicted RNase MRP RNA (RF00030)','Predicted RNase MRP RNA'),(46,'Predicted Archaeal RNase P RNA (RF00373)','Predicted Archaeal RNase P RNA'),(47,'Predicted Bacterial RNase P class A (RF00010)','Predicted Bacterial RNase P class A RNA'),(48,'Predicted Bacterial RNase P class B (RF00011)','Predicted Bacterial RNase P class B RNA'),(49,'Predicted Plasmodium RNase P (RF01577)','Predicted Plasmodium RNase P'),(50,'Predicted Nuclear RNase P (RF00009)','Predicted Nuclear RNase P'),(51,'Predicted transfer-messenger RNA (RF00023)','Predicted tmRNA'),(52,'Predicted transfer RNA (RF00005)','Predicted tRNA'),(53,'Predicted Selenocysteine transfer RNA (RF01852)','Predicted tRNA-Sec'),(54,'Predicted 5.8S ribosomal RNA (RF00002)','Predicted 5.8S rRNA'),(55,'Predicted Bacterial small subunit ribosomal RNA (RF00177)','Predicted Bacterial SSU rRNA'),(56,'Predicted Archaeal small subunit ribosomal RNA  (RF01959)','Predicted Archaeal SSU rRNA'),(57,'Predicted Eukaryotic small subunit ribosomal RNA (RF01960)','Predicted Eukaryotic SSU rRNA'),(58,'Predicted Archaeal large subunit ribosomal RNA  (RF02540)','Predicted Archaeal LSU rRNA'),(59,'Predicted Bacterial large subunit ribosomal RNA (RF02541)','Predicted Bacterial LSU rRNA'),(60,'Predicted Microsporidia small subunit ribosomal RNA (RF02542)','Predicted Microsporidia SSU rRNA'),(61,'Predicted Eukaryotic large subunit ribosomal RNA (RF02543)','Predicted Eukaryotic LSU rRNA'),(62,'Predicted Trypanosomatid mitochondrial large subunit ribosomal RNA (RF02546)','Predicted trypano mito LSU rRNA'),(63,'Predicted Permuted mitochondrial genome encoded 5S rRNA (RF02547)','Predicted mtPerm-5S rRNA');
/*!40000 ALTER TABLE `DOWNLOAD_DESCRIPTION_LABEL` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-10-10 12:11:58
