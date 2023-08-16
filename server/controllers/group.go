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
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Group interface {
	AddGroup(w http.ResponseWriter, r *http.Request)
	AddUserToGroup(w http.ResponseWriter, r *http.Request)
	GetGroups(w http.ResponseWriter, r *http.Request)
}

type GroupImplementation struct {
	client *mongo.Client
}

func NewGroup(client *mongo.Client) Group {
	return GroupImplementation{
		client: client,
	}
}

func (g GroupImplementation) AddGroup(w http.ResponseWriter, r *http.Request) {
	groupCollection := g.client.Database("chatterbox").Collection("groups")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var group models.Group
	defer cancel()

	json.NewDecoder(r.Body).Decode(&group)

	newGroup := models.Group{
		Id: 		primitive.NewObjectID(),
		Users:		group.Users,
	}

	result, err := groupCollection.InsertOne(ctx, newGroup)
	if err != nil {
		log.Fatal(err)
	}

	WriteJSON(w, http.StatusAccepted, result)
	fmt.Println("Inserted 1 group in db with id", result.InsertedID)
}

func (g GroupImplementation) AddUserToGroup(w http.ResponseWriter, r *http.Request) {
	groupCollection := g.client.Database("chatterbox").Collection("groups")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	type NewUser struct {
		Username		string				`bson:"username"`
		Group			primitive.ObjectID	`bson:"group"`
	}
	var user NewUser
	defer cancel()

	json.NewDecoder(r.Body).Decode(&user)

	filter := bson.D{primitive.E{Key: "_id", Value: user.Group}}

	var result models.Group
	err := groupCollection.FindOne(ctx, filter).Decode(&result)
	if err != nil {
		log.Fatal(err)
	}

	change := bson.M{"$push": bson.M{"users": user.Username}}
	opts := options.Update().SetUpsert(false)

	results, err := groupCollection.UpdateOne(ctx, filter, change, opts)
	if err != nil {
		log.Fatal(err)
	}

	WriteJSON(w, http.StatusAccepted, results)
	fmt.Println(results.ModifiedCount, "user was added to group")
}

func (g GroupImplementation) GetGroups(w http.ResponseWriter, r *http.Request) {
	groupCollection := g.client.Database("chatterbox").Collection("groups")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cur, err := groupCollection.Find(ctx, bson.M{})
	if err != nil {
		fmt.Println(err)
		return
	}

	models := []*models.Group{}
	if err = cur.All(ctx, &models); err != nil {
		fmt.Println(err)
		w.WriteHeader(500);
	}

	WriteJSON(w, http.StatusAccepted, models)
}
