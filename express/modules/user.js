var config = require('./config');

module.exports = User;

function User() {
  var googleID = null;
  this.id = null;
  this.email = null;
  this.displayName = null;
};

User.find = function (google_id, cb) {
    googleID = google_id;
    if (config.debug)
	console.log("Find: " + googleID);
    config.getConnPool().getConnection (function(error, connection) {
      if (error) {
	  console.error("Connection Pool Error: " + error.message);
          console.error(error.stack);
	  cb(error);
	  return;
      }
      var sql = "SELECT id, google_display_name, google_email FROM google_user WHERE google_id = "+ googleID + " AND is_active = 1";
      connection.query(sql, function (error, row) {
	if (error) {
	    console.error("SQL Error: " + error.message);
	    cb(error);
	}
	if (row.length == 1) {
	    this.id = row[0].id;
	    this.displayName = row[0].google_display_name;
	    this.email = row[0].google_email;
	    cb(null, this);
	} else {
	    cb("Record not found");
	}
      });
      connection.end();
    });
};
