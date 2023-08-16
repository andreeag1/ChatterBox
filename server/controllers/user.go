package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/andreeag1/chatterbox/configs"
	"github.com/andreeag1/chatterbox/lib"
	"github.com/andreeag1/chatterbox/models"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type User interface {
	AddUser(w http.ResponseWriter, r *http.Request)
	Login(w http.ResponseWriter, r *http.Request)
	GetCurrentUser(w http.ResponseWriter, r *http.Request)
}

type UserImplementation struct {
	client *mongo.Client
}

func NewUser(client *mongo.Client) User {
	return UserImplementation{
		client: client,
	}
}

func WriteJSON(w http.ResponseWriter, status int, v any) error {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(v)
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

	WriteJSON(w, http.StatusAccepted, result)
	fmt.Println("Inserted 1 user in db with id", result.InsertedID)
}


func (u UserImplementation) Login(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Credentials", "true")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type, withCredentials")

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
		fmt.Println(err, "This user does not exist")
		return
	} 

	if err := result.CheckPassword(password); err != nil {
		fmt.Println(err, "Invalid Credentials")
		return
	}

	jwtToken, err := lib.GenerateJWT(username)
	if err != nil {
		fmt.Println(err)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:    "access-token",
		Value:   jwtToken,
		Path: 	 "/",
		MaxAge:  3600,
        Secure:   false,
	})

	WriteJSON(w, http.StatusAccepted, jwtToken)

	fmt.Println("Login Successful!")
}

func (u UserImplementation) GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	for _, c := range r.Cookies() {
		fmt.Println(c.Name)
		if c.Name == "access-token" {
			fmt.Println(c.Value)
			tokenString := c.Value
			token, err := jwt.ParseWithClaims(tokenString, &lib.AccessTokenClaims{}, func(t *jwt.Token) (interface{}, error) {
				_, ok := t.Method.(*jwt.SigningMethodHMAC)
						if !ok {
							w.WriteHeader(http.StatusUnauthorized)
							w.Write([]byte("not authorized"))
							return nil, fmt.Errorf("Unexpected signing method")
						}
						return []byte(configs.EnvJWTSecret()), nil
			})
			if err != nil {
				fmt.Println("Error Parsing Token: ", err)
				return
			}

			claims, ok := token.Claims.(*lib.AccessTokenClaims)
				if ok && token.Valid {
					username := claims.Username
					WriteJSON(w, http.StatusAccepted, username)
					fmt.Println(username)
					return
				}
			fmt.Println("unable to extract claims")
			return
		}
   }
}



