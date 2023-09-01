import React from "react";
import "./Home.css";
import Chat from "../../components/Chat/Chat.js";
import {
  UserContext,
  UserContextProvider,
} from "../../lib/context/userContext";
import Groups from "../../components/Groups/Groups";

export default function Home() {
  return (
    <UserContextProvider>
      <div className="home">
        <Groups />
      </div>
    </UserContextProvider>
  );
}
