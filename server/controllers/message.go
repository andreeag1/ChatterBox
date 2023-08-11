package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/andreeag1/chatterbox/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Message interface {
	AddMessage(w http.ResponseWriter, r *http.Request)
	GetMessageByUser(w http.ResponseWriter, r *http.Request)
}

type MessageImplementation struct {
	client *mongo.Client
}

func NewMessage(client *mongo.Client) Message {
	return MessageImplementation{
		client: client,
	}
}

func (m MessageImplementation) AddMessage(w http.ResponseWriter, r *http.Request) {
	messageCollection := m.client.Database("chatterbox").Collection("messages")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var message models.Message
	defer cancel()

	json.NewDecoder(r.Body).Decode(&message)

	newMessage := models.Message{
		Id: 		primitive.NewObjectID(),
		From:		message.From,
		To: 		message.To,
		Message:	message.Message,
	}

	result, err := messageCollection.InsertOne(ctx, newMessage)
	if err != nil {
		log.Fatal(err)
	}

	json.NewEncoder(w).Encode(result)
	fmt.Println("Inserted 1 message in db with id", result.InsertedID)
}

func (m MessageImplementation) GetMessageByUser(w http.ResponseWriter, r *http.Request) {
	messageCollection := m.client.Database("chatterbox").Collection("messages")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	type fromMessage struct {
		From		string				`bson:"from"`
		To			string				`bson:"to"`
	}
	var message fromMessage
	defer cancel()

	json.NewDecoder(r.Body).Decode(&message)

	filter := bson.D{primitive.E{Key: "from", Value: message.From}, primitive.E{Key: "to", Value: message.To}}

	cursor, err := messageCollection.Find(ctx, filter)
	if err != nil {
		log.Fatal(err)
	}

	var results []models.Message
	if err = cursor.All(ctx, &results); err != nil {
		log.Fatal(err)
	}

	for _, result := range results {
		res, _ := json.Marshal(result)
		json.NewEncoder(w).Encode(string(res))
		fmt.Printf(string(res))
	}

}