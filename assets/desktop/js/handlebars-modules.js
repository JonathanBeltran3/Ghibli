Handlebars.registerHelper('dynPartial', function (data, options) {
    var change = '{{> ' + data + '}}';
    var template = Handlebars.compile(change);
    console.log(options);
    return template(options.data);
});

Handlebars.registerHelper('addingQTE', function () {
    var qtes = this.qte,
        duration = Handlebars.escapeExpression(this.videoDuration);
        var text = '';

    for (var i in qtes) {
        text += '<div class="qte" style="left: ' + (parseInt(qtes[i].time) / parseInt(duration) * 100) + '% "></div>';
    }

    return new Handlebars.SafeString(text);
});
