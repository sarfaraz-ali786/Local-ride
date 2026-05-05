const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://local-ride-tpgi.vercel.app",
    methods: ["GET", "POST"]
  }
});

const driverSockets = {};

io.on('connection', (socket) => {
  socket.on('register_driver', (driverId) => {
    driverSockets[driverId] = socket.id;
    console.log(`Driver connected: ${driverId}`);
  });

  socket.on('disconnect', () => {
    for (const [id, sockId] of Object.entries(driverSockets)) {
      if (sockId === socket.id) delete driverSockets[id];
    }
  });
});

app.use((req, res, next) => {
  req.io = io;
  req.driverSockets = driverSockets;
  next();
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/rides', require('./routes/rides'));
app.use('/api/bookings', require('./routes/bookings'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

server.listen(process.env.PORT || 5000, () => {
  console.log('Server running on port 5000');
});