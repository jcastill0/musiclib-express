var config = require('./config');

module.exports = Song;

function Song() {
  this.id = null;
  this.name = null;
  this.filePath = null;
  this.playedCnt = null;
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
      var sql = "SELECT id, name, file_path, played_count FROM song";
      if ((songID != undefined) && (songID != null))
	  sql = sql + " AND id = " + songID;
      connection.query(sql, function (error, rows) {
	if (error) {
	    console.error("SQL Error: " + error.message);
	    cb(error);
	}
	if (rows.length >= 1) {
	    if (config.debug)
		console.log("Songs found:" + JSON.stringify(rows));
	    cb(null, rows);
	} else {
	    cb("Song not found");
	}
      });
      connection.end();
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
      var sql = "SELECT id, name, file_path, played_count FROM song WHERE artist_id = " + artistID;
      connection.query(sql, function (error, rows) {
	if (error) {
	    console.error("SQL Error: " + error.message);
	    cb(error);
	}
	if (rows.length >= 1) {
	    if (config.debug)
		console.log("Songs found:" + JSON.stringify(rows));
	    cb(null, rows);
	} else {
	    cb("Song not found");
	}
      });
      connection.end();
  });
};


