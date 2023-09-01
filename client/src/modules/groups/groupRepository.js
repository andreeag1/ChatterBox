import { BACKEND_URL } from "../../lib/config";

export const AddGroup = async (users) => {
  const res = await fetch(`${BACKEND_URL}/group/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      users: users,
    }),
  });
  const data = await res.json();
  return data;
};

export const AddUserToGroup = async (username, group) => {
  const res = await fetch(`${BACKEND_URL}/group/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      group: group,
    }),
  });
  const data = await res.json();
  return 200;
};

export const GetGroupsByUsername = async (username) => {
  const res = await fetch(`${BACKEND_URL}/group/${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};

export const GetGroupById = async (id) => {
  const res = await fetch(`${BACKEND_URL}/group/get/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};
