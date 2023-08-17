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
  AddGroup,
  AddUserToGroup,
  GetGroupById,
  GetGroupsByUsername,
} from "../../modules/groups/groupRepository";
import { getCurrentUser } from "../../modules/users/userRepository";
import { CreateRoom } from "../../modules/websocket/webSocketRepository";
import {
  AddMessage,
  GetMessageByGroup,
} from "../../modules/messages/messageRepository";

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
  const [previousMessages, setPreviousMessages] = React.useState([]);
  const [changeGroupId, setChangeGroupId] = React.useState("");

  const handleClickOpen = () => {
    setOpenProfileDialog(true);
  };

  const handleClose = () => {
    setOpenProfileDialog(false);
  };

  const handleSendText = async () => {
    if (conn !== null) {
      console.log(sentText);
      try {
        const username = await getCurrentUser();
        await AddMessage(sentText, username.username, currentGroupId);
        conn.send(sentText);
        setSentText("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const getPreviousMessages = async () => {
      try {
        if (currentGroupId !== "") {
          const messages = await GetMessageByGroup(currentGroupId);
          console.log(messages);
          setPreviousMessages(messages);
          console.log(previousMessages);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getPreviousMessages();
  }, [currentGroupId]);

  const AddUser = async () => {
    try {
      await AddUserToGroup(addUser, currentGroupId);
      setAddUser("");
    } catch (error) {
      console.log(error);
    }
  };

  const CreateGroup = async () => {
    try {
      const username = await getCurrentUser();
      const users = [username.username];
      const newGroup = await AddGroup(users);
      setCurrentGroupId(newGroup.InsertedID);
      setNewGroup(true);
    } catch (error) {
      console.log(error);
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
  }, [newGroup, addUser]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendText();
    }
  };

  const handleUserKeyDown = (event) => {
    if (event.key === "Enter") {
      AddUser();
    }
  };

  const OpenGroupChat = async () => {
    try {
      const newGroups = await GetGroupById(currentGroupId);
      setNewGroup(true);
      console.log(newGroups);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const wsHandler = async () => {
      try {
        if (changeGroupId !== "") {
          var messageArray = [];
          message.map((singleMessage) => {
            if (singleMessage.Group !== currentGroupId) {
              messageArray.push(singleMessage);
            }
          });
          setMessage(messageArray);
          setCurrentGroupId(changeGroupId);
          const username = await getCurrentUser();
          await CreateRoom(currentGroupId);
          const ws = new WebSocket(
            `ws://localhost:9000/ws/${currentGroupId}?username=${username.username}`
          );
          if (ws.OPEN) {
            try {
              setNewGroup(true);
              setConn(ws);
              return;
            } catch (error) {
              console.log(error);
            }
          }
          OpenGroupChat();
        }
      } catch (error) {
        console.log(error);
      }
    };
    wsHandler();
  }, [changeGroupId]);

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

      conn.onclose = () => {
        console.log("User Disconnected");
      };

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
            Group: currentGroupId,
          };
          setMessage([...message, newMessage]);
        } else {
          const newMessage = {
            Type: "received",
            Content: m.content,
            Group: currentGroupId,
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
                  <div
                    className="single-chat"
                    key={group.Id}
                    onClick={(e) => setChangeGroupId(group.Id)}
                  >
                    <img className="profileImg" src={profile} alt="" />
                    <div className="names">
                      <div className="convo-names">
                        {group.Users.map((user) => {
                          if (
                            group.Users[0] == user &&
                            group.Users.length == 1
                          ) {
                            return <h5>{user} </h5>;
                          } else if (
                            group.Users[group.Users.length - 1] == user
                          ) {
                            return <h5>{user}</h5>;
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
                    <IconButton onClick={AddUser}>
                      <AddCircleIcon
                        sx={{ color: "white", height: "35px", width: "35px" }}
                      />
                    </IconButton>
                  </div>
                </div>
                <ChatBody
                  message={message}
                  previous={previousMessages}
                  group={currentGroupId}
                />

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
