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
		var datas = {room: this.room, action: action};
		this.socket.emit('mobileResponseQTE', datas);
		if(callback) callback.call(this);
	},
	emitSocket: function(event, datas, callback) {
		datas.room = this.room;
		this.socket.emit(event, datas);
		if(callback) callback.call(this);
	}
};
