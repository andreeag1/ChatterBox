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
import { GetMessageByGroup } from "../../modules/messages/messageRepository";

export default function ChatBody({ message, group, changeGroupId }) {
  const [username, setUsername] = React.useState("");
  const [previousMessages, setPreviousMessages] = React.useState([]);

  const ref = useRef(null);

  const scrollToBottom = () => {
    const lastChildElement = ref.current?.lastElementChild;
    lastChildElement?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "end",
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
  }, [previousMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [message]);

  useEffect(() => {
    const getPreviousMessages = async () => {
      try {
        if (group !== "") {
          const messages = await GetMessageByGroup(group);
          setPreviousMessages(messages);
        }
      } catch (error) {}
    };

    getPreviousMessages();
  }, [group, changeGroupId]);

  return (
    <div className="texts" ref={ref}>
      {previousMessages.map((newMessage) => {
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
            return (
              <div className="other-user-section">
                <div className="other-username">
                  <h7>{newMessage.Username}</h7>
                </div>
                <div className="other-user">
                  <img
                    className="otherUserProfileImg"
                    src={newMessage.Image}
                    alt=""
                  />
                  <div className="received-text">{newMessage.Content}</div>
                </div>
              </div>
            );
          } else if (newMessage.Type === "self") {
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
