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
	getSave: function(callback){
		var datas = {};
		if(localStorage.save)
        {
            datas = JSON.parse(localStorage.save);
        }
		this.save = datas;
		callback.call(this, this.save);
	},
	saveQTE: function(filmName, sequence, i, success, callback){
		if(this.save[filmName] === undefined) this.save[filmName] = [];
		if(this.save[filmName][sequence] === undefined) this.save[filmName][sequence] = [];
		if(!this.save[filmName][sequence][i] || this.save[filmName][sequence][i].qte !== true) {
			this.save[filmName][sequence][i] = {qte: success};
			console.log(this.save);
		}
		localStorage.save = JSON.stringify(this.save);
		callback.call(this);
	},
	ajaxLoadTemplate: function(template, callback) {
		var xmlhttp;

		if (window.XMLHttpRequest) {
			// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp = new XMLHttpRequest();
		} else {
			// code for IE6, IE5
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}

		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 ) {
			   if(xmlhttp.status == 200){
				   callback.call(this, xmlhttp.responseText);
			   }
			   else if(xmlhttp.status == 400) {
				   console.log('There was an error 400');
			   }
			   else {
				   console.log('something else other than 200 was returned');
			   }
			}
		}

		xmlhttp.open("GET", template, true);
		xmlhttp.send();
	},
	emitSocket: function(event, datas, callback) {
		this.socket.emit(event, datas);
		if(callback) callback.call(this);
	}
};
