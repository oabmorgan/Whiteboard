const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var port = 3000;
const ip = require("ip");
var activeCount = 0;

app.use('/images', express.static('images'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/gallery', (req, res) => {
	res.sendFile(__dirname + '/gallery.html');
});

io.on('connection', (socket) => {
	socket.on('start', () => {
		activeCount = 0;
		io.emit('start');
	});
	socket.on('starting',() => {
		activeCount++;
		console.log(activeCount);
	});
	socket.on('stop', () => {
		io.emit('stop');
	});
	socket.on('post', (userName, art) => {
		activeCount--;
		io.emit('post', socket.id, userName, art, activeCount);
	});
	socket.on('rate', (socket, color) => {
		io.to(socket).emit('rate', color);
		console.log("rating",socket, color);
	});
});

server.listen(port, () => {
	console.log(ip.address() + ':'+port);
});