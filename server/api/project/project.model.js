'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  title: String,
  body: String,
  preview: String,
  show: Boolean,
  date: Date,
  files: [
    String
  ]
});

module.exports = mongoose.model('Project', ProjectSchema);
