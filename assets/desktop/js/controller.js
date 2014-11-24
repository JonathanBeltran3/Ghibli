"use strict";

var Controller = function() {};
Controller.prototype = {
	init: function(model, view) {
		this.socket = io.connect();
		this.model = model;
		this.view = view;
		this.model.init(this.socket);
		this.videoNumber = 0;
		this.room = 0;
		this.QTESuccess = 0;
		this.main = document.querySelector('.main');
		this.eventListener();
		this.socketListener();
	},
	eventListener: function(){
		var self= this;
		
		document.querySelector('.fullscreen-toggle').addEventListener('click', self.view.toggleFullscreen, false);
	},
	socketListener: function() {
		var self = this;
		this.socket.on('connect', function() {
			self.model.ajaxLoadTemplate('links.handlebars',function(template){
				self.view.initTemplates('linksTemplate', template, function(){
					self.model.createRoom(function(string){
						self.model.getRootUrl(function(rootUrl) {
							self.view.showAccess(string, rootUrl);
							self.room = string;
						});
					});
				});
			});
		});

		this.socket.on('mobileConnected',function(data){
			self.json = data;
			self.filmName = data[self.videoNumber].fileName;
			self.loadVideoTemplates();
		});
	},
	loadVideoTemplates: function(){
		var self = this;
		self.load = 0;
		self.numberOfLoad = 13;
		self.launchInitTemplate('video.handlebars', 'videoTemplate');
		self.launchInitTemplate('quote.handlebars', 'quoteTemplate');
		self.launchInitTemplate('movieHome.handlebars', 'movieHomeTemplate');
		self.launchInitTemplate('moviePlaying.handlebars', 'moviePlaying');
		self.launchInitPartials('logos/nausicaa.handlebars', 'nausicaaLogo');
		self.launchInitPartials('modules/sound.handlebars', 'sound');
		self.launchInitPartials('modules/credits.handlebars', 'credits');

        /* gestures */
		self.launchInitTemplate('gestures/swipe-up.handlebars', 'swipe-up');
		self.launchInitTemplate('gestures/swipe-down.handlebars', 'swipe-down');
		self.launchInitTemplate('gestures/swipe-right.handlebars', 'swipe-right');
		self.launchInitTemplate('gestures/swipe-left.handlebars', 'swipe-left');
		self.launchInitTemplate('gestures/hold.handlebars', 'hold');
		self.launchInitTemplate('gestures/tap.handlebars', 'tap');
	},
	launchInitTemplate: function(templatePath, templateName){
		var self = this;
		self.model.ajaxLoadTemplate(templatePath, function(template) {
			self.view.initTemplates(templateName, template, function(){
                self.dealWithLoading();
			});
		});
	},
	launchInitPartials: function(partielPath, partialName){
		var self = this;
		self.model.ajaxLoadTemplate(partielPath, function(template) {
			Handlebars.registerPartial(partialName, template);
			self.dealWithLoading();
		});
	},
	dealWithLoading: function(){
		this.load += 100/this.numberOfLoad;
		if(Math.round(this.load) === 100) this.rollIntro();
	},
	rollIntro: function() {
		var self = this;
		self.view.renderIntro(self.json[self.videoNumber], function(video){
			self.main.classList.add('hide-element');
			self.video = video;
			video.play();
			video.onended = function(){self.passIntro();};
			self.model.emitSocket('passIntro', self.room);
			self.addIntroListener();
		});
	},
	
	passIntro: function() {
		var self = this;
		self.view.fadeIntro(self.video, function(){
			self.view.renderHomeVideo(self.json[self.videoNumber], function(){
				document.querySelector('.new-game').addEventListener('click', self.newGame.bind(self), false);
			});
		});
	},
	
	addIntroListener: function() {
		var self = this;
		self.socket.on('mobilePassIntro', function(){
			self.passIntro();
		});
	},
	
	newGame: function(e){
		e.preventDefault();
		this.videoSequence = 0;
		this.dealSequences();
	},
	
	dealSequences: function(){
		var self = this;
		self.view.renderQuotes(self.json[self.videoNumber], self.videoSequence, function(){
			self.view.renderVideo(self.json[self.videoNumber], self.videoSequence, function() {
				self.video = document.querySelector('.video');
				self.video.load();
				self.addVideoListener();
			});
            self.view.renderMoviePlaying(self.json[self.videoNumber]);
		});
		
	},
	
	fadeQuotesAndLaunchVideo: function(){
		var self = this;
		setTimeout(function(){
			self.main.classList.add('hide-element');
			self.view.launchVideo(self.video);
		},3000);
		
	},
	
	addVideoListener: function() {
		var self = this;
		var i = 0;
		self.video.addEventListener('canplaythrough', function(){self.fadeQuotesAndLaunchVideo();} , false);
		var sequence = self.json[self.videoNumber].sequences[self.videoSequence];
		if(sequence.qte.length) {
			self.video.addEventListener('timeupdate', function(){
                var progress = self.video.currentTime / self.video.duration * 100;
                self.view.updateTimelineProgress(self.videoSequence, progress);
				if(Math.round(self.video.currentTime) === parseInt(sequence.qte[i].time)) {
					self.dealQTEAction(parseInt(sequence.qte[i].duration)*1000, sequence.qte[i].type, i);
					if(i < sequence.qte.length-1) i++;
				}
			});
		}
		self.video.onended = function(e) { self.finishVideo(interval) };
	},
	
	dealQTEAction: function(wait, action, i) {
		var self = this;
		self.view.displayQTEInformations(action, self.videoSequence, i, function() {
			var datas = {'action': action, 'room': self.room};
			self.model.emitSocket('actionQTE', datas, function() {
				var timeout = setTimeout(function(){
					self.model.emitSocket('failQTE');
					console.log('failQTE');
                    self.view.toggleQteMode(self.videoSequence, i);
                    console.log(self);
				}, wait);
				self.addQTEListener(timeout, action);
			});
		});
		
	},
	
	addQTEListener: function(timeout, action, i) {
		var self = this;
		
		this.socket.on('QTEDone', function(actionMobile) {
			if(action === actionMobile) {
				clearTimeout(timeout);
				self.QTESuccess++;
			} else {
				self.model.emitSocket('failQTE');
			}
			self.view.toggleQteMode(self.videoSequence, i);
		});
	},
	
	finishVideo: function(interval) {


		if(this.videoSequence < this.json[this.videoNumber].sequences.length-1) {
			this.videoSequence++;
			this.dealSequences();
		}
	}
};
