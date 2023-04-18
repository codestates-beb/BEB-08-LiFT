package handlers

import (
	"context"
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

func NewPostHandlers(server *s.Server) *PostHandlers {
	return &PostHandlers{server: server}
}

type NFTData struct {
	LocationId  int         `json:locationId`
	Name        string      `json:"name"`
	Description string      `json:"description"`
	Image       string      `json:"image"`
	Attributes  []Attribute `json:"attributes"`
}

type WeatherAttribute struct {
	TraitType string `json:"trait_type"`
	Value     string `json:"value"`
}
type WeatherType struct {
	Name        string             `json:"name"`
	Description string             `json:"description"`
	Image       string             `json:"image"`
	Attributes  []WeatherAttribute `json:"attributes"`
}
type Attribute struct {
	TraitType string `json:"trait_type"`
	Value     string `json:"value"`
}

// 변수 설정
var (
	//Mutex 동시실행 방지하는 변수
	lock = sync.Mutex{}
)

// 1: locationManager : 0x8DB93Ede3bC2b1AdE17352aFB3077749400F83A0
// 2: weatherFeed: 0x988934F6B8B0a264e342b846cA87FdB361BAf7e1
// 3: weatherNft: 0x1077a33ED9aDD3d55aE3ef66C28b9638B9611C1d
// 4: weatherUpKeep: 0x5Cd75C04Bf0de56FB94BaFdF2DC26F6A46Cdc031

func (p *PostHandlers) MultipleCreateNFT(c echo.Context) error {
	lock.Lock()         //동시성 문제를 해결하기위한 mutex 값 설정
	defer lock.Unlock() //동시성 문제를 해결하기위한 mutex 값 해제

	var data map[string]interface{}

	if err := c.Bind(&data); err != nil {
		return err
	}

	data2 := make(map[string]interface{})
	var weatherLocationId string
	for i, v := range data {

		if i == "locationId" {
			switch s := v.(type) {
			case string:
				weatherLocationId = s
			default:
				fmt.Println("locationId is not a string ")
			}
		} else {

			data2[i] = v
		}
	}
	fmt.Println("weatherLocationId", weatherLocationId)
	//메타데이터 슬라이스 변수를 data.Types 크기만큼 할당해서 생성한다.
	metadataSlice := make([]string, len(data2))

	//채널을 만들어서 메타데이터 URL을 받는다.
	metadataURLs := make(chan string, len(data2))
	fmt.Println("metadataSlice metadataURLs", metadataSlice, metadataURLs)
	///WaitGroup을 사용하여 각 goroutine의 종료를 기다립니다.
	var wg sync.WaitGroup

	//data 길이만큼 작업개수 추가
	wg.Add(len(data2))
	// fmt.Println("metadataSlice", metadataSlice, metadataURLs)

	// cloudData := data2["cloud"].(map[string]interface{})
	// cloudName := cloudData["name"].(string)
	// fmt.Println("cloudData", cloudData)
	// fmt.Println("cloudName", cloudName)

	for i, _ := range data2 {
		typeData := i
		go func() {
			defer wg.Done()

			meta := data2[typeData].(map[string]interface{})

			metadata := map[string]interface{}{
				"name":        meta["name"].(string),
				"description": meta["description"].(string),
				"image":       meta["image"].(string),
				"attributes":  meta["attributes"].([]interface{}),
			}
			fmt.Println("metadata", metadata)
			sdk, _ := thirdweb.NewThirdwebSDK(os.Getenv("NETWORK"), nil)
			uri, _ := sdk.Storage.Upload(metadata, "", "")
			removeUri := strings.Replace(uri, "ipfs://", "", 1)
			newMetaDataUri := "https://gateway.ipfscdn.io/ipfs/" + removeUri
			fmt.Println("newMetaDataUri", newMetaDataUri)
			//데이터를 채널에 넣기.
			metadataURLs <- newMetaDataUri
			fmt.Println("metadataURLs", metadataURLs)

		}()
	}

	go func() {
		wg.Wait()
		//채널 닫기
		close(metadataURLs)
	}()

	for uri := range metadataURLs {
		metadataSlice = append(metadataSlice, uri)

	}

	fmt.Println("metadataSlice", metadataSlice)
	for i, v := range metadataSlice {
		metadataSlice[i] = strings.TrimSpace(v)
		fmt.Println(metadataSlice)
	}

	fmt.Println("metadataSlice 2 trimSpace", metadataSlice)

	var result string
	var elements []string

	for _, v := range metadataSlice {
		elements = append(elements, v)
		result = "[" + strings.Join(elements, ",") + "]"
	}
	fmt.Println("result 2 ", result)
	fmt.Println("type check result 2 ", reflect.TypeOf(result))
	//contractAddress := os.Getenv("CONTRACTS")
	contractAddress := os.Getenv("WEATHERNFT")
	fmt.Println("contractAddress", contractAddress)

	// sdk, err := thirdweb.NewThirdwebSDK("mumbai", &thirdweb.SDKOptions{
	// 	PrivateKey: os.Getenv("PRIVATEKEY"),
	// })
	// if err != nil {
	// 	panic(err)
	// }

	// contract, err := sdk.GetContractFromAbi(contractAddress, ABI)
	// if err != nil {
	// 	panic(err)
	// }
	// fmt.Println("contract", contract)

	contract, err := sdk.GetContract(os.Getenv("WEATHERNFT"))
	if err != nil {
		panic(err)
	}
	fmt.Println("contract", contract)

	// fmt.Println("type check result 2 ", reflect.TypeOf(metadataSlice))
	// fmt.Println("metadataSlice", metadataSlice)
	//메타데이터 4개를 설정하는 함수 실행

	tx, err := contract.Call(context.Background(), "mint", "0x7684992428a8E5600C0510c48ba871311067d74c", "0x7684992428a8E5600C0510c48ba871311067d74c", result, weatherLocationId)
	if err != nil {
		fmt.Println("contractCall mint ")
		panic(err)
	}
	fmt.Println("tx", tx)

	metadataBytes := []byte(strings.Join(metadataSlice, "\n"))

	return c.JSONBlob(http.StatusOK, metadataBytes)
	//return c.String(http.StatusOK, "Hello")
}

func (p *PostHandlers) SimpleCreateNFT(c echo.Context) error {
	lock.Lock()
	defer lock.Unlock()

	var data map[string]NFTData

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
	fmt.Println("typecheck reflect", reflect.TypeOf(data))
	metadataSlice := make([]string, len(data))
	for _, v := range data {
		fmt.Println("v", v)
		fmt.Println("v type", reflect.TypeOf(v))
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
	fmt.Println("metadataSlice", metadataSlice)

	balance, err := contract.Call(context.Background(), "balanceOf", "0x7684992428a8E5600C0510c48ba871311067d74c")
	if err != nil {
		panic(err)
	}
	fmt.Println("balance", balance)

	getIpfsUri, err := contract.Call(context.Background(), "getIpfsUri")
	if err != nil {
		panic(err)
	}
	var result string
	var elements []string
	for _, v := range metadataSlice {
		elements = append(elements, v)
		result = "[" + strings.Join(elements, ", ") + "]"
	}
	fmt.Println("result 2 ", result)
	fmt.Println("getIpfsUri1", getIpfsUri)
	fmt.Println("type check result 2 ", reflect.TypeOf(result))
	fmt.Println("type check result 2 ", reflect.TypeOf(metadataSlice))
	//메타데이터 4개를 설정하는 함수 실행
	contract.Call(context.Background(), "setIpfsUri", "0x7684992428a8E5600C0510c48ba871311067d74c", result)
	if err != nil {
		panic(err)
	}

	//메타데이터를 잘 가져왔는지 체크
	getIpfsUri2, err := contract.Call(context.Background(), "getIpfsUri")
	if err != nil {
		panic(err)
	}
	fmt.Println("getIpfsUri2", getIpfsUri2)
	return c.JSONBlob(http.StatusOK, response)

}

func (p *PostHandlers) DefaultCreateNFT(c echo.Context) error {
	lock.Lock()         //동시성 문제를 해결하기위한 mutex 값 설정
	defer lock.Unlock() //동시성 문제를 해결하기위한 mutex 값 해제
	var data map[string]NFTData

	//데이터 바인딩
	if err := c.Bind(&data); err != nil {
		return err
	}

	metadataSlice := make([]string, len(data))

	//채널을 만들어서 메타데이터 URL을 받는다.
	metadataURLs := make(chan string, len(data))

	for _, v := range data {

		metadata := map[string]interface{}{
			"name":        v.Name,
			"description": v.Description,
			"image":       v.Image,
			"attributes": []interface{}{
				map[string]interface{}{
					"trait_type": v.Attributes[0].TraitType,
					"value":      v.Attributes[0].Value,
				},
				map[string]interface{}{
					"trait_type": v.Attributes[1].TraitType,
					"value":      v.Attributes[1].Value,
				},
				map[string]interface{}{
					"trait_type": v.Attributes[2].TraitType,
					"value":      v.Attributes[2].Value,
				},
			},
		}

		sdk, _ := thirdweb.NewThirdwebSDK(os.Getenv("NETWORK"), nil)
		uri, _ := sdk.Storage.Upload(metadata, "", "")
		removeUri := strings.Replace(uri, "ipfs://", "", 1)
		newMetaDataUri := "https://gateway.ipfscdn.io/ipfs/" + removeUri

		//데이터를 채널에 넣기.
		metadataURLs <- newMetaDataUri

	}

	for i := 0; i < len(data); i++ {
		metadataSlice[i] = <-metadataURLs
	}

	contractAddress := os.Getenv("CONTRACTS")

	sdk, err := thirdweb.NewThirdwebSDK("mumbai", &thirdweb.SDKOptions{
		PrivateKey: os.Getenv("PRIVATEKEY"),
	})
	if err != nil {
		panic(err)
	}

	contract, err := sdk.GetContractFromAbi(contractAddress, ABI)
	if err != nil {
		panic(err)
	}

	balance, err := contract.Call(context.Background(), "balanceOf", "0x7684992428a8E5600C0510c48ba871311067d74c")
	if err != nil {
		panic(err)
	}
	fmt.Println("balance", balance)

	getIpfsUri, err := contract.Call(context.Background(), "getIpfsUri")
	if err != nil {
		panic(err)
	}
	fmt.Println("getIpfsUri", getIpfsUri)
	var result string
	var elements []string
	for _, v := range metadataSlice {
		elements = append(elements, v)
		result = "[" + strings.Join(elements, ", ") + "]"
	}

	//메타데이터 4개를 설정하는 함수 실행
	contract.Call(context.Background(), "setIpfsUri", "0x7684992428a8E5600C0510c48ba871311067d74c", result)
	if err != nil {
		panic(err)
	}

	//메타데이터를 잘 가져왔는지 체크
	getIpfsUri2, err := contract.Call(context.Background(), "getIpfsUri")
	if err != nil {
		panic(err)
	}
	fmt.Println("getIpfsUri2", getIpfsUri2)
	metadataBytes := []byte(strings.Join(metadataSlice, "\n"))

	return c.JSONBlob(http.StatusOK, metadataBytes)

}
