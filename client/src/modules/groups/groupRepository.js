export const addGroup = async (users) => {
  try {
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
    console.log(data);
    return data;
  } catch (error) {
    return 403;
  }
};

export const addUserToGroup = async (username, group) => {
  try {
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
    console.log(data);
    return 200;
  } catch (error) {
    return 403;
  }
};

export const GetGroupsByUsername = async (username) => {
  const res = await fetch(`http://localhost:9000/group/${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  console.log(data);
  return data;
};
