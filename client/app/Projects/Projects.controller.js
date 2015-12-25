'use strict';

angular.module('portfolioApp')
  .controller('ProjectsCtrl', function ($scope, Auth, Projects, $state) {
    $scope.isAdmin = Auth.isAdmin();
    $scope.init = function() {
      if ($state.current.name === 'Projects') {
        Projects.getProjects().then(function(result) {
          $scope.projects = result.data;
        });
      } else if ($state.current.name === 'ViewProject') {
        Projects.getProject($state.params.projectId).then(function(result) {
          $scope.project = result.data;
        });
      }

    };
  });
