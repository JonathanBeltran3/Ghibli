Handlebars.registerHelper('dynPartial', function(data, options) {
	var change = '{{> '+data+'}}';
	var template  = Handlebars.compile(change);
	console.log(options);
	return template(options.data);
});