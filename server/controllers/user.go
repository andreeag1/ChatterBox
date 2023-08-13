package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/andreeag1/chatterbox/lib"
	"github.com/andreeag1/chatterbox/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type User interface {
	AddUser(w http.ResponseWriter, r *http.Request)
	Login(w http.ResponseWriter, r *http.Request)
}

type UserImplementation struct {
	client *mongo.Client
}

func NewUser(client *mongo.Client) User {
	return UserImplementation{
		client: client,
	}
}

func (u UserImplementation) AddUser(w http.ResponseWriter, r *http.Request) {
	userCollection := u.client.Database("chatterbox").Collection("users")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var user models.User
	defer cancel()

	json.NewDecoder(r.Body).Decode(&user)

	filter := bson.D{{Key: "username", Value: user.Username}}

	cursor, err := userCollection.Find(ctx, filter)
	if err != nil {
		fmt.Println(err)
		return
	}

	var results []models.User
	if err := cursor.All(ctx, &results); err != nil {
		fmt.Println(err)
		return
	}

	if len(results) > 0 {
		fmt.Println("This user already exists")
		return
	}

	if err := user.HashPassword(user.Password); err != nil {
		fmt.Println(err)
		return
	}

	newUser := models.User{
		Id: 		primitive.NewObjectID(),
		Username: 	user.Username,
		Password:	user.Password,
	}

	result, err := userCollection.InsertOne(ctx, newUser)
	if err != nil {
		fmt.Println(err)
		return
	}

	json.NewEncoder(w).Encode(result)
	fmt.Println("Inserted 1 user in db with id", result.InsertedID)
}


func (u UserImplementation) Login(w http.ResponseWriter, r *http.Request) {
	userCollection := u.client.Database("chatterbox").Collection("users")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var user models.User
	defer cancel()

	json.NewDecoder(r.Body).Decode(&user)

	password := user.Password
	username := user.Username
	filter := bson.M{"username": username}

	var result models.User
	err := userCollection.FindOne(ctx, filter).Decode(&result)

	if err == mongo.ErrNoDocuments {
		log.Fatal("This user does not exist")
	} 

	if err := result.CheckPassword(password); err != nil {
		log.Fatal(err, "Invalid Credentials")
	}

	jwtToken, err := lib.GenerateJWT()
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("JWT Token: %s\n", jwtToken)
	log.Println("Login Successful!")
}

