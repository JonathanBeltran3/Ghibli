"use strict";

var Model = function() {};
Model.prototype = {
	init: function(socket) {
		this.socket = socket
	},
	randomString: function(stringLength) {
		var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
		var randomString = '';
		for (var i=0; i < stringLength; i++) {
			var rNum = Math.floor(Math.random() * chars.length);
			randomString += chars.substring(rNum,rNum+1);
		}
		return randomString;
	},
	createRoom: function(callback) {
		var string = this.randomString(6);
		this.socket.emit('subscribe', string);
		callback.call(this, string);
	},
	getRootUrl: function(callback){
		// Create
		var rootUrl = document.location.protocol+'//'+(document.location.hostname||document.location.host);
		if ( document.location.port||false ) {
			rootUrl += ':'+document.location.port;
		}
		rootUrl += '/';

		// Return
		callback.call(this, rootUrl);
	},
	emitSocket: function(event, datas, callback) {
		this.socket.emit(event, datas);
		if(callback) callback.call(this);
	}
};