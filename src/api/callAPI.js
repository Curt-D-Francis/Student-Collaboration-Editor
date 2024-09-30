
const http = require('http');
const express = require('express');
const {Server} = require('socket.io');
const app = express();
const server = http.createServer(app);

let connectedUsers = [];

const io = new Server(server);

io.on('connection', (socket)=>{
    const newUser = {id:socket.id, name:socket.name}
    console.log(`A user connected: ${socket.id}`);

    connectedUsers.push(newUser);

    io.emit('user-joined', connectedUsers);

    socket.on('join-call', (roomID)=>{
        console.log(`${socket.id} joined the call`);
        connectedUsers.push({id:socket.id, room: roomID});
        io.emit('user-joined', connectedUsers);
        socket.join(roomID);
        io.to(roomID).emit('new-participant', socket.id)
    })

    socket.on('leave-call', (roomID)=>{
        console.log(`${socket.id} has disconnected`);
        connectedUsers = connectedUsers.filter(user => user !== leaver.id);
        io.emit('user-left', connectedUsers);
        io.to(roomID).emit('new-participant-left', socket.id);
        socket.leave(roomID)
    })

    socket.on('disconnect', ()=>{
        const user = connectedUsers.find(user => user.id === socket.id);
        if (user) {
            const roomID = user.room;

            // Remove the user from the connectedUsers list
            connectedUsers = connectedUsers.filter(user => user.id !== socket.id);
            io.to(roomID).emit('user-left', connectedUsers);

            // Notify others in the room about the participant leaving
            socket.broadcast.to(roomID).emit('new-participant-left', socket.id);
        }
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

