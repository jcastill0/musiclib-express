SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';


-- -----------------------------------------------------
-- Table artist
-- -----------------------------------------------------
CREATE	TABLE IF NOT EXISTS artist (
  id	INT(11)		NOT NULL AUTO_INCREMENT ,
  name	VARCHAR(128)	NOT NULL ,
  PRIMARY KEY (id) )
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table google_user
-- -----------------------------------------------------
CREATE	TABLE IF NOT EXISTS google_user (
  id			INT(11)		NOT NULL AUTO_INCREMENT ,
  google_id		VARCHAR(64)	NULL DEFAULT NULL ,
  google_email		VARCHAR(256)	NOT NULL ,
  google_display_name	VARCHAR(128)	NULL DEFAULT NULL ,
  is_active		TINYINT(1)	NOT NULL DEFAULT '1' ,
  is_superuser		TINYINT(1)	NOT NULL DEFAULT '0' ,
  last_login		DATETIME	NULL DEFAULT NULL ,
  PRIMARY KEY (id) )
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table playlist
-- -----------------------------------------------------
CREATE	TABLE IF NOT EXISTS playlist (
  id		INT(11)		NOT NULL AUTO_INCREMENT ,
  name		VARCHAR(32)	NOT NULL ,
  owner_id	INT(11)		NOT NULL ,
  lastPlayedIX	INT(11)		NULL DEFAULT NULL ,
  created	DATETIME	NOT NULL ,
  PRIMARY KEY (id) ,
  INDEX owner_id_fk_idx (owner_id ASC) ,
  CONSTRAINT owner_id_fk
    FOREIGN KEY (owner_id)
    REFERENCES google_user (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION )
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table video
-- -----------------------------------------------------
CREATE	TABLE IF NOT EXISTS video (
  id		INT(11)		NOT NULL AUTO_INCREMENT ,
  name		VARCHAR(128)	NOT NULL ,
  url		VARCHAR(256)	NOT NULL ,
  embedded	VARCHAR(512)	NULL DEFAULT NULL ,
  view_count	INT(11)		NOT NULL DEFAULT '0' ,
  created	DATETIME 	NOT NULL ,
  PRIMARY KEY (id) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table song
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS song (
  id		INT(11)		NOT NULL AUTO_INCREMENT ,
  name		VARCHAR(256)	NOT NULL ,
  file_path	VARCHAR(512)	NOT NULL ,
  artist_id	INT(11)		NOT NULL ,
  video_id	INT(11)		NULL DEFAULT NULL ,
  played_count	INT(11)		NOT NULL DEFAULT '0' ,
  created	DATETIME	NOT NULL ,
  PRIMARY KEY (id) ,
  INDEX artist_id_fk_idx (artist_id ASC) ,
  INDEX video_id_fk_idx (video_id ASC) ,
  CONSTRAINT artist_id_fk
    FOREIGN KEY (artist_id)
    REFERENCES artist (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT video_id_fk
    FOREIGN KEY (video_id)
    REFERENCES video (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION )
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table playlist_songs
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS playlist_songs (
  id		INT(11)	NOT NULL AUTO_INCREMENT ,
  playlist_id	INT(11)	NOT NULL ,
  song_id	INT(11) NOT NULL ,
  PRIMARY KEY (id) ,
  INDEX playlist_id_fk_idx (playlist_id ASC) ,
  INDEX song_id_fk_idx (song_id ASC) ,
  CONSTRAINT playlist_id_fk
    FOREIGN KEY (playlist_id)
    REFERENCES playlist (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT song_id_fk
    FOREIGN KEY (song_id)
    REFERENCES song (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION )
ENGINE = InnoDB
AUTO_INCREMENT = 35
DEFAULT CHARACTER SET = utf8;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

