/**
* @module dispatchers/http
*/

var request = require('request');

/**
* HTTP request dispatcher
* #exports
* @param {object} data - activity object
* @param {object} conf - dispatcher preferences
* @param {function} done - callback function
*/
module.exports = function(data, conf, done) {
  var self = this;

  request({
    url: conf.url,
    method: 'POST',
    data: data,
    json: true
  }, function(err, result) {
    if (err) {
      self.logger.error(err);
    }

    done();
  });
};
