package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Message struct {
	Id 			primitive.ObjectID	`bson:"_id"`
	From		string				`bson:"from"`
	To			string				`bson:"to"`
	Messagge	string				`bson:"message"`
}