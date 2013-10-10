var mysql = require('mysql');

var dBparms = {
    host	: "127.0.0.1",
    dB		: "musicdb",
    user	: "musicuser",
    password	: "musicuser"
};
var connPool = null;

exports.serverPort = "3000";
exports.debug = false;
exports.google_callback_dev = "http://localhost:3000/oauth2callback";
exports.google_callback_prod= "http://www.guantanamera.us/oauth2callback";

exports.getConnPool = function() {return (connPool);};

exports.createConnPool = function() {
  connPool = mysql.createPool({
	host     : dBparms.host,
	user     : dBparms.user,
	password : dBparms.password,
	database : dBparms.dB
	});
};
