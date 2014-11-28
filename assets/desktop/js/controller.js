"use strict";

var Controller = function() {};
Controller.prototype = {
	init: function(model, view) {
		this.socket = io.connect();
		this.model = model;
		this.view = view;
		this.view.init();
		this.model.init(this.socket);
		this.videoNumber = 0;
		this.room = 0;
		this.QTESuccess = [];
		this.main = document.querySelector('.main');
		this.getSave();
		this.eventListener();
		this.socketListener();
        this.allowSound = true;
        this.togglingSound = false;
		this.step = 'init';
        this.tempSelfHiddenControls; // here to be able to remove evt listener
        this.tempSelfPlayPause;
	},

	/**
	 * Load save for the precedent films
	 * and QTEs
	 */
	getSave: function() {
		var self = this;
		self.model.getSave(function(datas){
			self.save = datas;
		});
	},
	/**
	 * Adding eventListener for switching the sound
	 * And going back to the film menu
	 */
	eventListener: function(){
		var self= this;
		//document.querySelector('.fullscreen-toggle').addEventListener('click', self.view.toggleFullscreen, false);


		document.querySelector('.sound').addEventListener('click', self.toggleSound.bind(self), false);


		document.querySelector('.back-film').addEventListener('click', function(e){
            e.preventDefault();
            self.removeHiddenControlsListener();

            document.querySelector('.qte-mode').removeEventListener('click', self.tempSelfPlayPause); //#baka

            Sound.cutSound(self.video, function(){
                self.allowSound = false;
                self.togglingSound = false;

                self.view.renderHomeVideo(self.json[self.videoNumber], function(){
                    document.querySelector('.back-film').classList.remove('visible');
                    self.video.pause();
                    self.addListenerHomeVideo();
                });

            });


        }, false);
	},
    /**
     * List of the different socket listeners
     */
	socketListener: function() {
		var self = this;
		var changeRoom = 0;

        /* Initialisation */
		self.socket.on('connect', function() {
			self.model.ajaxLoadTemplate('links.handlebars',function(template){
				self.view.initTemplates('linksTemplate', template, function(){
					self.model.createRoom(function(string){
						self.socket.on('changeRoom', function(){
							changeRoom = 1;
							self.changeRoom();
						});

						if(!changeRoom) {
							self.model.getRootUrl(function(rootUrl) {
								self.view.showAccess(string, rootUrl);
								self.room = string;
								self.launchInitTemplate('loading.handlebars', 'loadingTemplate');
							});
						}
					});
				});
			});
		});

		self.socket.once('mobileConnected',function(data){
			self.json = data;
			self.loadVideoTemplates();
		});

		self.socket.on('askStep', function(){
			self.model.emitSocket('resStep', {step: self.step, room: self.room});
		});

		self.socket.on('askFilmName', function(){
			self.model.emitSocket('resFilmName', {filmName: self.filmName, room: self.room});
		});

		/*self.socket.on('responseFilm', function(datas){
            self.view.renderSynopsis(datas);
        });*/
	},
    /**
     * Creation of the room to play
     * just between desktop & mobile
     */
	changeRoom: function() {
		var self = this;
		var changeRoom = 0;
		self.model.createRoom(function(string){
			self.socket.on('changeRoom', function(){
				changeRoom = 1;
				self.changeRoom();
			});

			if(!changeRoom) {
				self.model.getRootUrl(function(rootUrl) {
					self.view.showAccess(string, rootUrl);
					self.room = string;
					self.launchInitTemplate('loading.handlebars', 'loadingTemplate');
				});
			}
		});
	},
	/**
	 * Loading the list of templates
	 */
	loadVideoTemplates: function(){
		var self = this;
		self.load = 0;
		this.step = 'loading';
		self.view.renderLoader(self.load, function(){
			self.view.hideMain(function(){
				self.numberOfLoad = 31;
				self.launchInitTemplate('video.handlebars', 'videoTemplate');
				self.launchInitTemplate('quote.handlebars', 'quoteTemplate');
				self.launchInitTemplate('homeIntro.handlebars', 'homeIntro');
				self.launchInitTemplate('movieHome.handlebars', 'movieHomeTemplate');
				self.launchInitTemplate('moviePlaying.handlebars', 'moviePlaying');
				self.launchInitTemplate('modules/badge-content.handlebars', 'badgeContent');
				self.launchInitTemplate('map.handlebars', 'mapTemplate');
                self.launchInitTemplate('modules/infos-movie.handlebars', 'infosMovie');

                /* Repetition here could be avoided with a variable pass to the partial
                 * instead of loading 2 similar partials
                 * */
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

	/**
	 * Load Handlebars templates form server
	 * @param string templatePath Path of the template on server
	 * @param string templateName Name to use the template later
	 */
	launchInitTemplate: function(templatePath, templateName){
		var self = this;
		self.model.ajaxLoadTemplate(templatePath, function(template) {
			self.view.initTemplates(templateName, template, function(){
                self.dealWithLoading();
			});
		});
	},
	/**
	 * Load Handlebars partials form server
	 * @param string partielPath Path of the partial on server
	 * @param string partialName Name to use the partial later
	 */
	launchInitPartials: function(partielPath, partialName){
		var self = this;
		self.model.ajaxLoadTemplate(partielPath, function(template) {
			Handlebars.registerPartial(partialName, template);
			self.dealWithLoading();
		});
	},
	/**
	 * Increase the connection counter
	 */
	dealWithLoading: function(){
		var self = this;
		self.load += 100/self.numberOfLoad;
		self.model.emitSocket('loadingInProgress', {load: Math.round(self.load), room: self.room});
		if(Math.round(self.load) === 100) setTimeout(function(){self.renderMap()},3000);
		if(document.querySelector('.value')) self.view.updateLoader(Math.round(self.load));

	},
    /**
     * When every template is loaded
     * we render the map of the world
     */
	renderMap: function() {
		var self = this;
		this.step = 'renderMap';
		self.view.renderMap(function(){
			self.addListenerOnWorldMap();
		});
	},
	/**
	 * Each zone on map has a data attribut that
	 * we will use to change the information
	 * to start a new film, and launch the
	 * introduction
	 * @param elt clicked element
	 */
	getDataForIntro: function(elt){
		this.videoNumber = parseInt(elt.getAttribute('data-film'));
		this.filmName = this.json[this.videoNumber].filmName;
		this.rollIntro();
	},
	/**
	 * Launch the film video introduction
	 * Add the information screen hover
	 * You can pass the intro with your smartphone
	 * Or wait for the end of the video
	 */
	rollIntro: function() {
		var self = this;
		this.step = 'renderIntro';
		self.view.renderIntro(self.json[self.videoNumber], function(video){
			self.video = video;
			self.view.launchVideo(video);
            setTimeout(function(){
                if (document.querySelector('.first-animation'))
                    document.querySelector('.first-animation').classList.remove('first-animation');
                self.addHideControls();
            }, 10000);
			video.onended = function(){self.passIntro();};
			self.model.emitSocket('passIntro', {room: self.room, filmName: self.filmName});
			self.addIntroListener();
		});
	},
	/**
	 * Display the menu / home of a film
	 */
	passIntro: function() {
		var self = this;

		self.model.emitSocket('introPassed', self.room);
		self.view.fadeIntro(self.video, function(){
			self.view.renderHomeVideo(self.json[self.videoNumber], function(){
                self.addListenerHomeVideo();
			});
		});
	},
	addIntroListener: function() {
		var self = this;
		self.socket.once('mobilePassIntro', function(){
			self.passIntro();
		});
	},
	/**
	 * Init a new game
	 * @param event e Event for the click on "New game" button
	 */
	newGame: function(e){
		var self = this;
		e.preventDefault();
		self.videoSequence = 0;
		self.view.fadeHomeVideo(function(){
			self.dealSequences();
			self.view.renderMoviePlaying(self.json[self.videoNumber]);

		});

	},
	
	choiceSequence: function(e) {
		var self = this;
		var index = parseInt(e.getAttribute('data-index'));
		console.log(index);
		console.log(self.save[self.filmName]);
		if(index === 0 || self.save[self.filmName][index-1] !== undefined) {
			self.videoSequence = index;
			self.view.fadeHomeVideo(function(){
				self.dealSequences();
				self.view.renderMoviePlaying(self.json[self.videoNumber]);
			});
		} else {
			console.log('Not possible');
		}
	},

	dealSequences: function(){
		var self = this;
		this.step = 'onSequence';
        self.model.emitSocket('renderOnSequence', {room: self.room, filmName: self.filmName});
		self.QTESuccess = 0; // creating array for the sequence
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
            /* hide controls after 5 secondes without doing anyting */
            self.hiddenControls = false;
            self.timeoutControls;
            self.addHideControls();


            self.tempSelfPlayPause = self.playPauseVideo.bind(self);
            document.querySelector('.qte-mode').addEventListener('click', self.tempSelfPlayPause, true);
            /* Toujours en test, sera bien mis après #backFilm */
            document.querySelector('.back-film').classList.add('visible');
		},6000);
		
	},
	
	addVideoListener: function() {
		var self = this;
		var i = 0;
		self.video.addEventListener('canplaythrough', function(){ self.fadeQuotesAndLaunchVideo();} , false);
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
		var QTEDone = false;
		self.socket.once('QTEDone', function(actionMobile) {
			if(action === actionMobile) {
				self.QTESuccess++;
				QTEDone = true;
                self.view.addSuccessQTE(self.videoSequence, i);
				self.model.emitSocket('successQTE', self.room);
			} else {
				self.model.emitSocket('failQTE', self.room);
			}
            clearTimeout(timeout);
			self.view.toggleQteMode(self.videoSequence, i);
            if (i === sequence.qte.length-1) self.endQTEs(interval);
			self.saveQTE(i, QTEDone);
		});


	},
	finishVideo: function() {
		var self = this;
        self.removeHiddenControlsListener();
        document.querySelector('.qte-mode').removeEventListener('click', self.tempSelfPlayPause); // #baka
        /* Toujours en test, sera bien mis après #backFilm */
        document.querySelector('.back-film').classList.remove('visible');
		Sound.hideSound();
		if(self.videoSequence < self.json[self.videoNumber].sequences.length-1) {
			self.videoSequence++;
			self.dealSequences();
		} else {
			self.view.renderHomeVideo(self.json[self.videoNumber], function(){
				self.addListenerHomeVideo();
			});
		}
	},
    endQTEs: function (interval) {
        var self = this;
		clearInterval(interval);
		self.testSequence(function(QTEStatus){
            self.view.addStatusSeq(self.videoSequence, QTEStatus);
            self.view.showBadge(self.json[self.videoNumber].filmName, self.videoSequence, QTEStatus);
        });
    },
	saveQTE: function(i, success){
		var self = this;
		self.model.saveQTE(self.filmName, self.videoSequence, i, success, function(){
			self.getSave();
		});
	},
	testSequence: function(callback){
		var self = this;
		var QTEDone = false;
		var sequence = self.json[self.videoNumber].sequences[self.videoSequence];
		if(sequence.qte.length === self.QTESuccess) QTEDone = true; // checking if there if the right number of QTESuccess
        callback.call(this, QTEDone);
	},
    toggleSound: function(e){
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
    },

    /**
     * Add an event listener on mouse move and
     * trigger a mouse move in case user would not move his mouse
     */
    addHideControls: function(){
        var self = this;
        self.tempSelfHiddenControls = self.dealHiddenControls.bind(self); /* prevent error with bind and removeEventListener*/
        document.addEventListener('mousemove', self.tempSelfHiddenControls, false);

        if( document.createEvent ) {
            var evObj = document.createEvent('MouseEvents');
            evObj.initEvent( 'mousemove', true, false );
            document.dispatchEvent(evObj);
        } else if( document.createEventObject ) {
            document.fireEvent('mousemove');
        }
    },
	/**
	 * If the user doesn't move his mouse during 2 sec
	 * Controls will disappear to let him enjoy video
	 */
	dealHiddenControls : function(){
        /* Not working, mouse move trigger each second */
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
	/**
	 * Remove the event listener on mouse move and
	 * show back the controls
	 */
	removeHiddenControlsListener: function(){
        var self = this;
        document.removeEventListener('mousemove', self.tempSelfHiddenControls, false);

        clearTimeout(self.timeoutControls);
        if (self.hiddenControls === true) {
            self.view.toggleControls();
            self.hiddenControls = false;
        }
    },
	addListenerOnWorldMap: function() {
		var self = this;
		self.model.emitSocket('renderMap', self.room);
		var zones = document.querySelectorAll('.body-map .clickable-zone');
		for(var i = 0; i < zones.length; i++) {
			var zone = zones[i];
			zone.addEventListener('click', function(){
				self.getDataForIntro(this);
			}, false);
		}
	},
	addListenerHomeVideo: function() {
		var self = this;
		self.step = 'HomeVideo';
		self.model.emitSocket('renderOnFilm', {room: self.room, filmName: self.filmName});
		self.removeHiddenControlsListener();
		document.querySelector('.new-game').addEventListener('click', self.newGame.bind(self), false);
		document.querySelector('.select-sequence').addEventListener('click', self.openSequence.bind(self), false);
		document.querySelector('.map-content').addEventListener('click', function(e){
			e.preventDefault();
			self.view.showBackWorldMap(function(){
				self.addListenerOnWorldMap();
			});
		}, false);
		document.querySelector('.choice-sequence').addEventListener('click', function(e){ e.preventDefault(); self.choiceSequence(this); }, false);
		self.model.getFilmInfo({room: self.room, filmID: 81}, function(data){

		});  /* get information for a treasure, should be done only if the user wants to click on this treasure, and don't forget to change filmID */
	},

	openSequence: function(e) {
		var self = this;
		e.preventDefault();
		self.view.showSecondLevelMenu('.sequences-choices');
	},
};
