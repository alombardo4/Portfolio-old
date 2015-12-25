'use strict';

angular.module('portfolioApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('Projects', {
        url: '/Projects',
        templateUrl: 'app/Projects/Projects.html',
        controller: 'ProjectsCtrl'
      })
      .state('ViewProject', {
        url: '/Projects/:projectId',
        templateUrl: 'app/Projects/Project-view.html',
        controller: 'ProjectsCtrl'
      })
      .state('CreateProject', {
        url: '/Project/new',
        templateUrl: 'app/Projects/Project-form.html',
        controller: 'ProjectsFormCtrl',
        authenticate: 'admin'
      })
      .state('EditProject', {
        url: '/Projects/:projectId/edit',
        templateUrl: 'app/Projects/Project-form.html',
        controller: 'ProjectsFormCtrl',
        authenticate: 'admin'
      })
      .state('AllProjects', {
        url: '/Projects-all',
        templateUrl: 'app/Projects/Projects.html',
        controller: 'ProjectsCtrl',
        authenticate: 'admin'
      });
  });
