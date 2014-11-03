"use strict";

var Controller = function() {};
Controller.prototype = {
	init: function(model, view) {
		this.socket = io.connect();
		this.model = model;
		this.view = view;
		this.model.init(this.socket);
		this.eventHandler();
	},
	
	eventHandler: function() {
		var self = this;
		
		this.socket.on('connect', function() {
			self.model.createRoom(function(string){
				self.view.showAccess(string);
			});
		});

		this.socket.on('mobileConnected',function(){
			alert('mobile connected');
		});
	},
}