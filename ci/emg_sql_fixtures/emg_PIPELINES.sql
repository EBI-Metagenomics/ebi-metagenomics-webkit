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