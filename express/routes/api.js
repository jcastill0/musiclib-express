/*
 * Serve JSON to our AngularJS client
 */

var Playlist = require('../modules/playlist');
var Artist = require('../modules/artist');

exports.name = function (req, res) {
  console.log("api.name:" + req.user.email);
  res.json({
  	name: req.user.displayName
  });
};

exports.playlists = function (req, res) {
  console.log("api.playlists.userID: " + req.user.id);
  Playlist.find(req.user.id, req.playlistID, function (err, data) {
	if (err) {
	    console.error(err);
	    res.send(500, {Error:err});
	} else {
	    res.json(data);
	}
  });
};

exports.artists = function (req, res) {
  console.log("api.artists.userID: " + req.user.id);
  Artist.find(req.user.id, req.artistID, function (err, data) {
	if (err) {
	    console.error(err);
	    res.send(500, {Error:err});
	} else {
	    res.json(data);
	}
  });
};

