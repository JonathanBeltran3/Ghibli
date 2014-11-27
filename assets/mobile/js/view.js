"use strict";

var View = function() {};
View.prototype = {

	initTemplates: function(templateName, template, callback) {
		this[templateName] = template;
		if(callback) callback.call(this);
	},
	renderLoader: function() {
		var data      = {};
		var template  = Handlebars.compile(this.loaderTemplate);
		var html      = template(data);
		this.mainScreen = document.querySelector('.load-region');
		this.mainScreen.innerHTML = html;
		this.mainScreen.classList.remove('hide-screen');
	},
	dealwithLoading: function(load) {

	}
};
