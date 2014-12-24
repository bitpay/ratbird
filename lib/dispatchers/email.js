/**
* @module dispatchers/email
*/

var htmlToText = require('html-to-text');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

/**
* Email dispatcher
* #exports
* @param {object} data - activity object
* @param {object} conf - dispatcher preferences
* @param {function} done - callback function
*/
module.exports = function(data, conf, done) {
  var text = htmlToText.fromString(data.content || '', { wordwrap: 130 });
  var html = data.content;
  var address = conf.address;
  var subject = data.title;

  var transporter = nodemailer.createTransport(smtpTransport({
    host: this.config.email.host,
    port: this.config.email.port,
    secure: this.config.email.secure,
    auth: { user: this.config.email.user, pass: this.config.email.pass }
  }));

  var mailOptions = {
    from: this.config.email.from,
    to: address,
    subject: subject,
    text: text,
    html: html
  };

  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      self.logger.error(err);
    }

    done();
  });
};
