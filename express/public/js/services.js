'use strict';

/* Services */


// Demonstrate how to register services
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


