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
      var sql = "SELECT song.id, song.name, file_path, played_count, artist.name AS artistName FROM song INNER JOIN artist ON artist.id = song.artist_id ";
      if ((songID != undefined) && (songID != null))
	  sql = sql + " WHERE id = " + songID;
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
      var sql = "SELECT pls.song_id AS id, song.name, artist.name AS artistName FROM playlist_songs AS pls INNER JOIN song ON song.id = pls.song_id INNER JOIN artist on artist.id = song.artist_id WHERE pls.playlist_id = " + playlistID;
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

