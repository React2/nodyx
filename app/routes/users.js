
(function () {
    'use strict';

    var express = require('express'),
        router = express.Router(),
        Room = require('../models/Room');

    exports.listRooms = function (req, res) {
        Room.find({
            'host_id' : req.params.id
        }).exec().then(function (rooms) {
            return res.status(200).json(rooms);
        });
    };

    router.get('/:id/rooms', exports.listRooms);

    module.exports = router;

})();
