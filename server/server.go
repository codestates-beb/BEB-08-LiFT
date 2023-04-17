package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	thirdweb "github.com/thirdweb-dev/go-sdk/v2/thirdweb"
)

type (
	nft struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		TokenURI    string `json:"tokenuri"`
	}
)

var (
	name        = "test"
	description = "explain"
	tokenuri    = "tokenurl"
)

// ----------
// Handlers
// ----------

func createNFT(c echo.Context) error {
	lock.Lock()
	defer lock.Unlock()

	metadata := map[string]interface{}{
		"name":        "yong",
		"image":       "",
		"description": "",
	}
	uri, _ := thirdweb.sdk.Storage.Upload(context.Background(), metadata, "", "")

	a := &nft{
		Name:        name,
		Description: description,
		TokenURI:    tokenuri,
	}
	if err := c.Bind(a); err != nil {
		return err
	}
	return c.JSON(http.StatusCreated, a)
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	e := echo.New()
	sdk, err := thirdweb.NewThirdwebSDK(os.Getenv("NETWORK"), nil)

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes
	e.POST("/nft", createNFT)

	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}
