'use strict';

/* Directives */

angular.module('myMusicLib.directives', []).
  directive('appVersion', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  });
