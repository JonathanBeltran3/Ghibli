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
		
		self.socket.on('connect', function() {
			self.model.connectRoom(self.room);
		});

		self.socket.on('mobileConnected', function(data){
			self.json = data;
			self.view.renderLoader();
		});
				
		self.socket.on('mobileActionQTE', function(action){
		});

		self.socket.on('loadingInProgress', function(load){
			self.view.dealwithLoading(load);
		});

	},
	
	emitAction: function(action) {
		this.model.emitAction(action);
	},
	
	emitSocket: function(event, datas) {
		this.model.emitSocket(event, datas);
	},

	launchInitTemplate: function(templatePath, templateName){
		var self = this;
		self.model.ajaxLoadTemplate(templatePath, function(template) {
			self.view.initTemplates(templateName, template, function(){
                self.dealWithLoading();
			});
		});
	},
}
