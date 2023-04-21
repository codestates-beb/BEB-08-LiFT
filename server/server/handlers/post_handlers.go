package handlers

import (
	"context"
	"database/sql"
	s "echo-dnft/server"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"reflect"
	"strconv"
	"strings"
	"sync"

	"github.com/ethereum/go-ethereum/common"
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

type Attribute struct {
	TraitType string `json:"trait_type"`
	Value     string `json:"value"`
}

type MyPage struct {
	Name         string `json:"name"`
	OwnerAddress string `json:"owner_address"`
	Description  string `json:"description"`
}

type tokenObj struct {
	TokenID      string `json:"token_id"`
	OwnerAddress string `json:"owner_address"`
}
type buyerObj struct {
	TokenID       string `json:"token_id"`
	BuyerAddress  string `json:"buyer_address"`
	SellerAddress string `json:"seller_address"`
}

// 변수 설정
var (
	//Mutex 동시실행 방지하는 변수
	lock = sync.Mutex{}
	//wg 동시접근시 꼬이지 않게 하기 위한 변수 설정
	wg       sync.WaitGroup
	data     map[string]interface{}
	nft_id   int
	user_id  int
	token_id int
)

// TODO DB에 다이나믹 NFT 2,3,4번째도 넣을 수 있게 수정필요
// 수정 완료
func (p *PostHandlers) MultipleCreateNFT(c echo.Context) error {
	lock.Lock()         //동시성 문제를 해결하기위한 mutex 값 설정
	defer lock.Unlock() //동시성 문제를 해결하기위한 mutex 값 해제

	if err := c.Bind(&data); err != nil {
		return err
	}

	data2 := make(map[string]interface{})
	var weatherLocationId string
	var ownerAddress string
	fmt.Println("ownerAddress", ownerAddress)
	for i, v := range data {

		if i == "locationId" {
			switch s := v.(type) {
			case string:
				weatherLocationId = s
			default:
				fmt.Println("locationId is not a string ")
			}
		} else if i == "owner_address" {
			switch s := v.(type) {
			case string:
				ownerAddress = s
			default:
				fmt.Println("ownerId is not a string ")
			}

		} else {
			data2[i] = v
		}
	}
	fmt.Println("weatherLocationId", weatherLocationId)
	fmt.Println("ownerAddress", ownerAddress)
	//메타데이터 슬라이스 변수를 data.Types 크기만큼 할당해서 생성한다.
	metadataSlice := make([]string, len(data2))

	//채널을 만들어서 메타데이터 URL을 받는다.
	metadataURLs := make(chan string, len(data2))
	///WaitGroup을 사용하여 각 goroutine의 종료를 기다립니다
	wg.Add(len(data2))

	metadataSlice2 := make([]string, 0)
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

			if len(metadataSlice2) == 0 {
				metadataSlice2 = append(metadataSlice2, meta["name"].(string))
				metadataSlice2 = append(metadataSlice2, meta["description"].(string))
				metadataSlice2 = append(metadataSlice2, meta["image"].(string))

			}

			sdk, _ := thirdweb.NewThirdwebSDK(os.Getenv("NETWORK"), nil)
			uri, _ := sdk.Storage.Upload(metadata, "", "")
			removeUri := strings.Replace(uri, "ipfs://", "", 1)
			newMetaDataUri := "https://gateway.ipfscdn.io/ipfs/" + removeUri
			metadataURLs <- newMetaDataUri

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

	metadataSlice = metadataSlice[4:]
	metadataString := strings.Join(metadataSlice, ",") // 슬라이스를 하나의 문자열로 결합
	metadataString = strings.Replace(metadataString, "\\", "", -1)
	metadataelements := strings.Split(metadataString, ",")

	contractAddress := os.Getenv("CONTRACTS")
	//accountAddress := os.Getenv("WALLET_ADDRESS")
	accountAddress := ownerAddress
	fmt.Println("contractAddress", contractAddress)
	fmt.Println("accountAddress", accountAddress)

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
	fmt.Println("contract", contract)

	balance, err := contract.Call(context.Background(), "balanceOf", "0x7684992428a8E5600C0510c48ba871311067d74c")
	if err != nil {
		panic(err)
	}
	fmt.Println("balance", balance)

	getIpfsUri, err := contract.Call(context.Background(), "getIpfsUri")
	if err != nil {
		fmt.Println("getIpfsUri test~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
		panic(err)
	}
	fmt.Println("getIpfsUri", getIpfsUri)

	setIpfsUri, err := contract.Call(context.Background(), "setIpfsUri", metadataelements)
	if err != nil {
		fmt.Println("setIpfsUri test~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
		panic(err)
	}
	fmt.Println("setIpfsUri", setIpfsUri)

	// tokenid는 owner address가 일치하면서 디비에 있는 값과 맞췄을 때 마지막 token_id에서 +1
	// name > 메타데이터

	safeMint, err := contract.Call(context.Background(), "safeMint", accountAddress)
	if err != nil {
		fmt.Println("safeMint test~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
		panic(err)
	} else {
		fmt.Println("safeMint Success")
		user := os.Getenv("user")
		password := os.Getenv("password")
		//db url 설정
		db_url := fmt.Sprintf("%s:%s@tcp(152.69.231.140:3306)/lift", user, password)

		db, err := sql.Open("mysql", db_url)
		if err != nil {
			fmt.Println(err)
		}
		defer db.Close()

		err = db.QueryRow("SELECT COALESCE(Max(id), 0)  from nft where owner_address=?", accountAddress).Scan(&nft_id)
		if err != nil {
			fmt.Println(err)
		}
		err = db.QueryRow("SELECT COALESCE(Max(user_id), 0)  from nft where owner_address=?", accountAddress).Scan(&user_id)
		if err != nil {
			fmt.Println(err)
		}
		err = db.QueryRow("SELECT COALESCE(Max(token_id), 0) from nft where owner_address=?", accountAddress).Scan(&token_id)
		if err != nil {
			fmt.Println(err)
		}
		if user_id == 0 || token_id == 0 {
			user_id, token_id = 1, 1
		} else if nft_id != 0 && user_id != 0 && token_id != 0 {
			nft_id += 1
			user_id += 1
			token_id += 1
		}

		stmt, err := db.Prepare("INSERT INTO nft (id, user_id, token_id, name, description, ipfs_url, nft_contract_address, owner_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
		if err != nil {
			fmt.Println(err)
		}
		defer stmt.Close()

		_, err = stmt.Exec(nft_id, user_id, token_id, metadataSlice2[0], metadataSlice2[1], metadataSlice2[2], contractAddress, accountAddress)
		if err != nil {
			fmt.Println(err)
		}
	}
	fmt.Println("safeMint", safeMint)

	return c.String(http.StatusOK, "Congratulations. You've successfully minted.")
}

// TODO DB에 다이나믹 NFT 2,3,4번째도 넣을 수 있게 수정필요
// 수정완료함
func (p *PostHandlers) WeatherDynamicNFT(c echo.Context) error {
	lock.Lock()         //동시성 문제를 해결하기위한 mutex 값 설정
	defer lock.Unlock() //동시성 문제를 해결하기위한 mutex 값 해제

	//var data map[string]interface{}

	if err := c.Bind(&data); err != nil {
		return err
	}

	data2 := make(map[string]interface{})
	var weatherLocationId string
	var ownerAddress string
	fmt.Println("ownerId", ownerAddress)
	for i, v := range data {

		if i == "locationId" {
			switch s := v.(type) {
			case string:
				weatherLocationId = s
			default:
				fmt.Println("locationId is not a string ")
			}
		} else if i == "owner_address" {
			switch s := v.(type) {
			case string:
				ownerAddress = s
			default:
				fmt.Println("ownerId is not a string ")
			}
		} else {
			data2[i] = v
		}
	}
	fmt.Println("ownerAddress", ownerAddress)
	fmt.Println("weatherLocationId", weatherLocationId)
	//메타데이터 슬라이스 변수를 data.Types 크기만큼 할당해서 생성한다.
	metadataSlice := make([]string, len(data2))

	//채널을 만들어서 메타데이터 URL을 받는다.
	metadataURLs := make(chan string, len(data2))
	//fmt.Println("metadataSlice metadataURLs", metadataSlice, metadataURLs)
	///WaitGroup을 사용하여 각 goroutine의 종료를 기다립니다.

	//data 길이만큼 작업개수 추가
	wg.Add(len(data2))
	// fmt.Println("metadataSlice", metadataSlice, metadataURLs)

	metadataSlice2 := make([]string, 0)
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

			fmt.Println("meta[image].(string)", meta["image"].(string))
			//fmt.Println("len(metadataSlice2)", len(metadataSlice2))
			if len(metadataSlice2) == 0 {
				metadataSlice2 = append(metadataSlice2, meta["name"].(string))
				metadataSlice2 = append(metadataSlice2, meta["description"].(string))
				metadataSlice2 = append(metadataSlice2, meta["image"].(string))

			}

			//metadataSlice2 = append(metadataSlice2, meta["attributes"].([]interface{}))
			sdk, _ := thirdweb.NewThirdwebSDK(os.Getenv("NETWORK"), nil)
			uri, _ := sdk.Storage.Upload(metadata, "", "")
			removeUri := strings.Replace(uri, "ipfs://", "", 1)
			newMetaDataUri := "https://gateway.ipfscdn.io/ipfs/" + removeUri
			//fmt.Println("newMetaDataUri", newMetaDataUri)
			//데이터를 채널에 넣기.
			metadataURLs <- newMetaDataUri
			///fmt.Println("metadataURLs", metadataURLs)

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
	fmt.Println("metadataSlice slice before", metadataSlice)
	metadataSlice = metadataSlice[4:]
	fmt.Println("metadataSlice slice[4:]", metadataSlice)

	metadataString := strings.Join(metadataSlice, ",") // 슬라이스를 하나의 문자열로 결합
	fmt.Println("metadataString", metadataString)
	metadataString = strings.Replace(metadataString, "\\", "", -1)
	metadataelements := strings.Split(metadataString, ",")
	fmt.Println("metadataelements2", metadataelements)
	fmt.Println("type check metadataelements", reflect.TypeOf(metadataelements))

	contractAddress := os.Getenv("WEATHERNFT")
	//accountAddress := os.Getenv("WALLET_ADDRESS")
	accountAddress := ownerAddress
	fmt.Println("contractAddress", contractAddress)
	fmt.Println("accountAddress", accountAddress)

	sdk, err := thirdweb.NewThirdwebSDK("mumbai", &thirdweb.SDKOptions{
		PrivateKey: os.Getenv("PRIVATEKEY"),
	})
	if err != nil {
		panic(err)
	}

	contract, err := sdk.GetContractFromAbi(contractAddress, ABI2)
	if err != nil {
		panic(err)
	}
	fmt.Println("contract", contract)

	balance, err := contract.Call(context.Background(), "balanceOf", "0x7684992428a8E5600C0510c48ba871311067d74c")
	if err != nil {
		panic(err)
	}
	fmt.Println("balance", balance)

	//컨트랙트 주소 :0x443F2C402ae77877F0FB011491e02A10E153A33b
	//metadataelements >> 성공
	// tokenid는 owner address가 일치하면서 디비에 있는 값과 맞췄을 때 마지막 token_id에서 +1
	// name > 메타데이터

	locationNum, _ := strconv.Atoi(weatherLocationId) //locationNum
	fmt.Println("locationNum", reflect.TypeOf(locationNum))
	fmt.Println("locationNum", locationNum)
	mint, err := contract.Call(context.Background(), "mint", accountAddress, metadataelements, locationNum)
	if err != nil {
		fmt.Println("mint test~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
		panic(err)
	} else {
		fmt.Println("mint Success")
		user := os.Getenv("user")
		password := os.Getenv("password")
		//db url 설정
		db_url := fmt.Sprintf("%s:%s@tcp(152.69.231.140:3306)/lift", user, password)

		fmt.Println("metadataSlice2[0]", metadataSlice2[0])
		fmt.Println("metadataSlice2[1]", metadataSlice2[1])
		fmt.Println("metadataSlice2[2]", metadataSlice2[2])

		db, err := sql.Open("mysql", db_url)
		if err != nil {
			fmt.Println(err)
		}
		defer db.Close()

		fmt.Println("db", db)

		err = db.QueryRow("SELECT COALESCE(Max(id), 0)  from nft where owner_address=?", accountAddress).Scan(&nft_id)
		if err != nil {
			fmt.Println(err)
		}
		err = db.QueryRow("SELECT COALESCE(Max(user_id), 0)  from nft where owner_address=?", accountAddress).Scan(&user_id)
		if err != nil {
			fmt.Println(err)
		}
		err = db.QueryRow("SELECT COALESCE(Max(token_id), 0) from nft where owner_address=?", accountAddress).Scan(&token_id)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println("nft_id", nft_id)
		fmt.Println("user_id", user_id)
		fmt.Println("token_id", token_id)
		if user_id == 0 || token_id == 0 {
			user_id, token_id = 1, 1
		} else if nft_id != 0 && user_id != 0 && token_id != 0 {
			nft_id += 1
			user_id += 1
			token_id += 1
		}

		fmt.Println("nft_id", nft_id)
		fmt.Println("user_id", user_id)
		fmt.Println("token_id", token_id)

		stmt, err := db.Prepare("INSERT INTO nft (id, user_id, token_id, name, description, ipfs_url, nft_contract_address, owner_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
		if err != nil {
			fmt.Println(err)
		}
		defer stmt.Close()

		_, err = stmt.Exec(nft_id, user_id, token_id, metadataSlice2[0], metadataSlice2[1], metadataSlice2[2], contractAddress, accountAddress)
		if err != nil {
			fmt.Println(err)
		}
	}
	fmt.Println("mint", mint)

	return c.String(http.StatusOK, "Congratulations. You've successfully Weather NFT minted.")
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

	var result string
	var elements []string
	for _, v := range metadataSlice {
		elements = append(elements, v)
		result = "[" + strings.Join(elements, ", ") + "]"
	}
	fmt.Println("result 2 ", result)
	//fmt.Println("getIpfsUri1", getIpfsUri)
	fmt.Println("type check result 2 ", reflect.TypeOf(result))
	fmt.Println("type check result 2 ", reflect.TypeOf(metadataSlice))

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

func (p *PostHandlers) UpdateMyPage(c echo.Context) error {
	lock.Lock()         //동시성 문제를 해결하기위한 mutex 값 설정
	defer lock.Unlock() //동시성 문제를 해결하기위한 mutex 값 해제

	var myPage MyPage
	var user_id int
	if err := c.Bind(&myPage); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	fmt.Println("mint Success")
	user := os.Getenv("user")
	password := os.Getenv("password")
	//db url 설정
	db_url := fmt.Sprintf("%s:%s@tcp(152.69.231.140:3306)/lift", user, password)

	fmt.Println("myPage", myPage)
	fmt.Println("myPage", myPage.OwnerAddress)

	db, err := sql.Open("mysql", db_url)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	defer db.Close()

	fmt.Println("db", db)
	//COALESCE(Max(user_id), 0)
	// IFNULL(id,0)
	err = db.QueryRow("SELECT COALESCE(Max(id), 0) from user where owner_address = ?  ", myPage.OwnerAddress).Scan(&user_id)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	fmt.Println("user_id", user_id)
	if user_id == 0 {
		user_id = 1
		stmt, _ := db.Prepare("INSERT INTO user (name, description, owner_address) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name=?, description=?, owner_address=?")
		_, err = stmt.Exec(&myPage.Name, &myPage.Description, &myPage.OwnerAddress, &myPage.Name, &myPage.Description, &myPage.OwnerAddress)
		if err != nil {
			fmt.Println(err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}
		fmt.Println("stmt", stmt)
		defer stmt.Close()

	} else {
		stmt, _ := db.Prepare("UPDATE user  set name = ?  ,  description = ?  where owner_address = ?")
		_, err = stmt.Exec(&myPage.Name, &myPage.Description, &myPage.OwnerAddress)
		if err != nil {
			fmt.Println(err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}
		fmt.Println("stmt", stmt)
		defer stmt.Close()
	}

	fmt.Println("myPage", myPage)

	return c.JSON(http.StatusOK, myPage)

}

func (p *PostHandlers) Buy(c echo.Context) error {

	lock.Lock()         //동시성 문제를 해결하기위한 mutex 값 설정
	defer lock.Unlock() //동시성 문제를 해결하기위한 mutex 값 해제

	var buyerObj buyerObj
	if err := c.Bind(&buyerObj); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	fmt.Println("buyerObj", &buyerObj)

	contractAddress := os.Getenv("WEATHERNFT")
	//accountAddress := os.Getenv("WALLET_ADDRESS")
	buyerAddress := buyerObj.BuyerAddress
	ownerAddress := buyerObj.SellerAddress
	fmt.Println("buyerAddress", buyerAddress)
	fmt.Println("ownerAddress", ownerAddress)

	sdk, err := thirdweb.NewThirdwebSDK("mumbai", &thirdweb.SDKOptions{
		PrivateKey: os.Getenv("PRIVATEKEY"),
	})
	if err != nil {
		panic(err)
	}

	contract, err := sdk.GetContractFromAbi(contractAddress, ABI2)
	if err != nil {
		panic(err)
	}
	fmt.Println("contract", contract)

	num_tokenId, _ := strconv.Atoi(buyerObj.TokenID)
	ownerOf, err := contract.Call(context.Background(), "ownerOf", num_tokenId)
	if err != nil {
		panic(err)
	}
	fmt.Println("ownerOf", ownerOf)
	//0x61327612EC4aFD93e370eC0599f933bB08020A54 real owner
	fmt.Println("buyerObj.BuyerAddress", buyerObj.BuyerAddress)
	fmt.Println("num_tokenId", num_tokenId)

	//common.HexToAddress : common.Address 타입을 반환한다.
	//common.Address는 Ethereum 주소를 나타내는 구조체 20바이트 배열로 구성되고 0x로 시작함
	//common.Address를 문자열로 변환하려면 hexutil.Encode함수 사용이 가능함
	//hexutil.Encode함수는 []byte 인자를 받는다.

	//요청한 오너 어드레스를 common.Address 타입으로 변환
	address := common.HexToAddress(buyerObj.SellerAddress)
	fmt.Println("address", address)
	fmt.Println("type check", reflect.TypeOf(address))

	//토큰아이디의 주인과 요청받은 address가 같은 주소일 경우
	fmt.Println(reflect.TypeOf(buyerObj.SellerAddress))
	fmt.Println(reflect.TypeOf(ownerOf))
	if address == ownerOf {
		user := os.Getenv("user")
		password := os.Getenv("password")
		//db url 설정
		db_url := fmt.Sprintf("%s:%s@tcp(152.69.231.140:3306)/lift", user, password)
		db, _ := sql.Open("mysql", db_url)
		defer db.Close()
		fmt.Println("db test")
		stmt, err := db.Prepare("UPDATE nft set owner_address = ?  where id = ?")
		if err != nil {
			fmt.Println(err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}
		defer stmt.Close()

		// stmt, _ := db.Prepare("UPDATE nft  set ipfs_url = ?, owner_address =?  where  token_id = ?") db 수정 후 이 쿼리로 적용해야함
		_, err = stmt.Exec(buyerObj.BuyerAddress, num_tokenId)
		if err != nil {
			fmt.Println(err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}
		fmt.Println("stmt", stmt)

	}

	return c.String(http.StatusOK, "Congratulations on your purchase. Owner has changed ")
}

// TODO DB 날리고 업데이트하면 해당 함수 업데이트 필요
func (p *PostHandlers) UpdateMetaData(c echo.Context) error {
	lock.Lock()         //동시성 문제를 해결하기위한 mutex 값 설정
	defer lock.Unlock() //동시성 문제를 해결하기위한 mutex 값 해제

	var tokenObject tokenObj

	if err := c.Bind(&tokenObject); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	fmt.Println("tokenObject", &tokenObject)

	contractAddress := os.Getenv("WEATHERNFT")
	//accountAddress := os.Getenv("WALLET_ADDRESS")
	accountAddress := tokenObject.OwnerAddress
	fmt.Println("contractAddress", contractAddress)
	fmt.Println("accountAddress", accountAddress)

	sdk, err := thirdweb.NewThirdwebSDK("mumbai", &thirdweb.SDKOptions{
		PrivateKey: os.Getenv("PRIVATEKEY"),
	})
	if err != nil {
		panic(err)
	}

	contract, err := sdk.GetContractFromAbi(contractAddress, ABI2)
	if err != nil {
		panic(err)
	}
	fmt.Println("contract", contract)

	num_tokenId, _ := strconv.Atoi(tokenObject.TokenID)
	ownerOf, err := contract.Call(context.Background(), "ownerOf", num_tokenId)
	if err != nil {
		panic(err)
	}
	fmt.Println("ownerOf", ownerOf)
	//0x61327612EC4aFD93e370eC0599f933bB08020A54 real owner
	fmt.Println("tokenObject.OwnerAddress", tokenObject.OwnerAddress)
	fmt.Println(reflect.TypeOf(ownerOf))
	fmt.Println(reflect.TypeOf(tokenObject.OwnerAddress))
	//common.HexToAddress : common.Address 타입을 반환한다.
	//common.Address는 Ethereum 주소를 나타내는 구조체 20바이트 배열로 구성되고 0x로 시작함
	//common.Address를 문자열로 변환하려면 hexutil.Encode함수 사용이 가능함
	//hexutil.Encode함수는 []byte 인자를 받는다.

	//요청한 오너 어드레스를 common.Address 타입으로 변환
	address := common.HexToAddress(tokenObject.OwnerAddress)
	fmt.Println("address", address)
	fmt.Println("type check", reflect.TypeOf(address))

	//토큰아이디의 주인과 요청받은 address가 같은 주소일 경우
	results := make([]string, 0)
	if address == ownerOf {
		newTokenURI, err := contract.Call(context.Background(), "tokenURI", num_tokenId)
		if err != nil {
			panic(err)
		}

		user := os.Getenv("user")
		password := os.Getenv("password")
		//db url 설정
		db_url := fmt.Sprintf("%s:%s@tcp(152.69.231.140:3306)/lift", user, password)
		db, _ := sql.Open("mysql", db_url)
		defer db.Close()

		//before https://ipfs.thirdwebcdn.com/ipfs/QmbrnTEsM1XywtYXP3GLHW7jpCq233UiNc3vSemWH2h7D6/snow-chainlink.gif
		//after
		stmt, err := db.Prepare("UPDATE nft set ipfs_url = ?, owner_address = ? where id = ? ")
		if err != nil {
			fmt.Println(err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}
		defer stmt.Close()
		// stmt, _ := db.Prepare("UPDATE nft  set ipfs_url = ?, owner_address =?  where  token_id = ?") db 수정 후 이 쿼리로 적용해야함
		_, err = stmt.Exec(newTokenURI, tokenObject.OwnerAddress, num_tokenId)
		if err != nil {
			fmt.Println(err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}
		fmt.Println("stmt", stmt)
		results = append(results, newTokenURI.(string), tokenObject.OwnerAddress)

	}
	fmt.Println("results", results)
	//return c.String(http.StatusOK, "Update Metadata")
	return c.JSON(http.StatusOK, results)
}
