import React, { useState, createContext } from "react";

export const WebsocketContext = createContext({
  conn: null,
  setConn: () => {},
});

const WebSocketProvider = ({ children }) => {
  const [conn, setConn] = useState(null);

  return (
    <WebsocketContext.Provider
      value={{
        conn: conn,
        setConn: setConn,
      }}
    >
      {children}
    </WebsocketContext.Provider>
  );
};

export default WebSocketProvider;
