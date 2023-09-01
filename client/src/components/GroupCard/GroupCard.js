import React, { useContext, useEffect, useRef } from "react";
import "./GroupCard.css";

export default function GroupCard({
  groupId,
  groupPicture,
  usernames,
  lastMessage,
}) {
  return (
    <div className="single-chat" key={groupId}>
      <img className="profileImg" src={groupPicture} alt="" />
      <div className="names">
        <div className="convo-names">
          {usernames.map((username, i) => {
            return (
              <div>
                {i > 0 && ", "}
                <h5 key={username}>{username}</h5>
              </div>
            );
          })}
        </div>
        <div className="convo">
          <h6>{lastMessage}</h6>
        </div>
      </div>
    </div>
  );
}
