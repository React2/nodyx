
(function () {
    'use strict';

    var express = require('express'),
        router = express.Router();

    exports.getRoom =  function (req, res) {
      res.status(200).json({
          'Room' : 1408
      });
    };

    router.get('/', exports.getRoom);

    router

    module.exports = router;

})();
