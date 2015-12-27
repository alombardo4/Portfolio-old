'use strict';

angular.module('portfolioApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('EditProfile', {
        url: '/profile/edit',
        templateUrl: 'app/profile/profile-edit.html',
        controller: 'ProfileCtrl',
        authenticate: 'admin'
      });
  });
