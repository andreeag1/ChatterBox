import React, { useContext, useEffect, useRef } from "react";
import "./Chat.css";
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
import { makeStyles } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import WebSocketProvider, {
  WebsocketContext,
} from "../../modules/websocket/webSocketProvider";
import ChatBody from "../ChatBody/ChatBody";

const CssTextField = styled(TextField)(({ theme }) => ({
  input: {
    color: "white",
  },
  borderBlockColor: "black",
  borderRadius: "3%",
}));

const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText("#283038"),
  color: "white",
  backgroundColor: "#283038",
  "&:hover": {
    backgroundColor: "#d6dee1",
    color: "black",
  },
}));

export default function Chat() {
  const [openProfileDialog, setOpenProfileDialog] = React.useState(false);
  const [message, setMessage] = React.useState([]);
  const [sentText, setSentText] = React.useState("");
  const { setConn } = useContext(WebsocketContext);
  const { conn } = useContext(WebsocketContext);

  const handleClickOpen = () => {
    setOpenProfileDialog(true);
  };

  const handleClose = () => {
    setOpenProfileDialog(false);
  };

  const handleSendText = () => {
    if (conn !== null) {
      console.log(sentText);
      conn.send(sentText);

      setSentText("");
    }
  };

  const JoinGroup = () => {
    const ws = new WebSocket(`ws://localhost:9000/ws/blue`);
    if (ws.OPEN) {
      setConn(ws);
      return;
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendText();
    }
  };

  useEffect(() => {
    if (conn === null) {
      return;
    }

    conn.onopen = () => {
      console.log("Connected Successfully");
    };

    conn.onmessage = (event) => {
      const m = JSON.parse(event.data);
      console.log(m);

      if (m.content === "New User Joined...") {
        console.log("new user joined");
      } else if (m.content === "User Disconnected...") {
        console.log("User Disconnected...");
      } else if (m.username === "blue") {
        console.log(m);
        const newMessage = {
          Type: "self",
          Content: m.content,
        };
        setMessage([...message, newMessage]);
      } else {
        console.log("hello");
        const newMessage = {
          Type: "received",
          Content: m.content,
        };
        setMessage([...message, newMessage]);
      }
    };
  }, [conn, message]);

  return (
    <div className="chat-section">
      <div className="title">
        <h7>ChatterBox</h7>
      </div>
      <div className="box">
        <div className="box-two">
          <div className="chats">
            <div className="your-chats">
              <h3>Your Chats</h3>
              <ColorButton
                sx={{ width: "100px", height: "40px", marginTop: "15px" }}
                onClick={JoinGroup}
              >
                New Chat
              </ColorButton>
            </div>
            <div className="chats-section">
              <div className="single-chat">
                <img className="profileImg" src={profile} alt="" />
                <div className="names">
                  <div className="convo-names">
                    <h5>Jane Doe</h5>
                  </div>
                  <div className="convo">
                    <h6>Heyyyyy!</h6>
                  </div>
                </div>
              </div>
              <div className="single-chat">
                <img className="profileImg" src={profile} alt="" />
                <div className="names">
                  <div className="convo-names">
                    <h5>Jane Doe</h5>
                  </div>
                  <div className="convo">
                    <h6>Heyyyyy!</h6>
                  </div>
                </div>
              </div>
              <div className="single-chat">
                <img className="profileImg" src={profile} alt="" />
                <div className="names">
                  <div className="convo-names">
                    <h5>Jane Doe</h5>
                  </div>
                  <div className="convo">
                    <h6>Heyyyyy!</h6>
                  </div>
                </div>
              </div>
              <div className="single-chat">
                <img className="profileImg" src={profile} alt="" />
                <div className="names">
                  <div className="convo-names">
                    <h5>John Doe</h5>
                  </div>
                  <div className="convo">
                    <h6>Hello!</h6>
                  </div>
                </div>
              </div>
              <div className="single-chat">
                <img className="profileImg" src={profile} alt="" />
                <div className="names">
                  <div className="convo-names">
                    <h5>Jill Doe</h5>
                  </div>
                  <div className="convo">
                    <h6>What's up!</h6>
                  </div>
                </div>
              </div>
              <div className="single-chat">
                <img className="profileImg" src={profile} alt="" />
                <div className="names">
                  <div className="convo-names">
                    <h5>Job Doe</h5>
                  </div>
                  <div className="convo">
                    <h6>Heyyyyy!</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="right-section">
            <div className="profile-section">
              <img
                className="myProfileImg"
                src={profile}
                alt=""
                onClick={handleClickOpen}
              />
              <Dialog open={openProfileDialog} onClose={handleClose}>
                <DialogTitle>Set Profile Image</DialogTitle>
                <DialogContent>
                  <input type="file" />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Close</Button>
                  <Button onClick={handleClose} autoFocus>
                    Set image
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
            <div className="conversations">
              <div className="add-user">
                <CssTextField
                  fullWidth
                  variant="outlined"
                  placeholder="Add user"
                  sx={{
                    width: "600px",
                    marginLeft: "20px",
                  }}
                />
                <div className="add-button">
                  <IconButton>
                    <AddCircleIcon
                      sx={{ color: "white", height: "35px", width: "35px" }}
                    />
                  </IconButton>
                </div>
              </div>
              <ChatBody message={message} />

              <div className="type">
                <CssTextField
                  value={sentText}
                  fullWidth
                  variant="outlined"
                  placeholder="Type something..."
                  sx={{
                    width: "600px",
                  }}
                  className="send-text"
                  onChange={(e) => setSentText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <div className="send-button">
                  <IconButton>
                    <SendIcon
                      sx={{ color: "white", size: "medium" }}
                      onClick={handleSendText}
                    />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
