package configs

import (
	"os"
)

func EnvMongoURI() string {
    return os.Getenv("MONGOURI")
}

func EnvJWTSecret() string {
    return os.Getenv("JWT_SECRET")
}

func EnvPort() string {
    return os.Getenv("PORT")
}

func EnvFrontendUrl() string {
    return os.Getenv("FRONTEND_URL")
}

