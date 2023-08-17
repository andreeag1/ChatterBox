package repositories

import (
	"context"
	"fmt"

	"github.com/andreeag1/chatterbox/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type MessageRepository interface {
	InsertMessage(ctx context.Context, content string, username string, groupId primitive.ObjectID) *mongo.InsertOneResult
	FindMessagesByGroup(ctx context.Context, groupId primitive.ObjectID) ([]models.Message, error)
}

type MessageRepositoryImplementation struct {
	client *mongo.Client
}

func NewMessageRepository(client *mongo.Client) MessageRepository {
	return MessageRepositoryImplementation{
		client: client,
	}
}

func (m MessageRepositoryImplementation) InsertMessage(ctx context.Context, content string, username string, groupId primitive.ObjectID) *mongo.InsertOneResult {
	messageCollection := m.client.Database("chatterbox").Collection("messages")

	newMessage := models.Message{
		Id: 		primitive.NewObjectID(),
		From:		username,
		GroupId: 	groupId,
		Message:	content,
	}

	result, err := messageCollection.InsertOne(ctx, newMessage)
	if err != nil {
		fmt.Println(err)
		return nil
	}

	return result
}

func (m MessageRepositoryImplementation) FindMessagesByGroup(ctx context.Context, groupId primitive.ObjectID) ([]models.Message, error) {
	messageCollection := m.client.Database("chatterbox").Collection("messages")

	filter := bson.D{primitive.E{Key: "groupid", Value: groupId}}

	cursor, err := messageCollection.Find(ctx, filter)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	var results []models.Message
	if err = cursor.All(ctx, &results); err != nil {
		fmt.Println(err)
		return nil, err
	}

	return results, nil
}