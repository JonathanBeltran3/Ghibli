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
	displayQTEInformations: function(action, callback) {
		console.log(action);
		callback.call(this);
	}
};