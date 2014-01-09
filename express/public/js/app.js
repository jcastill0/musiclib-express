'use strict';

// Declare app level module which depends on filters, and services

var app = angular.module('myMusicLib', [
	'ngResource',
	'ngRoute',
	'myMusicLib.filters',
	'myMusicLib.directives'
	]);

app.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/welcome', {
	templateUrl: 'welcome',
	controller: 'WelcomeCtrl'
    })
    .when('/playlists', {
	templateUrl: 'partials/playlist/playlists',
	controller: 'PlaylistCtrl'
    })
    .when('/playlists/add', {
	templateUrl: 'partials/playlist/playlistDetail',
	controller: 'PlaylistDetailCtrl'
    })
    .when('/playlists/play/:playlistID', {
	templateUrl: 'partials/playlist/play',
	controller: 'PlayCtrl'
    })
    .when('/playlists/edit/:playlistID', {
	templateUrl: 'partials/playlist/playlistDetail',
	controller: 'PlaylistDetailCtrl'
    })
    .when('/playlists/delete/:playlistID', {
	templateUrl: 'partials/playlist/playlists',
	controller: 'PlaylistDCtrl'
    })
    .when('/artists', {
	templateUrl: 'partials/artist/artists',
	controller: 'ArtistCtrl'
    })
    .when('/artists/:artistID', {
	templateUrl: 'partials/artist/artistDetail',
	controller: 'ArtistDetailCtrl'
    })
    .when('/admin', {
	templateUrl: 'partials/admin/users',
	controller: 'UserCtrl'
    })
    .when('/suggest', {
	templateUrl: 'partials/admin/suggestion',
	controller: 'SuggestionCtrl'
    })
    .when('/auth/google', {
	templateUrl: 'auth/google',
	controller: 'OAuthCtrl'
    })
    .when('/auth/logout', {
	templateUrl: '/',
	controller: 'AuthCtrl'
    })
    .when('/home', {
	templateUrl: 'home',
	controller: 'HomeCtrl'
    })
    .when('/videos', {
	templateUrl: 'partials/video/videos',
	controller: 'VideoCtrl'
    })
    .when('/videos/add', {
	templateUrl: 'partials/video/videoDetail',
	controller: 'VideoDetailCtrl'
    })
    .when('/videos/:videoID', {
	templateUrl: 'partials/video/videoDetail',
	controller: 'VideoDetailCtrl'
    })
    .when('/videos/delete/:videoID', {
	templateUrl: 'partials/video/videos',
	controller: 'VideoDelCtrl'
    })
    .when('/users/:userID', {
	templateUrl: 'partials/profile/userDetail',
	controller: 'UserDetailCtrl'
    })
    .otherwise({
	redirectTo: '/'
    });
  //$locationProvider.html5Mode(true);
});
