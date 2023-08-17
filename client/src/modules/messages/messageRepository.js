export const AddMessage = async (message, username, groupId) => {
  const res = await fetch(`http://localhost:9000/message/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: message,
      from: username,
      groupId: groupId,
    }),
  });
  const data = await res.json();
  console.log(data);
  return data;
};

export const GetMessageByGroup = async (groupId) => {
  const res = await fetch(`http://localhost:9000/message/${groupId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  console.log(data);
  return data;
};
