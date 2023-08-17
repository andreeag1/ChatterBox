package repositories

import (
	"context"
	"fmt"

	"github.com/andreeag1/chatterbox/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type GroupRepository interface {
	InsertGroup(ctx context.Context, users []string) *mongo.InsertOneResult
	AddUserToGroup(ctx context.Context, groupId primitive.ObjectID, username string) *mongo.UpdateResult
	FindGroupsByUsername(ctx context.Context, username string) ([]*models.Group, error)
	FindGroupById(ctx context.Context, id primitive.ObjectID) (*models.Group, error)
}

type GroupRepositoryImplementation struct {
	client *mongo.Client
}

func NewGroupRepository(client *mongo.Client) GroupRepository {
	return GroupRepositoryImplementation{
		client: client,
	}
}

func (g GroupRepositoryImplementation) InsertGroup(ctx context.Context, users []string) *mongo.InsertOneResult {
	groupCollection := g.client.Database("chatterbox").Collection("groups")

	newGroup := models.Group{
		Id: 		primitive.NewObjectID(),
		Users:		users,
	}

	result, err := groupCollection.InsertOne(ctx, newGroup)
	if err != nil {
		fmt.Println(err)
	}

	return result
}

func (g GroupRepositoryImplementation) AddUserToGroup(ctx context.Context, groupId primitive.ObjectID, username string) *mongo.UpdateResult {
	groupCollection := g.client.Database("chatterbox").Collection("groups")

	filter := bson.D{primitive.E{Key: "_id", Value: groupId}}

	var result models.Group
	err := groupCollection.FindOne(ctx, filter).Decode(&result)
	if err != nil {
		fmt.Println(err)
	}

	change := bson.M{"$push": bson.M{"users": username}}
	opts := options.Update().SetUpsert(false)

	results, err := groupCollection.UpdateOne(ctx, filter, change, opts)
	if err != nil {
		fmt.Println(err)
	}

	return results
}

func (g GroupRepositoryImplementation) FindGroupsByUsername(ctx context.Context, username string) ([]*models.Group, error) {
	groupCollection := g.client.Database("chatterbox").Collection("groups")

	filter := bson.D{primitive.E{Key: "users", Value: username}}

	cur, err := groupCollection.Find(ctx, filter)
	if err != nil {
		fmt.Println(err)
	}

	models := []*models.Group{}
	if err = cur.All(ctx, &models); err != nil {
		fmt.Println(err)
		return nil, err
	}

	return models, nil
}

func (g GroupRepositoryImplementation) FindGroupById(ctx context.Context, id primitive.ObjectID) (*models.Group, error) {
	userCollection := g.client.Database("chatterbox").Collection("groups")

	filter := bson.M{"_id": id}

	result := models.Group{}
	err := userCollection.FindOne(ctx, filter).Decode(&result)

	if err == mongo.ErrNoDocuments {
		fmt.Println(err, "This group does not exist")
		return nil, err
	} 

	return &result, nil
}