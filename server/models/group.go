package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Group struct {
	Id 			primitive.ObjectID	`bson:"_id"`
	Users		[]string			`bson:"users"`
}