/*
 * Serve JSON to our AngularJS client
 */

var Playlist = require('../modules/playlist');
var Artist = require('../modules/artist');
var Song = require('../modules/song');
var User = require('../modules/user');
var Stats = require('../modules/stats');
var config = require('../modules/config');

exports.name = function (req, res) {
  if (config.debug)
      console.log("musiclib.api.name:" + req.user.email);
  res.json({
	name: req.user.displayName,
  	su: req.user.isSU});
};

exports.users = function (req, res) {
  if (config.debug)
      console.log("api.users");
  User.findAll(function (err, data) {
	if (err) {
	    console.error(err);
	    res.send(500, {Error:err});
	} else {
	    res.json(data);
	}
  });
};

exports.stats = function (req, res) {
  if (config.debug)
      console.log("api.stats");
  Stats.getAll(function (err, data) {
	if (err) {
	    console.error(err);
	    res.send(500, {Error:err});
	} else {
	    res.json(data);
	}
  });
};

exports.suggestion = function (req, res) {
  if (config.debug)
      console.log("api.suggestion");
  console.log("USER:" + req.user.id);
  console.log("FROM:" + req.body.from);
  console.log("MSG:" + req.body.message);
  res.send (200);
};


exports.playlists = function (req, res) {
  if (config.debug)
      console.log("api.playlists.playlistID: " + req.params.playlistID);
  Playlist.find(req.user.id, req.params.playlistID, function (err, data) {
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

exports.recentSongs = function (req, res) {
  if (config.debug)
      console.log("api.recentSongs");
  Song.findRecent(req.user.id, function (err, data) {
	if (err) {
	    console.error(err);
	    res.send(500, {Error:err});
	} else {
	    res.json(data);
	}
  });
};

exports.updatePlaylistSongs = function (req, res) {
  if (config.debug)
      console.log("api.updatePlaylistSongs.playlistID: "+req.params.playlistID);
  Playlist.updateSongs(req.user.id, req.params.playlistID, req.body.addSongs, req.body.remSongs, function (err, data) {
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
  Playlist.update(req.user.id, req.params.playlistID, req.body.name, function (err, data) {
	if (err) {
	    console.error(err);
	    res.send(500, {Error:err});
	} else {
	    res.json(data);
	}
  });
};


exports.deletePlaylist = function (req, res) {
  if (config.debug)
      console.log("api.deletePlaylist");
  Playlist.delete(req.user.id, req.params.playlistID, function (err, data) {
	if (err) {
	    console.error(err);
	    res.send(500, {Error:err});
	} else {
	    res.json(data);
	}
  });
};

