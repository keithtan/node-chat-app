const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

// triggers when there is a connection btw client and server
io.on('connection', (socket) => {
    console.log('New user connected');

    

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required.');
        }

        socket.join(params.room);
        // remove user from any existing room
        users.removeUser(socket.id);
        // add user to room
        users.addUser(socket.id, params.name, params.room);
        // update room list
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        // sends to itself
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        // send to all other users
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined`));
        
        callback();
    });

    // broadcasts to all users
    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        var user = users.removeUser(socket.id);

        if (user) {
            // updates room list in room
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
    })
})

server.listen(port, () => {
    console.log(`Started on port ${port}`);
});