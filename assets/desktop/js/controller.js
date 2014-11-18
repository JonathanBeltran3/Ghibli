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
			self.view.renderVideo(self.json[self.videoNumber], self.videoSequence, function() {
				self.video = document.querySelector('video');
				self.video.load();
				self.addVideoListener();
			});
		});
	},
	addVideoListener: function() {
		var self = this;
		var i = 0;
		self.video.addEventListener('canplaythrough', function(){self.view.launchVideo(self.video);} , false);
		var sequence = self.json[self.videoNumber].sequences[self.videoSequence];
		var interval = setInterval(function(){			
			if(parseInt(self.video.currentTime) === parseInt(sequence.qte[i].time)) {
				self.dealQTEAction(parseInt(sequence.qte[i].duration)*1000, sequence.qte[i].type);
				if(i < sequence.qte.length-1) i++;
			}
			if(self.video.ended) clearInterval(interval);
		},1000);
	},
	dealQTEAction: function(wait, action) {
		var self = this;
		self.view.displayQTEInformations(action, function() {
			var datas = {'action': action, 'room': self.room};
			self.model.emitSocket('actionQTE', datas, function() {
				var timeout = setTimeout(function(){
					self.model.emitSocket('failQTE');
				}, wait);
				self.addQTEListener(timeout, action);
			});
		});
		
	},
	addQTEListener: function(timeout, action) {
		this.socket.on('QTEDone', function(actionMobile) {
			if(action === actionMobile) {
				clearTimeout(timeout);
				console.log('Même action');
			} else {
				self.model.emitSocket('failQTE');
			}
		});
	}
}