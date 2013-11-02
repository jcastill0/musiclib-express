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
      console.log("api.songs.songID: " + req.params.songID);
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

exports.playlistSongs = function (req, res) {
  if (config.debug)
      console.log("api.playlistSongs.playlistID: " + req.params.playlistID);
  Song.findByPlaylist(req.user.id, req.params.playlistID, function (err, data) {
	if (err) {
	    console.error(err);
	    res.send(500, {Error:err});
	} else {
	    res.json(data);
	}
  });
};

exports.addPlaylistSongs = function (req, res) {
  if (config.debug)
      console.log("api.addPlaylistSongs.playlistID: " + req.params.playlistID);
  Playlist.addSongs(req.user.id, req.params.playlistID, req.body.songs, function (err, data) {
	if (err) {
	    console.error(err);
	    res.send(500, {Error:err});
	} else {
	    res.json(data);
	}
  });
};

exports.createPlaylist = function (req, res) {
  if (config.debug)
      console.log("api.createPlaylist");
  Playlist.create(req.user.id, req.body.name, function (err, data) {
	if (err) {
	    console.error(err);
	    res.send(500, {Error:err});
	} else {
	    res.json({id:data});
	}
  });
};

exports.updatePlaylist = function (req, res) {
  if (config.debug)
      console.log("api.updatePlaylist");
  Playlist.create(req.user.id, req.params.playlistID, req.body.name, function (err, data) {
	if (err) {
	    console.error(err);
	    res.send(500, {Error:err});
	} else {
	    res.json(data);
	}
  });
};


