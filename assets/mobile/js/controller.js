"use strict";

var Controller = function() {};
Controller.prototype = {
	init: function(model, view, socket, room) {
		this.socket = socket;
		this.model = model;
		this.view = view;
		this.room = room;
		this.touch = new Touch();
		this.touch.init(this);
		this.model.init(socket);
		this.socketListener();
	},
	
	socketListener: function() {
		var self = this;
		
		this.socket.on('connect', function() {
			self.model.connectRoom(self.room);
		});

		this.socket.on('mobileConnected', function(data){
			this.json = data;
			console.log(this.json);
		});
				
		this.socket.on('mobileActionQTE', function(action){
			console.log(action);
		});
	},
	
	emitAction: function(action) {

		this.model.emitAction(action);
	},
	
	emitSocket: function(event, datas) {
		this.model.emitSocket(event, datas);
	}
}
