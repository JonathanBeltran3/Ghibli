"use strict";

var Model = function() {};
Model.prototype = {
	init: function(socket) {
		this.socket = socket
	},
	connectRoom: function(room) {
		this.socket.emit('subscribe', room);
		this.socket.emit('mobileConnection', room);
		this.room = room;
	},
	emitAction: function(action, callback) {
		this.socket.emit('mobileResponseQTE', action);
	},
	emitSocket: function(event, datas, callback) {
		datas.room = this.room;
		this.socket.emit(event, datas);
		console.log("emit "+event);
		if(callback) callback.call(this);
	}
};
