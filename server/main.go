package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/andreeag1/chatterbox/configs"
	"github.com/andreeag1/chatterbox/controllers"
	"github.com/andreeag1/chatterbox/websocket"
	"github.com/gorilla/mux"
)

func WsHandler(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
    fmt.Println("WebSocket Endpoint Hit")
    conn, err := websocket.Upgrade(w, r)
    if err != nil {
        fmt.Fprintf(w, "%+v\n", err)
    }

    client := &websocket.Client{
        Conn: conn,
        Pool: pool,
    }

    pool.Register <- client
    client.Read()
}

func main() {
	r := mux.NewRouter()

	pool := websocket.NewPool()
	go pool.Start()

	user := controllers.NewUser(configs.ConnectDB())
	message := controllers.NewMessage(configs.ConnectDB())

	configs.ConnectDB()

	r.HandleFunc("/user/add", user.AddUser).Methods("POST")
	r.HandleFunc("/user/login", user.Login).Methods("POST")
	r.HandleFunc("/message/add", message.AddMessage).Methods("POST")
	r.HandleFunc("/message/get", message.GetMessageByUser).Methods("GET")
	r.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
        WsHandler(pool, w, r)})

	fmt.Println("Server is getting started...")
	log.Fatal(http.ListenAndServe(":9000", r))
	fmt.Println("Listening on port 9000...")
}