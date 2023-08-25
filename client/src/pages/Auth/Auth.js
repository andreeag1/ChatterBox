import React from "react";
import "./Auth.css";
import { Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import Chat from "../../pictures/chat.png";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { basicSchema, loginSchema } from "../../schemas";
import Login from "../../components/Login/Login";
import { registerUser } from "../../modules/users/userRepository";

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

export default function Auth() {
  const [error, setError] = React.useState(false);
  const [login, setLogin] = React.useState(true);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/home");
  };

  const handleLoginChange = () => {
    setLogin(!login);
  };

  const onSubmit = async () => {
    console.log("hello");
    try {
      const register = await registerUser(values.username, values.password);
      navigate("/home");
    } catch (error) {
      setError(true);
    }
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues: {
        username: "",
        password: "",
        passwordConfirmation: "",
      },
      validationSchema: basicSchema,
      onSubmit,
    });

  return login ? (
    <Login login={login} setLogin={setLogin} />
  ) : (
    <div className="signup-page">
      <div className="username">
        <div className="welcome-section">
          <h1>Welcome to ChatterBox!</h1>
          <img src={Chat} className="chat-icon" />
        </div>
        <h4>Sign-up to start chatting...</h4>
        <div className="login-signup-buttons">
          <Button
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "white",
                color: "black",
              },
            }}
            onClick={handleLoginChange}
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
            onClick={handleLoginChange}
          >
            Sign-up
          </Button>
        </div>
        <div
          className={
            errors.username && touched.username ? "input-error" : "textfield"
          }
        >
          <CssTextField
            id="username"
            value={values.username}
            placeholder="username"
            style={{ minWidth: "50px" }}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
        </div>
        {errors.username && touched.username ? (
          <p className="error">{errors.username}</p>
        ) : (
          <div />
        )}
        <div
          className={
            errors.password && touched.password ? "input-error" : "textfield"
          }
        >
          <CssTextField
            id="password"
            value={values.password}
            type="password"
            placeholder="password"
            style={{ minWidth: "50px" }}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        {errors.password && touched.password ? (
          <p className="error">{errors.password}</p>
        ) : (
          <div />
        )}
        <div
          className={
            errors.passwordConfirmation && touched.passwordConfirmation
              ? "input-error"
              : "textfield"
          }
        >
          <CssTextField
            id="passwordConfirmation"
            value={values.passwordConfirmation}
            type="password"
            placeholder="confirm password"
            style={{ minWidth: "50px" }}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        {errors.passwordConfirmation && touched.passwordConfirmation ? (
          <p className="error">{errors.passwordConfirmation}</p>
        ) : (
          <div />
        )}
        {error ? (
          <p className="error">That username is already taken</p>
        ) : (
          <div></div>
        )}
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
