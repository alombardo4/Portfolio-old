'use strict';

angular.module('portfolioApp')
  .controller('MainController', function ($scope, Auth, Projects, Profile) {
    $scope.isAdmin = Auth.isAdmin();



    $scope.init = function() {
      Projects.getProjects().then(function(result) {
        $scope.projects = result.data;
      });
      Profile.getProfile().then(function(result) {
        $scope.profile = result.data;
      });

    };
  });
