"use strict";

var Controller = function() {};
Controller.prototype = {
	init: function(model, view) {
		this.socket = io.connect();
		this.model = model;
		this.view = view;
		this.view.init();
		this.model.init(this.socket);
		this.videoNumber = 1;
		this.room = 0;
		this.QTESuccess = 0;
		this.main = document.querySelector('.main');
		this.getSave();
		this.eventListener();
		this.socketListener();
        this.allowSound = true;
        this.togglingSound = false;
	},
	getSave: function() {
		var self = this;
		self.model.getSave(function(datas){
			self.save = datas;
		});
	},
	eventListener: function(){
		var self= this;
		//document.querySelector('.fullscreen-toggle').addEventListener('click', self.view.toggleFullscreen, false);
		document.querySelector('.sound').addEventListener('click', self.toggleSound.bind(self), false);
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

		this.socket.once('mobileConnected',function(data){
			self.json = data;
			self.filmName = data[self.videoNumber].filmName;
			self.loadVideoTemplates();
		});
	},
	loadVideoTemplates: function(){
		var self = this;
		self.load = 0;
		self.view.renderLoader(self.load, function(){
			self.view.hideMain(function(){
				self.numberOfLoad = 30;
				self.launchInitTemplate('video.handlebars', 'videoTemplate');
				self.launchInitTemplate('quote.handlebars', 'quoteTemplate');
				self.launchInitTemplate('homeIntro.handlebars', 'homeIntro');
				self.launchInitTemplate('movieHome.handlebars', 'movieHomeTemplate');
				self.launchInitTemplate('moviePlaying.handlebars', 'moviePlaying');
				self.launchInitTemplate('modules/badge-content.handlebars', 'badgeContent');
				self.launchInitTemplate('map.handlebars', 'mapTemplate');

				self.launchInitPartials('logos/nausicaa.handlebars', 'nausicaaLogo');
				self.launchInitPartials('logos/nausicaa-intro.handlebars', 'nausicaaLogo-intro');
				self.launchInitPartials('logos/mononoke.handlebars', 'mononokeLogo');
				self.launchInitPartials('logos/mononoke-intro.handlebars', 'mononokeLogo-intro');
				self.launchInitPartials('logos/totoro.handlebars', 'totoroLogo');
				self.launchInitPartials('logos/totoro-intro.handlebars', 'totoroLogo-intro');
				self.launchInitPartials('logos/laputa.handlebars', 'laputaLogo');
				self.launchInitPartials('logos/laputa-intro.handlebars', 'laputaLogo-intro');
				self.launchInitPartials('logos/porco.handlebars', 'porcoLogo');
				self.launchInitPartials('logos/porco-intro.handlebars', 'porcoLogo-intro');
				self.launchInitPartials('logos/spirited.handlebars', 'spiritedLogo');
				self.launchInitPartials('logos/spirited-intro.handlebars', 'spiritedLogo-intro');
				self.launchInitPartials('logos/windrises.handlebars', 'windrisesLogo');
				self.launchInitPartials('logos/windrises-intro.handlebars', 'windrisesLogo-intro');
				self.launchInitPartials('modules/sound.handlebars', 'sound');
				self.launchInitPartials('modules/credits.handlebars', 'credits');
				self.launchInitPartials('modules/world-map.handlebars', 'worldMap');

				/* gestures */
				self.launchInitTemplate('gestures/swipe-up.handlebars', 'swipe-up');
				self.launchInitTemplate('gestures/swipe-down.handlebars', 'swipe-down');
				self.launchInitTemplate('gestures/swipe-right.handlebars', 'swipe-right');
				self.launchInitTemplate('gestures/swipe-left.handlebars', 'swipe-left');
				self.launchInitTemplate('gestures/hold.handlebars', 'hold');
				self.launchInitTemplate('gestures/tap.handlebars', 'tap');
			});
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
		self.model.emitSocket('loadingInProgress', {load: self.load, room: self.room});
		if(Math.round(self.load) === 100) setTimeout(function(){self.renderMap()},3000);
		if(document.querySelector('.value')) self.view.updateLoader(Math.round(self.load));

	},
	renderMap: function() {
		var self = this;
		self.view.renderMap(function(){
			var zones = document.querySelectorAll('.clickable-zone');
			for(var i = 0; i < zones.length; i++) {
				var zone = zones[i];
				zone.addEventListener('click', function(){
					self.getDataForIntro(this);
				}, false);
			}
		});
	},
	getDataForIntro: function(elt){
		this.videoNumber = parseInt(elt.getAttribute('data-film'));
		this.rollIntro();
	},
	rollIntro: function() {
		var self = this;
		self.view.renderIntro(self.json[self.videoNumber], function(video){
			self.video = video;
			self.view.launchVideo(video);
			document.addEventListener('mousemove', self.dealHiddenControls.bind(self), false);
			video.onended = function(){self.passIntro();};
			self.model.emitSocket('passIntro', self.room);
			self.addIntroListener();
		});
	},
	
	passIntro: function() {
		var self = this;

		self.model.emitSocket('introPassed', self.room);
		self.view.fadeIntro(self.video, function(){
			self.view.renderHomeVideo(self.json[self.videoNumber], function(){
                self.removeHiddenControlsListener();
				document.querySelector('.new-game').addEventListener('click', self.newGame.bind(self), false);
			});
		});
	},
	
	addIntroListener: function() {
		var self = this;
		self.socket.once('mobilePassIntro', function(){
			self.passIntro();
		});
	},
	
	newGame: function(e){
		var self = this;
		e.preventDefault();
		self.videoSequence = 0;
		self.view.fadeHomeVideo(function(){
			self.dealSequences();
			self.view.renderMoviePlaying(self.json[self.videoNumber]);
		});

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
            window.addEventListener('click', self.playPauseVideo.bind(self), true);
		},6000);
		
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

        /* hide controls after 5 secondes without doing anyting */
        self.hiddenControls = false;
        self.timeoutControls;

        document.addEventListener('mousemove', self.dealHiddenControls.bind(self), false);

		self.video.addEventListener('timeupdate', function(){
            var progress = self.video.currentTime / self.video.duration * 100;
            self.view.updateTimelineProgress(self.videoSequence, progress);
        });
		self.video.onended = function(e) { self.finishVideo(interval) };
	},
	dealHiddenControls : function(){
        var self = this;
        clearTimeout(self.timeoutControls);
        if (self.hiddenControls === true) {
            self.view.toggleControls();
            self.hiddenControls = false;
        }
        self.timeoutControls = setTimeout(function(){
            self.view.toggleControls();
            self.hiddenControls = true;
        }, 2000);
    },
    playPauseVideo: function(e) {
        e.preventDefault();
        if (this.video.paused)
            this.video.play();
        else
            this.video.pause();
    },
	dealQTEAction: function(sequence, interval, wait, action, i) {
		var self = this;
		self.view.displayQTEInformations(action, self.videoSequence, i, function() {
			var datas = {'action': action, 'room': self.room};
			self.model.emitSocket('actionQTE', datas, function() {
				var timeout = setTimeout(function(){
					console.log('failQTE');
					self.model.emitSocket('failQTE', self.room);
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
			} else {
				self.model.emitSocket('failQTE', self.room);
			}
            clearTimeout(timeout);
			self.view.toggleQteMode(self.videoSequence, i);
            if (i === sequence.qte.length-1) self.endQTEs(interval);
		});
	},
	removeHiddenControlsListener: function(){
        var self = this;
        document.removeEventListener('mousemove', self.dealHiddenControls);
        clearTimeout(self.timeoutControls);
        if (self.hiddenControls === true) {
            console.log('Controls were hidden');
            self.view.toggleControls();
            self.hiddenControls = false;
        }
        console.log('Remove evt listener');
    },
	finishVideo: function() {
		var self = this;
        self.removeHiddenControlsListener();
        window.removeEventListener('click', self.playPauseVideo.bind(self));

		Sound.hideSound();
		if(self.videoSequence < self.json[self.videoNumber].sequences.length-1) {
			self.videoSequence++;
			self.dealSequences();
		} else {
			self.view.renderHomeVideo(self.json[self.videoNumber], function(){
                self.removeHiddenControlsListener();
				document.querySelector('.new-game').addEventListener('click', self.newGame.bind(self), false);
			});
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
	},
    toggleSound: function(e){
        console.log(e);
        e.preventDefault();
        var self = this;
        if (!self.video) return;
        if (self.togglingSound === true) return;
        self.togglingSound = true;

        if (self.allowSound === true) {
            Sound.cutSound(self.video, function(){
                self.allowSound = false;
                self.togglingSound = false;
            });
        } else {
            Sound.playSound(self.video, function(){
                self.allowSound = true;
                self.togglingSound = false;
            });
        }
        return false;
    }
};
