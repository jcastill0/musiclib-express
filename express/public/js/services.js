'use strict';

/* Services */

//angular.module('myMusicLib.services', []).value('version', '0.1');

app.value('version', '0.2');

app.service('authService', function ($http, $log) {
    this.login = function (scope, formData) {
	$http.post('auth/login', formData)
		.success(function(data, status, headers, config) {
			scope.loggedIn = true;
			return (true);
		})
		.error(function(data, status, headers, config) {
			scope.loggedIn = true;	// for now
			return (false);
		});
    };
    this.logout = function() {
	$http.get('auth/logout')
		.success(function(data,status,headers,config) {return(true);})
		.error(function(data, status, headers, config) {
			return ("Request failed:" + status);
		});
    };
});

app.factory('User', function ($resource, $log) {
  $log.log("User Factory");
  var userRsrc = $resource('musiclib/api/users',
	  {userID:'@userID'},
	  {get: {method: 'GET', isArray:true}
	  });
  return (userRsrc);
});

app.factory('Artist', function ($resource, $log) {
  $log.log("Artist Factory");
  var artistRsrc = $resource('musiclib/api/artists/:artistID',
	  {artistID:'@artistID'},
	  {query: {
		method:'GET', isArray:true
		}
	  });
  return (artistRsrc);
});

app.factory('ArtistSongs', function ($resource, $log) {
  $log.log("ArtistSongs Factory");
  var artistSongsRsrc = $resource('musiclib/api/artists/:artistID/songs',
	  {artistID:'@artistID'},
	  {query: {
		method:'GET', isArray:true
		}
	  });
  return (artistSongsRsrc);
});

app.factory('Playlist', function ($resource, $log) {
  $log.log("Playlist Factory");
  var playlistsRsrc = $resource('musiclib/api/playlists/:playlistID',
	  {playlistID:'@playlistID'},
	  {query: {
		method:'GET', isArray:true
		},
	   save: {
		method: 'POST'
		},
	   update: {
		method: 'PUT'
		},
	   del: {
		method: 'DELETE'
		},
	   get: {
		method: 'GET', isArray:false
		}
	  });
  return (playlistsRsrc);
});

app.factory('PlaylistSongs', function ($resource, $log) {
  $log.log("PlaylistSongs Factory");
  var playlistsRsrc = $resource('musiclib/api/playlists/:playlistID/songs',
	  {playlistID:'@playlistID'},
	  {query: {
		method:'GET', isArray:true
		},
	   save: {
		method: 'POST'
		}
	  });
  return (playlistsRsrc);
});


app.factory('RecentSongs', function ($resource, $log) {
  $log.log("RecentSongs Factory");
  var songRsrc = $resource('musiclib/api/recentSongs',
	  {songID:'@songID'},
	  {query: {
		method:'GET', isArray:true
		}
	  });
  return (songRsrc);
});


app.factory('Song', function ($resource, $log) {
  $log.log("Song Factory");
  var songRsrc = $resource('musiclib/api/songs/:songID',
	  {songID:'@songID'},
	  {query: {
		method:'GET', isArray:true
		}
	  });
  return (songRsrc);
});


app.factory('Suggestion', function ($resource, $log) {
  $log.log("Suggestion Factory");
  var suggestionRsrc = $resource('musiclib/api/suggestion',
	  {suggestionID:'@suggestionID'},
	  {save: {method: 'POST'}
	  });
  return (suggestionRsrc);
});


app.factory('Stats', function ($resource, $log) {
  $log.log("Stats Factory");
  var statsRsrc = $resource('musiclib/api/stats',
	  {query: {
		method:'GET'
		}
	  });
  return (statsRsrc);
});

app.factory('audioControl', function ($document, $log) {
  $log.log("AudioControl");
  var player = $document[0].getElementById('AudioPlayerID');
  return (player);
});

