'use strict';

angular.module('portfolioApp')
  .service('Projects', function ($http) {
    var factory = {};
    factory.getProject = function(id) {
      return $http.get('/api/projects/' + id);
    };
    factory.createProject = function(project) {
      return $http.post('/api/projects/', project);
    };
    factory.updateProject = function(project) {
      return $http.put('/api/projects/' + project._id, project);
    };
    factory.removeProject = function(project) {
      return $http.delete('/api/projects/' + project._id);
    };
    factory.getProjects = function() {
      return $http.get('/api/projects');
    };
    factory.getAllProjects = function() {
      return $http.get('/api/projects/all');
    };
    factory.removeImage = function(project, index) {
      return $http.post('/api/projects/' + project._id + '/removeImage', {index : index});
    };
    return factory;
    // AngularJS will instantiate a singleton by calling "new" on this function
  });
