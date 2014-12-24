/**
* @module notifier
*/

var async = require('async');
var hbs = require('handlebars');
var extend = require('extend');

/**
* Notification dispatcher representation
* @constructor
* @param {object} preferences - notification prefs dictionary
*/
var Notifier = function(config) {
  this.config = extend(true, Notifier.DEFAULTS, config || {});
  this.logger = this.config.logger || console;
};

Notifier.DEFAULTS = {
  sms: { accountSid: '', authToken: '', senderTel: '+15555555555' }, // twilio
  email: { user: '', pass:'', host: '', port: '', secure: true, from: '' },
  http: {  },
  desktop: {  },
  dgram: {  }
};

Notifier.DISPATCHERS = {
  sms: require('./dispatchers/sms'),
  email: require('./dispatchers/email'),
  desktop: require('./dispatchers/desktop'),
  http: require('./dispatchers/http'),
  dgram: require('./dispatchers/dgram')
};

/**
* Executes proper dispatcher method
* #dispatch
* @param {object} activity - activity object
*/
Notifier.prototype.dispatch = function(activity, prefs, callback) {
  var self = this;

  if (!prefs) {
    return callback();
  }

  callback = callback || new Function();

  async.each(Object.keys(prefs), function(c, done) {
    if (!self.config[c]) {
      return done(new Error('Invalid preference supplied: ' + c));
    }

    var dispImpl = self.config[c].dispatcher || Notifier.DISPATCHERS[c];
    var dispConf = prefs[c];
    var dispData = self._populateContent(activity);

    if (dispConf.disabled) {
      return done();
    }

    dispImpl.apply(self, [dispData, dispConf, done]);
  }, function(err) {
    if (err) {
      // something FATAL happened, other dispatchers should be halted
      return callback(err);
    }

    callback(null);
  });
};

/**
* Populates any variables in the content property
* #_populateContent
* @param {object} activity - activity object
*/
Notifier.prototype._populateContent = function(activity) {
  if (activity.title) {
    activity.title = hbs.compile(activity.title)(activity);
  }

  if (activity.content) {
    activity.content = hbs.compile(activity.content)(activity);
  }

  return activity;
};

module.exports = Notifier;
