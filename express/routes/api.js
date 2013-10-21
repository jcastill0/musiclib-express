/*
 * Serve JSON to our AngularJS client
 */

var Playlist = require('../modules/playlist');
var Artist = require('../modules/artist');
var Song = require('../modules/song');
var config = require('../modules/config');

exports.name = function (req, res) {
  if (config.debug)
      console.log("api.name:" + req.user.email);
  res.json({name: req.user.displayName});
};

exports.playlists = function (req, res) {
  if (config.debug)
      console.log("api.playlists.playlistID: " + req.playlistID);
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
  if (config.debug)
      console.log("api.artists.artistID: " + req.params.artistID);
  Artist.find(req.user.id, req.params.artistID, function (err, data) {
	if (err) {
	    console.error(err);
	    res.send(500, {Error:err});
	} else {
	    res.json(data);
	}
  });
};

exports.songs = function (req, res) {
  if (config.debug)
      console.log("api.songs.artistID: " + req.params.songID);
  Song.find(req.user.id, req.params.songID, function (err, data) {
	if (err) {
	    console.error(err);
	    res.send(500, {Error:err});
	} else {
	    res.json(data);
	}
  });
};

exports.artistSongs = function (req, res) {
  if (config.debug)
      console.log("api.artistSongs.artistID: " + req.params.artistID);
  Song.findByArtist(req.user.id, req.params.artistID, function (err, data) {
	if (err) {
	    console.error(err);
	    res.send(500, {Error:err});
	} else {
	    res.json(data);
	}
  });
};
