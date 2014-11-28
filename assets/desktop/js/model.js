"use strict";

var Model = function() {};
Model.prototype = {
	init: function(socket) {
		this.socket = socket
	},
	/**
	 * Generate a token
	 * @param int stringLength Size of the token
	 * @returns stinf Token made with letters & numbers + uppercases
	 */
	randomString: function(stringLength) {
		var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
		var randomString = '';
		for (var i=0; i < stringLength; i++) {
			var rNum = Math.floor(Math.random() * chars.length);
			randomString += chars.substring(rNum,rNum+1);
		}
		return randomString;
	},
	/**
	 * Create a room for server
	 */
	createRoom: function(callback) {
		var string = this.randomString(6);
		this.socket.emit('subscribe', string);
		callback.call(this, string);
	},
	/**
	 * Get the root url because we have 2 domain name
	 */
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
	/**
	 * Load the localStorage to find back last save
	 */
	getSave: function(callback){
		var datas = {};
		if(localStorage.save)
        {
            datas = JSON.parse(localStorage.save);
        }
		this.save = datas;
		callback.call(this, this.save);
	},
	/**
	 * On each QTE update the save
	 * @param string filmName Name of the film
	 * @param int sequence Index of the sequence
	 * @param int i Index of the QTE inside a sequence
	 * @param bool success If the user did correctly the QTE or not
	 */
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
	},
    /**
     * Get Film Info using TMDb API
     * @param object datas Object with the token room + film ID
     */
    getFilmInfo: function(datas, callback){
        this.emitSocket('askFilm', datas);
        /* exemple
         * 81 pour Nausicaa
        * 128 Mononoke
        * 129 Spirited Away
        * 8392-tonari-no-totoro pour Totoro
        * 11621-kurenai-no-buta pour Porco Rosso
        * 10515 Laputa
        * 149870-kaze-tachinu The wind rises
        * */
    }
};
