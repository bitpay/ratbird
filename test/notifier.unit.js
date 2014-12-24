var should = require('chai').should();
var expect = require('chai').expect;
var sinon = require('sinon');
var Notifier = require('../lib/notifier');

var notifier;

before(function() {
  Notifier.DISPATCHERS = {
    sms: sinon.stub().callsArg(2),
    email: sinon.stub().callsArg(2),
    desktop: sinon.stub().callsArg(2),
    http: sinon.stub().callsArg(2),
    dgram: sinon.stub().callsArg(2)
  };
  notifier = new Notifier();
});

after(function(done) {
  done();
});

describe('Notifier', function() {

  describe('#exports', function() {

    var pref = {
      sms: { disabled: true, tel: '555-555-5555' },
      email: { disabled: true, address: 'x@y.z' },
      desktop: { disabled: true },
      http: { disabled: true, url: 'http://127.0.0.1/notifyme' },
      dgram: { disabled: true, host: '127.0.0.1', port: 1337 }
    };

    var a1 = {
      actor: { objectType: 'NSA' },
      target: { objectType: 'User' },
      object: { objectType: 'Wiretap' }
    };

    Object.defineProperty(a1.target, '_notifications', {
      configurable: true,
      writable: true,
      value: pref
    });

    var a2 = {
      actor: { objectType: '?' },
      target: { objectType: '?' },
      object: { objectType: '?' }
    };

    it('should ignore the activity', function(done) {
      notifier.dispatch(a2, a2.target._notifications, function() {
        for (var d in Notifier.DISPATCHERS) {
          expect(Notifier.DISPATCHERS[d].called).to.equal(false);
        }
        done();
      });
    });

    it('should dispatch notifications for sms and email', function(done) {
      a1.target._notifications.sms.disabled = false;
      a1.target._notifications.email.disabled = false;
      notifier.dispatch(a1, a1.target._notifications, function() {
        expect(Notifier.DISPATCHERS.sms.called).to.equal(true);
        expect(Notifier.DISPATCHERS.email.called).to.equal(true);
        expect(Notifier.DISPATCHERS.http.called).to.equal(false);
        expect(Notifier.DISPATCHERS.desktop.called).to.equal(false);
        expect(Notifier.DISPATCHERS.dgram.called).to.equal(false);
        done();
      });
    });

    it('should dispatch notifications for desktop and http', function(done) {
      a1.target._notifications.sms.disabled = true;
      a1.target._notifications.email.disabled = true;
      a1.target._notifications.desktop.disabled = false;
      a1.target._notifications.http.disabled = false;
      notifier.dispatch(a1, a1.target._notifications, function() {
        expect(Notifier.DISPATCHERS.sms.callCount).to.equal(1);
        expect(Notifier.DISPATCHERS.email.callCount).to.equal(1);
        expect(Notifier.DISPATCHERS.http.called).to.equal(true);
        expect(Notifier.DISPATCHERS.desktop.called).to.equal(true);
        expect(Notifier.DISPATCHERS.dgram.called).to.equal(false);
        done();
      });
    });

    it('should dispatch notifications for dgram', function(done) {
      a1.target._notifications.desktop.disabled = true;
      a1.target._notifications.http.disabled = true;
      a1.target._notifications.dgram.disabled = false;
      notifier.dispatch(a1, a1.target._notifications, function() {
        expect(Notifier.DISPATCHERS.sms.callCount).to.equal(1);
        expect(Notifier.DISPATCHERS.email.callCount).to.equal(1);
        expect(Notifier.DISPATCHERS.http.callCount).to.equal(1);
        expect(Notifier.DISPATCHERS.desktop.callCount).to.equal(1);
        expect(Notifier.DISPATCHERS.dgram.called).to.equal(true);
        done();
      });
    });

    it('should dispatch no notifications', function(done) {
      a1.target._notifications.dgram.disabled = true;
      notifier.dispatch(a1, a1.target._noitifications, function() {
        expect(Notifier.DISPATCHERS.sms.callCount).to.equal(1);
        expect(Notifier.DISPATCHERS.email.callCount).to.equal(1);
        expect(Notifier.DISPATCHERS.http.callCount).to.equal(1);
        expect(Notifier.DISPATCHERS.desktop.callCount).to.equal(1);
        expect(Notifier.DISPATCHERS.dgram.callCount).to.equal(1);
        done();
      });
    });

  });

});
