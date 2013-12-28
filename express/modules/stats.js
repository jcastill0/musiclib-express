var config = require('./config');

module.exports = Stats;

function Stats() {
  this.totalUsers = null;
  this.totalSongs = null;
  this.totalPlaylists = null;
  this.totalArtists = null;
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
      var sql = "SELECT COUNT(*) AS totalUsers, (SELECT COUNT(*) FROM song) AS totalSongs, (SELECT COUNT(*) FROM playlist) AS totalPlaylists, (SELECT COUNT(*) FROM artist) AS totalArtists FROM google_user WHERE is_active = 1";
      connection.query(sql, function (error, row) {
	if (error) {
	    console.error("SQL Error: " + error.message);
	    cb(error);
	}
	if (row.length == 1) {
	    this.totalUsers = row[0];
	    this.totalSongs = row[1];
	    this.totalPlaylists = row[2];
	    this.totalArtists = row[3];
console.log("U:"+this.totalUsers+" S:"+this.totalSongs+" P:"+this.totalPlaylists+" A:"+this.totalArtists);
	    cb (null, {"totalUsers":this.totalUsers, "totalSongs":this.totalSongs, "totalPlaylists":this.totalPlaylists, "totalArtists":this.totalArtists});
	} else {
	    cb("Record not found");
	}
      });
      connection.end();
    });
};

