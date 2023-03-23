-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               10.2.38-MariaDB - MariaDB Server
-- Server OS:                    Linux
-- HeidiSQL Version:             11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table Company
CREATE TABLE IF NOT EXISTS `Company` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `UUID` varchar(100) DEFAULT NULL,
  `SubDomain` varchar(100) DEFAULT NULL,
  `DomainName` varchar(100) DEFAULT NULL,
  `DomainStatus` tinyint(1) DEFAULT 0 COMMENT '0=none,1=registered,2=external',
  `CompanyName` varchar(100) DEFAULT NULL,
  `PublicKey` varchar(100) DEFAULT NULL,
  `FormRecipient` varchar(100) DEFAULT NULL,
  `Logo` varchar(200) DEFAULT NULL,
  `RegistrationDate` datetime DEFAULT NULL,
  `TemplateUUID` varchar(100) DEFAULT NULL,
  `MailSent` int(11) DEFAULT 0,
  `MailReceived` int(11) DEFAULT 0,
  `MailSentTotal` int(11) DEFAULT 0,
  `MailReceivedTotal` int(11) DEFAULT 0,
  `CallMinutes` int(11) DEFAULT NULL,
  `CallCost` decimal(8,4) DEFAULT NULL,
  `SMSSent` int(11) DEFAULT NULL,
  `SMSCost` decimal(8,4) DEFAULT NULL,
  `Profiles` int(11) DEFAULT NULL COMMENT 'clearbit calls',
  `BeaconInterval` int(11) DEFAULT 1000,
  `IsDeleted` tinyint(1) DEFAULT 0,
  `DateCreated` datetime DEFAULT NULL,
  `DateModified` datetime DEFAULT NULL,
  `CreatedBy` varchar(100) DEFAULT NULL,
  `ModifiedBy` varchar(100) DEFAULT NULL,
  `IPCreated` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `UUID` (`UUID`),
  UNIQUE KEY `SubDomain` (`SubDomain`),
  UNIQUE KEY `DomainName` (`DomainName`),
  UNIQUE KEY `CompanyFormID` (`PublicKey`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

-- Data exporting was unselected.

-- Dumping structure for table Customer
CREATE TABLE IF NOT EXISTS `Customer` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `UUID` varchar(100) DEFAULT NULL,
  `CompanyUUID` varchar(100) DEFAULT NULL,
  `CustomerName` varchar(100) DEFAULT NULL,
  `CompanyEmail` varchar(100) DEFAULT NULL,
  `CustomerEmail` varchar(100) DEFAULT NULL,
  `CustomerRole` varchar(100) DEFAULT NULL,
  `CompanyPhone` varchar(50) DEFAULT NULL,
  `CustomerPhone` varchar(50) DEFAULT NULL,
  `CustomerPasswordHash` varchar(300) DEFAULT NULL,
  `CustomerLanguage` varchar(10) NOT NULL DEFAULT 'en',
  `CustomerTheme` varchar(40) NOT NULL DEFAULT 'standard',
  `CustomerBaseColor` varchar(40) DEFAULT NULL,
  `MailSent` int(11) NOT NULL DEFAULT 0,
  `MailReceived` int(11) NOT NULL DEFAULT 0,
  `MailSentTotal` int(11) NOT NULL DEFAULT 0,
  `MailReceivedTotal` int(11) NOT NULL DEFAULT 0,
  `ClearBitKey` varchar(100) DEFAULT 'sk_0a44b6e645a0e3ec67e4ad9de2a368f2',
  `ConfigUsePhone` tinyint(1) NOT NULL DEFAULT 0,
  `ConfigUseSMS` tinyint(1) NOT NULL DEFAULT 0,
  `ConfigTimeFormat` varchar(30) NOT NULL DEFAULT 'fullddt',
  `LeadsTimeFormat` varchar(30) NOT NULL DEFAULT 'shortdt',
  `LeadTimeFormat` varchar(30) NOT NULL DEFAULT 'fullddt',
  `MailTimeFormat` varchar(30) NOT NULL DEFAULT 'fullddt',
  `ConfigRecordCalls` tinyint(1) NOT NULL DEFAULT 0,
  `ConfigTranscribeCalls` tinyint(1) NOT NULL DEFAULT 0,
  `ConfigCountryCode` smallint(5) DEFAULT NULL,
  `ConfigRunCallPause` smallint(5) NOT NULL DEFAULT 2,
  `ColLeadsCompany` tinyint(1) NOT NULL DEFAULT 1,
  `ColLeadsContactName` tinyint(1) NOT NULL DEFAULT 1,
  `ColLeadsContactEmail` tinyint(1) NOT NULL DEFAULT 0,
  `ColLeadsStatus` tinyint(1) NOT NULL DEFAULT 1,
  `ColLeadsLocation` tinyint(1) NOT NULL DEFAULT 1,
  `ColLeadsSource` tinyint(1) NOT NULL DEFAULT 1,
  `ColLeadsDateCreated` tinyint(1) NOT NULL DEFAULT 0,
  `ColLeadsDateModified` tinyint(1) NOT NULL DEFAULT 0,
  `ColLeadsLastAction` tinyint(1) NOT NULL DEFAULT 0,
  `ColBroadcastRecipients` tinyint(1) NOT NULL DEFAULT 1,
  `ColBroadcastDelivered` tinyint(1) NOT NULL DEFAULT 1,
  `ColBroadcastBounced` tinyint(1) NOT NULL DEFAULT 1,
  `ColBroadcastFailed` tinyint(1) NOT NULL DEFAULT 1,
  `ColBroadcastOpened` tinyint(1) NOT NULL DEFAULT 1,
  `ColBroadcastClicked` tinyint(1) NOT NULL DEFAULT 1,
  `ColBroadcastUnsubscribed` tinyint(1) NOT NULL DEFAULT 0,
  `ColBroadcastComplained` tinyint(1) NOT NULL DEFAULT 1,
  `ColBroadcastDateCreated` tinyint(1) NOT NULL DEFAULT 1,
  `ColBroadcastDateModified` tinyint(1) NOT NULL DEFAULT 0,
  `ColBroadcastCreatedBy` tinyint(1) NOT NULL DEFAULT 0,
  `CRMSaveIncomingEmail` tinyint(1) NOT NULL DEFAULT 1,
  `CRMSaveOutgoingEmail` tinyint(1) NOT NULL DEFAULT 1,
  `ColAccountsCompanyEmail` tinyint(1) NOT NULL DEFAULT 1,
  `ColAccountsName` tinyint(1) NOT NULL DEFAULT 1,
  `ColAccountsUserEmail` tinyint(1) NOT NULL DEFAULT 1,
  `ColAccountsRole` tinyint(1) NOT NULL DEFAULT 1,
  `ColAccountsType` tinyint(1) NOT NULL DEFAULT 1,
  `ColAccountsUserPhone` tinyint(1) NOT NULL DEFAULT 1,
  `ColAccountsCompanyPhone` tinyint(1) NOT NULL DEFAULT 1,
  `EmailSignature` varchar(400) DEFAULT NULL,
  `IsAdmin` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0: Only show email client, 1: show most modules',
  `IsOwner` tinyint(1) NOT NULL DEFAULT 0 COMMENT '1: Show domain name and email accounts',
  `IsDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `DateCreated` datetime DEFAULT NULL,
  `DateModified` datetime DEFAULT NULL,
  `CreatedBy` varchar(100) DEFAULT NULL,
  `ModifiedBy` varchar(100) DEFAULT NULL,
  `IPCreated` varchar(100) DEFAULT NULL,
  `IPLastLogin` varchar(100) DEFAULT NULL,
  `DateLastLogin` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `CustomerEmail` (`CustomerEmail`),
  UNIQUE KEY `CompanyEmail` (`CompanyEmail`),
  KEY `FK_Customer_Company` (`CompanyUUID`),
  CONSTRAINT `FK_Customer_Company` FOREIGN KEY (`CompanyUUID`) REFERENCES `Company` (`UUID`)
) ENGINE=InnoDB AUTO_INCREMENT=126 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

-- Dumping structure for table Lead
CREATE TABLE IF NOT EXISTS `Lead` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `UUID` varchar(100) DEFAULT NULL,
  `CompanyUUID` varchar(100) DEFAULT NULL,
  `PrimaryContactID` int(11) DEFAULT NULL,
  `LeadName` varchar(100) DEFAULT NULL,
  `LeadStatus` varchar(100) NOT NULL DEFAULT 'Prospect',
  `LeadLocation` varchar(100) DEFAULT NULL,
  `LeadSource` varchar(100) DEFAULT NULL,
  `LeadNoteboard` varchar(10000) DEFAULT NULL,
  `CF1` varchar(1000) DEFAULT NULL,
  `CF2` varchar(1000) DEFAULT NULL,
  `CF3` varchar(1000) DEFAULT NULL,
  `CF4` varchar(1000) DEFAULT NULL,
  `CF5` varchar(1000) DEFAULT NULL,
  `CF6` varchar(1000) DEFAULT NULL,
  `CF7` varchar(1000) DEFAULT NULL,
  `CF8` varchar(1000) DEFAULT NULL,
  `CF9` varchar(1000) DEFAULT NULL,
  `CF10` varchar(1000) DEFAULT NULL,
  `CF11` varchar(100) DEFAULT NULL,
  `CF12` varchar(100) DEFAULT NULL,
  `CF13` varchar(100) DEFAULT NULL,
  `CF14` varchar(100) DEFAULT NULL,
  `CF15` varchar(100) DEFAULT NULL,
  `CF16` varchar(100) DEFAULT NULL,
  `CF17` varchar(100) DEFAULT NULL,
  `CF18` varchar(100) DEFAULT NULL,
  `CF19` varchar(100) DEFAULT NULL,
  `CF20` varchar(100) DEFAULT NULL,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `IsAdmin` tinyint(1) NOT NULL DEFAULT 0,
  `DateCreated` datetime DEFAULT NULL,
  `DateModified` datetime DEFAULT NULL,
  `CreatedBy` varchar(100) DEFAULT NULL,
  `ModifiedBy` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3412 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

-- Dumping structure for table LeadAction
CREATE TABLE IF NOT EXISTS `LeadAction` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `LeadID` int(11) DEFAULT NULL,
  `ActionType` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ActionStatus` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ActionLink` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ActionData` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ActionPrice` decimal(16,7) DEFAULT NULL,
  `ActionFrom` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ActionTo` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ActionStartDT` datetime DEFAULT NULL,
  `ActionEndDT` datetime DEFAULT NULL,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `DateCreated` datetime DEFAULT NULL,
  `DateModified` datetime DEFAULT NULL,
  `CreatedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ModifiedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=14792 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table LeadCF
CREATE TABLE IF NOT EXISTS `LeadCF` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `UUID` varchar(100) DEFAULT NULL,
  `CompanyUUID` varchar(100) DEFAULT NULL,
  `FieldName` varchar(100) DEFAULT NULL,
  `FieldType` varchar(60) DEFAULT NULL,
  `FieldIcon` varchar(60) DEFAULT NULL,
  `ValuePos` tinyint(4) DEFAULT NULL,
  `FieldDefault` varchar(100) DEFAULT NULL,
  `FieldPlaceholder` varchar(100) DEFAULT NULL,
  `FieldSelections` varchar(400) DEFAULT NULL,
  `FieldMin` int(11) DEFAULT NULL,
  `FieldMax` int(11) DEFAULT NULL,
  `HasSearch` tinyint(1) NOT NULL DEFAULT 0,
  `HasDropdown` tinyint(1) NOT NULL DEFAULT 0,
  `IsRequired` tinyint(1) NOT NULL DEFAULT 0,
  `IsViewable` tinyint(1) NOT NULL DEFAULT 1,
  `IsIndexed` tinyint(1) NOT NULL DEFAULT 1,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `IsAdmin` tinyint(1) NOT NULL DEFAULT 0,
  `DateCreated` datetime DEFAULT NULL,
  `DateModified` datetime DEFAULT NULL,
  `CreatedBy` varchar(100) DEFAULT NULL,
  `ModifiedBy` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=652 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

-- Data exporting was unselected.

-- Dumping structure for table LeadContact
CREATE TABLE IF NOT EXISTS `LeadContact` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `LeadID` int(10) DEFAULT NULL,
  `ContactName` varchar(200) DEFAULT NULL,
  `ContactTitle` varchar(200) DEFAULT NULL,
  `ContactAvatar` varchar(1000) DEFAULT NULL,
  `ContactPhone` varchar(100) DEFAULT NULL,
  `ContactEmail` varchar(100) DEFAULT NULL,
  `ContactLocation` varchar(100) DEFAULT NULL,
  `CF1` varchar(1000) DEFAULT NULL,
  `CF2` varchar(1000) DEFAULT NULL,
  `CF3` varchar(1000) DEFAULT NULL,
  `CF4` varchar(1000) DEFAULT NULL,
  `CF5` varchar(1000) DEFAULT NULL,
  `CF6` varchar(1000) DEFAULT NULL,
  `CF7` varchar(1000) DEFAULT NULL,
  `CF8` varchar(1000) DEFAULT NULL,
  `CF9` varchar(1000) DEFAULT NULL,
  `CF10` varchar(1000) DEFAULT NULL,
  `CF11` varchar(100) DEFAULT NULL,
  `CF12` varchar(100) DEFAULT NULL,
  `CF13` varchar(100) DEFAULT NULL,
  `CF14` varchar(100) DEFAULT NULL,
  `CF15` varchar(100) DEFAULT NULL,
  `CF16` varchar(100) DEFAULT NULL,
  `CF17` varchar(100) DEFAULT NULL,
  `CF18` varchar(100) DEFAULT NULL,
  `CF19` varchar(100) DEFAULT NULL,
  `CF20` varchar(100) DEFAULT NULL,
  `ClearBit` tinyint(1) NOT NULL DEFAULT 0,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `DateCreated` datetime DEFAULT NULL,
  `DateModified` datetime DEFAULT NULL,
  `CreatedBy` varchar(100) DEFAULT NULL,
  `ModifiedBy` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3488 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

-- Dumping structure for table LeadContactCF
CREATE TABLE IF NOT EXISTS `LeadContactCF` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `UUID` varchar(100) DEFAULT NULL,
  `CompanyUUID` varchar(100) DEFAULT NULL,
  `FieldName` varchar(100) DEFAULT NULL,
  `FieldType` varchar(60) DEFAULT NULL,
  `FieldIcon` varchar(60) DEFAULT NULL,
  `ValuePos` tinyint(4) DEFAULT NULL,
  `FieldDefault` varchar(100) DEFAULT NULL,
  `FieldPlaceholder` varchar(100) DEFAULT NULL,
  `FieldSelections` varchar(400) DEFAULT NULL,
  `FieldMin` int(11) DEFAULT NULL,
  `FieldMax` int(11) DEFAULT NULL,
  `HasSearch` tinyint(1) NOT NULL DEFAULT 0,
  `HasDropdown` tinyint(1) NOT NULL DEFAULT 0,
  `IsRequired` tinyint(1) NOT NULL DEFAULT 0,
  `IsPillAction` tinyint(1) NOT NULL DEFAULT 1,
  `IsIndexed` tinyint(1) NOT NULL DEFAULT 0,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `IsAdmin` tinyint(1) NOT NULL DEFAULT 0,
  `DateCreated` datetime DEFAULT NULL,
  `DateModified` datetime DEFAULT NULL,
  `CreatedBy` varchar(100) DEFAULT NULL,
  `ModifiedBy` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=655 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

-- Data exporting was unselected.

-- Dumping structure for table LeadList
CREATE TABLE IF NOT EXISTS `LeadList` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `UUID` varchar(255) DEFAULT NULL,
  `ListName` varchar(200) DEFAULT NULL,
  `IsAdmin` tinyint(1) DEFAULT 0,
  `IsDeleted` tinyint(1) DEFAULT 0,
  `CompanyUUID` varchar(100) DEFAULT NULL,
  `DateCreated` datetime DEFAULT NULL,
  `CreatedBy` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

-- Data exporting was unselected.

-- Dumping structure for table LeadListJunction
CREATE TABLE IF NOT EXISTS `LeadListJunction` (
  `LeadListUUID` varchar(255) NOT NULL,
  `LeadUUID` varchar(255) NOT NULL,
  PRIMARY KEY (`LeadListUUID`,`LeadUUID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

-- Dumping structure for table LeadSearch
CREATE TABLE IF NOT EXISTS `LeadSearch` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `SearchQuery` varchar(255) DEFAULT NULL,
  `ListUUID` varchar(255) DEFAULT NULL,
  `SearchName` varchar(200) DEFAULT NULL,
  `IsAdmin` tinyint(1) DEFAULT 0,
  `IsDeleted` tinyint(1) DEFAULT 0,
  `CompanyUUID` varchar(100) DEFAULT NULL,
  `DateCreated` datetime DEFAULT NULL,
  `CreatedBy` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

-- Data exporting was unselected.

-- Dumping structure for table Mail
CREATE TABLE IF NOT EXISTS `Mail` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `UUID` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CompanyUUID` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MailDomain` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MailFrom` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MailSender` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MailTo` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MailCC` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MailBCC` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MailSubject` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MailBodyPlain` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MailBodyHTML` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MailBodyFiltered` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MailAttachments` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MessageHeaders` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MailFolder` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MailFolderUUID` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `IsRead` tinyint(1) NOT NULL DEFAULT 0,
  `IsDelivered` tinyint(1) NOT NULL DEFAULT 0,
  `IsOpened` tinyint(1) NOT NULL DEFAULT 0,
  `IsClicked` tinyint(1) NOT NULL DEFAULT 0,
  `IsBounced` tinyint(1) NOT NULL DEFAULT 0,
  `IsFailed` tinyint(1) NOT NULL DEFAULT 0,
  `IsUnsubscribed` tinyint(1) NOT NULL DEFAULT 0,
  `IsComplained` tinyint(1) NOT NULL DEFAULT 0,
  `RecipientsDelivered` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RecipientsOpened` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RecipientsClicked` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RecipientsBounced` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RecipientsFailed` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RecipientsUnsubscribed` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RecipientsComplained` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DTDelivered` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `DTOpened` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `DTClicked` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `DTBounced` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `DTFailed` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `DTUnsubscribed` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `DTComplained` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `TrackedIP` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TrackedCountry` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TrackedRegion` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TrackedCity` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TrackedUserAgent` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TrackedDeviceType` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TrackedClientType` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TrackedClientName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TrackedClientOS` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `DateSent` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=32386 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

-- Dumping structure for table MailBroadcast
CREATE TABLE IF NOT EXISTS `MailBroadcast` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `UUID` varchar(100) DEFAULT NULL,
  `CampaignName` varchar(200) DEFAULT NULL,
  `MailFrom` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MailTo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MailCC` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MailBCC` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MailSubject` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MailBodyPlain` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MailBodyHTML` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MailBodyFiltered` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MailAttachments` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MessageHeaders` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RecipientsDelivered` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RecipientsOpened` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RecipientsClicked` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RecipientsBounced` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RecipientsFailed` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RecipientsUnsubscribed` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RecipientsComplained` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DTDelivered` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `DTOpened` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `DTClicked` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `DTBounced` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `DTFailed` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `DTUnsubscribed` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `DTComplained` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `TotalRecipients` int(11) NOT NULL DEFAULT 0,
  `TotalDelivered` int(11) NOT NULL DEFAULT 0,
  `TotalBounced` int(11) NOT NULL DEFAULT 0,
  `TotalFailed` int(11) NOT NULL DEFAULT 0,
  `TotalOpened` int(11) NOT NULL DEFAULT 0,
  `TotalClicked` int(11) NOT NULL DEFAULT 0,
  `TotalUnsubscribed` int(11) NOT NULL DEFAULT 0,
  `TotalComplained` int(11) NOT NULL DEFAULT 0,
  `CompanyUUID` varchar(100) DEFAULT NULL,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `DateCreated` datetime DEFAULT NULL,
  `CreatedBy` varchar(100) DEFAULT NULL,
  `DateModified` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

-- Dumping structure for table MailFirewall
CREATE TABLE IF NOT EXISTS `MailFirewall` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `UUID` varchar(100) DEFAULT NULL,
  `MailDomain` varchar(100) DEFAULT NULL,
  `CompanyUUID` varchar(100) DEFAULT NULL,
  `CompanyEmail` varchar(100) DEFAULT NULL,
  `CustomerUUID` varchar(100) DEFAULT NULL,
  `FilterType` varchar(20) DEFAULT NULL,
  `FilterScope` varchar(20) DEFAULT NULL,
  `FilterStatement` varchar(100) DEFAULT NULL,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `DateCreated` datetime DEFAULT NULL,
  `CreatedBy` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=294 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

-- Data exporting was unselected.

-- Dumping structure for table MailFolder
CREATE TABLE IF NOT EXISTS `MailFolder` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `FolderName` varchar(200) DEFAULT NULL,
  `UUID` varchar(100) DEFAULT NULL,
  `CompanyUUID` varchar(100) DEFAULT NULL,
  `CompanyEmail` varchar(100) DEFAULT NULL,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=460 DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

-- Dumping structure for table MailTemplate
CREATE TABLE IF NOT EXISTS `MailTemplate` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `UUID` varchar(100) DEFAULT NULL,
  `CompanyUUID` varchar(100) DEFAULT NULL,
  `TemplateName` varchar(200) DEFAULT NULL,
  `TemplateContent` mediumtext DEFAULT NULL,
  `IsPrivate` tinyint(1) NOT NULL DEFAULT 0,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `DateCreated` datetime DEFAULT NULL,
  `CreatedBy` varchar(100) DEFAULT NULL,
  `DateModified` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

-- Dumping structure for table TokenRecovery
CREATE TABLE IF NOT EXISTS `TokenRecovery` (
  `TokenUUID` varchar(255) NOT NULL,
  `CustomerUUID` varchar(255) NOT NULL,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `DateCreated` datetime NOT NULL,
  `CreatedBy` varchar(100) NOT NULL,
  PRIMARY KEY (`TokenUUID`,`CustomerUUID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

-- Data exporting was unselected.

-- Dumping structure for table TokenRegister
CREATE TABLE IF NOT EXISTS `TokenRegister` (
  `TokenUUID` varchar(255) NOT NULL,
  `CustomerUUID` varchar(255) NOT NULL,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `DateCreated` datetime NOT NULL,
  `CreatedBy` varchar(100) NOT NULL,
  PRIMARY KEY (`TokenUUID`,`CustomerUUID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

-- Dumping structure for table Weblytics
CREATE TABLE IF NOT EXISTS `Weblytics` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `UUID` varchar(100) NOT NULL,
  `CompanyUUID` varchar(100) NOT NULL,
  `PageView` varchar(200) NOT NULL,
  `PageViewLength` int(11) DEFAULT NULL,
  `PageSource` varchar(500) DEFAULT NULL,
  `UserBrowser` varchar(200) DEFAULT NULL,
  `UserBrowserVersion` varchar(50) DEFAULT NULL,
  `UserScreenSize` varchar(50) DEFAULT NULL,
  `UserLanguage` varchar(50) DEFAULT NULL,
  `UserPlatform` varchar(50) DEFAULT NULL,
  `UserPlatformVersion` varchar(50) DEFAULT NULL,
  `UserIP` varchar(100) DEFAULT NULL,
  `UserCity` varchar(100) DEFAULT NULL,
  `UserCountry` varchar(100) DEFAULT NULL,
  `UserDeviceType` varchar(50) DEFAULT NULL,
  `UserDeviceVendor` varchar(50) DEFAULT NULL,
  `UserDeviceModel` varchar(100) DEFAULT NULL,
  `UserAgent` varchar(300) DEFAULT NULL,
  `DateCreated` datetime NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `UUID` (`UUID`),
  KEY `FK__Company` (`CompanyUUID`),
  CONSTRAINT `FK__Company` FOREIGN KEY (`CompanyUUID`) REFERENCES `Company` (`UUID`)
) ENGINE=InnoDB AUTO_INCREMENT=9791 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

-- Dumping structure for table WebTemplate
CREATE TABLE IF NOT EXISTS `WebTemplate` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `UUID` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TemplateName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TemplateType` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TemplateCategory` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TemplateKeywords` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TemplateFamily` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TemplateLocation` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TemplateSections` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TemplateThumb` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TemplatePreview` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TemplateSource` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MobileSource` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `PrimaryColor` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SecondaryColor` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Difficulty` tinyint(1) DEFAULT 2,
  `IsDeleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `UUID` (`UUID`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
