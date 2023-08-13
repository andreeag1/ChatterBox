export const registerUser = async (username, password) => {
  try {
    const res = await fetch(`http://localhost:9000/user/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    const data = await res.json();
    console.log(data);
    return 200;
  } catch (error) {
    console.log("this user already exists");
    return 403;
  }
};
