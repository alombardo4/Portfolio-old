'use strict';

angular.module('portfolioApp')
  .service('Profile', function ($http) {
    var factory = {};
    factory.getProfile = function() {
      return $http.get('/api/profile');
    };
    factory.createProfile = function(profile) {
      return $http.post('/api/profile/', profile);
    };
    factory.updateProfile = function(profile) {
      return $http.put('/api/profile/', profile);
    };
    return factory;
    // AngularJS will instantiate a singleton by calling "new" on this function
  });
