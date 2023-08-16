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
import {
  GetGroupsByUsername,
  addGroup,
  addUserToGroup,
} from "../../modules/groups/groupRepository";
import { getCurrentUser } from "../../modules/users/userRepository";

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

const NewColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText("#283038"),
  color: "black",
  backgroundColor: "#d6dee1",
  "&:hover": {
    backgroundColor: "#283038",
    color: "white",
  },
}));

export default function Chat() {
  const [openProfileDialog, setOpenProfileDialog] = React.useState(false);
  const [message, setMessage] = React.useState([]);
  const [sentText, setSentText] = React.useState("");
  const { setConn } = useContext(WebsocketContext);
  const { conn } = useContext(WebsocketContext);
  const [newGroup, setNewGroup] = React.useState(false);
  const [groups, setGroups] = React.useState([]);
  const [addUser, setAddUser] = React.useState("");
  const [currentGroupId, setCurrentGroupId] = React.useState("");

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

  const AddUserToGroup = async () => {
    await addUserToGroup(addUser, currentGroupId);
    setAddUser("");
  };

  const CreateGroup = async () => {
    const username = await getCurrentUser();
    const ws = new WebSocket(`ws://localhost:9000/ws/${username.username}`);
    if (ws.OPEN) {
      try {
        console.log(username);
        const users = [username.username];
        const newGroup = await addGroup(users);
        setNewGroup(true);
        setCurrentGroupId(newGroup.InsertedID);
        setConn(ws);
        return;
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const HandleGroups = async () => {
      const username = await getCurrentUser();

      try {
        console.log(username);
        const groupResults = await GetGroupsByUsername(username.username);
        console.log(groupResults);
        setGroups(groupResults);
      } catch (error) {
        console.log(error);
      }
    };
    HandleGroups();
  }, [newGroup]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendText();
    }
  };

  const handleUserKeyDown = (event) => {
    if (event.key === "Enter") {
      AddUserToGroup();
    }
  };

  useEffect(() => {
    const connection = async () => {
      if (conn === null) {
        return;
      }

      var username = {};
      try {
        username = await getCurrentUser();
        console.log(username);
      } catch (error) {
        console.log(error);
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
        } else if (m.username === username.username) {
          console.log(m);
          const newMessage = {
            Type: "self",
            Content: m.content,
          };
          setMessage([...message, newMessage]);
        } else {
          const newMessage = {
            Type: "received",
            Content: m.content,
          };
          setMessage([...message, newMessage]);
        }
      };
    };
    connection();
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
                onClick={CreateGroup}
              >
                New Chat
              </ColorButton>
            </div>
            <div className="chats-section">
              {groups.map((group) => {
                return (
                  <div className="single-chat" key={group.Id}>
                    <img className="profileImg" src={profile} alt="" />
                    <div className="names">
                      <div className="convo-names">
                        {group.Users.map((user) => {
                          if (
                            group.Users[0] == user &&
                            group.Users.length == 1
                          ) {
                            return <h5>{user} </h5>;
                          } else {
                            return <h5>{user}, </h5>;
                          }
                        })}
                      </div>
                      <div className="convo">
                        <h6>Heyyyyy!</h6>
                      </div>
                    </div>
                  </div>
                );
              })}
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
            {newGroup ? (
              <div className="conversations">
                <div className="add-user">
                  <CssTextField
                    value={addUser}
                    fullWidth
                    variant="outlined"
                    placeholder="Add user"
                    sx={{
                      width: "600px",
                      marginLeft: "20px",
                    }}
                    onChange={(e) => setAddUser(e.target.value)}
                    onKeyDown={handleUserKeyDown}
                  />
                  <div className="add-button">
                    <IconButton onClick={addUserToGroup}>
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
            ) : (
              <div className="no-chats">
                <div className="start-chatting">
                  You're ready to start chatting!
                  <NewColorButton
                    sx={{
                      width: "100px",
                      marginLeft: "150px",
                      marginTop: "10px",
                    }}
                    onClick={CreateGroup}
                  >
                    New Chat
                  </NewColorButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
