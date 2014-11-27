"use strict";
var App = function(){};
App.prototype = {
	init: function(){
		this.express = require('express');
		this.app = this.express();
		this.http = require('http');
		this.path = require('path');
		this.server = this.http.createServer(this.app);
		this.io = require('socket.io').listen(this.server);
		this.json = require('./qte.json');
		this.listenQTE = 0;
		this.listenPassIntro = 0;

		this.app.use(this.express.static(this.path.join(__dirname, './assets/desktop/views')));
		this.app.use(this.express.static(this.path.join(__dirname, './assets/desktop/videos/')));
		this.app.use(this.express.static(this.path.join(__dirname, './assets/mobile/views/')));
		this.app.use(this.express.static(this.path.join(__dirname, './assets/')));
		this.getRoutes();
		this.socketListener();
	},
	getRoutes: function() {
		var self = this
		// Routing with params
		self.app.get('/', function (req, res) {
		  res.render('index.ejs', {title: 'Wind Memory'});
		}).get('/:code/', function (req, res) {
		  res.render('mobile.ejs', {title: 'Wind Memory', code: req.params.code});
		});
	},
	socketListener: function() {
		var self = this;

		self.io.sockets.on('connection', function(socket){
			socket.on('subscribe', function(room) { //Client subscribe to a Room (recieve)
				socket.join(room);
			});

			socket.on('mobileConnection', function(datas){
				console.log(datas);
				self.io.to(datas.room).emit('mobileConnected', self.json);
			});

			socket.on('passIntro', function(room){
				self.io.to(room).emit('passIntro');
				self.listenPassIntro = 1;
			});

			socket.on('mobilePassIntro', function(datas){
				if(self.listenPassIntro) {
					self.listenPassIntro = 0;
					self.io.to(datas.room).emit('mobilePassIntro');
				}
			});

			socket.on('actionQTE', function(datas){
				self.io.to(datas.room).emit('mobileActionQTE', datas.action);
				self.listenQTE = 1;
			});

			socket.on('mobileResponseQTE', function(datas) {
				if(self.listenQTE) {
					self.io.to(datas.room).emit('QTEDone', datas.action);
				}
				self.listenQTE = 0;
			});

			socket.on('introPassed', function(room) {
				self.listenPassIntro = 0;
			});

			socket.on('failQTE', function(room) {
				self.listenQTE = 0;
				self.io.to(room).emit('failQTE');
			});

			socket.on('loadingInProgress', function(datas){
				self.io.to(datas.room).emit('loadingInProgress', datas.load);
			});
		});
		self.server.listen(8080);
	}
}
var app = new App();
app.init();
