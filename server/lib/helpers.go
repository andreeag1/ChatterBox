package lib

import (
	"time"

	"github.com/andreeag1/chatterbox/configs"
	"github.com/golang-jwt/jwt"
)

func GenerateJWT(username string) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["exp"] = time.Now().Add(10 * time.Minute)
	claims["authorized"] = true
	claims["username"] = username

	tokenString, err := token.SignedString([]byte(configs.EnvJWTSecret()))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}