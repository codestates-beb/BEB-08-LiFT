package handlers

import (
	s "echo-dnft/server"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"reflect"
	"strings"
	"sync"

	"github.com/labstack/echo/v4"
	"github.com/thirdweb-dev/go-sdk/thirdweb"
)

type PostHandlers struct {
	server *s.Server
}

// 다음 코드에서는 배열의 JSON 객체를 나타내는 NFT 구조체를 정의한다
type NFT struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Image       string `json:"image"`
}

// 변수 설정
var (
	//Mutex 동시실행 방지하는 변수
	lock = sync.Mutex{}
)

func NewPostHandlers(server *s.Server) *PostHandlers {
	return &PostHandlers{server: server}
}

func (p *PostHandlers) MultipleCreateNFT(c echo.Context) error {
	lock.Lock()
	defer lock.Unlock()

	var data map[string]NFT

	if err := c.Bind(&data); err != nil {
		return err
	}

	response, err := json.Marshal(data)
	if err != nil {
		return err
	}

	if err := json.Unmarshal(response, &data); err != nil {
		return err
	}
	fmt.Println("len(data)", len(data))
	metadataSlice := make([]string, len(data))
	for _, v := range data {
		fmt.Println("name:", v.Name)
		fmt.Println("description:", v.Description)
		fmt.Println("image:", v.Image)
		metadata := map[string]interface{}{
			"name":        v.Name,
			"description": v.Description,
			"image":       v.Image,
		}
		fmt.Println("metadata", metadata)
		sdk, _ := thirdweb.NewThirdwebSDK(os.Getenv("NETWORK"), nil)
		// uri, _ := sdk.Storage.Upload(context.Background(), metadata, "", "")
		uri, _ := sdk.Storage.Upload(metadata, "", "")
		fmt.Println("sdk", sdk)
		fmt.Println("uri", uri)

		removeUri := strings.Replace(uri, "ipfs://", "", 1)
		fmt.Println("removeUri", removeUri)
		newMetaDataUri := "https://gateway.ipfscdn.io/ipfs/" + removeUri
		fmt.Println("typeCheck", reflect.TypeOf(newMetaDataUri))
		fmt.Println("newMetaDataUri", newMetaDataUri)
		metadataSlice = append(metadataSlice, newMetaDataUri)

	}
	// contractAddress := os.Getenv(CONTRACTS)
	// balance, err := contract.Call("balanceOf", "{{wallet_address}}")

	// // You can also make a transaction to your contract with the call method
	// tx, err := contract.Call("mintTo", "{{wallet_address}}", "ipfs://...")

	// fmt.Println("metadataSlice", metadataSlice)

	return c.JSONBlob(http.StatusOK, response)

}
