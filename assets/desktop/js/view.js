"use strict";

var View = function() {};
View.prototype = {
	showAccess: function(string) {
		document.getElementById('links').innerHTML = '<img src="http://api.qrserver.com/v1/create-qr-code/?data=http://www.windmemory.com/'+string+'&size=250x250" alt="Wind Memory QR Code" /><p>OR</p><p>http://www.windmemory.com/'+string+'</p>';
	}
};