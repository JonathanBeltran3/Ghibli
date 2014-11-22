"use strict";

var View = function() {};
View.prototype = {
	showAccess: function(string, rootUrl) {
		var data = {rootUrl: rootUrl, token: string};
		var html = new EJS({url: '/links.ejs'}).render(data);
		document.getElementById('links').innerHTML = html;
	},
	renderIntro: function(movie, callback) {
		var data = {movieLink: movie.introduction};
		var html = new EJS({url: '/video.ejs'}).render(data);
		document.querySelector('.video-container').innerHTML = html;
		var video = document.querySelector('.video');
		callback.call(this, video);
	},
	renderVideo: function(movie, sequence, callback) {
		var data = {movieLink: movie.sequences[sequence].videoLink};
		var html = new EJS({url: '/video.ejs'}).render(data);
		document.querySelector('.video-container').innerHTML = html;
		callback.call(this);
	},
	renderQuotes: function(movie, sequence, callback){
		var data = {movieQuote: movie.sequences[sequence].quote, movieSequence: sequence+1};
		var html = new EJS({url: '/quote.ejs'}).render(data);
		document.querySelector('.main').innerHTML = html;
		callback.call(this);
	},
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