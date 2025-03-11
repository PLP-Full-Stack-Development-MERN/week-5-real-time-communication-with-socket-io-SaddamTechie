import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { NoteEditor } from "./components/NoteEditor";
import { UsersList } from "./components/UsersList";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
  reconnection: true,
});

function App() {
  const [noteContent, setNoteContent] = useState("");
  const [users, setUsers] = useState([]);
  const { roomId } = useParams();

  useEffect(() => {
    socket.on("connect", () => console.log("Connected to server:", socket.id));
    socket.on("connect_error", (err) => console.error("Connection error:", err));

    socket.emit("joinRoom", roomId);

    socket.on("loadNote", (content) => {
      console.log("Loaded note:", content);
      setNoteContent(content);
    });

    socket.on("noteUpdated", (content) => {
      console.log("Note updated:", content);
      setNoteContent(content);
    });

    // Set the full list of users when joining or on update
    socket.on("updateUsers", (userIds) => {
      console.log("Updated user list:", userIds);
      setUsers(userIds);
    });

    // Add a new user incrementally
    socket.on("userJoined", (userId) => {
      console.log("User joined:", userId);
      setUsers((prev) => [...new Set([...prev, userId])]); // Avoid duplicates
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("loadNote");
      socket.off("noteUpdated");
      socket.off("updateUsers");
      socket.off("userJoined");
    };
  }, [roomId]);

  const handleNoteChange = (newContent) => {
    setNoteContent(newContent);
    socket.emit("updateNote", { roomId, content: newContent });
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Collaborative Notes - Room: {roomId}</h1>
        <div className="main-content">
          <NoteEditor content={noteContent} onChange={handleNoteChange} />
          <UsersList users={users} />
        </div>
      </div>
    </div>
  );
}

export default App;