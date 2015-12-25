/**
 * Main application file
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
import config from './config/environment';
import http from 'http';
import Grid from 'gridfs-stream';

// Connect to MongoDB
Grid.mongo = mongoose.mongo;
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});
var conn = mongoose.connection;



// Populate databases with sample data
if (config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = http.createServer(app);
require('./config/express')(app);
require('./routes')(app);

conn.once('open', function () {
  var gfs = new Grid(conn.db);
  app.set('gridfs', gfs);
  // all set!
});

// Start server
function startServer() {
  server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;
