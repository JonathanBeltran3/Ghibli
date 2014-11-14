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
		this.socketListener();
	},
	
	socketListener: function() {
		var self = this;
		
		this.socket.on('connect', function() {
			self.model.createRoom(function(string){
				self.model.getRootUrl(function(rootUrl) {
					self.view.showAccess(string, rootUrl);
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
		this.video.addEventListener('canplaythrough', function(){self.view.launchVideo(self.video);} , false);
		var sequence = this.json[this.videoNumber].sequences[this.videoSequence];
		var interval = setInterval(function(){			
			console.log(i);
			if(parseInt(self.video.currentTime) === parseInt(sequence.qte[i].time)) {
				self.dealQTEAction(parseInt(sequence.qte[i].duration)*1000);
				if(i < sequence.qte.length-1) i++;
			}
			if(self.video.ended) clearInterval(interval);
		},1000);
	},
	dealQTEAction: function(wait){
		this.view.waitForQTE(wait);
	}
}