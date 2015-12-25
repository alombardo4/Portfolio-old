/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/projects              ->  index
 * POST    /api/projects              ->  create
 * GET     /api/projects/:id          ->  show
 * PUT     /api/projects/:id          ->  update
 * DELETE  /api/projects/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Project = require('./project.model');

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(function(updated) {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(function() {
          res.status(204).end();
        });
    }
  };
}

// Gets a list of Projects
exports.index = function(req, res) {
  Project.find({}).exec(function(err, result) {
    if (err) return res.status(500).send(err);
    return res.json(result);
  });
};

// Gets a single Project from the DB
exports.show = function(req, res) {
  Project.findById(req.params.id).exec(function(err, result) {
    if (err) return res.status(400).send(err);
    return res.json(result);
  });
};

// Creates a new Project in the DB
exports.create = function(req, res) {
  var project = new Project(req.body);
  Project.save(project).exec(function(err, result) {
    if (err) return res.status(500).send(err);
    return res.json(result);
  });
};

// Updates an existing Project in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Project.findById(req.params.id).exec(function(err, result) {
    if (err) return res.status(500).send(err);
    var updated = _.merge(result, req.body);
    console.log(updated);
    updated.save(function(err, result) {
      console.log(result);
      if (err) return res.status(500).send(err);
      console.log(result);
      return res.json(result);
    })
  });
};

// Deletes a Project from the DB
exports.destroy = function(req, res) {
  Project.findById(req.params.id).exec(function(err, result) {
    if (err) return res.status(500).send(err);
    var project = result;
    project.remove(function(err, result) {
      if (err) return res.status(500).send(err);
      return res.json(result);
    })
  });
};
