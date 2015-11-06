
(function () {
    'use strict';

    var express = require('express'),
        router = express.Router(),
        Room = require('../models/Room');

    exports.getById = function (req, res) {
        Room.findOne({
            '_id' : req.params.id
        }).exec().then(function (room) {
            return res.status(200).json(room);
        });
    };

    exports.save = function (req, res) {
        if (!req.body) {
            return res.status(400).send('invalid json');
        } else {
            Room.create(req.body, function (err) {
                if (err) {
                    console.error(err);
                    res.status(500).send();
                } else {
                    res.status(201).send();
                }
            });
        }
    };

    exports.remove = function (req, res) {
        Room.remove({
            '_id' : req.params.id
        }, function (err) {
            if (err) {
                console.error(err);
                res.status(500).send();
            } else {
                res.status(200).send();
            }
        });
    };


    router.get('/:id', exports.getById);
    router.post('/', exports.save);
    router.delete('/:id', exports.remove);

    module.exports = router;

})();
