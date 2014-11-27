"use strict";

var View = function() {};
View.prototype = {
	initTemplates: function(templateName, template, callback) {
		this[templateName] = template;
		callback.call(this);
	},

};
