CREATE DATABASE  IF NOT EXISTS `memory` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `memory`;

DROP TABLE IF EXISTS `cards`;
DROP TABLE IF EXISTS `games`;

--
-- Table structure for table `games`
--

CREATE TABLE `games` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `rating` int(5) NOT NULL DEFAULT '0',
  `points` int(5) NOT NULL DEFAULT '0',
  `errors` int(5) NOT NULL DEFAULT '0',
  `created_at` DATETIME,
  `updated_at` DATETIME,
  `finished_at` DATETIME,
  PRIMARY KEY (`id`,`game`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `rating_index` (`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Table structure for table `cards`
--

CREATE TABLE `cards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_id` int(11) NOT NULL,
  `card` varchar(6) CHARACTER SET utf8 NOT NULL,
  `index` int(11) NOT NULL DEFAULT '0',
  `created_at` DATETIME,
  `updated_at` DATETIME,
  PRIMARY KEY (`id`,`game_id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `game_id_idx` (`game_id`),
  CONSTRAINT `game_id` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


