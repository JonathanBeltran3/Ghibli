"use strict";

var View = function() {};
View.prototype = {
	initTemplates: function(templateName, template, callback){
		this[templateName] = template;
		callback.call(this);
	},
	showAccess: function(string, rootUrl) {
		var data      = {rootUrl: rootUrl, token: string};
		var template  = Handlebars.compile(this.linksTemplate);
		var html      = template(data);
		document.getElementById('links').innerHTML = html;
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
	renderTimelinePart: function(movie, sequence) {
		var data = { movieDuration: movie.sequences[sequence].videoDuration, qte: movie.sequences[sequence].qte };
		var template  = Handlebars.compile(this.timelinePart);
		var html      = template(data);
		document.querySelectorAll('.timeline')[sequence].innerHTML = html;
	},
//	renderQuotes: function(movie, sequence, callback){
//		var data = {movieQuote: movie.sequences[sequence].quote, movieSequence: sequence+1};
//		var html = new EJS({url: '/quote.ejs'}).render(data);
//		document.querySelector('.main').innerHTML = html;
//		callback.call(this);
//	},
	launchVideo: function(video) {
		console.log('launch');
		this.video = video;
		video.play();
	},
	displayQTEInformations: function(action, callback) {
		document.querySelector('.qte-information').innerHTML = action;
		callback.call(this);
	}
};
