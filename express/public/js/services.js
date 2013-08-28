'use strict';

/* Services */

// In this case it is a simple value service.
//angular.module('myMusicLib.services', []).value('version', '0.1');

app.value('version', '0.2');

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

app.factory('Artist', function ($resource) {
  var artistRsrc = $resource('data/artists/:artistID.json',
	  {artistID:'@artistID'},
	  {query: {
		method:'GET', params:{artistID:'artists'}, isArray:true
		}
	  });
  return (artistRsrc);
});

app.factory('Playlist', function ($resource) {
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

app.factory('Song', function ($resource) {
  var songRsrc = $resource('data/songs/:songID.json',
	  {songID:'@songID'},
	  {query: {
		method:'GET', params:{songID:'songs'}, isArray:true
		}
	  });
  return (songRsrc);
});


app.factory('audioControl', function ($document) {
  var player = $document[0].getElementById('AudioPlayerID');
  return (player);
});

