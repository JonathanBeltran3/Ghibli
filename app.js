"use strict";
var express = require('express'),
    app = express(),
	http = require('http'),
	path = require('path'),
	server = http.createServer(app),
	io = require('socket.io').listen(server),
	json = require('./qte.json'),
	listenQTE = 0,
	listenPassIntro = 0;
   
app.use(express.static(path.join(__dirname, './assets/desktop/views')));
app.use(express.static(path.join(__dirname, './assets/desktop/videos/')));
app.use(express.static(path.join(__dirname, './assets/')));


// Routing with params
app.get('/', function (req, res) {
  res.render('index.ejs', {title: 'Wind Memory'});
}).get('/:code/', function (req, res) {
  res.render('mobile.ejs', {title: 'Wind Memory', code: req.params.code});
})
io.sockets.on('connection', function(socket){
	socket.on('subscribe', function(room) { //Client subscribe to a Room (recieve)
		socket.join(room); 
    });
	socket.on('mobileConnection', function(room){
		io.to(room).emit('mobileConnected', json);
	});
	socket.on('passIntro', function(room){
		io.to(room).emit('passIntro');
		listenPassIntro = 1;
	});
	socket.on('mobilePassIntro', function(datas){
		if(listenPassIntro === 1 && datas.action === 'tap') {
			listenPassIntro = 0;
			io.to(datas.room).emit('mobilePassIntro');
		}
	});
	socket.on('actionQTE', function(datas){
		io.to(datas.room).emit('mobileActionQTE', datas.action);
		listenQTE = 0;
	});
	socket.on('mobileResponseQTE', function(datas) {
		if(listenQTE === 0) {
			io.to(datas.room).emit('QTEDone', datas.action);
		}
		listenQTE++;
	});
	socket.on('failQTE', function(){
		listenQTE++;
	});
});
server.listen(8080);