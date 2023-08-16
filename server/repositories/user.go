package repositories

import (
	"context"
	"fmt"

	"github.com/andreeag1/chatterbox/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserRepository interface {
	FindUserByUsername(ctx context.Context, username string) (*models.User, error)
	InsertUser(ctx context.Context, username string, password string) *mongo.InsertOneResult
}

type UserRepositoryImplementation struct {
	client *mongo.Client
}

func NewUserRepository(client *mongo.Client) UserRepository {
	return UserRepositoryImplementation{
		client: client,
	}
}

func (u UserRepositoryImplementation) FindUserByUsername(ctx context.Context, username string) (*models.User, error) {
	userCollection := u.client.Database("chatterbox").Collection("users")

	filter := bson.M{"username": username}

	result := models.User{}
	err := userCollection.FindOne(ctx, filter).Decode(&result)

	if err == mongo.ErrNoDocuments {
		fmt.Println(err, "This user does not exist")
		return nil, err
	} 

	return &result, nil
}

func (u UserRepositoryImplementation) InsertUser(ctx context.Context, username string, password string) *mongo.InsertOneResult {
	userCollection := u.client.Database("chatterbox").Collection("users")

	newUser := models.User{
		Id: 		primitive.NewObjectID(),
		Username: 	username,
		Password:	password,
	}

	result, err := userCollection.InsertOne(ctx, newUser)
	if err != nil {
		fmt.Println(err)
		return nil
	}

	return result
}
