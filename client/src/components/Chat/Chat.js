import React, { useContext, useEffect } from "react";
import "./Chat.css";
import { styled } from "@mui/material/styles";
import { Button, IconButton, TextField } from "@mui/material";
import profile from "../../pictures/profile.png";
import SendIcon from "@mui/icons-material/Send";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { WebsocketContext } from "../../modules/websocket/webSocketProvider";
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
import { storage } from "../../firebase.js";
import { ref, getDownloadURL } from "firebase/storage";
import Profile from "../Profile/Profile";

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
  const [url, setUrl] = React.useState(null);
  const [usernameMap, setUsernameMap] = React.useState(new Map());

  const handleSendText = async () => {
    if (conn !== null) {
      console.log(sentText);
      try {
        const username = await getCurrentUser();
        const imageRef = ref(storage, username.username);
        var profilePic = "";
        getDownloadURL(imageRef)
          .then(async (url) => {
            profilePic = url;
            await AddMessage(
              sentText,
              username.username,
              currentGroupId,
              profilePic
            );
          })
          .catch(async (error) => {
            profilePic = profile;
            await AddMessage(
              sentText,
              username.username,
              currentGroupId,
              profilePic
            );
          });
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
          setPreviousMessages(messages);
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
        const groupResults = await GetGroupsByUsername(username.username);
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
        }
        const group = await GetGroupById(currentGroupId);
        const usernameProfiles = new Map();
        group.Users.map((user) => {
          const imageRef = ref(storage, user);
          getDownloadURL(imageRef)
            .then((url) => {
              usernameProfiles.set(user, url);
            })
            .catch((error) => {
              usernameProfiles.set(user, profile);
            });
        });
        setUsernameMap(usernameProfiles);
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
      } catch (error) {
        console.log(error);
      }
    };
    wsHandler();
  }, [changeGroupId, currentGroupId]);

  useEffect(() => {
    const connection = async () => {
      if (conn === null) {
        return;
      }

      var username = {};
      try {
        username = await getCurrentUser();
      } catch (error) {
        console.log(error);
      }

      conn.onclose = () => {
        console.log("User Disconnected");
      };

      conn.onopen = () => {
        console.log("Connected Successfully");
      };

      conn.onmessage = async (event) => {
        const m = JSON.parse(event.data);
        if (m.content === "New User Joined...") {
          console.log("new user joined");
        } else if (m.content === "User Disconnected...") {
          console.log("User Disconnected...");
        } else if (m.username === username.username) {
          const newMessage = {
            Type: "self",
            Content: m.content,
            Username: m.username,
            Group: currentGroupId,
            Image: usernameMap.get(m.username),
          };
          setMessage([...message, newMessage]);
        } else {
          const newMessage = {
            Type: "received",
            Content: m.content,
            Username: m.username,
            Group: currentGroupId,
            Image: usernameMap.get(m.username),
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
              <div className="your-chats-button">
                <ColorButton onClick={CreateGroup}>New Chat</ColorButton>
              </div>
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
            <Profile />
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
