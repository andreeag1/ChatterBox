package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/andreeag1/chatterbox/configs"
	"github.com/andreeag1/chatterbox/controllers"
	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()

	configs.ConnectDB()

	r.HandleFunc("/user/add", controllers.AddUser()).Methods("POST")

	fmt.Println("Server is getting started...")
	log.Fatal(http.ListenAndServe(":9000", r))
	fmt.Println("Listening on port 9000...")
}