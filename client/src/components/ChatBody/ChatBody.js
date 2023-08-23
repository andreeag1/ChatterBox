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
import { getCurrentUser } from "../../modules/users/userRepository";

export default function ChatBody({ message, previous, group }) {
  const [username, setUsername] = React.useState("");

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
    const getUsername = async () => {
      try {
        const username = await getCurrentUser();
        setUsername(username.username);
      } catch (error) {
        console.log(error);
      }
    };
    getUsername();
  }, [previous]);

  useEffect(() => {
    scrollToBottom();
  }, [message]);

  return (
    <div className="texts" ref={ref}>
      {previous.map((newMessage) => {
        if (newMessage.From !== username) {
          return (
            <div className="other-user-section">
              <div className="other-username">
                <h7>{newMessage.From}</h7>
              </div>
              <div className="other-user">
                <img
                  className="otherUserProfileImg"
                  src={newMessage.Picture}
                  alt=""
                />
                <div className="received-text">{newMessage.Message}</div>
              </div>
            </div>
          );
        } else if (newMessage.From === username) {
          return (
            <div className="current-user">
              <div className="sent-text">{newMessage.Message}</div>
              <img
                className="otherUserProfileImg"
                src={newMessage.Picture}
                alt=""
              />
            </div>
          );
        } else {
          console.log("hello");
          return <></>;
        }
      })}
      {message.map((newMessage) => {
        if (newMessage.Group === group) {
          if (newMessage.Type === "received") {
            console.log(newMessage.Image);
            return (
              <div className="other-user">
                <img
                  className="otherUserProfileImg"
                  src={newMessage.Image}
                  alt=""
                />
                <div className="received-text">{newMessage.Content}</div>
              </div>
            );
          } else if (newMessage.Type === "self") {
            console.log(newMessage.Image);
            return (
              <div className="current-user">
                <div className="sent-text">{newMessage.Content}</div>
                <img
                  className="otherUserProfileImg"
                  src={newMessage.Image}
                  alt=""
                />
              </div>
            );
          } else {
            console.log("hello");
            return <></>;
          }
        }
      })}
    </div>
  );
}
