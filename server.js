const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const users = new Map();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (username) => {
    users.set(socket.id, username);
    io.emit('online-users', Array.from(users.values()));
    socket.broadcast.emit('message', { user: 'System', message: `${username} joined the chat` });
  });

  socket.on('chat message', (msg) => {
    const username = users.get(socket.id) || 'Unknown';
    io.emit('message', { user: username, message: msg });
  });

  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    users.delete(socket.id);
    io.emit('online-users', Array.from(users.values()));
    if (username) {
      socket.broadcast.emit('message', { user: 'System', message: `${username} left the chat` });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});