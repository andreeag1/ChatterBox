import React, { useEffect, useRef } from "react";
import "./ChatBody.css";
import { styled } from "@mui/material/styles";
import {
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import profile from "../../pictures/profile.png";

export default function ChatBody({ message }) {
  const ref = useRef(null);

  const scrollToBottom = () => {
    const lastChildElement = ref.current?.lastElementChild;
    lastChildElement?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [message]);

  return (
    <div className="texts" ref={ref}>
      {message.map((newMessage) => {
        if (newMessage.Type === "received") {
          return (
            <div className="other-user">
              <img className="otherUserProfileImg" src={profile} alt="" />
              <div className="received-text">{newMessage.Content}</div>
            </div>
          );
        } else if (newMessage.Type === "self") {
          return (
            <div className="current-user">
              <div className="sent-text">{newMessage.Content}</div>
              <img className="otherUserProfileImg" src={profile} alt="" />
            </div>
          );
        } else {
          console.log("hello");
          return <></>;
        }
      })}
    </div>
  );
}
