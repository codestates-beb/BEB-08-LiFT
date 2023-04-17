package handlers

import (
	s "echo-dnft/server"
	"encoding/json"
	"fmt"
	"io/ioutil"
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

// 다음 코드에서는 배열의 JSON 객체를 나타내는 공통 NFTDATA 구조체를 정의한다

type NFTData struct {
	Name        string      `json:"name"`
	Description string      `json:"description"`
	Image       string      `json:"image"`
	Attributes  []Attribute `json:"attributes"`
}
type Attribute struct {
	TraitType string `json:"trait_type"`
	Value     string `json:"value"`
}

type Weather struct {
	LocationId string `json:"locationId"`
	Types      map[string]*WeatherType
}

// type Weather struct {
// 	LocationId string      `json:"locationId"`
// 	Sun        WeatherType `json:"sun"`
// 	Rain       WeatherType `json:"rain"`
// 	Cloud      WeatherType `json:"cloud"`
// 	Snow       WeatherType `json:"snow"`
// }

type WeatherType struct {
	Name        string             `json:"name"`
	Description string             `json:"description"`
	Image       string             `json:"image"`
	Attributes  []WeatherAttribute `json:"attributes"`
}

type WeatherAttribute struct {
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

	body, err := ioutil.ReadAll(c.Request().Body)
	if err != nil {
		return err
	}
	fmt.Println("body", body)
	//fmt.Println("string(body)", string(body))
	data2 := string(body)
	fmt.Println("data2", data2)
	fmt.Println("type check", reflect.TypeOf(body))

	var weather Weather
	// if err := json.Unmarshal(body, &weather); err != nil {
	// 	return err
	// }
	// fmt.Println("weather", weather)
	if err := c.Bind(&weather); err != nil {
		return err
	}

	// data := new(Weather)
	data := &Weather{}
	if err := c.Bind(&data); err != nil {
		return err
	}
	fmt.Println("data", data)

	locationId := data.LocationId
	fmt.Println("locationId", locationId)

	fmt.Println("type check", reflect.TypeOf(data))
	//메타데이터 슬라이스 변수를 data.Types 크기만큼 할당해서 생성한다.
	// metadataSlice := make([]string, len(data.Types))

	// //채널을 만들어서 메타데이터 URL을 받는다.
	// metadataURLs := make(chan string, len(data.Types))

	// //WaitGroup을 사용하여 각 goroutine의 종료를 기다립니다.
	// var wg sync.WaitGroup

	//data 길이만큼 작업개수 추가
	// fmt.Println("len(data.Types", len(data.Types))
	// wg.Add(len(data.Types))

	// for _, v := range data.Types {
	// 	typeData := v

	// 	go func() {
	// 		defer wg.Done()
	// 		fmt.Println("typeData", typeData)
	// 		metadata := map[string]interface{}{
	// 			"name":        typeData.Name,
	// 			"description": typeData.Description,
	// 			"image":       typeData.Image,
	// 			"attributes": []interface{}{
	// 				map[string]interface{}{
	// 					"trait_type": typeData.Attributes[0].TraitType,
	// 					"value":      typeData.Attributes[0].Value,
	// 				},
	// 				map[string]interface{}{
	// 					"trait_type": typeData.Attributes[1].TraitType,
	// 					"value":      typeData.Attributes[1].Value,
	// 				},
	// 				map[string]interface{}{
	// 					"trait_type": typeData.Attributes[2].TraitType,
	// 					"value":      typeData.Attributes[2].Value,
	// 				},
	// 			},
	// 		}
	// 		fmt.Println("metadata", metadata)

	// 		sdk, _ := thirdweb.NewThirdwebSDK(os.Getenv("NETWORK"), nil)
	// 		uri, _ := sdk.Storage.Upload(metadata, "", "")
	// 		removeUri := strings.Replace(uri, "ipfs://", "", 1)
	// 		newMetaDataUri := "https://gateway.ipfscdn.io/ipfs/" + removeUri
	// 		fmt.Println("newMetaDataUri", newMetaDataUri)
	// 		//데이터를 채널에 넣기.
	// 		metadataURLs <- newMetaDataUri
	// 		fmt.Println("metadataURLs", metadataURLs)
	// 	}()

	// }
	// go func() {
	// 	wg.Wait()
	// 	//채널 닫기
	// 	close(metadataURLs)
	// }()

	// for uri := range metadataURLs {
	// 	metadataSlice = append(metadataSlice, uri)
	// }

	// fmt.Println("metadataSlice", metadataSlice)
	// contractAddress := os.Getenv("CONTRACTS")
	// fmt.Println("contractAddress", contractAddress)

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

	// balance, err := contract.Call(context.Background(), "balanceOf", "0x7684992428a8E5600C0510c48ba871311067d74c")
	// if err != nil {
	// 	panic(err)
	// }
	// fmt.Println("balance", balance)

	// getIpfsUri, err := contract.Call(context.Background(), "getIpfsUri")
	// if err != nil {
	// 	panic(err)
	// }
	// var result string
	// var elements []string
	// for _, v := range metadataSlice {
	// 	elements = append(elements, v)
	// 	result = "[" + strings.Join(elements, ", ") + "]"
	// }
	// fmt.Println("result 2 ", result)
	// fmt.Println("getIpfsUri1", getIpfsUri)
	// fmt.Println("type check result 2 ", reflect.TypeOf(result))
	// fmt.Println("type check result 2 ", reflect.TypeOf(metadataSlice))
	// //메타데이터 4개를 설정하는 함수 실행
	// contract.Call(context.Background(), "setIpfsUri", "0x7684992428a8E5600C0510c48ba871311067d74c", result)
	// if err != nil {
	// 	panic(err)
	// }

	// //메타데이터를 잘 가져왔는지 체크
	// getIpfsUri2, err := contract.Call(context.Background(), "getIpfsUri")
	// if err != nil {
	// 	panic(err)
	// }

	// fmt.Println("getIpfsUri2", getIpfsUri2)

	// metadataBytes := []byte(strings.Join(metadataSlice, "\n"))
	// fmt.Println("metadataBytes", metadataBytes)
	// return c.JSONBlob(http.StatusOK, "metadataBytes")
	return c.String(http.StatusOK, "Hello")
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
