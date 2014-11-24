"use strict";

var View = function() {};
View.prototype = {
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
		document.querySelector('.main').innerHTML = html;
	},
	renderIntro: function(movie, callback) {
		var data      = {movieLink: movie.introduction};
		var template  = Handlebars.compile(this.videoTemplate);
		var html      = template(data);
		document.querySelector('.video-container').innerHTML = html;
		var video = document.querySelector('.video');
		callback.call(this, video);
	},
	renderHomeVideo: function(movie, callback) {
		var data      = {filmName: movie.filmName, logo: movie.logo};
		var template  = Handlebars.compile(this.movieHomeTemplate);
		var html      = template(data);
		template  = Handlebars.compile(html);
		html = template(data);
		document.querySelector('.main').innerHTML = html;
		callback.call(this);
	},
	renderVideo: function(movie, sequence, callback) {
		var data      = {movieLink: movie.sequences[sequence].videoLink};
		var template  = Handlebars.compile(this.videoTemplate);
		var html      = template(data);
		document.querySelector('.video-container').innerHTML = html;
		callback.call(this);
	},
	renderMoviePlaying: function(movie) {
		var data = { sequences: movie.sequences };
		var template  = Handlebars.compile(this.moviePlaying);
		var html      = template(data);
		document.querySelector('.main').innerHTML = html;
	},
	renderQuotes: function(movie, sequence, callback){
		var data = {movieQuote: movie.sequences[sequence].quote, movieSequence: sequence+1};
		var template  = Handlebars.compile(this.quoteTemplate);
		var html      = template(data);
		document.querySelector('.loader-screen').innerHTML = html;
		document.querySelector('.loader-screen').classList.add('show-screen');
		callback.call(this);
	},
	launchVideo: function(video) {
		this.video = video;
		video.play();
	},
    hideLoader: function() {
        document.querySelector('.loader-screen').classList.remove('show-screen');
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
			if(video.volume < 0.15) {
				video.volume = 0;
				clearInterval(interval);
			}
			video.volume -= 0.1;
		},200);
		callback.call(this);
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
        this.showBadge();
    },
    showBadge : function (){
        var seq = 1;

		var data = {
            filmName: 'nausicaa',
            seq : seq,
            unlocked : false
        };

        switch(seq) {
            case 1 :
                data.msg = 'The complete biography of the film &amp; characters.';
            break;
            case 2 :
                data.msg = 'The complete biography of the film &amp; characters.';
            break;
            case 3 :
                data.msg = 'The complete biography of the film &amp; characters.';
            break;
        }

		var template  = Handlebars.compile(this.badgeContent);
		var html      = template(data);
		document.querySelector('.qte-badge').innerHTML = html;
		document.querySelector('.qte-badge').classList.add('animated');
    }
};
