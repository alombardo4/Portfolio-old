'use strict';

angular.module('portfolioApp')
  .filter('HTMLString', function ($sce) {
    return function(input) {
      return $sce.trustAsHtml(input);
    }
  });
