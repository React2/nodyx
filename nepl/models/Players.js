(function () {
    'use strict';

    function Players () {
      this.players = {};
    }

    Players.prototype.add = function (id) {
      this.players.id = id;
    };

    Players.prototype.get = function (id) {
      return this.players[id];
    };

    Players.prototype.size = function () {
      return Object.keys(this.players);
    };

    module.exports = Players;

})();
