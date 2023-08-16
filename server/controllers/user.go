package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/andreeag1/chatterbox/configs"
	"github.com/andreeag1/chatterbox/lib"
	"github.com/andreeag1/chatterbox/models"
	"github.com/andreeag1/chatterbox/repositories"
	"github.com/golang-jwt/jwt/v5"
)

type User interface {
	AddUser(w http.ResponseWriter, r *http.Request)
	Login(w http.ResponseWriter, r *http.Request)
	GetCurrentUser(w http.ResponseWriter, r *http.Request)
}

type UserImplementation struct {
	repository repositories.UserRepository
}

func NewUser(repository repositories.UserRepository) User {
	return UserImplementation{
		repository: repository,
	}
}

func WriteJSON(w http.ResponseWriter, status int, v any) error {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(v)
}

func (u UserImplementation) AddUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	json.NewDecoder(r.Body).Decode(&user)

	_, err := u.repository.FindUserByUsername(r.Context(), user.Username)
	if (err == nil) {
		fmt.Println("This user already exists")
		return
	}

	if err := user.HashPassword(user.Password); err != nil {
		fmt.Println(err)
		return
	}

	result := u.repository.InsertUser(r.Context(), user.Username, user.Password)
	if (result == nil) {
		fmt.Println(result)
		return
	}

	jwtToken, err := lib.GenerateJWT(user.Username)
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

	WriteJSON(w, http.StatusAccepted, result)
	fmt.Println("Inserted 1 user in db with id", result.InsertedID)
}


func (u UserImplementation) Login(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Credentials", "true")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type, withCredentials")

	var user models.User
	json.NewDecoder(r.Body).Decode(&user)

	password := user.Password
	username := user.Username

	result, err := u.repository.FindUserByUsername(r.Context(), user.Username)
	if (err != nil) {
		fmt.Println("This user does not exist")
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
		if c.Name == "access-token" {
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
					type newObj struct {
						Username string	`json:"username"`
					}
					var result newObj
					result.Username = claims.Username
					WriteJSON(w, http.StatusAccepted, result)
					fmt.Println(result)
					return
				}
			fmt.Println("unable to extract claims")
			return
		}
   }
}



