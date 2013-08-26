'use strict';

/* Controllers */

/*
angular.module('myMusicLib.controllers', []).
  controller('AppCtrl', function ($scope, $http) {
    $http({method: 'GET', url: '/api/name'
    }).
    success(function(data, status, headers, config) {$scope.name = data.name;}).
    error(function (data, status, headers, config) {$scope.name = 'Error!'});
  }).
  controller('MyCtrl1', function ($scope) {}).
  controller('MyCtrl2', function ($scope) {});
*/

/*app.controller('AppCtrl', function ($scope, $http) {
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

app.controller('AuthCtrl', function($log) {$log.log("AuthCtrl");});

app.controller('UserDetailCtrl', function($scope, $routeParams, $log, $location, User) {
  $log.log("UserDetailCtrl:" + $routeParams.userID);
  $scope.user = User.get({userID:$routeParams.userID});

  $scope.save = function () {
	User.save({userID:$routeParams.userID}, $scope.user, function(user) {
		$log.log (user);
	});
	$location.path('/');
  };
});

app.controller('MyCtrl1', function ($scope, $log) {$log.log("MyCtrl1");});
app.controller('MyCtrl2', function ($scope, $log) {$log.log("MyCtrl2");});
