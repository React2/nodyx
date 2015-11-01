(function () {
    'use strict';

    var Player = require('../services/players'),
        PubSub = require('pubsub-js'),
        Promise = require('bluebird'),
        listeners = [];

    exports.newTurnBasedGame = function (maxPhases) {
        console.log('Starting new turn based game...');

        var playersOnline = Player.getPlayersOnline();

        exports.onEvent('newGame', function (message) {
            console.log("New game started at " + message.date);
            if (playersOnline.length > 0) {
                startPlayerTurnListener();
                startNextTurnListener();

                PubSub.publish('nextTurn', 1);

                exports.onEvent('phaseEnded', function (msg, data) {
                    console.log('Current Phase: ' + data.currentPhase);
                    if (data.currentPhase === maxPhases) {
                        notifyGameEnd(data.currentPhase);
                    } else {
                        console.log('Starting phase: ' + data.currentPhase);
                        PubSub.publish('nextTurn', 1);
                    }
                });

            } else {
                console.log('ERROR');
                systemError('Required at least one player online.');
            }
        });
    };

    function startNextTurnListener () {
        var players = [],
            phase = 0;

        exports.onEvent('nextTurn', function (turn) {
            var currentTurn = turn,
                player = players.shift();

            // Reset the players turn
            if (player === undefined) {
                phase = phase + 1;
                players = Player.getPlayersOnline();
                exports.notify('phaseEnded', {
                    'currentPhase' : phase
                });
            } else {
                exports.notify('playerTurn', {
                    'turn' : currentTurn + 1,
                    'player' : player
                });
            }


        });
    }

    function startPlayerTurnListener () {
        exports.onEvent('playerTurn', function (message) {
            console.log('Player ' + message.player + ' at turn ' + message.turn);
            exports.notify('nextTurn', message.turn + 1);
        });
    }

    exports.notify = function (event, message) {
        PubSub.publish(event, message);
    };

    function systemError (err) {
        exports.notify('SYSTEM', {
            'type' : 'error',
            'body' : err
        });
    }

    function notifyGameEnd (currentPhase) {
        exports.notify('GAME_ENDED', {
            'winner' : 'Diego',
            'points' : 1234.0,
            'duration' : new Date(),
            'totalPhases' : currentPhase
        });
    }

    exports.stopAllListeners = function () {
        console.log('Stopping all listeners: ' + listeners.length);
        listeners.forEach(function (listener) {
           PubSub.unsubscribe(listener);
        });
        listeners = 0;
    };

    // Create a listener for the given event
    exports.onEvent = function (event, listener) {
        var token = PubSub.subscribe(event, listener);

        listeners.push(token);
        return {
            'unsubscribe' : function () {
                PubSub.unsubscribe(listener);
            }
        };
    };

    exports.waitResponse = function (event, timeout) {
        return new Promise(function (resolve, reject) {
            var token = PubSub.subscribe(event, function (msg, data) {
                PubSub.unsubscribe(token);
                resolve(data);
            });

            setTimeout(function () {
                reject('TIMEOUT');
            }, timeout);
        });
    };


}());
