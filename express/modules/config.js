var mysql = require('mysql');
var nodemailer = require('nodemailer');

var dBparms = {
    host	: "127.0.0.1",
    dB		: "xxxx",
    user	: "xxxx",
    password	: "xxxx"
};
var connPool = null;

var smtpOptions = {
    service	: "Gmail",
    auth	: {
	user	: "xxx@xxx.com",
	pass	: "xxx"
    },
    debug	: true
};
var smtpTransport = null;

exports.serverPort = "3000";
exports.debug = false;
exports.dataRootDir = "C:/dev/show/musiclib-express/express/public/";

// Google stuff
var callbackPath = "/auth/oauth2callback";
exports.google_callback_dev = "http://localhost:3000" + callbackPath;
exports.google_callback_prod= "http://www.guantanamera.us" + callbackPath;
exports.googleClientSecret = "xxx";
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

exports.getMailTransport = function() {return (smtpTransport);};
exports.getMyEmail = function() {return (smtpOptions.auth.user);};

exports.createMailTransport = function () {
  smtpTransport = nodemailer.createTransport(smtpOptions);
  //smtpTransport = nodemailer.createTransport("direct", {debug:true});
};
