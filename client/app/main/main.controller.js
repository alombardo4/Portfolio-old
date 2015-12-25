'use strict';

angular.module('portfolioApp')
  .controller('MainController', function ($scope, Auth, Projects) {
    $scope.isAdmin = Auth.isAdmin();

    $scope.profile = {
      name: 'Alec Lombardo'
      
    };

    $scope.init = function() {
      Projects.getProjects().then(function(result) {
        $scope.projects = result.data;
      });

    };
  });
