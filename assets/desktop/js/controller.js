"use strict";

var Controller = function() {};
Controller.prototype = {
	init: function(model, view) {
		this.socket = io.connect();
		this.model = model;
		this.view = view;
		this.model.init(this.socket);
		this.videoNumber = 0;
		this.videoSequence = 0;
		this.room = 0;
		this.socketListener();
	},
	
	socketListener: function() {
		var self = this;
		this.socket.on('connect', function() {
			self.model.createRoom(function(string){
				self.model.getRootUrl(function(rootUrl) {
					self.view.showAccess(string, rootUrl);
					self.room = string;
				});
			});
		});

		this.socket.on('mobileConnected',function(data){
			self.json = data;
			self.rollIntro();
		});
	},
	
	rollIntro: function() {
		var self = this;
		self.view.renderIntro(self.json[self.videoNumber], function(video){
			console.log(video);
			video.play();
			//video.onended = self.passIntro();
			self.model.emitSocket('passIntro', self.room);
			self.addIntroListener();
		});
		
	},
	
	passIntro: function() {
		this.dealSequences();
	},
	
	addIntroListener: function() {
		var self = this;
		
		self.socket.on('mobilePassIntro', function(){
			self.passIntro();
		});
	},
	
	dealSequences: function(){
		var self = this;
		self.view.renderQuotes(self.json[self.videoNumber], self.videoSequence, function(){
			self.quote = document.querySelector('.main');
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
			self.quote.classList.add('hide-element');
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
				if(parseInt(self.video.currentTime) === parseInt(sequence.qte[i].time)) {
					self.dealQTEAction(parseInt(sequence.qte[i].duration)*1000, sequence.qte[i].type);
					if(i < sequence.qte.length-1) i++;
				}
			},1000);
		}
		self.video.onended = function(e) { self.finishVideo(interval) };
	},
	
	dealQTEAction: function(wait, action) {
		var self = this;
		self.view.displayQTEInformations(action, function() {
			var datas = {'action': action, 'room': self.room};
			self.model.emitSocket('actionQTE', datas, function() {
				var timeout = setTimeout(function(){
					self.model.emitSocket('failQTE');
					console.log('failQTE');
				}, wait);
				self.addQTEListener(timeout, action);
			});
		});
		
	},
	
	addQTEListener: function(timeout, action) {
		var self = this;
		
		this.socket.on('QTEDone', function(actionMobile) {
			if(action === actionMobile) {
				clearTimeout(timeout);
				console.log('Même action');
			} else {
				self.model.emitSocket('failQTE');
			}
		});
	},
	
	finishVideo: function(interval) {
		clearInterval(interval);
		if(this.videoSequence < this.json[this.videoNumber].sequences.length-1) {
			this.videoSequence++;
			this.dealSequences();
		}
	}
};