package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
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
	mnft struct {
		mnftsId int
	}
)

type (
	nft struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		TokenURI    string `json:"tokenuri"`
		TokenId     int
	}
)

// 다음 코드에서는 배열의 JSON 객체를 나타내는 NFT 구조체를 정의한다
type NFT struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	TokenURI    string `json:"tokenuri"`
}

// 배열과 함께 JSON 페이로드를 나타내는 DataRequest 구조체를 정의합니다.
type DataRequest struct {
	Array []NFT `json:"array"`
}

var (
	mnfts = map[int]*mnft{}
	nfts  = map[int]*nft{}
	seq   = 1
	lock  = sync.Mutex{}
)

func MultipleCreateNFT(c echo.Context) error {

	//mnfts 경로에 대한 핸들러 함수에서는 먼저 json.NewDecoder().Decode()를 사용하여 JSON 페이로드를 DataRequest 구조체로 구문 분석합니다.
	var dataRequest DataRequest
	err := json.NewDecoder(c.Request().Body).Decode(&dataRequest)

	fmt.Println("dataRequest", dataRequest)
	err = os.MkdirAll("nft-json", 0755)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"Error: ": "failed to create folder "})
	}

	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request payload "})
	}
	//NFT 객체 배열을 반복하고 각 객체를 순회
	// iterate over the array of NFT objects and create a JSON file for each object
	for i, nft := range dataRequest.Array {

		// create the filename for the JSON file
		filename := fmt.Sprintf("nft-%d.json", i)

		//marshal the nft object to json bytes
		jsonBytes, err := json.Marshal(nft)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to create json file"})
		}
		err = ioutil.WriteFile("nft-json/"+filename, jsonBytes, 0644)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to create json file"})
		}

	}

	return c.JSON(http.StatusOK, map[string]string{"message": "NFTs saved to database"})

}

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
	e.POST("/mnfts", MultipleCreateNFT)
	e.POST("/nft", createNFT)
	e.GET("/nfts", getAllNFTS)
	e.GET("/nfts/:id", getNFT)
	e.PUT("/nfts/:id", updateNFT)
	e.DELETE("/nfts/:id", deleteNFT)

	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}
