/**
* @module ratbird
*/

var Notifier = require('./lib/notifier');

module.exports.createNotifier = function(config) {
  return new Notifier(config);
};

module.exports.Notifier = Notifier;
