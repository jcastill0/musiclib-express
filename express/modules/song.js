var config = require('./config');
var fs = require('fs');

module.exports = Song;

function Song() {
  this.id = null;
  this.name = null;
  this.filePath = null;
  this.playedCnt = null;
  this.lyrics = null;
};


Song.find = function (userID, songID, cb) {
  if (config.debug)
      console.log("Find Song for SongID:" + songID);
  config.getConnPool().getConnection (function(error, connection) {
      if (error) {
	  console.error("Connection Pool Error: " + error.message);
          console.error(error.stack);
	  cb(error);
	  return;
      }
      var sql = "SELECT song.id, song.name, file_path, played_count, artist.name AS artistName FROM song INNER JOIN artist ON artist.id = song.artist_id ORDER BY artist.name, song.name";
      if ((songID != undefined) && (songID != null))
	  sql = sql + " WHERE id = " + songID;
      connection.query(sql, function (error, rows) {
	if (error) {
	    console.error("SQL Error: " + error.message);
	    cb(error);
	}
	if (config.debug)
	    console.log("Songs found:" + JSON.stringify(rows));
	cb(null, rows);
      });
      connection.release();
  });
};


Song.search = function (userID, term, cb) {
  if (config.debug)
      console.log("Search Song with term:" + term);
  config.getConnPool().getConnection (function(error, connection) {
      if (error) {
	  console.error("Connection Pool Error: " + error.message);
          console.error(error.stack);
	  cb(error);
	  return;
      }
      var sql = "SELECT song.id, song.name, file_path, song.lyrics, artist.name AS artistName, artist.id AS artistID FROM song INNER JOIN artist ON artist.id = song.artist_id WHERE LOWER(song.name) LIKE '%" + term + "%' ORDER BY artist.name, song.name";
      connection.query(sql, function (error, rows) {
	if (error) {
	    console.error("SQL Error: " + error.message);
	    cb(error);
	}
	if (config.debug)
	    console.log("Songs found:" + JSON.stringify(rows));
	cb(null, rows);
      });
      connection.release();
  });
};


Song.findRecent = function (userID, cb) {
  if (config.debug)
      console.log("Find Recent Songs");
  config.getConnPool().getConnection (function(error, connection) {
      if (error) {
	  console.error("Connection Pool Error: " + error.message);
          console.error(error.stack);
	  cb(error);
	  return;
      }
      var sql = "SELECT song.id, song.name, file_path, played_count, artist.name AS artistName FROM song INNER JOIN artist ON artist.id = song.artist_id ORDER BY song.created DESC LIMIT 5";
      connection.query(sql, function (error, rows) {
	if (error) {
	    console.error("SQL Error: " + error.message);
	    cb(error);
	}
	if (config.debug)
	    console.log("Songs found:" + JSON.stringify(rows));
	cb(null, rows);
      });
      connection.release();
  });
};


Song.findByArtist = function (userID, artistID, cb) {
  if (config.debug)
      console.log("Find Song for ArtistID:" + artistID);
  config.getConnPool().getConnection (function(error, connection) {
      if (error) {
	  console.error("Connection Pool Error: " + error.message);
          console.error(error.stack);
	  cb(error);
	  return;
      }
      var sql = "SELECT id, name, file_path, played_count FROM song WHERE artist_id = " + artistID + " ORDER BY name";
      connection.query(sql, function (error, rows) {
	if (error) {
	    console.error("SQL Error: " + error.message);
	    cb(error);
	}
	if (config.debug)
	    console.log("Songs found:" + JSON.stringify(rows));
	cb(null, rows);
      });
      connection.release();
  });
};

Song.findByPlaylist = function (userID, playlistID, cb) {
  if (config.debug)
      console.log("Find Song for PlaylistID:" + playlistID);
  config.getConnPool().getConnection (function(error, connection) {
      if (error) {
	  console.error("Connection Pool Error: " + error.message);
          console.error(error.stack);
	  cb(error);
	  return;
      }
      var sql = "SELECT pls.song_id AS id, song.name, artist.name AS artistName, song.file_path AS path, song.lyrics FROM playlist_songs AS pls INNER JOIN song ON song.id = pls.song_id INNER JOIN artist on artist.id = song.artist_id WHERE pls.playlist_id = " + playlistID + " ORDER BY artist.name, song.name";
      connection.query(sql, function (error, rows) {
	if (error) {
	    console.error("SQL Error: " + error.message);
	    cb(error);
	}
	if (config.debug)
	    console.log("Songs found:" + JSON.stringify(rows));
	cb(null, rows);
      });
      connection.release();
  });
};

Song.mostPopularSongs = function (userID, cb) {
    if (config.debug)
	console.log("Song.mostPopularSongs");
    config.getConnPool().getConnection (function(error, connection) {
      if (error) {
	  console.error("Connection Pool Error: " + error.message);
          console.error(error.stack);
	  cb(error);
	  return;
      }
      var sql = "SELECT COUNT(song_id) AS songCnts, ps.song_id, song.name, artist.name AS artistName, song.file_path FROM playlist_songs AS ps INNER JOIN song ON song.id = ps.song_id INNER JOIN artist ON artist.id = song.artist_id GROUP BY ps.song_id ORDER BY songCnts DESC LIMIT 10";
      connection.query(sql, function (error, rows) {
	if (error) {
	    console.error("SQL Error: " + error.message);
	    cb(error);
	}
	cb (null, rows);
      });
      connection.release();
    });
};

Song.frequentlyPlayedSongs = function (userID, cb) {
    if (config.debug)
	console.log("Song.frequentlyPlayedSongs");
    config.getConnPool().getConnection (function(error, connection) {
      if (error) {
	  console.error("Connection Pool Error: " + error.message);
          console.error(error.stack);
	  cb(error);
	  return;
      }
      var sql = "SELECT song.id, song.name, song.played_count, artist.name AS artistName, song.file_path FROM song INNER JOIN artist ON artist.id = song.artist_id ORDER BY song.played_count DESC LIMIT 10";
      connection.query(sql, function (error, rows) {
	connection.release();
	if (error) {
	    console.error("SQL Error: " + error.message);
	    cb(error);
	}
	cb (null, rows);
      });
    });
};

Song.create = function (userID, name, filePath, artistID, cb) {
  if (config.debug)
      console.log("Create Song for: " + userID);
  config.getConnPool().getConnection (function(error, connection) {
      if (error) {
	  console.error("Connection Pool Error: " + error.message);
          console.error(error.stack);
	  cb(error);
	  return;
      }
      var sql = "INSERT INTO song (name, file_path, artist_id, played_count, created) VALUES ('"+name+"', '"+filePath+"', '"+artistID+"',0, NOW())";
      connection.query(sql, function (error, result) {
	if (error) {
		console.error("SQL Error: " + error.message);
		cb(error);
	}
	cb(null, result.insertId);
      });
      connection.release();
  });
};

Song.update = function (userID, songID, name, filePath, artistID, cb) {
  if (config.debug)
      console.log("Update: " + songID);
  config.getConnPool().getConnection (function(error, connection) {
      if (error) {
	  console.error("Connection Pool Error: " + error.message);
          console.error(error.stack);
	  cb(error);
	  return;
      }
      var sql = "UPDATE song SET name='"+name+"', file_path='"+filePath+"', artist_id="+artistID+" WHERE (id = "+songID +")";
      connection.query(sql, function (error, result) {
	if (error) {
	    console.error("SQL Error: " + error.message);
	    cb(error);
	}
	if (result) {
	    cb(null, result);
	} else {
	    cb("Record not found");
	}
      });
      connection.release();
  });
};

Song.updateCount = function (userID, songID, cb) {
  if (config.debug)
      console.log("Update Count: " + songID);
  config.getConnPool().getConnection (function(error, connection) {
      if (error) {
	  console.error("Connection Pool Error: " + error.message);
          console.error(error.stack);
	  cb(error);
	  return;
      }
      var sql = "UPDATE song SET played_count = LAST_INSERT_ID(played_count) + 1 WHERE id ="+songID;
      connection.query(sql, function (error, result) {
        connection.release();
	if (error) {
	    console.error("SQL Error: " + error.message);
	    cb(error);
	}
	if (result) {
	    cb(null, result);
	} else {
	    cb("Record not found");
	}
      });
  });
};

Song.updateLyrics = function (userID, songID, lyrics, cb) {
  if (config.debug)
      console.log("UpdateLyrics: " + songID);
  config.getConnPool().getConnection (function(error, connection) {
      if (error) {
	  console.error("Connection Pool Error: " + error.message);
          console.error(error.stack);
	  cb(error);
	  return;
      }
      var sql = "UPDATE song SET lyrics="+connection.escape(lyrics)+" WHERE (id = "+songID +")";
      connection.query(sql, function (error, result) {
	connection.release();
	if (error) {
	    console.error("SQL Error: " + error.message);
	    cb(error);
	}
	if (result) {
	    cb(null, result);
	} else {
	    cb("Record not found");
	}
      });
  });
};

Song.findLyrics = function (userID, songID, cb) {
  if (config.debug)
      console.log("Find Lyrics for SongID:" + songID);
  config.getConnPool().getConnection (function(error, connection) {
      if (error) {
	  console.error("Connection Pool Error: " + error.message);
          console.error(error.stack);
	  cb(error);
	  return;
      }
      var sql = "SELECT song.id, song.name, song.file_path, song.lyrics, artist.name AS artistName FROM song INNER JOIN artist ON artist.id = song.artist_id WHERE song.id = " + songID;
      connection.query(sql, function (error, rows) {
	connection.release();
	if (error) {
	    console.error("SQL Error: " + error.message);
	    cb(error);
	    return;
	}
	if (rows.length != 1) {
	    console.error("Song not found:" + songID);
	    cb(error);
	    return;
	}
	cb(null, rows[0]);
      });
  });
};
