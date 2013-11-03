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
  var userRsrc = $resource('data/users/:userID.json',
	  {userID:'@userID'},
	  {get: {method: 'GET'},
	   save: {method:'POST'}
	  });
  return (userRsrc);
});

app.factory('Artist', function ($resource, $log) {
  $log.log("Artist Factory");
  var artistRsrc = $resource('api/artists/:artistID',
//var artistRsrc = $resource('data/artists/:artistID.json',
	  {artistID:'@artistID'},
	  {query: {
		method:'GET', isArray:true
//		method:'GET', params:{artistID:'artists'}, isArray:true
		}
	  });
  return (artistRsrc);
});

app.factory('ArtistSongs', function ($resource, $log) {
  $log.log("ArtistSongs Factory");
  var artistSongsRsrc = $resource('api/artists/:artistID/songs',
	  {artistID:'@artistID'},
	  {query: {
		method:'GET', isArray:true
		}
	  });
  return (artistSongsRsrc);
});

app.factory('Playlist', function ($resource, $log) {
  $log.log("Playlist Factory");
  var playlistsRsrc = $resource('api/playlists/:playlistID',
//var playlistRsrc = $resource('data/playlists/:playlistID.json',
	  {playlistID:'@playlistID'},
	  {query: {
		method:'GET', isArray:true
//		method:'GET', params:{playlistID:'playlists'}, isArray:true
		},
	   save: {
		method: 'POST'
		},
	   update: {
		method: 'PUT'
	        },
	   delete: {
		method: 'DELETE'
	        }
	  });
  return (playlistsRsrc);
});

app.factory('PlaylistSongs', function ($resource, $log) {
  $log.log("PlaylistSongs Factory");
  var playlistsRsrc = $resource('api/playlists/:playlistID/songs',
	  {playlistID:'@playlistID'},
	  {query: {
		method:'GET', isArray:true
		},
	   save: {
		method: 'POST', isArray:true
		}
	  });
  return (playlistsRsrc);
});


app.factory('Song', function ($resource, $log) {
  $log.log("Song Factory");
  var songRsrc = $resource('api/songs/:songID',
//var songRsrc = $resource('data/songs/:songID.json',
	  {songID:'@songID'},
	  {query: {
		method:'GET', isArray:true
//		method:'GET', params:{songID:'songs'}, isArray:true
		}
	  });
  return (songRsrc);
});


app.factory('audioControl', function ($document, $log) {
  $log.log("AudioControl");
  var player = $document[0].getElementById('AudioPlayerID');
  return (player);
});

