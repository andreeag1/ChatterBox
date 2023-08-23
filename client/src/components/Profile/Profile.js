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

export default function Profile() {
  const [url, setUrl] = React.useState(null);
  const [image, setImage] = React.useState(null);
  const [openProfileDialog, setOpenProfileDialog] = React.useState(false);

  useEffect(() => {
    const handleProfilePic = async () => {
      const username = await getCurrentUser();
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
  );
}
