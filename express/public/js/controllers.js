'use strict';

/* Controllers */

/*
angular.module('myMusicLib.controllers', []).
  controller('AppCtrl', function ($scope, $http) {$http({method: 'GET', url: '/api/name'}).
    success(function(data, status, headers, config) {$scope.name = data.name;}).
    error(function (data, status, headers, config) {$scope.name = 'Error!'});
  }).
  controller('MyCtrl1', function ($scope) {}).
  controller('MyCtrl2', function ($scope) {});

app.controller('AppCtrl', function ($scope, $http) {
    $http({method: 'GET', url: '/api/name'}).
    success(function(data, status, headers, config) {$scope.name = data.name;}).
    error(function (data, status, headers, config) {$scope.name = 'Error!'});
});*/

app.controller('WelcomeCtrl', function($scope, $http, $log) {
  $log.log("WelcomeCtrl");
  $http({method: 'GET', url: '/api/name'}).
    success(function(data, status, headers, config) {$scope.name = data.name;}).
    error(function (data, status, headers, config) {$scope.name = 'Error!'});
});

app.controller('OAuthCtrl', function($scope, $http, $log) {
  $log.log("OAuthCtrl");
});

app.controller('AuthCtrl', function($scope, authService, $log, $location) {
  $log.log("AuthCtrl");
  $scope.loggedIn = null;
  $scope.loginName = null;
  $scope.password = null;
  $scope.login = function () {
    var formData = {
	'loginName' : $scope.loginName,
	'password'  : $scope.password
    };
    formData = JSON.stringify(formData);
    authService.login($scope, formData);
    $scope.password = null;
  };
  $scope.logout = function() {
    authService.logout();
    $scope.loggedIn = "false";
    $scope.password = null;
    $location.path('/');
  };
});

//////////////////////////////////

app.controller('PlaylistDCtrl', function($scope, $routeParams, $log, Playlist) {
  $log.log("PlaylistDCtrl:" + $routeParams.playlistID);
  //Playlist.delete({playlistID:$routeParams.playlistID});
  $scope.playlists = Playlist.query();
});

app.controller('PlaylistCtrl', function($scope, $log, Playlist) {
  $log.log("PlaylistCtrl");
  $scope.playlists = Playlist.query();
});

app.controller('PlayCtrl', function($scope, $routeParams, Playlist, $log, audioControl) {
  $log.log("PlayCtrl:" + $routeParams.playlistID);
  $scope.playlist = Playlist.get({playlistID:$routeParams.playlistID});
  var ix = 0;
  $scope.currentlyPlaying = null;
  audioControl.addEventListener('ended', function() {
      ix = ix + 1;
      if (ix >= $scope.playlist.songs.length) {
	  return;
      }
      var song = $scope.playlist.songs[ix];
      $log.log("PlayCtrl.addEventListener.cb Play["+ix+"]: " + song.name);
      audioControl.src = song.path;
      $scope.currentlyPlaying = song.name;
      audioControl.play();
  });

  $scope.startPlaying = function () {
      ix = 0;
      if ($scope.playlist.songs.length == 0) {
	  alert("Empty Playlist");
	  return;
      }
      var song = $scope.playlist.songs[ix];
      $log.log("PlayCtrl.startPlaying Play["+ix+"]: " + song.name);
      audioControl.src = song.path;
      $scope.currentlyPlaying = song.name;
      audioControl.play();
  };
});

app.controller('PlaylistDetailCtrl', function($scope, $routeParams, Playlist, Song, $location, $log) {
  $log.log("PlaylistDetailCtrl:" + $routeParams.playlistID);
  $scope.playlist = Playlist.get({playlistID:$routeParams.playlistID});
  $scope.songs = Song.query();

  $scope.addSong = function(song) {
    $log.log("PlaylistDetailCtrl.addSong: " + song.name);
    $scope.playlist.songs.push(song);	// add to playlist
  };
  $scope.removeSong = function(song) {
    var songIDtoBeRemoved = song.id;
    var index = 0;
    $log.log ("PlaylistDetailCtrl.removeSong: " + song.name);
    angular.forEach($scope.playlist.songs, function(song) {
	if (song.id == songIDtoBeRemoved) {
	    $scope.playlist.songs.splice(index, 1);
	}
	index++;
    });
  };

  $scope.save = function() {
    $log.log("PlaylistDetailCtrl.save: " + $scope.playlist.name);
    Playlist.save({playlistID:$routeParams.playlistID}, $scope.playlist, function (playlist) {
	$log.log("PlaylistDetailCtrl.save.cb: " + playlist.name);
	$location.path('/');
    });
  };
});

/////////////////////////////
app.controller('ArtistCtrl', function($scope, $log, Artist) {
  $log.log("ArtistCtrl");
  $scope.artists = Artist.query();
});


app.controller('ArtistDetailCtrl', function($scope, $routeParams, $log, $location, Artist, Playlist) {
  $log.log("ArtistDetailCtrl:" + $routeParams.artistID);
  $scope.artist = Artist.get({artistID:$routeParams.artistID});
  $scope.playlists = Playlist.query();
  var songs = [];
  var selectedPlaylist = null;

  $scope.save = function() {
    if (selectedPlaylist == null) {
	alert("Must select a Playlist first");
	return;
    }
    if (songs.length <= 0) {
	alert("No songs added");
	return;
    }
    $log.log("ArtistDetailCtrl.save:" + selectedPlaylist.name);
    angular.forEach (songs, function (song) {
	selectedPlaylist.songs.push (song);
    });
    Playlist.save({playlistID:selectedPlaylist.id}, selectedPlaylist, function (playlist) {
	$log.log("ArtistDetailCtrl.Playlist.save.cb:" + playlist.name);
	$location.path('/');
    });
  };

  function addSongToPlaylist(song) {
    $log.log("ArtistDetailCtrl.addSongToPlaylist: " + song.name);
    songs.push(song); 
  };
  function removeSongFromPlaylist(song) {
    $log.log("ArtistDetailCtrl.removeSongFromPlaylist: " + song.name);
    var songIDtoBeRemoved = song.id;
    var index = 0;
    angular.forEach(songs, function(song) {
	if (song.id == songIDtoBeRemoved) {
	    songs.splice(index, 1);
	}
	index++;
    });
  };

  $scope.songChecked = function(song, checkedValue) {
    $log.log("ArtistDetailCtrl.songChecked: " + song.name);
    if (checkedValue) {
	addSongToPlaylist(song);
    } else {
	removeSongFromPlaylist(song);
    }
  };

  $scope.playlistSelected = function (playlist) {
    $log.log("ArtistDetailCtrl.playlistSelected: " + playlist.name);
    selectedPlaylist = Playlist.get({playlistID:playlist.id});
  };
});

////////////////////////////////////////////////

app.controller('UserDetailCtrl', function($scope, $routeParams, $log, $location, User) {
  $log.log("UserDetailCtrl:" + $routeParams.userID);
  $scope.user = User.get({userID:$routeParams.userID});

  $scope.save = function () {
	User.save({userID:$routeParams.userID}, $scope.user, function(user) {
		$log.log ("UserDetailCtrl.save.cb:" + user);
	});
	$location.path('/');
  };
});

app.controller('MyCtrl1', function ($scope, $log) {$log.log("MyCtrl1");});
app.controller('MyCtrl2', function ($scope, $log) {$log.log("MyCtrl2");});
