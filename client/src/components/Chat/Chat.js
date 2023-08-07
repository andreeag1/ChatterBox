import React from "react";
import "./Chat.css";
import { styled } from "@mui/material/styles";
import { Button, TextField } from "@mui/material";

const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText("#C2D3CD"),
  color: "#C2D3CD",
  backgroundColor: "#56494C",
  "&:hover": {
    backgroundColor: "#56494C",
  },
}));

export default function Chat() {
  return (
    <div className="chat-section">
      <div className="title">
        <h7>ChatterBox</h7>
      </div>
      <div className="box">
        <div className="box-two">
          <div className="description">
            <h7>
              Enter a username and room id to chat with anyone and play fun mini
              games!
            </h7>
          </div>
          <div className="textfield-one">
            <TextField placeholder="username" sx={{ width: "350px" }} />
          </div>
          <div className="textfield-two">
            <TextField placeholder="room id" sx={{ width: "350px" }} />
          </div>
          <div className="start-button">
            <ColorButton>Start</ColorButton>
          </div>
        </div>
      </div>
    </div>
  );
}
