'use strict';

// Declare app level module which depends on filters, and services

var app = angular.module('myMusicLib', [
	'ngResource',
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
    .when('/view1', {
	templateUrl: 'partials/partial1',
	controller: 'MyCtrl1'
    })
    .when('/view2', {
	templateUrl: 'partials/partial2',
	controller: 'MyCtrl2'
    })
    .when('/musiclib/auth/google', {
	templateUrl: 'musiclib/auth/google',
	controller: 'OAuthCtrl'
    })
    .when('/musiclib/auth/login', {
	templateUrl: 'partials/welcome',
	controller: 'AuthCtrl'
    })
    .when('/musiclib/auth/logout', {
	templateUrl: '/',
	controller: 'AuthCtrl'
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
