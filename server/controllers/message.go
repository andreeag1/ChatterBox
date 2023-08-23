package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/andreeag1/chatterbox/models"
	"github.com/andreeag1/chatterbox/repositories"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Message interface {
	AddMessage(w http.ResponseWriter, r *http.Request)
	GetMessageByGroup(w http.ResponseWriter, r *http.Request)
}

type MessageImplementation struct {
	repository repositories.MessageRepository
}

func NewMessage(repository repositories.MessageRepository) Message {
	return MessageImplementation{
		repository: repository,
	}
}

func (m MessageImplementation) AddMessage(w http.ResponseWriter, r *http.Request) {
	var message models.Message

	json.NewDecoder(r.Body).Decode(&message)

	result := m.repository.InsertMessage(r.Context(), message.Message, message.From, message.GroupId, message.Picture)
	if result == nil {
		fmt.Println(result)
		return
	}

	json.NewEncoder(w).Encode(result)
	fmt.Println("Inserted 1 message in db with id", result.InsertedID)
}

func (m MessageImplementation) GetMessageByGroup(w http.ResponseWriter, r *http.Request) {
	groupId := mux.Vars(r)["groupId"]

	objID, err := primitive.ObjectIDFromHex(groupId)
	if err != nil {
		fmt.Println(err)
	}

	results, err := m.repository.FindMessagesByGroup(r.Context(), objID)
	if err != nil {
		fmt.Println(err)
		return
	}

	messageArray := make([]models.Message, 0)
	for _, result := range results {
		messageArray = append(messageArray, result)
	}
	json.NewEncoder(w).Encode(messageArray)
}