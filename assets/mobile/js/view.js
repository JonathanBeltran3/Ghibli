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
	renderPassIntro: function(filmName) {
		var data      = {filmName: filmName};
		var template  = Handlebars.compile(this.filmScreenTemplate);
		var html      = template(data);
		this.mainScreen.innerHTML = html;
		if(this.mainScreen.classList.contains('hide-screen')) this.mainScreen.classList.remove('hide-screen');
		var data      = {};
		var template  = Handlebars.compile(this.passIntroTemplate);
		var html      = template(data);
		this.introScreen.innerHTML = html;
		if(this.introScreen.classList.contains('hide-screen')) this.introScreen.classList.remove('hide-screen');
	},
	renderOnFilm: function(){
		var data      = {};
		var template  = Handlebars.compile(this.onFilmTemplate);
		var html      = template(data);
		this.loadRegionScreen.innerHTML = html;
		if(!this.introScreen.classList.contains('hide-screen')) this.introScreen.classList.add('hide-screen');
		if(this.loadRegionScreen.classList.contains('hide-screen')) this.loadRegionScreen.classList.remove('hide-screen');
	},
	dealwithLoading: function(load) {
		document.querySelector('.loading-value').innerHTML = load;
	}
};
