const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./conf/db');
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST","PUT","DELETE"]
    }
});

app.use(cors());
app.use(express.json());



// Note Schema
const noteSchema = new mongoose.Schema({
    roomId: String,
    content: String,
    lastUpdated: { type: Date, default: Date.now }
});
const Note = mongoose.model('Note', noteSchema);

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('New client connected');

    // Join room
    socket.on('joinRoom', async (roomId) => {
        socket.join(roomId);
        
        // Send current note content
        const note = await Note.findOne({ roomId });
        socket.emit('loadNote', note?.content || '');
        
        // Broadcast user joined
        socket.to(roomId).emit('userJoined', socket.id);
    });

    // Handle note updates
    socket.on('updateNote', async ({ roomId, content }) => {
        await Note.findOneAndUpdate(
            { roomId },
            { content, lastUpdated: new Date() },
            { upsert: true }
        );
        socket.to(roomId).emit('noteUpdated', content);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// RESTful Endpoints
app.get('/api/notes/:roomId', async (req, res) => {
    const note = await Note.findOne({ roomId: req.params.roomId });
    res.json(note);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
    connectDB();
}); 