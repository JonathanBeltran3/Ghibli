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
	renderLoader: function(callback) {
		var data      = {};
		console.log(this.loaderTemplate);
		var template  = Handlebars.compile(this.loaderTemplate);
		var html      = template(data);
		this.mainScreen.innerHTML = html;
		this.mainScreen.classList.remove('hide-screen');
		callback.call(this);
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
	renderOnFilm: function(filmName){
		console.log(document.querySelector('.'+filmName));

		if(!document.querySelector('.'+filmName)) {
			var data      = {filmName: filmName};
			var template  = Handlebars.compile(this.filmScreenTemplate);
			var html      = template(data);
			this.mainScreen.innerHTML = html;
			if(this.mainScreen.classList.contains('hide-screen')) this.mainScreen.classList.remove('hide-screen');
		}
		var data      = {};
		var template  = Handlebars.compile(this.onFilmTemplate);
		var html      = template(data);
		this.loadRegionScreen.innerHTML = html;
		if(!this.introScreen.classList.contains('hide-screen')) this.introScreen.classList.add('hide-screen');
		if(this.loadRegionScreen.classList.contains('hide-screen')) this.loadRegionScreen.classList.remove('hide-screen');
	},
	renderOnSequence: function(filmName) {
		if(!document.querySelector('.'+filmName)) {
			var data      = {filmName: filmName};
			var template  = Handlebars.compile(this.filmScreenTemplate);
			var html      = template(data);
			this.mainScreen.innerHTML = html;
			if(this.mainScreen.classList.contains('hide-screen')) this.mainScreen.classList.remove('hide-screen');
		}
		var data      = {};
		var template  = Handlebars.compile(this.onSequenceTemplate);
		var html      = template(data);
		this.introScreen.innerHTML = html;
		if(this.introScreen.classList.contains('hide-screen')) this.introScreen.classList.remove('hide-screen');
		if(!this.loadRegionScreen.classList.contains('hide-screen')) this.loadRegionScreen.classList.add('hide-screen');
	},
	addActionToScreen: function(action) {
		var data = {};
		var template  = Handlebars.compile(this[action]);
		var html      = template(data);
		var gesture = document.querySelector('.gesture');
		gesture.innerHTML = html;
		gesture.classList.remove('fade-disappear');
		document.querySelector('.progress-bar').classList.add('done');
	},
	addFailToScreen: function() {
		var data = {};
		var template  = Handlebars.compile(this.qteFail);
		var html      = template(data);
		var qteDone = document.querySelector('.qte-done');
		qteDone.innerHTML = html;
		qteDone.classList.remove('fade-disappear');
		document.querySelector('.progress-bar').classList.remove('done');
		document.querySelector('.gesture').classList.add('fade-disappear');
		setTimeout(function(){
			qteDone.classList.add('fade-disappear');
		},1500)
	},
	addSuccessToScreen: function() {
		var data = {};
		var template  = Handlebars.compile(this.qteSuccess);
		var html      = template(data);
		var qteDone = document.querySelector('.qte-done');
		qteDone.innerHTML = html;
		qteDone.classList.remove('fade-disappear');
		document.querySelector('.progress-bar').classList.remove('done');
		document.querySelector('.gesture').classList.add('fade-disappear');
		setTimeout(function(){
			qteDone.classList.add('fade-disappear');
		},1500)
	},
	dealwithLoading: function(load) {
		document.querySelector('.loading-value').innerHTML = load;
	}
};
