import React from "react";
import "./Home.css";
import Chat from "../../components/Chat/Chat.js";
import { UserContextProvider } from "../../lib/context/userContext";

export default function Home() {
  return (
    <UserContextProvider>
      <div className="home">
        <Chat />
      </div>
    </UserContextProvider>
  );
}
