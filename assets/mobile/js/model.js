"use strict";

var Model = function() {};
Model.prototype = {
	init: function(socket) {
		this.socket = socket
	},
	connectRoom: function(room) {
		this.socket.emit('subscribeMobile', room);
		this.room = room;
	},
	emitAction: function(action, callback) {
		var datas = {room: this.room, action: action};
		this.socket.emit('mobileResponseQTE', datas);
		if(callback) callback.call(this);
	},
	emitSocket: function(event, datas, callback) {
		datas.room = this.room;
		this.socket.emit(event, datas);
		if(callback) callback.call(this);
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
};
