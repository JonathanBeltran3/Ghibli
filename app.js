var express = require('express'),
    app = express(),
	http = require('http'),
	path = require('path'),
	server = http.createServer(app),
	io = require('socket.io').listen(server),
	json = require('./qte.json');
   
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
	socket.on('mobileConnection',function(room){
		io.to(room).emit('mobileConnected', json);
	});
});
server.listen(8080);