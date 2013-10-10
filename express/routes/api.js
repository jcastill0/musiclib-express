/*
 * Serve JSON to our AngularJS client
 */

var playlist = require('../modules/playlist');

exports.name = function (req, res) {
  console.log("api.name:" + req.user.email);
  res.json({
  	name: req.user.displayName
  });
};

exports.playlists = function (req, res, connPool) {
  console.log("api.playlists:" + req);
  console.log("api.playlists.userID: " + req.user.id);
  console.log("api.playstlis.playstlistID: " + req.playlistID);
  playlist.find(connPool, req.user.id, req.playlistID, function (err, data) {
	if (err) {
	    console.error(err);
	    res.json({xxx:"XXX"});
	} else {
	    res.json(data);
	}
  });
};
