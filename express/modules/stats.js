var config = require('./config');

module.exports = Stats;

function Stats() {
};

Stats.getAll= function (cb) {
    if (config.debug)
	console.log("Stats.getAll");
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
	    cb (null, row[0]);
	} else {
	    cb("Record not found");
	}
      });
      connection.end();
    });
};

