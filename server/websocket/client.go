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
    RoomID  string  `json:"roomid"`
    Username string `json:"username"`
}

type Message struct {
	Content  string `json:"content"`
	Username string `json:"username"`
    RoomId   string `json:"roomId"`
}

func (c *Client) WriteMessage() {
	defer func() {
		c.Conn.Close()
	}()

	for {
		message, ok := <-c.Message
		if !ok {
			return
		}

		c.Conn.WriteJSON(message)
	}
}


func (c *Client) Read(pool *Pool) {
	defer func() {
        pool.Unregister <- c
        c.Conn.Close()
    }()

    for {
        _, p, err := c.Conn.ReadMessage()
        if err != nil {
            log.Println(err)
            return
        }
        message := &Message{Content: string(p), Username: c.Username, RoomId: c.RoomID}
        pool.Broadcast <- message
        fmt.Printf("Message Received: %+v\n", message)
    }
}