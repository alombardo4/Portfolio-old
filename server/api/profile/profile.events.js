/**
 * profile model events
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var profile = require('./profile.model');
var profileEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
profileEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  profile.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    profileEvents.emit(event + ':' + doc._id, doc);
    profileEvents.emit(event, doc);
  }
}

module.exports = profileEvents;
