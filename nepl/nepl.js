(function() {
  'use strict';

  var PubSub = require('pubsub-js'),
      Promise = require('bluebird');

  function Nepl() {
    this.listeners = [];
  }

  Nepl.prototype.emit = function(event, message) {
    PubSub.publish(event, message);
  };

  /**
  * Create a listener for the given event
  * @param {Function} listener - The event listener
  */
  Nepl.prototype.on = function(event, listener) {
    var token = PubSub.subscribe(event, function (e, message) {
      listener(message);
    });

    this.listeners.push(token);
    return {
      'unsubscribe': function() {
        PubSub.unsubscribe(listener);
      }
    };
  };

  Nepl.prototype.stopAllListeners = function() {
    console.log('Stopping all listeners: ' + this.listeners.length);
    this.listeners.forEach(function(listener) {
      PubSub.unsubscribe(listener);
    });
    this.listeners = [];
  };

  Nepl.prototype.waitResponse = function(event, timeout) {
    return new Promise(function(resolve, reject) {
      var token = PubSub.subscribe(event, function(msg, data) {
        PubSub.unsubscribe(token);
        resolve(data);
      });

      setTimeout(function() {
        reject('TIMEOUT');
      }, timeout);
    });
  };

  Nepl.prototype.clear = function () {
    PubSub.clearAllSubscriptions();
  };

  Nepl.prototype.eval = function (lex) {
    return [{
      name: "Diego"
    }, {
      name: "Jonny"
    }];
  };

  module.exports = Nepl;

}());
