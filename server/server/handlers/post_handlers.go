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

	"github.com/jinzhu/gorm"
	"github.com/labstack/echo/v4"
	"github.com/thirdweb-dev/go-sdk/thirdweb"
)

type PostHandlers struct {
	server *s.Server
}

func NewPostHandlers(server *s.Server) *PostHandlers {
	return &PostHandlers{server: server}
}

type Attribute struct {
	TraitType string `json:"trait_type"`
	Value     string `json:"value"`
}

// 다음 코드에서는 배열의 JSON 객체를 나타내는 NFT 구조체를 정의한다
type MNFT struct {
	Name        string      `json:"name"`
	Description string      `json:"description"`
	Image       string      `json:"image"`
	Attributes  []Attribute `json:"attributes"`
}

type WeatherData struct {
	Sun   Weather `json:"sun"`
	Rain  Weather `json:"rain"`
	Cloud Weather `json:"cloud"`
	Snow  Weather `json:"snow"`
}

type Weather struct {
	Name        string      `json:"name"`
	Description string      `json:"name"`
	Image       string      `json:"image"`
	Attributes  []Attribute `json:"attributes"`
}

type WeatherModal struct {
	gorm.Model
	Name        string
	Description string
	Image       string
	Location    string
	Latitude    string
	Longitude   string
}

// 변수 설정
var (
	//Mutex 동시실행 방지하는 변수
	lock = sync.Mutex{}
)

func (p *PostHandlers) MultipleCreateNFT(c echo.Context) error {
	lock.Lock()
	defer lock.Unlock()

	//var data map[string]NFT

	var data map[string]MNFT

	if err := c.Bind(&data); err != nil {
		return err
	}
	//fmt.Println("data", data)
	fmt.Printf("data :%s\n", data)
	//response, err := json.Marshal(data)
	// if err != nil {
	// 	return err
	// }
	//fmt.Printf("response :%s\n", response)
	//metadataSlice := make([]string, len(data))
	for i, v := range data {
		// fmt.Printf("i %s", i)
		// fmt.Printf("v %s", v)
		fmt.Println("i,v", i, v)
		// metadata := map[string]interface{}{
		// 	"name":        v.Name,
		// 	"description": v.Description,
		// 	"image":       v.Image,
		// }
	}
	// response, err := json.Marshal(data)
	// fmt.Println("response", response)
	// if err != nil {
	// 	return err
	// }

	// if err := json.Unmarshal(response, &data); err != nil {
	// 	return err
	// }

	// fmt.Println("len(data)", len(data))

	// metadataSlice := make([]string, len(data))
	// for _, v := range data {
	// 	fmt.Println("name:", v.Name)
	// 	fmt.Println("description:", v.Description)
	// 	fmt.Println("image:", v.Image)
	// 	metadata := map[string]interface{}{
	// 		"name":        v.Name,
	// 		"description": v.Description,
	// 		"image":       v.Image,
	// 	}
	// 	fmt.Println("metadata", metadata)
	// 	sdk, _ := thirdweb.NewThirdwebSDK(os.Getenv("NETWORK"), nil)
	// 	// uri, _ := sdk.Storage.Upload(context.Background(), metadata, "", "")
	// 	uri, _ := sdk.Storage.Upload(metadata, "", "")
	// 	fmt.Println("sdk", sdk)
	// 	fmt.Println("uri", uri)

	// 	removeUri := strings.Replace(uri, "ipfs://", "", 1)
	// 	fmt.Println("removeUri", removeUri)
	// 	newMetaDataUri := "https://gateway.ipfscdn.io/ipfs/" + removeUri
	// 	fmt.Println("typeCheck", reflect.TypeOf(newMetaDataUri))
	// 	fmt.Println("newMetaDataUri", newMetaDataUri)
	// 	metadataSlice = append(metadataSlice, newMetaDataUri)

	// }
	// contractAddress := os.Getenv("CONTRACTS")
	// sdk, err := thirdweb.NewThirdwebSDK("mumbai", &thirdweb.SDKOptions{
	// 	PrivateKey: os.Getenv("PRIVATEKEY"),
	// })
	// abi := os.Getenv("ABI")
	// contract, err := sdk.GetContractFromAbi(contractAddress, abi)
	// fmt.Println("contractAddress", contractAddress)
	// balance, err := contract.Call("getIpfsUri", "{0x7684992428a8E5600C0510c48ba871311067d74c}")

	// // // You can also make a transaction to your contract with the call method
	// // tx, err := contract.Call("mintTo", "{{wallet_address}}", "ipfs://...")

	// fmt.Println("metadataSlice", metadataSlice)

	//return c.JSONBlob(http.StatusOK, response)
	return c.String(http.StatusOK, "Hello ECHO ")

}

func (p *PostHandlers) SimpleCreateNFT(c echo.Context) error {
	lock.Lock()
	defer lock.Unlock()

	var data map[string]MNFT

	if err := c.Bind(&data); err != nil {
		return err
	}
	fmt.Println("data", data)
	response, err := json.Marshal(data)
	fmt.Println("response", response)
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
	contractAddress := os.Getenv("CONTRACTS")
	sdk, err := thirdweb.NewThirdwebSDK("mumbai", &thirdweb.SDKOptions{
		PrivateKey: os.Getenv("PRIVATEKEY"),
	})
	abi := os.Getenv("ABI")
	contract, err := sdk.GetContractFromAbi(contractAddress, abi)
	fmt.Println("contractAddress", contract)
	//balance, err := contract.Call("getIpfsUri", "{0x7684992428a8E5600C0510c48ba871311067d74c}")

	// // You can also make a transaction to your contract with the call method
	// tx, err := contract.Call("mintTo", "{{wallet_address}}", "ipfs://...")

	fmt.Println("metadataSlice", metadataSlice)

	return c.JSONBlob(http.StatusOK, response)

}
