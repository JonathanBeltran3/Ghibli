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
		this.getSave();
		this.eventListener();
		this.socketListener();
	},
	getSave: function() {
		var self = this;
		self.model.getSave(function(datas){
			self.save = datas;
		});
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
							self.launchInitTemplate('loading.handlebars', 'loadingTemplate');

						});
					});
				});
			});
		});

		this.socket.on('mobileConnected',function(data){
			self.json = data;
			self.filmName = data[self.videoNumber].filmName;
			self.loadVideoTemplates();
		});
	},
	loadVideoTemplates: function(){
		var self = this;
		self.load = 0;
		self.view.renderLoader(self.load, function(){
			self.numberOfLoad = 14;
			self.launchInitTemplate('video.handlebars', 'videoTemplate');
			self.launchInitTemplate('quote.handlebars', 'quoteTemplate');
			self.launchInitTemplate('movieHome.handlebars', 'movieHomeTemplate');
			self.launchInitTemplate('moviePlaying.handlebars', 'moviePlaying');
			self.launchInitTemplate('modules/badge-content.handlebars', 'badgeContent');

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
		});
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
		var self = this;
		self.load += 100/self.numberOfLoad;
		if(Math.round(self.load) === 100) setTimeout(function(){self.rollIntro()},1000);
		if(document.querySelector('.value')) self.view.updateLoader(Math.round(self.load));

	},
	rollIntro: function() {
		var self = this;
		self.view.renderIntro(self.json[self.videoNumber], function(video){
			self.view.hideLoader(function(){
				self.video = video;
				video.play();
				video.onended = function(){self.passIntro();};
				self.model.emitSocket('passIntro', self.room);
				self.addIntroListener();
			});
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
        this.view.renderMoviePlaying(this.json[this.videoNumber]);
	},
	
	dealSequences: function(){
		var self = this;
		self.QTESuccess = 0;
		self.view.renderQuotes(self.json[self.videoNumber], self.videoSequence, function(){
			self.view.renderVideo(self.json[self.videoNumber], self.videoSequence, function() {
				self.video = document.querySelector('.video');
				self.video.load();
				self.addVideoListener();
			});
		});
		
	},
	
	fadeQuotesAndLaunchVideo: function(){
		var self = this;
		setTimeout(function(){
            self.view.hideLoader();
			self.view.launchVideo(self.video);
		},3000);
		
	},
	
	addVideoListener: function() {
		var self = this;
		var i = 0;
		self.video.addEventListener('canplaythrough', function(){self.fadeQuotesAndLaunchVideo();} , false);
		var sequence = self.json[self.videoNumber].sequences[self.videoSequence];
		if(sequence.qte.length) {
			var interval = setInterval(function(){


				if(Math.round(self.video.currentTime) === parseInt(sequence.qte[i].time)) {
					self.dealQTEAction(sequence, interval, parseInt(sequence.qte[i].duration)*1000, sequence.qte[i].type, i);
					if(i < sequence.qte.length-1) i++;
				}
			}, 1000);
		} else {
            setTimeout(function(){
                self.endQTEs(interval);
            }, 10 * 1000);
        }
		self.video.addEventListener('timeupdate', function(){
            var progress = self.video.currentTime / self.video.duration * 100;
            self.view.updateTimelineProgress(self.videoSequence, progress);
        });
		self.video.onended = function(e) { self.finishVideo(interval) };
	},
	
	dealQTEAction: function(sequence, interval, wait, action, i) {
		var self = this;
		self.view.displayQTEInformations(action, self.videoSequence, i, function() {
			var datas = {'action': action, 'room': self.room};
			self.model.emitSocket('actionQTE', datas, function() {
				var timeout = setTimeout(function(){
					console.log('failQTE');
                    self.view.toggleQteMode(self.videoSequence, i);
                    self.socket.removeAllListeners('QTEDone');

                    if (i === sequence.qte.length-1) self.endQTEs(interval);
				}, wait);
				self.addQTEListener(sequence, interval, timeout, action, i);
			});
		});
		
	},
	
	addQTEListener: function(sequence, interval, timeout, action, i) {
		var self = this;
        //self.socket.addListener('QTEDone');
		self.socket.once('QTEDone', function(actionMobile) {
			if(action === actionMobile) {
				self.QTESuccess++;
                self.view.addSuccessQTE(self.videoSequence, i);
			}
            clearTimeout(timeout);
			self.view.toggleQteMode(self.videoSequence, i);
            if (i === sequence.qte.length-1) self.endQTEs(interval);
		});
	},
	
	finishVideo: function() {
		var self = this;

		if(self.videoSequence < self.json[self.videoNumber].sequences.length-1) {
			self.videoSequence++;
			self.dealSequences();
		}
	},
    endQTEs: function (interval) {
        var self = this;
		clearInterval(interval);
		self.saveSequence(function(QTEStatus){
            self.view.addStatusSeq(self.videoSequence, QTEStatus);
            self.view.showBadge(self.json[self.videoNumber].filmName, self.videoSequence, QTEStatus);
        });
    },
	saveSequence: function(callback){
		var self = this;
		var QTEDone = false;
		var sequence = self.json[self.videoNumber].sequences[self.videoSequence];
		if(sequence.qte.length === self.QTESuccess) QTEDone = true;
		console.log(self.filmName);
		self.model.saveSequence(self.filmName, self.videoSequence, QTEDone, function(){
			self.getSave();
		});
        callback.call(this, QTEDone);
	}
};
