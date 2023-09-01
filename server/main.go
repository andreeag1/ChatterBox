package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/andreeag1/chatterbox/configs"
	"github.com/andreeag1/chatterbox/controllers"
	"github.com/andreeag1/chatterbox/repositories"
	"github.com/andreeag1/chatterbox/websocket"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	if os.Getenv("ENV") != "prod" {
		err := godotenv.Load()
		if err != nil {
			log.Fatal("Error loading .env file")
		}
	}

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
        AllowedOrigins: []string{configs.EnvFrontendUrl()},
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
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", configs.EnvPort()), handler))
	fmt.Println("Listening on port 9000...")
}