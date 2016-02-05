'use strict';

var assert = require('assert'),
  Nepl = require('../nepl'),
  Game = require('../game'),
  nepl = new Nepl();

describe('Game', function() {

  after(function () {
    nepl.clear();
    console.log('All subs cleaned!');
  });

  it("should create a turn based game", function(done) {
    Game.newTurnBasedGame(3);
    Game.start();

    nepl.waitResponse('gameEnd', 5000)
      .then(function(data) {
        assert.equal(data.totalPhases, 3);
        done();
      }).catch(done);
  });

});
