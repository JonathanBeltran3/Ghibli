Handlebars.registerHelper('dynPartial', function (data, options) {
    var change = '{{> ' + data + '}}';
    var template = Handlebars.compile(change);
    return template(options.data);
});

Handlebars.registerHelper('addingQTE', function () {
    var qtes = this.qte,
        duration = Handlebars.escapeExpression(this.movieDuration);
        var text = '';

    for (var i in qtes) {
        console.log(qtes[i]);
        text += '<div class="qte" style="left: ' + (parseInt(qtes[i].time) / parseInt(duration) * 100) + '% "></div>';
    }

    return new Handlebars.SafeString(text);
});
