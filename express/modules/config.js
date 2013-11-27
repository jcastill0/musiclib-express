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

// Google stuff
var callbackPath = "/auth/oauth2callback";
exports.google_callback_dev = "http://localhost:3000" + callbackPath;
exports.google_callback_prod= "http://www.guantanamera.us" + callbackPath;
exports.googleClientSecret = "gRR2ir5camkaMzqukmFmw7fS";
exports.googleClientID = "680561429810.apps.googleusercontent.com";
exports.googleScope = "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";

exports.getConnPool = function() {return (connPool);};

exports.createConnPool = function() {
  connPool = mysql.createPool({
	host     : dBparms.host,
	user     : dBparms.user,
	password : dBparms.password,
	database : dBparms.dB
	});
};
