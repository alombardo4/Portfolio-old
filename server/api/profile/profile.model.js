'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var ProfileSchema = new Schema({
  name: String,
  blogUrl: String,
  linkedInUrl: String,
  githubUrl: String,
  facebookUrl: String,
  twitterUrl: String,
  flickrUrl: String,
  backgroundImage: String,
  showBackground: Boolean,
  headline: String
});

module.exports = mongoose.model('Profile', ProfileSchema);
