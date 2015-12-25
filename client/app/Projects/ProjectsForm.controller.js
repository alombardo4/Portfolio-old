'use strict';

angular.module('portfolioApp')
  .controller('ProjectsFormCtrl', function ($scope, $state, Projects, Auth, $mdToast, $location, Upload, $mdDialog) {
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
    };

    $scope.deleteProject = function() {
      var confirm = $mdDialog.confirm()
                      .title('Are you sure you want to delete this project?')
                      .content('This action cannot be undone.')
                      .ok('Delete')
                      .cancel('Cancel');
      $mdDialog.show(confirm).then(function() {
        Projects.removeProject($scope.project).then(function() {
          $location.path('/Projects');
          $mdToast.show(
            $mdToast.simple()
              .textContent('Project deleted!')
              .hideDelay(1000)
          );
        });
      }, function() {

      });
    };

    $scope.saveCreate = function() {
      Projects.createProject($scope.project).then(function(result) {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Created project!')
            .hideDelay(1000)
        );
        $location.path('/Projects/' + result.data._id);
      });
    };
    $scope.saveUpdate = function() {
      console.log('updating');
      Projects.updateProject($scope.project).then(function() {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Saved project!')
            .hideDelay(1000)
        );
        $location.path('/Projects/' + $scope.project._id);

      });
    };
    $scope.removeImage = function(image, index) {
      var confirm = $mdDialog.confirm()
                      .title('Are you sure you want to remove this image?')
                      .content('This action cannot be undone.')
                      .ok('Remove')
                      .cancel('Cancel');
      $mdDialog.show(confirm).then(function() {
        var project = $scope.project;
        project.files.splice(index, 1);
        Projects.removeImage(project, index).then(function() {
          $scope.init();
          $mdToast.show(
            $mdToast.simple()
              .textContent('File deleted!')
              .hideDelay(1000)
          );
        });
      }, function() {

      });

    };

    $scope.upload = function (file) {
      Upload.upload({
        url: '/api/projects/' + $scope.project._id + '/addImage',
        method: 'POST',
        file: file
      }).progress(function(event) {
        $scope.progressPercentage = parseInt(100.0 * event.loaded / event.total);
        $scope.$apply();
      }).success(function(/*data, status, headers, config*/) {
        $scope.init();
        $mdToast.show(
          $mdToast.simple()
            .textContent('Upload complete!')
            .hideDelay(1000)
        );
      }).error(function(err) {
        $scope.uploadInProgress = false;
        console.log('error status: ' + err);
        $mdToast.show(
          $mdToast.simple()
            .textContent('An error occurred.')
            .hideDelay(1000)
        );
      });
    };
  });
