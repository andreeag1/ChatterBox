import React, { useContext, useEffect, useRef } from "react";
import "./GroupCard.css";

export default function GroupCard({
  groupId,
  groupPicture,
  usernames,
  lastMessage,
  currentUsername,
}) {
  return (
    <div className="single-chat" key={groupId}>
      <img className="profileImg" src={groupPicture} alt="" />
      <div className="names">
        <div className="convo-names">
          {usernames.map((username) => {
            if (username !== currentUsername) {
              if (
                (usernames[1] == username || usernames[0] == username) &&
                usernames.length == 2
              ) {
                return <h5>{username} </h5>;
              } else if (usernames[usernames.length - 1] == username) {
                return <h5>{username}</h5>;
              } else {
                return <h5>{username}, </h5>;
              }
            }
          })}
        </div>
        <div className="convo">
          <h6>{lastMessage}</h6>
        </div>
      </div>
    </div>
  );
}
