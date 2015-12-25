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
var multiparty = require('multiparty');
var uuid = require('uuid');
var fs = require('fs');

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
  Project.find({show: true}).exec(function(err, result) {
    if (err) return res.status(500).send(err);
    return res.json(result);
  });
};

// Gets all of Projects, even hidden
exports.all = function(req, res) {
  Project.find().exec(function(err, result) {
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
  Project.create(project, function(err, result) {
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
    updated.save(function(err, result) {
      if (err) return res.status(500).send(err);
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

exports.removeImage = function(req, res) {
  Project.findById(req.params.id).exec(function(err, result) {
    if (err) return res.status(500).send(err);
    var index = req.body.index;
    var gridfs = req.app.get('gridfs');
    var fileId = result.files[index];

    gridfs.remove({_id : fileId}, function (err) {
      if (err) return res.status(500).send(err);
      result.files.splice(index,1);
      result.save(function(err, project) {
        if (err) return res.status(500).send(err);
        return res.json(project);
      });
    });
  });
};

exports.addImage = function(req, res) {
  Project.findById(req.params.id).exec(function(err, result) {
    var project = result;
    if (err) return res.status(400).send(err);
    var gridfs = req.app.get('gridfs');
    var form = new multiparty.Form();
      form.parse(req, function(err, fields, files) {
        if (err) return res.status(500).send(err);
        if (!files.file) return res.status(400).send({message: 'no image'});
        var file = files.file[0];
        var contentType = file.headers['content-type'];
        var extension = file.path.substring(file.path.lastIndexOf('.'));
        var destPath = uuid.v4() + extension;
        var initialPath = file.path;
        var is = fs.createReadStream(file.path);
        var os = gridfs.createWriteStream({ filename: destPath });
        is.pipe(os);

        os.on('close', function (file) {
          //delete file from temp folder
          fs.unlink(initialPath, function() {
            project.files.push(file._id);
            project.save(function(err, project) {
              if (err) return res.status(500).send(err);
              return res.json(project);
            });
          });
        });

      });
  });

}
exports.getImage = function(req, res) {
  var gridfs = req.app.get('gridfs');
  var readstream = gridfs.createReadStream({
    _id: req.params.id
  });
  req.on('error', function(err) {
    res.send(500, err);
  });
  readstream.on('error', function (err) {
    res.send(500, err);
  });
  readstream.pipe(res);
}
