package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/andreeag1/chatterbox/configs"
	"github.com/andreeag1/chatterbox/controllers"
	"github.com/andreeag1/chatterbox/repositories"
	"github.com/andreeag1/chatterbox/websocket"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

// func WsHandler(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
//     fmt.Println("WebSocket Endpoint Hit")
//     conn, err := websocket.Upgrade(w, r)
//     if err != nil {
//         fmt.Fprintf(w, "%+v\n", err)
//     }

// 	username := mux.Vars(r)["username"]

//     client := &websocket.Client{
//         Conn: conn,
//         Pool: pool,
// 		Username: username,
//     }

//     pool.Register <- client
//     client.Read()
// }

func main() {
	r := mux.NewRouter()

	pool := websocket.NewPool()
	go pool.Start()

	wshandler := websocket.NewHandler(pool)

	userRepository := repositories.NewUserRepository(configs.ConnectDB())
	groupRepository := repositories.NewGroupRepository(configs.ConnectDB())
	messageRepository := repositories.NewMessageRepository(configs.ConnectDB())

	user := controllers.NewUser(userRepository)
	message := controllers.NewMessage(messageRepository)
	group := controllers.NewGroup(groupRepository)

	configs.ConnectDB()

	c := cors.New(cors.Options{
        AllowedOrigins: []string{"http://localhost:3000"},
        AllowCredentials: true,
    })

	r.HandleFunc("/user/add", user.AddUser).Methods("POST")
	r.HandleFunc("/user/login", user.Login).Methods("POST")
	r.HandleFunc("/user/get", user.GetCurrentUser).Methods("GET")

	r.HandleFunc("/message/add", message.AddMessage).Methods("POST")
	r.HandleFunc("/message/{groupId}", message.GetMessageByGroup).Methods("GET")

	r.HandleFunc("/group/add", group.AddGroup).Methods("POST")
	r.HandleFunc("/group/user", group.AddUserToGroup).Methods("POST")
	r.HandleFunc("/group/{username}", group.GetGroupsByUsername).Methods("GET")
	r.HandleFunc("/group/get/{id}", group.GetGroupById).Methods("GET")
	
	r.HandleFunc("/ws/create", wshandler.CreateRoom).Methods("POST")
	r.HandleFunc("/ws/{roomId}", wshandler.JoinRoom).Methods("GET")
	r.HandleFunc("/ws", wshandler.GetRooms).Methods("GET")

	handler := c.Handler(r)

	fmt.Println("Server is getting started...")
	log.Fatal(http.ListenAndServe(":9000", handler))
	fmt.Println("Listening on port 9000...")
}