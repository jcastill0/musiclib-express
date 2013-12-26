var config = require('./config');

module.exports = Stats;

function Stats() {
  /*this.totalUsers = null;
  this.totalSongs = null;
  this.totalPlaylists = null;
  this.totalArtists = null;*/
};

Stats.getAll= function (cb) {
    if (config.debug)
	console.log("Stats.getAll");
    var totalUsers = null;
    var totalSongs = null;
    var totalPlaylists = null;
    var totalArtists = null;
    config.getConnPool().getConnection (function(error, connection) {
      if (error) {
	  console.error("Connection Pool Error: " + error.message);
          console.error(error.stack);
	  cb(error);
	  return;
      }
      var sql = "SELECT count(*) AS totalUsers FROM google_user WHERE is_active = 1";
      connection.query(sql, function (error, row) {
	if (error) {
	    console.error("SQL Error: " + error.message);
	    cb(error);
	}
	if (row.length == 1) {
	    totalUsers = row;
	} else {
	    cb("Record not found");
	}
      });
      var sql = "SELECT count(*) AS totalSongs FROM song";
      connection.query(sql, function (error, row) {
	if (error) {
	    console.error("SQL Error: " + error.message);
	    cb(error);
	}
	if (row.length == 1) {
	    totalSongs = row;
	} else {
	    cb("Record not found");
	}
      });
      var sql = "SELECT count(*) AS totalPlaylists FROM playlist";
      connection.query(sql, function (error, row) {
	if (error) {
	    console.error("SQL Error: " + error.message);
	    cb(error);
	}
	if (row.length == 1) {
	    totalPlaylists = row;
	} else {
	    cb("Record not found");
	}
      });
      var sql = "SELECT count(*) AS totalArtists FROM artist";
      connection.query(sql, function (error, row) {
	if (error) {
	    console.error("SQL Error: " + error.message);
	    cb(error);
	}
	if (row.length == 1) {
	    totalArtists = row;
	} else {
	    cb("Record not found");
	}
      });
console.log("U:"+totalUsers+" S:"+totalSongs+" P:"+totalPlaylists+" A:"+totalArtists);
      cb (null, {"totalUsers":totalUsers, "totalSongs":totalSongs, "totalPlaylists":totalPlaylists, "totalArtists":totalArtists});
      connection.end();
    });
};


