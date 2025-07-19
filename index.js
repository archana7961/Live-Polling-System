const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let currentPoll = null;
let votes = {};

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('new-poll', (poll) => {
        currentPoll = poll;
        votes = {};
        io.emit('poll-started', poll);
    });

    socket.on('submit-answer', (answer) => {
        votes[answer] = (votes[answer] || 0) + 1;
        io.emit('poll-result-update', votes);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
