package websocket

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/andreeag1/chatterbox/controllers"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

type Handler struct {
    pool *Pool
}

func NewHandler(p *Pool) *Handler {
    return &Handler{
        pool: p,
    }
}

var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
    CheckOrigin: func(r *http.Request) bool { return true },
}

func Upgrade(w http.ResponseWriter, r *http.Request) (*websocket.Conn, error) {
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println(err)
        return nil, err
    }

    return conn, nil
}

type CreateRoomReq struct {
	ID   string `json:"id"`
}

func (h *Handler) CreateRoom(w http.ResponseWriter, r *http.Request) {
    var req CreateRoomReq

    json.NewDecoder(r.Body).Decode(&req)

    h.pool.Rooms[req.ID] = &Room{
        ID: req.ID,
        Clients: make(map[string]*Client),
    }

    controllers.WriteJSON(w, http.StatusAccepted, req)
}

func (h *Handler) JoinRoom(w http.ResponseWriter, r *http.Request) {
    fmt.Println("WebSocket Endpoint Hit")
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        fmt.Println(err)
        return
    }

    roomId := mux.Vars(r)["roomId"]
    username := r.URL.Query().Get("username")

    cl := &Client{
        Conn: conn,
        Message: make(chan *Message, 10),
        RoomID: roomId,
        Username: username,
    }

    h.pool.Register <- cl
    
    go cl.WriteMessage()
    cl.Read(h.pool)
}

func (h *Handler) GetRooms(w http.ResponseWriter, r *http.Request) {
	rooms := make([]CreateRoomReq, 0)

	for _, r := range h.pool.Rooms {
		rooms = append(rooms, CreateRoomReq{
			ID:   r.ID,
		})
	}

    controllers.WriteJSON(w, http.StatusAccepted, rooms)

}
