package config

import (
	"fmt"
	"log"

	"github.com/joho/godotenv"
)

type Config struct {
	HTTP HTTPConfig
}

func NewConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file")
	}
	fmt.Println("err", err)

	return &Config{
		HTTP: LoadHTTPConfig(),
	}
	//fmt.Println("config")
}
