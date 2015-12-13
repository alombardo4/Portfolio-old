'use strict';

angular.module('portfolioApp.auth', [
  'portfolioApp.constants',
  'portfolioApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
