'use strict';

var assert = require('assert'),
    nepl = require('../nepl'),
    PubSub = require('pubsub-js');

describe('NEPL', function () {

    after(function () {
        PubSub.clearAllSubscriptions();
        console.log('All subs cleaned!');
    });

    it("should send a sayHello event", function (done) {
        nepl.onEvent('sayHello', function (msg, data) {
            nepl.notify("gotData", data);
        });

        nepl.notify('sayHello', "Hello World");

        nepl.waitResponse('gotData', 500)
            .then(function (data) {
                assert.equal(data, "Hello World");
                done();
            })
            .catch(done);
    });

    it("should create a turn based game", function (done) {
        nepl.newTurnBasedGame(3);
        nepl.notify("newGame", {date : Date.now});

        nepl.waitResponse('GAME_ENDED', 5000)
            .then(function (data) {
                assert.equal(data.totalPhases, 3);
                done();
            }).catch(done);
    });

});
