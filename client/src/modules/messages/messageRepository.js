import { BACKEND_URL } from "../../lib/config";

export const AddMessage = async (message, username, groupId, picture) => {
  const res = await fetch(`${BACKEND_URL}/message/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: message,
      from: username,
      groupId: groupId,
      picture: picture,
    }),
  });
  const data = await res.json();
  return data;
};

export const GetMessageByGroup = async (groupId) => {
  const res = await fetch(`${BACKEND_URL}/message/${groupId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};
