"use strict";

var View = function() {};
View.prototype = {
	init: function() {
		this.loader = document.querySelector('.loader-screen');
		this.main = document.querySelector('.main');
		this.videoContainer = document.querySelector('.video-container');
		this.mapContainer = document.querySelector('.map-screen');
	},

	toggleFullscreen: function() {
		if (fullScreenApi.supportsFullScreen)
		{
			if (fullScreenApi.isFullScreen()) {
				fullScreenApi.cancelFullScreen(document.documentElement);
			} else {
				fullScreenApi.requestFullScreen(document.documentElement);
			}
		}

	},
	initTemplates: function(templateName, template, callback) {
		this[templateName] = template;
		callback.call(this);
	},
	showAccess: function(string, rootUrl) {
		var data      = {rootUrl: rootUrl, token: string};
		var template  = Handlebars.compile(this.linksTemplate);
		var html      = template(data);
		this.main.innerHTML = html;
	},
	renderLoader: function(value, callback){
		var data      = {value: value};
		var template  = Handlebars.compile(this.loadingTemplate);
		var html      = template(data);
		this.loader.innerHTML = html;
		this.loader.classList.remove('hide-screen');
		setTimeout(callback.call(this), 1000);

	},
	renderIntro: function(movie, callback) {
		var data      = {movieLink: movie.introduction, logo: movie.logo+'-intro'};
		var template  = Handlebars.compile(this.homeIntro);
		var html      = template(data);
		this.videoContainer.innerHTML = html;
        this.videoContainer.classList.remove('hide-screen');
		setTimeout(function(){
			var downs = document.querySelectorAll('.down-disappear');
			for(var i = 0; i < downs.length; i++) {
				var down = downs[i];
				down.classList.remove('down-disappear');
			}
		},50);
		var video = document.querySelector('.video');
		callback.call(this, video);
	},
	renderHomeVideo: function(movie, callback) {
		var data      = {filmName: movie.filmName, logo: movie.logo};
		var template  = Handlebars.compile(this.movieHomeTemplate);
		var html      = template(data);
		template  = Handlebars.compile(html);
		html = template(data);
		this.main.innerHTML = html;
		this.main.classList.remove('hide-screen');
		setTimeout(function(){document.querySelector('.up-disappear').classList.remove('up-disappear')}, 50);
		var lis = document.querySelectorAll('.left-disappear');
		var i = 0;
		var interval = setInterval(function(){
			var li = lis[i];
			li.classList.remove('left-disappear');
			if(i === lis.length-1) clearInterval(interval);
			i++;
		},150);
		callback.call(this);
	},
	renderVideo: function(movie, sequence, callback) {
		var data      = {movieLink: movie.sequences[sequence].videoLink};
		var template  = Handlebars.compile(this.videoTemplate);
		var html      = template(data);
		this.videoContainer.innerHTML = html;
		callback.call(this);
	},
	renderMap: function(callback) {
		var data      = {};
		var template  = Handlebars.compile(this.mapTemplate);
		var html      = template(data);
		this.mapContainer.innerHTML = html;
		this.hideLoader();
		callback.call(this);
	},
	renderMoviePlaying: function(movie) {
		var data = { sequences: movie.sequences };
		var template  = Handlebars.compile(this.moviePlaying);
		var html      = template(data);
		this.main.innerHTML = html;
	},
	renderQuotes: function(movie, sequence, callback){
		var data = {movieQuote: movie.sequences[sequence].quote, movieSequence: sequence+1};
		var template  = Handlebars.compile(this.quoteTemplate);
		var html      = template(data);
		this.loader.innerHTML = html;
		this.loader.classList.remove('hide-screen');
		callback.call(this);
	},
	launchVideo: function(video) {
		this.video = video;
		video.play();
        document.querySelector('.sound').classList.add('visible');
	},
	updateLoader: function(value) {
		document.querySelector('.value').innerHTML = value;
	},
    hideLoader: function(callback) {
        this.loader.classList.add('hide-screen');
		if(callback) callback.call(this);
    },
	hideMain: function(callback) {
		this.main.classList.add('hide-screen');
		if(callback) callback.call(this);
	},
	hideVideoContainer: function(callback) {
		this.videoContainer.classList.add('hide-screen');
		if(callback) callback.call(this);
	},
	displayQTEInformations: function(action, seq, i, callback) {
		var data = {};
		var template  = Handlebars.compile(this[action]);
		var html      = template(data);
		document.querySelector('.qte-action').innerHTML = html;
		this.toggleQteMode(seq, i);
		callback.call(this);
	},
	toggleQteMode: function(seq, i) {
        document.querySelector('.qte-mode').classList.toggle('active');
        document.querySelector('.qte-progression').classList.toggle('shrinkQTECircle');
        document.querySelectorAll('.timeline-3-seq')[seq].querySelectorAll('.qte')[i].classList.toggle('doing');
	},
	fadeIntro: function(video, callback){
        var interval = setInterval(function() {
            if (video.volume > 0) {
                video.volume -= 0.1;
                video.volume = Math.round(video.volume * 100)/100; // fixing stupid error
            }
            if(video.volume === 0) {
                video.pause();
                document.querySelector('.sound').classList.remove('visible');
                clearInterval(interval);
                callback.call(this);
            }
        },200);

		document.querySelector('.indication-text').classList.add('down-disappear');
		document.querySelector('.credits-intro').classList.add('down-disappear');
		document.querySelector('.film-title').classList.add('down-disappear');
	},
	fadeHomeVideo: function(callback) {
		document.querySelector('.film-title').classList.add('up-disappear');
		var lis = document.querySelectorAll('.first-level-li');
		for(var i = 0; i < lis. length; i++) {
			var li = lis[i];
			li.classList.add('left-disappear');
		}
		setTimeout(function(){callback.call(this);},800);

	},
    updateTimelineProgress: function (seq, progress) {
        document.querySelectorAll('.timeline-part')[seq].style.width = progress + '%';
    },
    addSuccessQTE: function(seq, i) {
        document.querySelectorAll('.timeline-3-seq')[seq].querySelectorAll('.qte')[i].classList.add('success');
    },
    addStatusSeq: function(seq, success) {
        var status = (success) ? 'unlocked' : 'locked';
        document.querySelectorAll('.qte-shield')[seq].classList.add(status);
    },
    showBadge : function (filmName, seq, unlocked){
        document.querySelector('.qte-badge').classList.remove('badgeAnimation');
		var data = {
            filmName: filmName,
            seq : seq + 1,
            unlocked : unlocked
        };

        switch(seq) {
            case 0 :
                data.msg = 'All you need to know about this movie (Synopsis & other).';
            break;
            case 1 :
                data.msg = 'The complete biography of each important character.';
            break;
            case 2 :
                data.msg = 'All the best fan art, found on Deviant Art & Behance.';
            break;
        }

		var template  = Handlebars.compile(this.badgeContent);
		var html      = template(data);
		document.querySelector('.qte-badge').innerHTML = html;
		setTimeout(function(){
            document.querySelector('.qte-badge').classList.add('badgeAnimation');
        }, 100);
    },
    toggleControls: function(){
        document.querySelector('body').classList.toggle('hide-controls');
    }
};

var Sound = {
    el : document.querySelector('.sound')
};

Sound.playSound = function(video, callback) {
    video.volume = 0;
    var interval = setInterval(function() {
        if(video.volume >= 1) {
            clearInterval(interval);
            callback.call(this);
        } else {
            video.volume += 0.1;
            video.volume = Math.round(video.volume * 100)/100;
        }
    },200);

    this.el.classList.remove('is-off');
};

Sound.cutSound = function(video, callback) {
    video.volume = 1;
    var interval = setInterval(function() {
        if(video.volume <= 0) {
            clearInterval(interval);
            callback.call(this);
        } else {
            video.volume -= 0.1;
            video.volume = Math.round(video.volume * 100)/100;
        }
    },200);

    this.el.classList.add('is-off');
};

Sound.showSound = function (soundOn) {
    this.el.classList.add('visible');
    if (soundOn)
        this.el.classList.remove('is-off');
    else
        this.el.classList.add('is-off');
};

Sound.hideSound = function () {
    this.el.classList.remove('visible');
};
