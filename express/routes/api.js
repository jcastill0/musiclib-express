/*
 * Serve JSON to our AngularJS client
 */

var Playlist = require('../modules/playlist');
var Artist = require('../modules/artist');
var Song = require('../modules/song');
var Video = require('../modules/video');
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
      console.log("api.suggestion:" + req.user.id);
  var message = {
	from: req.user.displayName + " <" + req.user.email + ">",
	to: config.getMyEmail(),
	subject: 'Suggestion Request from ' + req.body.from,
	text: req.body.message
  };
  config.getMailTransport().sendMail (message, function (err, response) {
	if (err) {
	    console.error(err);
	    res.send(500, {Error:err});
	} else {
	    res.json(response);
	}
  });
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

exports.searchSongs = function (req, res) {
  if (config.debug)
      console.log("api.songs.term: " + req.params.queryTerm);
  Song.search(req.user.id, req.params.queryTerm, function (err, data) {
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

exports.createSong = function (req, res) {
  if (config.debug)
      console.log("api.createSong");
  Song.create(req.user.id, req.body.name, req.body.filePath, req.body.artistID, function (err, data) {
	if (err) {
	    console.error(err);
	    res.send(500, {Error:err});
	} else {
	    res.json({id:data});
	}
  });
};

exports.updateSong = function (req, res) {
  if (config.debug)
      console.log("api.updateSong");
  Song.update(req.user.id, req.params.songID, req.body.name, req.body.filePath, req.body.artistID, function (err, data) {
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

exports.popularSongs = function (req, res) {
  if (config.debug)
      console.log("api.popularSongs");
  Song.mostPopularSongs(req.user.id, function (err, data) {
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


exports.videos = function (req, res) {
  if (config.debug)
      console.log("api.videos.videoID: " + req.params.videoID);
  Video.find(req.user.id, req.params.videoID, function (err, data) {
	if (err) {
	    console.error(err);
	    res.send(500, {Error:err});
	} else {
	    res.json(data);
	}
  });
};

exports.recentVideos = function (req, res) {
  if (config.debug)
      console.log("api.recentVideos");
  Video.findRecent(req.user.id, function (err, data) {
	if (err) {
	    console.error(err);
	    res.send(500, {Error:err});
	} else {
	    res.json(data);
	}
  });
};

exports.createVideo = function (req, res) {
  if (config.debug)
      console.log("api.createVideo");
  Video.create(req.user.id, req.body.name, req.body.url, req.body.embedded, req.body.artistID, function (err, data) {
	if (err) {
	    console.error(err);
	    res.send(500, {Error:err});
	} else {
	    res.json({id:data});
	}
  });
};

exports.deleteVideo = function (req, res) {
  if (config.debug)
      console.log("api.deleteVideo");
  Video.delete(req.user.id, req.params.videoID, function (err, data) {
	if (err) {
	    console.error(err);
	    res.send(500, {Error:err});
	} else {
	    res.json(data);
	}
  });
};


