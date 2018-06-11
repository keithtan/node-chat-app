const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

// triggers when there is a connection btw client and server
io.on('connection', (socket) => {
    console.log('New user connected');

    // sends to itself
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    // send to all other users
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    // broadcasts to all users
    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is from the server');
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    })
})

server.listen(port, () => {
    console.log(`Started on port ${port}`);
});