const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./conf/db");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(cors());
app.use(express.json());

// Note Schema
const noteSchema = new mongoose.Schema({
  roomId: String,
  content: String,
  lastUpdated: { type: Date, default: Date.now },
});
const Note = mongoose.model("Note", noteSchema);

// Socket.io Connection
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("joinRoom", async (roomId) => {
    socket.join(roomId);
    console.log(`Client ${socket.id} joined room: ${roomId}`);

    // Send current note content to the new user
    const note = await Note.findOne({ roomId });
    socket.emit("loadNote", note?.content || "");

    // Get all clients in the room (including the new user)
    const clientsInRoom = await io.in(roomId).fetchSockets();
    const userIds = clientsInRoom.map((client) => client.id);

    // Send the full list of users to the newly joined client
    socket.emit("updateUsers", userIds);

    // Notify existing users (excluding the new user) of the new join
    socket.to(roomId).emit("userJoined", socket.id);
  });

  socket.on("updateNote", async ({ roomId, content }) => {
    console.log(`Updating note in room ${roomId}: ${content}`);
    await Note.findOneAndUpdate(
      { roomId },
      { content, lastUpdated: new Date() },
      { upsert: true }
    );
    socket.to(roomId).emit("noteUpdated", content);
  });

  socket.on("disconnect", async () => {
    console.log("Client disconnected:", socket.id);
    // Notify all rooms the user was in
    for (const roomId of socket.rooms) {
      if (roomId !== socket.id) { // Exclude the socket's own room
        const clientsInRoom = await io.in(roomId).fetchSockets();
        const userIds = clientsInRoom.map((client) => client.id);
        io.to(roomId).emit("updateUsers", userIds); // Update all clients in the room
      }
    }
  });
});

// RESTful Endpoints
app.get("/api/notes/:roomId", async (req, res) => {
  try {
    const note = await Note.findOne({ roomId: req.params.roomId });
    res.json(note || { roomId: req.params.roomId, content: "" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB(); 
});
