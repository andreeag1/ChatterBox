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

type Group interface {
	AddGroup(w http.ResponseWriter, r *http.Request)
	AddUserToGroup(w http.ResponseWriter, r *http.Request)
	GetGroupsByUsername(w http.ResponseWriter, r *http.Request)
	GetGroupById(w http.ResponseWriter, r *http.Request)
}

type GroupImplementation struct {
	repository repositories.GroupRepository
}

func NewGroup(repository repositories.GroupRepository) Group {
	return GroupImplementation{
		repository: repository,
	}
}

func (g GroupImplementation) AddGroup(w http.ResponseWriter, r *http.Request) {
	var group models.Group
	json.NewDecoder(r.Body).Decode(&group)

	result := g.repository.InsertGroup(r.Context(), group.Users)

	WriteJSON(w, http.StatusAccepted, result)
	fmt.Println("Inserted 1 group in db with id", result.InsertedID)
}

func (g GroupImplementation) AddUserToGroup(w http.ResponseWriter, r *http.Request) {
	type NewUser struct {
		Username		string				`bson:"username"`
		Group			primitive.ObjectID	`bson:"group"`
	}
	var user NewUser
	json.NewDecoder(r.Body).Decode(&user)

	results := g.repository.AddUserToGroup(r.Context(), user.Group, user.Username)

	WriteJSON(w, http.StatusAccepted, results)
	fmt.Println(results.ModifiedCount, "user was added to group")
}

func (g GroupImplementation) GetGroupsByUsername(w http.ResponseWriter, r *http.Request) {
	username := mux.Vars(r)["username"]

	models, err := g.repository.FindGroupsByUsername(r.Context(), username)
	if err != nil {
		fmt.Println(err)
		return
	}

	WriteJSON(w, http.StatusAccepted, models)
}

func (g GroupImplementation) GetGroupById(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		fmt.Println(err)
	}

	models, err := g.repository.FindGroupById(r.Context(), objID)
	if err != nil {
		fmt.Println(err)
		return
	}

	WriteJSON(w, http.StatusAccepted, models)
}


