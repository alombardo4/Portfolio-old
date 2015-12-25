'use strict';

angular.module('portfolioApp', [
  'portfolioApp.auth',
  'portfolioApp.admin',
  'portfolioApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'validation.match',
  'ngMaterial',
  'textAngular',
  'ngFileUpload'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
