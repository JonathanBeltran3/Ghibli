"use strict";

var Controller = function() {};
Controller.prototype = {
	init: function(model, view, socket, room) {
		this.socket = socket;
		this.model = model;
		this.view = view;
		this.room = room;
		this.model.init(socket);
		this.socketListener();
	},
	
	socketListener: function() {
		var self = this;
		
		this.socket.on('connect', function() {
			self.model.connectRoom(self.room);
		});

		this.socket.on('mobileConnected',function(data){
			this.json = data;
			console.log(this.json);
		});
	},
}