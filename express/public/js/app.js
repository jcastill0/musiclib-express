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
	templateUrl: 'partials/welcome',
	controller: 'WelcomeCtrl'
    })
    .when('/view1', {
	templateUrl: 'partials/partial1',
	controller: 'MyCtrl1'
    })
    .when('/view2', {
	templateUrl: 'partials/partial2',
	controller: 'MyCtrl2'
    })
    .when('/auth/login', {
	templateUrl: 'partials/welcome',
	controller: 'AuthCtrl'
    })
    .when('/auth/logout', {
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
