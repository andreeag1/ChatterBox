package models

import (
	"fmt"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Id 			primitive.ObjectID	`bson:"_id"`
	Username	string				`bson:"username"`
	Password	string				`bson:"password"`
}

func (user *User) HashPassword(password string) error {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return err
	}

	user.Password = string(bytes)
	return nil
}
func (user *User) CheckPassword(providedPassword string) error {
	fmt.Println(user.Password)
	fmt.Println(providedPassword)
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(providedPassword))
	if err != nil {	
		return err
	}
	return nil
}



