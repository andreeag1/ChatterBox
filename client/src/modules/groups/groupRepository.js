export const AddGroup = async (users) => {
  const res = await fetch(`http://localhost:9000/group/add`, {
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
  const res = await fetch(`http://localhost:9000/group/user`, {
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
  const res = await fetch(`http://localhost:9000/group/${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};

export const GetGroupById = async (id) => {
  const res = await fetch(`http://localhost:9000/group/get/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};
