var config = require('./config');

module.exports = Video;

function Video() {
  this.id = null;
  this.name = null;
  this.url = null;
  this.embedded = null;
};


Video.find = function (userID, videoID, cb) {
  if (config.debug)
      console.log("Find Video for VideoID:" + videoID);
  config.getConnPool().getConnection (function(error, connection) {
      if (error) {
	  console.error("Connection Pool Error: " + error.message);
          console.error(error.stack);
	  cb(error);
	  return;
      }
      var sql = "SELECT id, name, url, embedded FROM video ORDER BY name";
      if ((videoID != undefined) && (videoID != null))
	  sql = sql + " WHERE id = " + videoID;
      connection.query(sql, function (error, rows) {
	if (error) {
	    console.error("SQL Error: " + error.message);
	    cb(error);
	}
	if (config.debug)
	    console.log("Videos found:" + JSON.stringify(rows));
	cb(null, rows);
      });
      connection.end();
  });
};


Video.findRecent = function (userID, cb) {
  if (config.debug)
      console.log("Find Recent Videos");
  config.getConnPool().getConnection (function(error, connection) {
      if (error) {
	  console.error("Connection Pool Error: " + error.message);
          console.error(error.stack);
	  cb(error);
	  return;
      }
      var sql = "SELECT id, name, url FROM video ORDER BY created DESC LIMIT 5";
      connection.query(sql, function (error, rows) {
	if (error) {
	    console.error("SQL Error: " + error.message);
	    cb(error);
	}
	if (config.debug)
	    console.log("Videos found:" + JSON.stringify(rows));
	cb(null, rows);
      });
      connection.end();
  });
};

Video.create = function (userID, name, url, embedded, cb) {
  if (config.debug)
      console.log("Create Video for: " + userID);
  config.getConnPool().getConnection (function(error, connection) {
      if (error) {
	  console.error("Connection Pool Error: " + error.message);
          console.error(error.stack);
	  cb(error);
	  return;
      }
      var sql = "INSERT INTO video (name, url, embedded, created) VALUES ('"+name+"', '" + url + "', '" + embedded + "', NOW())";
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

