package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/andreeag1/chatterbox/configs"
	"github.com/andreeag1/chatterbox/lib"
	"github.com/andreeag1/chatterbox/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var userCollection *mongo.Collection = configs.GetCollection(configs.DB, "users")

func AddUser() http.HandlerFunc {
	return func (w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		var user models.User
		defer cancel()

		json.NewDecoder(r.Body).Decode(&user)

		if err := user.HashPassword(user.Password); err != nil {
			log.Fatal(err)
		}

		newUser := models.User{
			Id: 		primitive.NewObjectID(),
			Username: 	user.Username,
			Password:	user.Password,
		}

		result, err := userCollection.InsertOne(ctx, newUser)
		if err != nil {
			log.Fatal(err)
		}

		json.NewEncoder(w).Encode(result)
		fmt.Println("Inserted 1 user in db with id", result.InsertedID)
	}
}

func Login() http.HandlerFunc {
	return func (w http.ResponseWriter, r *http.Request) {
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
}

func Logout() http.HandlerFunc {
	return func (w http.ResponseWriter, r *http.Request) {
		
	}
}
