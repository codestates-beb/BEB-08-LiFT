package main

import (
	"context"
	"net/http"
	"strconv"
	"sync"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	//"github.com/thirdweb-dev/go-sdk/v2/thirdweb"
	thirdweb "github.com/thirdwebio/go-thirdweb-sdk"
)

type IpfsStorage struct {
	GatewayUrl string
}

type (
	user struct {
		ID   int    `json:"id"`
		Name string `json:"name"`
	}
)

type (
	nft struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		TokenURI    string `json:"tokenuri"`
	}
)

var (
	users       = map[int]*user{}
	seq         = 1
	lock        = sync.Mutex{}
	name        = "test"
	description = "explain"
	tokenuri    = "tokenurl"
)

//----------
// Handlers
//----------

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

func createUser(c echo.Context) error {
	lock.Lock()
	defer lock.Unlock()
	u := &user{
		ID: seq,
	}
	if err := c.Bind(u); err != nil {
		return err
	}
	users[u.ID] = u
	seq++
	return c.JSON(http.StatusCreated, u)
}

func getUser(c echo.Context) error {
	lock.Lock()
	defer lock.Unlock()
	id, _ := strconv.Atoi(c.Param("id"))
	return c.JSON(http.StatusOK, users[id])
}

func updateUser(c echo.Context) error {
	lock.Lock()
	defer lock.Unlock()
	u := new(user)
	if err := c.Bind(u); err != nil {
		return err
	}
	id, _ := strconv.Atoi(c.Param("id"))
	users[id].Name = u.Name
	return c.JSON(http.StatusOK, users[id])
}

func deleteUser(c echo.Context) error {
	lock.Lock()
	defer lock.Unlock()
	id, _ := strconv.Atoi(c.Param("id"))
	delete(users, id)
	return c.NoContent(http.StatusNoContent)
}

func getAllUsers(c echo.Context) error {
	lock.Lock()
	defer lock.Unlock()
	return c.JSON(http.StatusOK, users)
}

func main() {
	e := echo.New()
	sdk, err := thirdweb.NewThirdwebSDK("mumbai", nil)

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes
	e.GET("/users", getAllUsers)
	e.POST("/users", createUser)
	e.POST("/nft", createNFT)
	e.GET("/users/:id", getUser)
	e.PUT("/users/:id", updateUser)
	e.DELETE("/users/:id", deleteUser)

	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}
