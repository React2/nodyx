(function () {
    'use strict';

    var Player = require('../app/services/players'),
        Nepl = require('./nepl'),
        nepl = new Nepl();

    exports.newTurnBasedGame = function(maxPhases) {
      console.log('Starting new turn based game...');

      var playersOnline = nepl.eval("{{Players.online()}}");

      nepl.on('newGame', function(message) {
        console.log("New game started at " + message.date);
        if (playersOnline.length > 0) {
          startPlayerTurnListener();
          startNextTurnListener();

          nepl.emit('nextTurn', 1);
          startPhaseEndListener(maxPhases);
        } else {
          console.log('ERROR');
          systemError('Required at least one player online.');
        }
      });
    };

    exports.start = function () {
      nepl.on("gameEnd", function(message) {
         console.log(JSON.stringify(message));
      });
      nepl.emit("newGame", {
        date: Date.now
      });
    };

    function startPhaseEndListener(maxPhases) {
        nepl.on('phaseEnded', function(message) {
          console.log('Current Phase: ' + message.currentPhase);
          if (message.currentPhase === maxPhases) {
            notifyGameEnd(message.currentPhase);
          } else {
            console.log('Starting phase: ' + message.currentPhase);
            nepl.emit('nextTurn', 1);
          }
        });
    }

    function startNextTurnListener() {
      var players = [],
        phase = 0;

      nepl.on('nextTurn', function(turn) {
        var currentTurn = turn,
          player = players.shift();

        // Reset the players turn
        if (player === undefined) {
          phase = phase + 1;
          players = Player.getPlayersOnline();
          nepl.emit('phaseEnded', {
            'currentPhase': phase
          });
        } else {
          nepl.emit('playerTurn', {
            'turn': currentTurn + 1,
            'player': player
          });
        }
      });
    }

    function startPlayerTurnListener() {
      nepl.on('playerTurn', function(message) {
        console.log('Player ' + message.player.name + ' at turn ' + message.turn);
        nepl.emit('nextTurn', message.turn + 1);
      });
    }

    function systemError(err) {
      nepl.emit('SYSTEM', {
        'type': 'error',
        'body': err
      });
    }

    function notifyGameEnd(currentPhase) {
      nepl.emit('gameEnd', {
        'winner': 'Diego',
        'points': 1234.0,
        'duration': new Date(),
        'totalPhases': currentPhase
      });
    }

})();
