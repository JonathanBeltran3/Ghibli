"use strict";

var View = function() {};
View.prototype = {
	showAccess: function(string, rootUrl) {
		var data = {rootUrl: rootUrl, token: string};
		var html = new EJS({url: '/links.ejs'}).render(data);
		document.getElementById('links').innerHTML = html;
	},
	renderVideo: function(movie, sequence, callback) {
		var data = {movieLink: movie.sequences[sequence].videoLink};
		var html = new EJS({url: '/video.ejs'}).render(data);
		document.getElementById('links').innerHTML = html;
		callback.call(this);
	},
	launchVideo: function(video) {
		this.video = video;
		video.play();
	},
	waitForQTE: function(wait) {
		var self = this;
		this.video.playbackRate = 0.25;
		console.log(wait);
		setTimeout(function(){self.video.playbackRate = 1; console.log('back to normal');},wait);
	}
};