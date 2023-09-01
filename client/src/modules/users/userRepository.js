import { BACKEND_URL } from "../../lib/config";

export const registerUser = async (username, password) => {
  const res = await fetch(`${BACKEND_URL}/user/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
    credentials: "include",
  });
  const data = await res.json();
  return data;
};

export const loginUser = async (username, password) => {
  const res = await fetch(`${BACKEND_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
    credentials: "include",
  });
  const data = await res.json();
  return 200;
};

export const getCurrentUser = async () => {
  const res = await fetch(`${BACKEND_URL}/user/get`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data = await res.json();
  return data;
};
