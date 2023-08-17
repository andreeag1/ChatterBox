export const CreateRoom = async (id) => {
  const res = await fetch(`http://localhost:9000/ws/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ID: id,
    }),
  });
  const data = await res.json();
  console.log(data);
  return 200;
};
