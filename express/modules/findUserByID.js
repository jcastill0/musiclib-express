module.exports = function(connPool, googleID, cb) {
  connPool.getConnection (function(error, connection) {
    if (error) {
	console.error("Connection Pool Error: " + error.message);
        console.error(error.stack);
	cb(error, false);
	return;
    }
    var sql = "SELECT id FROM google_user WHERE google_id = "+ googleID;
    connection.query(sql, function (error, row) {
      if (error) {
	  console.log("SQL Error: " + error.message);
	  cb(error);
      }
      if (row.length == 1) {
	  var id = row[0].id;
	  cb(null, id);
      } else {
	  cb("Record not found");
      }
    });
    connection.end();
  });
};
