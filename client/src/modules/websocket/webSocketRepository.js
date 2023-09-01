import { BACKEND_URL } from "../../lib/config";

export const CreateRoom = async (id) => {
  const res = await fetch(`${BACKEND_URL}/ws/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ID: id,
    }),
  });
  const data = await res.json();
  return 200;
};

export const GetRooms = async () => {
  const res = await fetch(`${BACKEND_URL}/ws/get`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};
