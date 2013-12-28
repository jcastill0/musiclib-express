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
  $http({method: 'GET', url: '/musiclib/api/name'}).
    success(function(data, status, headers, config) {
	    $scope.name = data.name;
    	    $scope.su = data.su}).
    error(function (data, status, headers, config) {$scope.name = 'Error!'});
});

app.controller('HomeCtrl', function($scope, $log, RecentSongs, Stats) {
  $log.log("HomeCtrl");
  $scope.songs = RecentSongs.query();
  $scope.stats = Stats.get();
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
  Playlist.del({playlistID:$routeParams.playlistID});
  $scope.playlists = Playlist.query();
});

app.controller('PlaylistCtrl', function($scope, $log, Playlist) {
  $log.log("PlaylistCtrl");
  $scope.playlists = Playlist.query();
});

app.controller('PlayCtrl', function($scope, $routeParams, Playlist, PlaylistSongs, $log, audioControl) {
  $log.log("PlayCtrl:" + $routeParams.playlistID);
  $scope.playlist = Playlist.get({playlistID:$routeParams.playlistID});
  $scope.playlistSongs = PlaylistSongs.query({playlistID:$routeParams.playlistID});
  var ix = 0;
  $scope.currentlyPlaying = null;
  audioControl.addEventListener('ended', function() {
      ix = ix + 1;
      if (ix >= $scope.playlistSongs.length) {
	  return;
      }
      var song = $scope.playlistSongs[ix];
      $log.log("PlayCtrl.addEventListener.cb Play["+ix+"]: " + song.name);
      audioControl.src = song.path;
      $scope.currentlyPlaying = song.name;
      audioControl.play();
  });

  $scope.startPlaying = function () {
      ix = 0;
      if ($scope.playlistSongs.length == 0) {
	  alert("Empty Playlist");
	  return;
      }
      var song = $scope.playlistSongs[ix];
      $log.log("PlayCtrl.startPlaying Play["+ix+"]: " + song.name);
      audioControl.src = song.path;
      $scope.currentlyPlaying = song.name;
      audioControl.play();
  };
});

app.controller('PlaylistDetailCtrl', function($scope, $routeParams, Playlist, PlaylistSongs, Song, $location, $log) {
  if ($routeParams.playlistID == undefined) {
      $log.log("PlaylistDetailCtrl.Add");
      $scope.playlist = null;
      $scope.playlistSongs = [];
  } else {
      $log.log("PlaylistDetailCtr:" + $routeParams.playlistID);
      $scope.playlist = Playlist.get({playlistID:$routeParams.playlistID});
      $scope.playlistSongs = PlaylistSongs.query({playlistID:$routeParams.playlistID});
  }
  $scope.songs = Song.query();
  var addSongs = [];
  var remSongs = [];

  $scope.addSong = function(song) {
    $log.log("PlaylistDetailCtrl.addSong: " + song.name);
    $scope.playlistSongs.push(song);	// add to playlist
    addSongs.push(song);
    var index = 0;
    var songIDtoBeRemoved = song.id;
    angular.forEach(remSongs, function(s) {
	if (s.id == songIDtoBeRemoved) {
	    remSongs.splice(index, 1);
	}
	index++
    });
  };
  $scope.removeSong = function(song) {
    var songIDtoBeRemoved = song.id;
    var index = 0;
    $log.log ("PlaylistDetailCtrl.removeSong: " + song.name);
    angular.forEach($scope.playlistSongs, function(s) {
	if (s.id == songIDtoBeRemoved) {
	    $scope.playlistSongs.splice(index, 1);
	}
	index++;
    });
    var foundInAddList = false;
    angular.forEach(addSongs, function (s) {
	if (s.id == songIDtoBeRemoved) {
	    addSongs.splice(index, 1);
	    foundInAddList = true;
	}
	index++;
    });
    if (!foundInAddList)
	remSongs.push(song);
  };

  $scope.save = function() {
    if ($routeParams.playlistID == undefined) {
	$log.log("PlaylistDetailCtrl.save: " + $scope.playlist.name);
	Playlist.save({name:$scope.playlist.name}, function (newPlaylist) {
		$log.log("PlaylistDetailCtrl.Playlist.save.cb: " + newPlaylist.id);
		if ($scope.playlistSongs.length != 0) {
		    var emptyList = [];
		    PlaylistSongs.save({playlistID:newPlaylist.id, addSongs:$scope.playlistSongs, remSongs:emptyList}, function (sData) {
			$log.log("PlaylistDetailCtrl.PlaylistSongs.save.cb:" + sData.addedRows);
			$location.path('/');
		    });
		} else
			$location.path('/');
	});
    } else {
	$log.log("PlaylistDetailCtrl.update: " + $scope.playlist.name);
	Playlist.update({playlistID:$routeParams.playlistID, name:$scope.playlist.name}, function (uData) {
		$log.log("PlaylistDetailCtrl.Playlist.update.cb: "+uData.affectedRows);
		PlaylistSongs.save({playlistID:$routeParams.playlistID, addSongs:addSongs, remSongs:remSongs}, function (sData) {
			$log.log("PlaylistDetailCtrl.PlaylistSongs.save.cb:" + sData.addedRows);
			$location.path('/');
    		});
	});
    };
  };

});



/////////////////////////////
app.controller('ArtistCtrl', function($scope, $log, Artist) {
  $log.log("ArtistCtrl");
  $scope.artists = Artist.query();
});


app.controller('ArtistDetailCtrl', function($scope, $routeParams, $log, $location, Artist, Playlist, ArtistSongs, PlaylistSongs) {
  $log.log("ArtistDetailCtrl:" + $routeParams.artistID);
  $scope.artist = Artist.get({artistID:$routeParams.artistID});
  $scope.playlists = Playlist.query();
  $scope.songs = ArtistSongs.query({artistID:$routeParams.artistID});
  var localSongs = [];
  var selectedPlaylist = null;

  $scope.save = function() {
    if (selectedPlaylist == null) {
	alert("Must select a Playlist first");
	return;
    }
    if (localSongs.length <= 0) {
	alert("No songs added");
	return;
    }
    $log.log("ArtistDetailCtrl.save:" + selectedPlaylist.name);
    var emptyList = [];
    PlaylistSongs.save({playlistID:selectedPlaylist.id, addSongs:localSongs, remSongs:emptyList}, function (sData) {
	$log.log("ArtistDetailCtrl.PlaylistSongs.save.cb:" + sData.addedRows);
//	$location.path('/');
    });
  };

  function addSongToPlaylist(song) {
    $log.log("ArtistDetailCtrl.addSongToPlaylist: " + song.name);
    localSongs.push(song); 
  };
  function removeSongFromPlaylist(song) {
    $log.log("ArtistDetailCtrl.removeSongFromPlaylist: " + song.name);
    var songIDtoBeRemoved = song.id;
    var index = 0;
    angular.forEach(localSongs, function(song) {
	if (song.id == songIDtoBeRemoved) {
	    localSongs.splice(index, 1);
	}
	index++;
    });
  };

  $scope.songChecked = function(song) {
    $log.log("ArtistDetailCtrl.songChecked: "+song.name+" CHECK:" + song.isSelected);
    if (song.isSelected) {
	addSongToPlaylist(song);
    } else {
	removeSongFromPlaylist(song);
    }
  };

  $scope.playlistSelected = function (playlist) {
    $log.log("ArtistDetailCtrl.playlistSelected: " + playlist.name);
    selectedPlaylist = playlist;
  };
});

////////////////////////////////////////////////

app.controller('UserCtrl', function($scope, $log, User) {
  $log.log("UserCtrl");
  $scope.users = User.query();
});

app.controller('SuggestionCtrl', function($scope, $log, $location, Suggestion) {
  $log.log("SuggestionCtrl");
  $scope.from = null;
  $scope.message = null;
  $scope.submitSuggestion = function () {
    Suggestion.save({from:$scope.from, message:$scope.message}, function(result) {
	$log.log("SuggestionCtrl.Suggestion.save.cb:" + result);
    });
    $location.path('/');
  };
});

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
