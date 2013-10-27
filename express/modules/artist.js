var config = require('./config');

module.exports = Artist;

function Artist() {
  this.id = null;
  this.name = null;
};


Artist.find = function (userID, artistID, cb) {
  if (config.debug)
      console.log("Find Artist for ArtistID:" + artistID);
  config.getConnPool().getConnection (function(error, connection) {
      if (error) {
	  console.error("Connection Pool Error: " + error.message);
          console.error(error.stack);
	  cb(error);
	  return;
      }
      var sql = "SELECT id, name FROM artist";
      if ((artistID != undefined) && (artistID != null))
	  sql = sql + " WHERE id = " + artistID;
      connection.query(sql, function (error, rows) {
	if (error) {
	    console.error("SQL Error: " + error.message);
	    cb(error);
	}
	if (config.debug)
	    console.log("Artists found:" + JSON.stringify(rows));
	if (rows.length == 1) {
	    cb(null, rows[0]);
	} else if (rows.length > 1) {
	    cb(null, rows);
	} else {
	    cb("Artist not found");
	}
      });
      connection.end();
  });
};


