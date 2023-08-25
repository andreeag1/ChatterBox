import React, { useEffect } from "react";
import "./Profile.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import profile from "../../pictures/profile.png";
import { getCurrentUser } from "../../modules/users/userRepository";
import { storage } from "../../firebase.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Profile({ group }) {
  const [url, setUrl] = React.useState(null);
  const [image, setImage] = React.useState(null);
  const [openProfileDialog, setOpenProfileDialog] = React.useState(false);
  const [currentUsername, setCurrentUsername] = React.useState("");

  useEffect(() => {
    const handleProfilePic = async () => {
      const username = await getCurrentUser();
      setCurrentUsername(username.username);
      const imageRef = ref(storage, username.username);
      getDownloadURL(imageRef)
        .then((url) => {
          setUrl(url);
        })
        .catch((error) => {
          setUrl(profile);
        });
    };
    handleProfilePic();
  });

  const handleClickOpen = () => {
    setOpenProfileDialog(true);
  };

  const handleClose = () => {
    setOpenProfileDialog(false);
  };

  const handleSubmitProfile = async () => {
    setOpenProfileDialog(false);
    const username = await getCurrentUser();
    const imageRef = ref(storage, username.username);
    uploadBytes(imageRef, image)
      .then(() => {
        getDownloadURL(imageRef)
          .then((url) => {
            setUrl(url);
          })
          .catch((error) => {});
        setImage(null);
      })
      .catch((error) => {});
  };

  const handleProfileChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="profile-section">
      <div className="group-title-section">
        {group.map((user) => {
          console.log(group);
          if (user !== currentUsername) {
            if (
              (group[1] === user || group[0] === user) &&
              group.length === 2
            ) {
              console.log("hello1");
              return <h5 className="group-text">{user} </h5>;
            } else if (group[group.length - 1] === user) {
              console.log(user);
              return <h5 className="group-text">{user} </h5>;
            } else {
              console.log(user);
              return <h5 className="group-text">{user}, </h5>;
            }
          }
        })}
      </div>
      <div className="profile-image">
        <img
          className="myProfileImg"
          src={url}
          alt=""
          onClick={handleClickOpen}
        />
        <Dialog open={openProfileDialog} onClose={handleClose}>
          <DialogTitle>Set Profile Image</DialogTitle>
          <DialogContent>
            <input type="file" onChange={handleProfileChange} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={handleSubmitProfile} autoFocus>
              Set image
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
