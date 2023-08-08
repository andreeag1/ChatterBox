import React, { useEffect } from "react";
import "./Chat.css";
import { styled } from "@mui/material/styles";
import { Button, IconButton, TextField } from "@mui/material";
import profile from "../../pictures/profile.png";
import { makeStyles } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const CssTextField = styled(TextField)(({ theme }) => ({
  input: {
    color: "white",
  },
  borderBlockColor: "black",
  borderRadius: "3%",
}));

export default function Chat() {
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
          <div className="conversations">
            <div className="texts">
              <div className="other-user">
                <img className="otherUserProfileImg" src={profile} alt="" />
                <div className="received-text">
                  heyyyy! What's up? zsdfkj asdfdfv ldjhv ksjdhfvba dkah
                  vakdhgad advkah dfvdkf sd
                </div>
              </div>
              <div className="other-user">
                <img className="otherUserProfileImg" src={profile} alt="" />
                <div className="received-text">
                  heyyyy! What's up? zsdfkj asdfdfv ldjhv ksjdhfvba dkah
                  vakdhgad advkah dfvdkf sd
                </div>
              </div>
              <div className="other-user">
                <img className="otherUserProfileImg" src={profile} alt="" />
                <div className="received-text">
                  heyyyy! What's up? zsdfkj asdfdfv ldjhv ksjdhfvba dkah
                  vakdhgad advkah dfvdkf sd
                </div>
              </div>
              <div className="other-user">
                <img className="otherUserProfileImg" src={profile} alt="" />
                <div className="received-text">
                  heyyyy! What's up? zsdfkj asdfdfdh dhsf sdf sdhfshdf sdfhs
                  dfsdh
                </div>
              </div>
              <div className="current-user">
                <div className="sent-text">
                  Nothing much, you? skdfjhsdkjf adfjhasasfhadjsh asdkjfha
                  askdfjh adskfjhsd dsfkjdhf sd
                </div>
                <img className="otherUserProfileImg" src={profile} alt="" />
              </div>
              <div className="other-user">
                <img className="otherUserProfileImg" src={profile} alt="" />
                <div className="received-text">
                  heyyyy! What's up? zsdfkj asdfdfv ldjhv ksjdhfvba dkah sdfhs
                  dfsdh
                </div>
              </div>
              <div className="current-user">
                <div className="sent-text">
                  Nothing much, you? skdfjhsdkjf adfjhasasfhadjsh asdkjfha
                  askdfjh adskfjhsd dsfkjdhf sd
                </div>
                <img className="otherUserProfileImg" src={profile} alt="" />
              </div>
              <div className="current-user">
                <div className="sent-text">
                  Nothing much, you? skdfjhsdkjf adfjhasasfhadjsh asdkjfha
                  askdfjh adskfjhsd dsfkjdhf sd
                </div>
                <img className="otherUserProfileImg" src={profile} alt="" />
              </div>
            </div>

            <div className="type">
              <CssTextField
                fullWidth
                variant="outlined"
                placeholder="Type something..."
                sx={{
                  width: "600px",
                }}
                className="send-text"
              />
              <div className="send-button">
                <IconButton>
                  <SendIcon sx={{ color: "white", size: "medium" }} />
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
