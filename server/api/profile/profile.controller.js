/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/profiles              ->  index
 * POST    /api/profiles              ->  create
 * GET     /api/profiles/:id          ->  show
 * PUT     /api/profiles/:id          ->  update
 * DELETE  /api/profiles/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var profile = require('./profile.model');
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

// Gets profile
exports.index = function(req, res) {
  profile.find().limit(1).exec(function(err, result) {
    if (err) return res.status(400).send(err);
    return res.json(result[0]);
  });
};

// Creates a new profile in the DB
exports.create = function(req, res) {
  var profile = new profile(req.body);
  profile.find().limit(1).exec(function(err, result) {
    if (err) return res.status(400).send(err);
    if (result.length && result.length > 0) {
      return res.status(400).send({message : 'Profile already exists'});
    }
    profile.create(profile, function(err, result) {
      if (err) return res.status(500).send(err);
      return res.json(result);
    });
  });

};

// Updates an existing profile in the DB
exports.update = function(req, res) {
  profile.find().limit(1).exec(function(err, result) {
    if (err) return res.status(400).send(err);
    if (result.length && result.length > 0) {
      return res.status(400).send({message : 'Profile already exists'});
    }
    var updated = _.merge(result, req.body);
    updated.save(function(err, result) {
      if (err) return res.status(500).send(err);
      return res.json(result);
    })
  });
};

exports.addBackground = function(req, res) {
  profile.find({}).exec(function(err, result) {
    var profile = result[0];
    if (err) return res.status(400).send(err);
    var form = new multiparty.Form();
      form.parse(req, function(err, fields, files) {
        if (err) return res.status(500).send(err);
        if (!files.file) return res.status(400).send({message: 'no image'});
        var file = files.file[0];

        exports.saveImage(file, req, function(file) {
          console.log(file);
          profile.backgroundImage = file._id;
          profile.showBackground = true;
          profile.save(function(err) {
            if (err) return res.status(500).send(err);
            return res.json(profile);
          });
        });

      });
  });
};

exports.addPortrait = function(req, res) {
  profile.find({}).exec(function(err, result) {
    var profile = result[0];
    if (err) return res.status(400).send(err);
    var form = new multiparty.Form();
      form.parse(req, function(err, fields, files) {
        if (err) return res.status(500).send(err);
        if (!files.file) return res.status(400).send({message: 'no image'});
        var file = files.file[0];

        exports.saveImage(file, req, function(file) {
          console.log(file);
          profile.portraitImage = file._id;
          profile.showPortrait = true;
          profile.save(function(err) {
            if (err) return res.status(500).send(err);
            return res.json(profile);
          });
        });

      });
  });

};


exports.saveImage = function(file, req, callback) {
  var gridfs = req.app.get('gridfs');
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
      callback(file);
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
