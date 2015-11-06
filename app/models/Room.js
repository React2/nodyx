(function () {

	'use strict';

	var mongoose = require('mongoose'),
		schema = new mongoose.Schema({
            name : String,
			host_id : String,
            host_name : String,
            max_players : Number
		});

	module.exports = mongoose.model('Room', schema);

}());
