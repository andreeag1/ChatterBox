# ChatterBox

ChatterBox is a real-time messaging application that allows users to create groups, add friends and chat with anyone on a simple, user-friendly platform. The app makes use of websockets to allow messages to send in real time while also storing the messages on a REST Api to let users come back to them later on.

## Services

ChatterBox operates on two services.

1. The Frontend
2. The Backend

The frontend is the side that presents the interface and user-experience to the end-users. Meanwhile, the backend is the server side which includes a REST Api and websocket routes that handle multiple users using rooms. The architecture for the websocket includes the central place called the Pool that manages all the different channels and rooms. The Pool is also responsible for registering and unregistering clients from rooms, while also broadcasting messages to every client in that particular room. Once a client has joined a room, the client object will then be created and registered through the Pool's register channel. Each client also has a WriteMessage and ReadMessage method that will send the messages to the broadcast channel to then broadcast the messages to each client. Alongside the websocket, is also the server that handles any data processing and supplies the frontend with the necessary data, including groups, messages and users.

## Technologies

- React (Javascript)
  - Material UI, Formik
- Firebase
- Golang
  - Gorilla
- MongoDB
- Docker
- Google Cloud (Cloud Run)

## Visit [Chatterbox](https://chatterbox.andreeagugiuman.com/) today!

Both the frontend and backend are hosted on Google Cloud (Cloud Run) while the user's profile pictures are hosted on Firebase.

## Motivations

One of my main motivations for making this project was to learn more about WebSocket technology and be able to get valuable learning experience from handling real-time communication challenges. I also wanted to challenge myself to see if I could make something that even my friends could use on a daily basis, something so used by everyone like a chat app.
