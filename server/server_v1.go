package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"reflect"
	"strconv"
	"strings"
	"sync"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/thirdweb-dev/go-sdk/v2/thirdweb"
)

type (
	nft struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		TokenURI    string `json:"tokenuri"`
		TokenId     int
	}
)

var (
	nfts = map[int]*nft{}
	seq  = 1
	lock = sync.Mutex{}
)

func createNFT(c echo.Context) error {
	fmt.Println("c", c)
	jsonTest, err := json.Marshal(c)
	fmt.Println("refkect", reflect.TypeOf(c))
	if err != nil {
		fmt.Println("error ")
	}
	fmt.Println("jsonTest", jsonTest)
	lock.Lock()
	defer lock.Unlock()

	n := &nft{
		TokenId: seq,
	}
	fmt.Println("n", n)
	if err := c.Bind(n); err != nil {
		return err
	}

	fmt.Println("n 2", n)
	nfts[n.TokenId] = n
	seq++

	fmt.Println("n 3", n.Name, n.Description, n.TokenId, n.TokenURI)
	fmt.Println("n.Name", n.Name)
	fmt.Println("n.Description", n.Description)
	fmt.Println("n.TokenId", n.TokenId)
	fmt.Println("n.TokenURI", n.TokenURI)

	metadata := map[string]interface{}{
		"name":        n.Name,
		"image":       n.TokenURI,
		"description": n.Description,
	}

	jsonMetaData, err := json.Marshal(metadata)
	if err != nil {
		fmt.Println("Err jsonMetaData")
	}
	fmt.Println("typeOf metadata", reflect.TypeOf(metadata))

	fmt.Println("jsonMetaData", jsonMetaData)
	fmt.Println("metaData", metadata)
	fmt.Println("string jsonMetaData", string(jsonMetaData))

	sdk, _ := thirdweb.NewThirdwebSDK(os.Getenv("NETWORK"), nil)
	uri, _ := sdk.Storage.Upload(context.Background(), metadata, "", "")
	fmt.Println("sdk", sdk)
	fmt.Println("uri", uri)

	// metaData map[description:dynamicNFT test   image:https://gateway.ipfscdn.io/ipfs/QmerEwUkicVJ1yAPh3R2joLGUEu8kum5XSVD6tadWTgetx/0 name:dynamicNFT]
	// string jsonMetaData {"description":"dynamicNFT test","image":"https://gateway.ipfscdn.io/ipfs/QmerEwUkicVJ1yAPh3R2joLGUEu8kum5XSVD6tadWTgetx/0","name":"dynamicNFT"}

	//https://gateway.ipfscdn.io/ipfs/QmerEwUkicVJ1yAPh3R2joLGUEu8kum5XSVD6tadWTgetx/0
	//https://gateway.ipfscdn.io/ipfsQmWk5Sa6VXZ5NLuk5Mr19x4dRe8xZuoKatjUPMt2FHWVDA/0
	removeUri := strings.Replace(uri, "ipfs://", "", 1)
	fmt.Println("removeUri", removeUri)
	newMetaDataUri := "https://gateway.ipfscdn.io/ipfs/" + removeUri
	fmt.Println("newMetaDataUri", newMetaDataUri)

	return c.JSON(http.StatusCreated, n)
}

func getNFT(c echo.Context) error {
	fmt.Println("c", c)
	lock.Lock()
	defer lock.Unlock()
	id, _ := strconv.Atoi(c.Param("id"))
	return c.JSON(http.StatusOK, nfts[id])
}

func updateNFT(c echo.Context) error {
	fmt.Println("c", c)
	lock.Lock()
	defer lock.Unlock()
	u := new(nft)
	if err := c.Bind(u); err != nil {
		return err
	}
	id, _ := strconv.Atoi(c.Param("id"))
	nfts[id].Name = u.Name
	return c.JSON(http.StatusOK, nfts[id])
}

func deleteNFT(c echo.Context) error {
	lock.Lock()
	defer lock.Unlock()
	id, _ := strconv.Atoi(c.Param("id"))
	delete(nfts, id)
	return c.NoContent(http.StatusNoContent)
}

func getAllNFTS(c echo.Context) error {
	lock.Lock()
	defer lock.Unlock()
	return c.JSON(http.StatusOK, nfts)
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	sdk, err := thirdweb.NewThirdwebSDK(os.Getenv("NETWORK"), nil)
	fmt.Println("sdk", sdk)
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes

	e.POST("/nft", createNFT)
	e.GET("/nfts", getAllNFTS)
	e.GET("/nfts/:id", getNFT)
	e.PUT("/nfts/:id", updateNFT)
	e.DELETE("/nfts/:id", deleteNFT)

	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}