"use strict";

var Controller = function() {};
Controller.prototype = {
	init: function(model, view, socket, room) {
		this.socket = socket;
		this.model = model;
		this.view = view;
		this.view.init();
		this.room = room;
		this.touch = new Touch();
		this.touch.init(this);
		this.model.init(socket);
		this.socketListener();
		this.loaderOn = 0;
	},
	
	socketListener: function() {
		var self = this;
		
		self.socket.on('connect', function() {
			self.model.connectRoom(self.room);
			self.loadTemplates();
		});

		self.socket.on('mobileConnected', function(data){
			self.json = data;
			self.view.renderLoader(function(){
				self.loaderOn = 1;
			});
		});

		self.socket.on('noMoreSpaces', function() {
			alert('No more spaces !');
			self.touch.setListenTouch(0);
		});

		self.socket.on('resStep', function(step) {
			self.step = step;

			switch(self.step) {
				case 'renderMap':
					self.view.renderMap();
					break;
				case 'renderIntro':
					self.model.emitSocket('askFilmName', {}, function(){
						self.socket.on('resFilmName', function(filmName) {
							self.view.renderPassIntro(filmName);
						});
					});
					break;
			}
		});

		self.socket.on('passIntro', function(filmName){
			self.view.renderPassIntro(filmName);
		});
				
		self.socket.on('mobileActionQTE', function(action){
			self.view.addActionToScreen(action);
		});

		self.socket.on('failQTE', function(){
			self.view.addFailToScreen();
		});

		self.socket.on('successQTE', function(){
			self.view.addSuccessToScreen();
		});

		self.socket.on('loadingInProgress', function(load){
			if(self.loaderOn) self.view.dealwithLoading(load);
		});

		self.socket.on('renderMap', function(){
			self.view.renderMap();
		});

		self.socket.on('renderOnFilm', function(filmName) {
			self.view.renderOnFilm(filmName);
		});

		self.socket.on('renderOnSequence', function(filmName) {
			self.view.renderOnSequence(filmName);
		});

	},
	
	loadTemplates: function() {
		var templates = [
			{
				templatePath: 'mobileLoader.handlebars',
				templateName: 'loaderTemplate'
			},
			{
				templatePath: 'mobileMap.handlebars',
				templateName: 'mapTemplate'
			},
			{
				templatePath: 'mobileFilmScreen.handlebars',
				templateName: 'filmScreenTemplate'
			},
			{
				templatePath: 'mobilePassIntro.handlebars',
				templateName: 'passIntroTemplate'
			},
			{
				templatePath: 'mobileOnFilm.handlebars',
				templateName: 'onFilmTemplate'
			},
			{
				templatePath: 'mobileOnSequence.handlebars',
				templateName: 'onSequenceTemplate'
			},
			{
				templatePath: 'mobile-gestures/hold.handlebars',
				templateName: 'hold'
			},
			{
				templatePath: 'mobile-gestures/tap.handlebars',
				templateName: 'tap'
			},
			{
				templatePath: 'mobile-gestures/swipe-up.handlebars',
				templateName: 'swipe-up'
			},
			{
				templatePath: 'mobile-gestures/swipe-down.handlebars',
				templateName: 'swipe-down'
			},
			{
				templatePath: 'mobile-gestures/swipe-right.handlebars',
				templateName: 'swipe-right'
			},
			{
				templatePath: 'mobile-gestures/swipe-left.handlebars',
				templateName: 'swipe-left'
			},
			{
				templatePath: 'modules/badGesture.handlebars',
				templateName: 'qteFail'
			},
			{
				templatePath: 'modules/goodGesture.handlebars',
				templateName: 'qteSuccess'
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
			this.model.emitSocket('mobileConnection', {});
		}
	},

	emitAction: function(action) {
		this.model.emitAction(action);
	},

	emitSocket: function(event, datas) {
		this.model.emitSocket(event, datas);
	},
}
