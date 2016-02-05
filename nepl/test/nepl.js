'use strict';

var assert = require('assert'),
  Nepl = require('../nepl'),
  nepl = new Nepl(),
  PubSub = require('pubsub-js');

describe('Nepl', function() {

  after(function() {
    nepl.clear();
    console.log('All subs cleaned!');
  });

  it("should send a sayHello event", function(done) {
    nepl.on('sayHello', function(data) {
      nepl.emit("gotData", data);
    });

    nepl.emit('sayHello', "Hello World");

    nepl.waitResponse('gotData', 500)
      .then(function(data) {
        assert.equal(data, "Hello World");
        done();
      })
      .catch(done);
  });

});
