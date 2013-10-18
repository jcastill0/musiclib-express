var config = require('./config');

module.exports = Playlist;

function Playlist() {
  this.id = null;
  this.owner_id = null;
  this.name = null;
};


Playlist.find = function (userID, playlistID, cb) {
  if (config.debug)
      console.log("Find Playlist for: " + userID + " PlaylistID:" + playlistID);
  config.getConnPool().getConnection (function(error, connection) {
      if (error) {
	  console.error("Connection Pool Error: " + error.message);
          console.error(error.stack);
	  cb(error);
	  return;
      }
      var sql = "SELECT id, name FROM playlist WHERE owner_id = " + userID;
      if ((playlistID != undefined) && (playlistID != null))
	  sql = sql + " AND id = " + playlistID;
      connection.query(sql, function (error, rows) {
	if (error) {
	    console.error("SQL Error: " + error.message);
	    cb(error);
	}
	if (rows.length >= 1) {
	    if (config.debug)
		console.log("Playlists found:" + JSON.stringify(rows));
	    cb(null, rows);
	} else {
	    cb("Playlist not found");
	}
      });
      connection.end();
  });
};

Playlist.create = function (userID, name, cb) {
  if (config.debug)
      console.log("Create: " + userID);
  config.getConnPool().getConnection (function(error, connection) {
      if (error) {
	  console.error("Connection Pool Error: " + error.message);
          console.error(error.stack);
	  cb(error);
	  return;
      }
      var sql = "INSERT INTO playlist (name, owner_id, created) VALUES ('"+name+"', " + userID + ", NOW())";
      connection.query(sql, function (error, result) {
	if (error) {
	    console.error("SQL Error: " + error.message);
	    cb(error);
	}
	cb(null, result.insertId);
      });
      connection.end();
  });
};

Playlist.update = function (playlistID, userID, name, cb) {
  if (config.debug)
      console.log("Update: " + playlistID);
  config.getConnPool().getConnection (function(error, connection) {
      if (error) {
	  console.error("Connection Pool Error: " + error.message);
          console.error(error.stack);
	  cb(error);
	  return;
      }
      var sql = "UPDATE playlist SET (name = '"+name+"') WHERE (id = "+playlistID +" AND owner_id = "+userID+")";
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
      connection.end();
  });
};

Playlist.delete = function (playlistID, userID, cb) {
  if (config.debug)
      console.log("Delete: " + playlistID);
  config.getConnPool().getConnection (function(error, connection) {
      if (error) {
	  console.error("Connection Pool Error: " + error.message);
          console.error(error.stack);
	  cb(error);
	  return;
      }
      var sql = "DELETE FROM playlist WHERE (id = "+playlistID +" AND owner_id = "+userID+")";
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
      connection.end();
  });
};

