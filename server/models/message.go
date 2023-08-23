package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Message struct {
	Id 			primitive.ObjectID	`bson:"_id"`
	From		string				`bson:"from"`
	GroupId		primitive.ObjectID	`bson:"groupid"`
	Message		string				`bson:"message"`
	Picture		string				`bson:"picture"`
}