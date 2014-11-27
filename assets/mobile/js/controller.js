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
			self.loadTemplates();
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
	
	loadTemplates: function() {
		var templates = [
			{
				templatePath: 'mobileLoader.handlebars',
				templateName: 'loaderTemplate'
			}
		];
		this.totalLoad = templates.length;
		this.load = 0;
		for(var i = 0; i < this.totalLoad; i++) {
			var template = templates[i];
			this.launchInitTemplate(template.templatePath, template.templateName);
		}
	},

	launchInitTemplate: function(templatePath, templateName){
		var self = this;
		self.model.ajaxLoadTemplate(templatePath, function(template) {
			self.view.initTemplates(templateName, template, function(){
				self.loading();
			});
		});
	},

	loading: function() {
		this.load++;
		if(this.load === this.totalLoad) {
			this.model.emitSocket('mobileConnection', this.room);
		}
	},

	emitAction: function(action) {
		this.model.emitAction(action);
	},

	emitSocket: function(event, datas) {
		this.model.emitSocket(event, datas);
	},
}
