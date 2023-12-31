package websocket

import "fmt"

type Room struct {
	ID      string             `json:"id"`
	Clients map[string]*Client `json:"clients"`
}

type Pool struct {
    Rooms      map[string]*Room
    Register   chan *Client
    Unregister chan *Client
    Clients    map[*Client]bool
    Broadcast  chan *Message
}

func NewPool() *Pool {
    return &Pool{
        Rooms:      make(map[string]*Room),
        Register:   make(chan *Client),
        Unregister: make(chan *Client),
        Clients:    make(map[*Client]bool),
        Broadcast:  make(chan *Message, 5),
    }
}

func (pool *Pool) Start() {
    for {
        select {
        case client := <-pool.Register:
            if _, ok := pool.Rooms[client.RoomID]; ok {
                fmt.Println("Room exists")
                newRoom := pool.Rooms[client.RoomID]
                    newRoom.Clients[client.Username] = client
                    fmt.Println("User Registered")
                
            }
        case client := <-pool.Unregister:
            if _, ok := pool.Rooms[client.RoomID]; ok {
                        pool.Broadcast <- &Message{
                            Content: "User disconnected",
                            RoomId: client.RoomID,
                            Username: client.Username,
                        }
                        fmt.Println("User Disconnected")
                    delete(pool.Rooms[client.RoomID].Clients, client.Username)
                    close(client.Message)
            }
        case message := <-pool.Broadcast:
            fmt.Println("message exists")
            if _, ok := pool.Rooms[message.RoomId]; ok {
                fmt.Println("room exists")
                for _, cl := range pool.Rooms[message.RoomId].Clients {
                    if err := cl.Conn.WriteJSON(message); err != nil {
                        fmt.Println(err)
                        return
                    }
                    fmt.Println("Sending message to all clients in Pool")
                    cl.Message <- message
                }
            }
        }
    }
}