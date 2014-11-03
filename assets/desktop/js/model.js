"use strict";

var Model = function() {};
Model.prototype = {
	init: function(socket) {
		this.socket = socket
	},
	randomString: function(stringLength) {
		var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
		var randomString = '';
		for (var i=0; i < stringLength; i++) {
			var rNum = Math.floor(Math.random() * chars.length);
			randomString += chars.substring(rNum,rNum+1);
		}
		return randomString;
	},
	createRoom: function(callback) {
		var string = this.randomString(6);
		this.socket.emit('subscribe', string);
		callback.call(this, string);
	}
};