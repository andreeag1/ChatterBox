import React from "react";
import "./Login.css";
import { Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import Chat from "../../pictures/chat.png";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { loginSchema } from "../../schemas";
import { loginUser } from "../../modules/users/userRepository";

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

export default function Login({ login, setLogin }) {
  const [error, setError] = React.useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/home");
  };

  const onSubmit = async () => {
    try {
      const login = await loginUser(values.loginUsername, values.loginPassword);
      navigate("/home");
    } catch (error) {
      setError(true);
    }
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues: {
        loginUsername: "",
        loginPassword: "",
      },
      validationSchema: loginSchema,
      onSubmit,
    });

  return (
    <div className="login-page">
      <div className="username">
        <div className="welcome-section">
          <h1>Welcome to ChatterBox!</h1>
          <img src={Chat} className="chat-icon" />
        </div>
        <h4>Login to start chatting...</h4>
        <div className="login-signup-buttons">
          <Button
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "white",
                color: "black",
              },
            }}
            onClick={(e) => setLogin(!login)}
          >
            Login
          </Button>
          <Button
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "white",
                color: "black",
              },
            }}
            onClick={(e) => setLogin(!login)}
          >
            Sign-up
          </Button>
        </div>
        <div
          className={
            errors.loginUsername && touched.loginUsername
              ? "input-error"
              : "textfield"
          }
        >
          <CssTextField
            id="loginUsername"
            value={values.loginUsername}
            placeholder="username"
            style={{ minWidth: "50px" }}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        {errors.loginUsername && touched.loginUsername ? (
          <p className="error">{errors.loginUsername}</p>
        ) : (
          <div />
        )}
        <div
          className={
            errors.loginPassword && touched.loginPassword
              ? "input-error"
              : "textfield"
          }
        >
          <CssTextField
            id="loginPassword"
            value={values.loginPassword}
            type="password"
            placeholder="password"
            style={{ minWidth: "50px" }}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        {errors.loginPassword && touched.loginPassword ? (
          <p className="error">{errors.loginPassword}</p>
        ) : (
          <div />
        )}
        {error ? <p className="error">Invalid Credentials</p> : <div></div>}
        <div className="enter-button">
          <ColorButton
            fullWidth
            style={{ minWidth: "100px" }}
            onClick={handleSubmit}
          >
            Enter
          </ColorButton>
        </div>
      </div>
    </div>
  );
}
