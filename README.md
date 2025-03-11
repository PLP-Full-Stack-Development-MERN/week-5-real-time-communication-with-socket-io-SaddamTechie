# Real-Time Collaborative Notes

A real-time note-taking application built with MERN stack and Socket.io, allowing multiple users to collaborate on notes simultaneously.

## Features

- Real-time note editing and synchronization
- Room-based collaboration
- Live user presence indicators
- Persistent note storage

## Installation

1. Clone the repository

```bash
git clone https://github.com/PLP-Full-Stack-Development-MERN/week-5-real-time-communication-with-socket-io-SaddamTechie.git note-app
```

2.Install server dependencies

```bash
   cd note-app
   npm run build
```

3.Connect MongoDB cloud
Create `.env` file at the root of your `note-app` folder and add:

```
   MONGO_URI=<YOUR_MONGO_URI>
   PORT=5000
```

4.Start the app

```bash
   npm run start
```

**Usage**

- Access the app at http://localhost:5000
- Create room
- Use the id to join the room on different tab using your name.
- Make changes to the notes and observe it from the other tab.

**Key Real-Time Concepts**

- WebSockets: Implemented using Socket.io for bi-directional communication
- Rooms: Socket.io rooms feature used for isolating collaboration spaces
- Real-Time Updates: Broadcast note changes to all connected clients in a room
- State Synchronization: Combines REST API with WebSocket events

**Technologies**

- MongoDB, Express.js, React, Node.js (MERN)
- Socket.io for WebSocket communication
