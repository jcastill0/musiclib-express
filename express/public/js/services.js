'use strict';

/* Services */

// In this case it is a simple value service.
//angular.module('myMusicLib.services', []).value('version', '0.1');

app.value('version', '0.2');

app.service('authService', function ($http, $log) {
    this.login = function (scope, formData) {
	$http.post('auth/login', formData)
		.success(function(data, status, headers, config) {
			$log.log("SUCCESS:" + status);
			scope.loggedIn = true;
			return (true);
		})
		.error(function(data, status, headers, config) {
			$log.log("Login Error: " + status);
			scope.loggedIn = true;	// for now
			return (false);
		});
    };
    this.logout = function() {
	$http.get('auth/logout')
		.success(function(data, status, headers, config) {
			return(true);
		})
		.error(function(data, status, headers, config) {
			$log.log("Logout Error: " + status);
			return ("Request failed:" + status);
		});
    };
});

app.factory('User', function ($resource, $log) {
  $log.log("User Factory");
  var userRsrc = $resource('data/users/:userID.json',
	  {userID:'@userID'},
	  {get: {
		method: 'GET'
		},
	   save: {
		method:'POST'
		}
	  });
  return (userRsrc);
});

app.factory('Artist', function ($resource, $log) {
  $log.log("Artist Factory");
  var artistRsrc = $resource('data/artists/:artistID.json',
	  {artistID:'@artistID'},
	  {query: {
		method:'GET', params:{artistID:'artists'}, isArray:true
		}
	  });
  return (artistRsrc);
});

app.factory('Playlist', function ($resource, $log) {
  $log.log("Playlist Factory");
  var playlistRsrc = $resource('data/playlists/:playlistID.json',
	  {playlistID:'@playlistID'},
	  {query: {
		method:'GET', params:{playlistID:'playlists'}, isArray:true
		},
	   delete: {
		method:'DELETE'
		   }
	  });
  return (playlistRsrc);
});

app.factory('Song', function ($resource, $log) {
  $log.log("Song Factory");
  var songRsrc = $resource('data/songs/:songID.json',
	  {songID:'@songID'},
	  {query: {
		method:'GET', params:{songID:'songs'}, isArray:true
		}
	  });
  return (songRsrc);
});


app.factory('audioControl', function ($document, $log) {
  $log.log("AudioControl");
  var player = $document[0].getElementById('AudioPlayerID');
  return (player);
});

