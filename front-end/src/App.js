import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./components/chatComponent";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dateBirthDay, setDateBirthDay] = useState("")
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (email !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Chat </h3>
          <input
            type="text"
            placeholder="Nome..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
           <input
            type="text"
            placeholder="Email..."
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Data de nascimento..."
            onChange={(event) => {
              setDateBirthDay(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Nome da sala..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Entre</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} email={email} dateBirthDay={dateBirthDay} room={room} />
      )}
    </div>
  );
}

export default App;
