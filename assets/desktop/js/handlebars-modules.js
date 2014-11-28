/**
 * Dynamic partial
 * Allow us to pass a variable for the name of the partial to load
 * exemple : {{{dynPartial logo}}}
 */
Handlebars.registerHelper('dynPartial', function (data, options) {
    var change = '{{> ' + data + '}}';
    var template = Handlebars.compile(change);
    return template(options.data);
});

/**
 * Create the HTML for QTEs and calculate where
 * they shoud be positionnated on timeline
 * exemple : {{addingQTE}}
 */
Handlebars.registerHelper('addingQTE', function () {
    var qtes = this.qte,
        duration = Handlebars.escapeExpression(this.videoDuration);
        var text = '';

    for (var i in qtes) {
        text += '<div class="qte" style="left: ' + (parseInt(qtes[i].time) / parseInt(duration) * 100) + '% "></div>';
    }

    return new Handlebars.SafeString(text);
});


/**
 * Calculate the value of 100 / number
 * exemple : style="width: {{percent ../sequences.length}}%"
 */
Handlebars.registerHelper('percent', function (nb) {
    return new Handlebars.SafeString(100/nb);
});

Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
});
