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
  $scope.menuHome = "active";
  $scope.menuPlaylists = null;
  $scope.menuArtists = null;
  $scope.menuAdmin = null;
  $scope.menuVideos = null;
  $scope.menuSuggest = null;
  $scope.menuSongs = null;
  $scope.activate = function (menuItem) {
    if (menuItem == 'suggest') {
	$scope.menuHome = null;
	$scope.menuPlaylists = null;
	$scope.menuArtists = null;
	$scope.menuAdmin = null;
	$scope.menuVideos = null;
	$scope.menuSuggest = "active";
	$scope.menuSongs = null;
    } else if (menuItem == 'playlists') {
	$scope.menuHome = null;
	$scope.menuPlaylists = "active";
	$scope.menuArtists = null;
	$scope.menuAdmin = null;
	$scope.menuVideos = null;
	$scope.menuSuggest = null;
	$scope.menuSongs = null;
    } else if (menuItem == 'artists') {
	$scope.menuHome = null;
	$scope.menuPlaylists = null;
	$scope.menuArtists = "active";
	$scope.menuAdmin = null;
	$scope.menuVideos = null;
	$scope.menuSuggest = null;
	$scope.menuSongs = null;
    } else if (menuItem == 'admin') {
	$scope.menuHome = null;
	$scope.menuPlaylists = null;
	$scope.menuArtists = null;
	$scope.menuAdmin = "active";
	$scope.menuVideos = null;
	$scope.menuSuggest = null;
	$scope.menuSongs = null;
    } else if (menuItem == 'videos') {
	$scope.menuHome = null;
	$scope.menuPlaylists = null;
	$scope.menuArtists = null;
	$scope.menuAdmin = null;
	$scope.menuVideos = "active";
	$scope.menuSuggest = null;
	$scope.menuSongs = null;
    } else if (menuItem == 'songs') {
	$scope.menuHome = null;
	$scope.menuPlaylists = null;
	$scope.menuArtists = null;
	$scope.menuAdmin = null;
	$scope.menuVideos = null;
	$scope.menuSuggest = null;
	$scope.menuSongs= "active";
    } else {
	$scope.menuHome = "active";
	$scope.menuPlaylists = null;
	$scope.menuArtists = null;
	$scope.menuAdmin = null;
	$scope.menuVideos = null;
	$scope.menuSuggest = null;
	$scope.menuSongs = null;
    }
  };
});

app.controller('HomeCtrl', function($scope, $log, RecentSongs, RecentVideos, PopularSongs, Stats) {
  $log.log("HomeCtrl");
  $scope.songs = RecentSongs.query();
  $scope.popularSongs = PopularSongs.query();
  $scope.videos = RecentVideos.query();
  $scope.stats = Stats.get();
});

app.controller('OAuthCtrl', function($scope, $http, $log) {
  $log.log("OAuthCtrl");
});

app.controller('AuthCtrl', function($scope, Auth, $log, $location) {
  $log.log("AuthCtrl");
  Auth.get();
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
      $scope.$apply();
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
			$location.path('/playlists');
		    });
		} else
			$location.path('/playlists');
	});
    } else {
	$log.log("PlaylistDetailCtrl.update: " + $scope.playlist.name);
	Playlist.update({playlistID:$routeParams.playlistID, name:$scope.playlist.name}, function (uData) {
		$log.log("PlaylistDetailCtrl.Playlist.update.cb: "+uData.affectedRows);
		PlaylistSongs.save({playlistID:$routeParams.playlistID, addSongs:addSongs, remSongs:remSongs}, function (sData) {
			$log.log("PlaylistDetailCtrl.PlaylistSongs.save.cb:" + sData.addedRows);
			$location.path('/playlists');
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
	alert("Saved!");
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

app.controller('VideoCtrl', function($scope, $log, $http, Video) {
  $log.log("VideoCtrl");
  $scope.videos = Video.query();
  $http({method: 'GET', url: '/musiclib/api/name'}).
    success(function(data, status, headers, config) {
	    $scope.name = data.name;
    	    $scope.su = data.su}).
    error(function (data, status, headers, config) {$scope.name = 'Error!'});
});


app.controller('VideoDetailCtrl', function($scope, $routeParams, $log, $location, Video, Artist) {
  $log.log("VideoDetailCtrl");
  $scope.artists = Artist.query();
  $scope.name = null;
  $scope.url = null;
  $scope.embedded = null;
  $scope.artistID = null;
  $scope.save = function () {
	Video.save({name:$scope.name, url:$scope.url, embedded:$scope.embedded, artistID:$scope.artistID}, function(data) {
		$log.log ("VideoDetailCtrl.save.cb:" + data);
	});
	$location.path('/videos');
  };
});

app.controller('VideoDelCtrl', function($scope, $routeParams, $log, Video) {
  $log.log("VideoDelCtrl:" + $routeParams.videoID);
  Video.del({videoID:$routeParams.videoID});
  $scope.videos = Video.query();
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
    $location.path('/home');
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

///////////////////////////////////////////

app.controller('SongCtrl', function($scope, $routeParams, $log, SearchSongs) {
  $scope.songs = null;
  $scope.queryTerm = null;
  $scope.search = function () {
    $log.log("SongCtrl:" + $scope.queryTerm);
    if (($scope.queryTerm != null) && ($scope.queryTerm != "") && ($scope.queryTerm.length > 1))
	$scope.songs = SearchSongs.query({queryTerm:$scope.queryTerm});
  };
});

app.controller('SongDetailCtrl', function($scope, $routeParams, $log, SearchSongs, Song) {
  $scope.songs = null;
  $scope.queryTerm = null;
  $scope.collapse = true;
  $scope.search = function () {
    $log.log("SongDetailCtrl:" + $scope.queryTerm);
    if (($scope.queryTerm != null) && ($scope.queryTerm != "") && ($scope.queryTerm.length > 1))
	$scope.songs = SearchSongs.query({queryTerm:$scope.queryTerm});
  };
  $scope.toggleSongForm = function(song) {
    if (song.isSelected == undefined) {
	song.isSelected = true;
    } else {
	song.isSelected = !song.isSelected;
    }
  };

  $scope.update = function(song) {
    $log.log("SongDetailCtrl.update: " + song.name);
    Song.update({songID:song.id, name:song.name, filePath:song.file_path, artistID:song.artistID}, function (uData) {
	$log.log("SongDetailCtrl.Song.update.cb: "+uData.affectedRows);
    });
  };

});


app.controller('SongAddCtrl', function($scope, $log, $location, Song, Artist) {
  $scope.songName = null;
  $scope.songFilePath = null;
  $scope.artistID = null;
  $scope.artists = Artist.query();

  $scope.save = function() {
    $log.log("SongAddCtrl.save: "+$scope.songName+" artistID:"+$scope.artistID);
    Song.save({name:$scope.songName, filePath:$scope.songFilePath, artistID:$scope.artistID}, function (newSong) {
	$log.log("SongAddCtrl.Song.save.cb: " + newSong.id);
	$location.path('/admin');
    });
  };
});

app.controller('SongUploadCtrl', function($scope, $log, $http, $location, Artist) {
  $scope.artistID = null;
  $scope.artists = Artist.query();

  $scope.save = function() {
    $log.log("SongUploadCtrl.save: artistID:"+$scope.artistID);
    $http({ method:'POST',
	    data:{artistID:$scope.artistID},
	    url: 'musiclib/api/songs/upload'}).
	success(function(data, status,  headers, config) {
		$log.log("SongAddCtrl.Song.upload.cb: " + data);
		$location.path('/admin');}).
	error(function(data, status, headers, config) {
		$log.error('Status:' + data);
		$location.path('/admin');});
  };
});


/////////////////////////////////////////////
app.controller('MyCtrl1', function ($scope, $log) {$log.log("MyCtrl1");});
app.controller('MyCtrl2', function ($scope, $log) {$log.log("MyCtrl2");});
