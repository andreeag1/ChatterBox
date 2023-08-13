import * as yup from "yup";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
//min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit

export const basicSchema = yup.object().shape({
  username: yup.string().required("username required"),
  password: yup
    .string()
    .min(5)
    .matches(passwordRules, { message: "Please create a stronger password" })
    .required("password required"),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("password confirmation required"),
});

export const loginSchema = yup.object().shape({
  loginUsername: yup.string().required("username required"),
  loginPassword: yup.string().required("password required"),
});
