/**
* @module dispatchers/sms
*/

var twilio = require('twilio');

/**
* SMS dispatcher
* #exports
* @param {object} data - activity object
* @param {object} conf - dispatcher preferences
* @param {function} done - callback function
*/
module.exports = function(data, conf, done) {
  var self = this;
  var sms = twilio(this.config.sms.accountSid, this.config.sms.authToken);
  var messageBody = data.title + ' ' + (data.object.url || '');

  sms.messages.create({
    body: messageBody,
    to: conf.tel,
    from: this.config.sms.senderTel
  }, function(err, message) {
    if (err) {
      self.logger.error(err);
    }

    done();
  });
};
