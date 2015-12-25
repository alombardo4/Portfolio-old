'use strict';

angular.module('portfolioApp')
  .controller('ProjectsFormCtrl', function ($scope, $state, Projects, Auth, $mdToast, $location) {
    $scope.isAdmin = Auth.isAdmin();
    $scope.init = function() {
      if ($state.current.name === 'CreateProject') {
        $scope.project = {};
        $scope.project.date = new Date();
        $scope.mode = 'create';
      } else if ($state.current.name === 'EditProject') {

        $scope.mode = 'edit';
        Projects.getProject($state.params.projectId).then(function(result) {
          $scope.project = result.data;
          $scope.project.date = new Date($scope.project.date);
        });
      }
    };
    $scope.saveProject = function() {
      console.log('saving');
      if ($scope.mode === 'create') {
        $scope.saveCreate();
      } else if ($scope.mode === 'edit') {
        $scope.saveUpdate();
      }
    }
    $scope.saveCreate = function() {
      Projects.createProject($scope.project).then(function(result) {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Created project!')
            .hideDelay(1000)
        );
        $location.path('/Projects/' + result.data._id);
      })
    };
    $scope.saveUpdate = function() {
      console.log('updating');
      Projects.updateProject($scope.project).then(function(result) {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Saved project!')
            .hideDelay(1000)
        );
        $location.path('/Projects/' + $scope.project._id);

      })
    }
  });
