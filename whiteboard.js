const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var port = 5000;
const ip = require("ip");

app.use('/images', express.static('images'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/gallery', (req, res) => {
	res.sendFile(__dirname + '/gallery.html');
});

io.on('connection', (socket) => {
	socket.on('joinRoom', (roomID, open = false) => {
		if(open || io.sockets.adapter.rooms.get(roomID)){
			socket.join(roomID);
			io.to(socket.id).emit('joinRoom', roomID);
		} else {
			io.to(socket.id).emit('joinRoom', 'fail');
		}
	})
	socket.on('start', () => {
		io.to(getRoom(socket)).emit('start');
	});

	socket.on('starting',() => {
	});

	socket.on('stop', () => {
		io.to(getRoom(socket)).emit('stop');
	});

	socket.on('post', (art) => {
		io.to(getRoom(socket)).emit('post', socket.id, art, 0);
	});

	socket.on('rate', (socket, color) => {
		io.to(socket).emit('rate', color);
	});
});

function getRoom(socket){
	let roomArray = Array.from(socket.rooms);
	return roomArray[roomArray.length-1];
}

server.listen(port, () => {
	console.log(ip.address() + ':'+port);
	let url = 'https://QKgzmbdX6fuvW0NX:xhj0GS56VBlN59EU@domains.google.com/nic/update?hostname=wb.omorgan.net&myip='+ip.address();
	require('https').get(url, (res) => {
    	res.on('data', function (body) {
        	console.log(body);
    	});
	});
})