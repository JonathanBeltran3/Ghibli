"use strict";

var Model = function() {};
Model.prototype = {
	init: function(socket) {
		this.socket = socket
	},
	connectRoom: function(room) {
		this.socket.emit('subscribe', room);
		this.socket.emit('mobileConnection', room);
	}
};