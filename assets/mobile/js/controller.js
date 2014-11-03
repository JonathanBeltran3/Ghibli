"use strict";

var Controller = function() {};
Controller.prototype = {
	init: function(model, view, socket, room) {
		this.socket = socket;
		this.model = model;
		this.view = view;
		this.room = room;
		this.model.init(socket);
		this.eventHandler();
	},
	
	eventHandler: function() {
		var self = this;
		
		this.socket.on('connect', function() {
			self.model.connectRoom(self.room);
		});

		this.socket.on('mobileConnected',function(){
			alert('mobile connected');
		});
	},
}