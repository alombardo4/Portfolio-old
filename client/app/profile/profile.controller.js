'use strict';

angular.module('portfolioApp')
  .controller('ProfileCtrl', function ($scope, $state, Auth, $mdToast, $location, Upload, $mdDialog, Profile) {
    $scope.isAdmin = Auth.isAdmin();
    $scope.init = function() {
      Profile.getProfile().then(function(result) {
        if (result.data === '') {
          $scope.mode = 'create';
        } else {
          $scope.mode = 'edit';
          $scope.profile = result.data;
        }
      });
    };
    $scope.saveProfile = function() {
      if ($scope.mode === 'create') {
        $scope.saveCreate();
      } else if ($scope.mode === 'edit') {
        $scope.saveUpdate();
      }
    };

    $scope.saveCreate = function() {
      Profile.createProfile($scope.profile).then(saveResult);
    };

    $scope.saveUpdate = function() {
      Profile.updateProfile($scope.profile).then(saveResult);
    };

    var saveResult = function(result) {
      if (result.status === 200) {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Saved profile!')
            .hideDelay(1000)
        );
      } else {
        $mdToast.show(
          $mdToast.simple()
            .textContent('An error occurred!')
            .hideDelay(1000)
        );
      }
    };

    $scope.deleteProject = function() {
      var confirm = $mdDialog.confirm()
                      .title('Are you sure you want to delete this project?')
                      .content('This action cannot be undone.')
                      .ok('Delete')
                      .cancel('Cancel');
      $mdDialog.show(confirm).then(function() {

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
