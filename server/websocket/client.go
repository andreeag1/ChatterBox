package websocket

import (
	"fmt"
	"log"

	"github.com/gorilla/websocket"
)

type Client struct {
	ID 		string  `json:"id"`
    Message  chan *Message
	Conn 	*websocket.Conn
	Pool 	*Pool
    Username string `json:"username"`
}

type Message struct {
	Content  string `json:"content"`
	Username string `json:"username"`
}


func (c *Client) Read() {
	defer func() {
        c.Pool.Unregister <- c
        c.Conn.Close()
    }()

    for {
        _, p, err := c.Conn.ReadMessage()
        if err != nil {
            log.Println(err)
            return
        }
        message := &Message{Content: string(p), Username: c.Username}
        c.Pool.Broadcast <- message
        fmt.Printf("Message Received: %+v\n", message)
    }
}