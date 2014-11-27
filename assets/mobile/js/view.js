"use strict";

var View = function() {};
View.prototype = {
	init: function() {
		this.mainScreen = document.querySelector('.main-mobile');
		this.mapScreen = document.querySelector('.world-map');
		this.introScreen = document.querySelector('.skip-intro');
		this.loadRegionScreen = document.querySelector('.load-region');
	},
	initTemplates: function(templateName, template, callback) {
		this[templateName] = template;
		if(callback) callback.call(this);
	},
	renderLoader: function() {
		var data      = {};
		var template  = Handlebars.compile(this.loaderTemplate);
		var html      = template(data);
		this.mainScreen.innerHTML = html;
		this.mainScreen.classList.remove('hide-screen');
	},
	renderMap: function(){
		var data      = {};
		var template  = Handlebars.compile(this.mapTemplate);
		var html      = template(data);
		this.mapScreen.innerHTML = html;
		if(!this.mainScreen.classList.contains('hide-screen')) this.mainScreen.classList.add('hide-screen');
		if(!this.introScreen.classList.contains('hide-screen')) this.introScreen.classList.add('hide-screen');
		if(!this.loadRegionScreen.classList.contains('hide-screen')) this.loadRegionScreen.classList.add('hide-screen');
	},
	dealwithLoading: function(load) {
		document.querySelector('.loading-value').innerHTML = load;
	}
};
