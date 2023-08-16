export const registerUser = async (username, password) => {
  const res = await fetch(`http://localhost:9000/user/add`, {
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
  console.log(data);
  return data;
};

export const loginUser = async (username, password) => {
  const res = await fetch(`http://localhost:9000/user/login`, {
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
  console.log(data);
  return 200;
};

export const getCurrentUser = async () => {
  try {
    const res = await fetch(`http://localhost:9000/user/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
