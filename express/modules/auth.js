var config = require('./config');

module.exports = function(profile, cb) {
  config.getConnPool().getConnection (function(error, connection) {
    if (error) {
	console.error("Connection Pool Error: " + error.message);
        console.error(error.stack);
	cb(error, false);
	return;
    }
    var sql = "SELECT id FROM google_user WHERE google_email ='"+profile.emails[0].value+ "'";
    connection.query(sql, function (error, row) {
      if (error) {
	  console.log("SQL Error: " + error.message);
	  cb(error, false);
      }
      if (row.length == 1) {
	  var id = row[0].id;
	  cb(null, true);
	  sql = "UPDATE google_user SET google_id = '" + profile.id + "', google_display_name = '" + profile.displayName + "', last_login=NOW() WHERE id = " + id;
	  connection.query(sql, function (error, row) {
		if (error) {
		    console.log("SQL Error: " + error.message);
		}
	  });
      } else {
	  cb(null, false);
      }
    });
    connection.release();
  });
};
