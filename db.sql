-- `rank`.bridge_guilds definition

CREATE TABLE `bridge_guilds` (
  `id` varchar(32) NOT NULL,
  `name` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- `rank`.bridge_configs definition

CREATE TABLE `bridge_configs` (
  `guild_id` varchar(32) NOT NULL,
  `channel_name` varchar(100) DEFAULT NULL,
  `channel_id` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`guild_id`),
  CONSTRAINT `bridge_configs_FK` FOREIGN KEY (`guild_id`) REFERENCES `bridge_guilds` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;