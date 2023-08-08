import React from "react";
import "./Login.css";
import { Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import Chat from "../../pictures/chat.png";
import { useNavigate } from "react-router-dom";

const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText("#C2D3CD"),
  color: "white",
  backgroundColor: "#56494C",
  "&:hover": {
    backgroundColor: "white",
    color: "black",
  },
}));

const CssTextField = styled(TextField)(({ theme }) => ({
  input: {
    color: "black",
  },
  backgroundColor: "white",
  borderRadius: "3%",
}));

export default function Login() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/home");
  };

  return (
    <div className="login-page">
      <div className="username">
        <div className="welcome-section">
          <h1>Welcome to ChatterBox!</h1>
          <img src={Chat} className="chat-icon" />
        </div>
        <h4>Set a username to start chatting...</h4>
        <div className="textfield">
          <CssTextField placeholder="username" style={{ minWidth: "50px" }} />
        </div>

        <div className="enter-button">
          <ColorButton
            fullWidth
            style={{ minWidth: "100px" }}
            onClick={handleClick}
          >
            Enter
          </ColorButton>
        </div>
      </div>
    </div>
  );
}
