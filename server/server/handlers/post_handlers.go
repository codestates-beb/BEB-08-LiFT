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
type Abi []struct {
	Inputs []struct {
		InternalType string `json:"internalType"`
		Name         string `json:"name"`
		Type         string `json:"type"`
	} `json:"inputs"`
	StateMutability string `json:"stateMutability"`
	Type            string `json:"type"`
}

// 변수 설정
var (
	//Mutex 동시실행 방지하는 변수
	lock = sync.Mutex{}
)

func (p *PostHandlers) MultipleCreateNFT(c echo.Context) error {
	lock.Lock()
	defer lock.Unlock()
	var data map[string]MNFT

	if err := c.Bind(&data); err != nil {
		return err
	}
	// fmt.Printf("data :%s\n", data)

	type result struct {
		value map[string]interface{}
		err   error
	}

	metadataSlice := make([]string, len(data))

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
		fmt.Println("metadata", metadata)

		sdk, _ := thirdweb.NewThirdwebSDK(os.Getenv("NETWORK"), nil)
		uri, _ := sdk.Storage.Upload(metadata, "", "")
		removeUri := strings.Replace(uri, "ipfs://", "", 1)
		newMetaDataUri := "https://gateway.ipfscdn.io/ipfs/" + removeUri
		fmt.Println("typeCheck", reflect.TypeOf(newMetaDataUri))
		fmt.Println("newMetaDataUri", newMetaDataUri)

		metadataSlice = append(metadataSlice, newMetaDataUri)

	}

	fmt.Println("metadataSlice", metadataSlice)

	contractAddress := os.Getenv("CONTRACTS")
	fmt.Println("contractAddress", contractAddress)

	abi := `[
	  {
	    "inputs": [
	      {
	        "internalType": "uint256",
	        "name": "_interval",
	        "type": "uint256"
	      }
	    ],
	    "stateMutability": "nonpayable",
	    "type": "constructor"
	  },
	  {
	    "anonymous": false,
	    "inputs": [
	      {
	        "indexed": true,
	        "internalType": "address",
	        "name": "owner",
	        "type": "address"
	      },
	      {
	        "indexed": true,
	        "internalType": "address",
	        "name": "approved",
	        "type": "address"
	      },
	      {
	        "indexed": true,
	        "internalType": "uint256",
	        "name": "tokenId",
	        "type": "uint256"
	      }
	    ],
	    "name": "Approval",
	    "type": "event"
	  },
	  {
	    "anonymous": false,
	    "inputs": [
	      {
	        "indexed": true,
	        "internalType": "address",
	        "name": "owner",
	        "type": "address"
	      },
	      {
	        "indexed": true,
	        "internalType": "address",
	        "name": "operator",
	        "type": "address"
	      },
	      {
	        "indexed": false,
	        "internalType": "bool",
	        "name": "approved",
	        "type": "bool"
	      }
	    ],
	    "name": "ApprovalForAll",
	    "type": "event"
	  },
	  {
	    "inputs": [
	      {
	        "internalType": "address",
	        "name": "to",
	        "type": "address"
	      },
	      {
	        "internalType": "uint256",
	        "name": "tokenId",
	        "type": "uint256"
	      }
	    ],
	    "name": "approve",
	    "outputs": [],
	    "stateMutability": "nonpayable",
	    "type": "function"
	  },
	  {
	    "inputs": [
	      {
	        "internalType": "uint256",
	        "name": "_tokenId",
	        "type": "uint256"
	      }
	    ],
	    "name": "growFlower",
	    "outputs": [],
	    "stateMutability": "nonpayable",
	    "type": "function"
	  },
	  {
	    "inputs": [
	      {
	        "internalType": "bytes",
	        "name": "",
	        "type": "bytes"
	      }
	    ],
	    "name": "performUpkeep",
	    "outputs": [],
	    "stateMutability": "nonpayable",
	    "type": "function"
	  },
	  {
	    "inputs": [
	      {
	        "internalType": "address",
	        "name": "to",
	        "type": "address"
	      }
	    ],
	    "name": "safeMint",
	    "outputs": [],
	    "stateMutability": "nonpayable",
	    "type": "function"
	  },
	  {
	    "inputs": [
	      {
	        "internalType": "address",
	        "name": "from",
	        "type": "address"
	      },
	      {
	        "internalType": "address",
	        "name": "to",
	        "type": "address"
	      },
	      {
	        "internalType": "uint256",
	        "name": "tokenId",
	        "type": "uint256"
	      }
	    ],
	    "name": "safeTransferFrom",
	    "outputs": [],
	    "stateMutability": "nonpayable",
	    "type": "function"
	  },
	  {
	    "inputs": [
	      {
	        "internalType": "address",
	        "name": "from",
	        "type": "address"
	      },
	      {
	        "internalType": "address",
	        "name": "to",
	        "type": "address"
	      },
	      {
	        "internalType": "uint256",
	        "name": "tokenId",
	        "type": "uint256"
	      },
	      {
	        "internalType": "bytes",
	        "name": "data",
	        "type": "bytes"
	      }
	    ],
	    "name": "safeTransferFrom",
	    "outputs": [],
	    "stateMutability": "nonpayable",
	    "type": "function"
	  },
	  {
	    "inputs": [
	      {
	        "internalType": "address",
	        "name": "operator",
	        "type": "address"
	      },
	      {
	        "internalType": "bool",
	        "name": "approved",
	        "type": "bool"
	      }
	    ],
	    "name": "setApprovalForAll",
	    "outputs": [],
	    "stateMutability": "nonpayable",
	    "type": "function"
	  },
	  {
	    "inputs": [
	      {
	        "internalType": "string[]",
	        "name": "_uri",
	        "type": "string[]"
	      }
	    ],
	    "name": "setIpfsUri",
	    "outputs": [],
	    "stateMutability": "nonpayable",
	    "type": "function"
	  },
	  {
	    "anonymous": false,
	    "inputs": [
	      {
	        "indexed": true,
	        "internalType": "address",
	        "name": "from",
	        "type": "address"
	      },
	      {
	        "indexed": true,
	        "internalType": "address",
	        "name": "to",
	        "type": "address"
	      },
	      {
	        "indexed": true,
	        "internalType": "uint256",
	        "name": "tokenId",
	        "type": "uint256"
	      }
	    ],
	    "name": "Transfer",
	    "type": "event"
	  },
	  {
	    "inputs": [
	      {
	        "internalType": "address",
	        "name": "from",
	        "type": "address"
	      },
	      {
	        "internalType": "address",
	        "name": "to",
	        "type": "address"
	      },
	      {
	        "internalType": "uint256",
	        "name": "tokenId",
	        "type": "uint256"
	      }
	    ],
	    "name": "transferFrom",
	    "outputs": [],
	    "stateMutability": "nonpayable",
	    "type": "function"
	  },
	  {
	    "inputs": [
	      {
	        "internalType": "address",
	        "name": "owner",
	        "type": "address"
	      }
	    ],
	    "name": "balanceOf",
	    "outputs": [
	      {
	        "internalType": "uint256",
	        "name": "",
	        "type": "uint256"
	      }
	    ],
	    "stateMutability": "view",
	    "type": "function"
	  },
	  {
	    "inputs": [
	      {
	        "internalType": "bytes",
	        "name": "",
	        "type": "bytes"
	      }
	    ],
	    "name": "checkUpkeep",
	    "outputs": [
	      {
	        "internalType": "bool",
	        "name": "upkeepNeeded",
	        "type": "bool"
	      },
	      {
	        "internalType": "bytes",
	        "name": "",
	        "type": "bytes"
	      }
	    ],
	    "stateMutability": "view",
	    "type": "function"
	  },
	  {
	    "inputs": [
	      {
	        "internalType": "uint256",
	        "name": "_tokenId",
	        "type": "uint256"
	      }
	    ],
	    "name": "flowerStage",
	    "outputs": [
	      {
	        "internalType": "uint256",
	        "name": "",
	        "type": "uint256"
	      }
	    ],
	    "stateMutability": "view",
	    "type": "function"
	  },
	  {
	    "inputs": [
	      {
	        "internalType": "uint256",
	        "name": "tokenId",
	        "type": "uint256"
	      }
	    ],
	    "name": "getApproved",
	    "outputs": [
	      {
	        "internalType": "address",
	        "name": "",
	        "type": "address"
	      }
	    ],
	    "stateMutability": "view",
	    "type": "function"
	  },
	  {
	    "inputs": [],
	    "name": "getIpfsUri",
	    "outputs": [
	      {
	        "internalType": "string[]",
	        "name": "",
	        "type": "string[]"
	      }
	    ],
	    "stateMutability": "view",
	    "type": "function"
	  },
	  {
	    "inputs": [
	      {
	        "internalType": "address",
	        "name": "owner",
	        "type": "address"
	      },
	      {
	        "internalType": "address",
	        "name": "operator",
	        "type": "address"
	      }
	    ],
	    "name": "isApprovedForAll",
	    "outputs": [
	      {
	        "internalType": "bool",
	        "name": "",
	        "type": "bool"
	      }
	    ],
	    "stateMutability": "view",
	    "type": "function"
	  },
	  {
	    "inputs": [],
	    "name": "name",
	    "outputs": [
	      {
	        "internalType": "string",
	        "name": "",
	        "type": "string"
	      }
	    ],
	    "stateMutability": "view",
	    "type": "function"
	  },
	  {
	    "inputs": [
	      {
	        "internalType": "uint256",
	        "name": "tokenId",
	        "type": "uint256"
	      }
	    ],
	    "name": "ownerOf",
	    "outputs": [
	      {
	        "internalType": "address",
	        "name": "",
	        "type": "address"
	      }
	    ],
	    "stateMutability": "view",
	    "type": "function"
	  },
	  {
	    "inputs": [
	      {
	        "internalType": "bytes4",
	        "name": "interfaceId",
	        "type": "bytes4"
	      }
	    ],
	    "name": "supportsInterface",
	    "outputs": [
	      {
	        "internalType": "bool",
	        "name": "",
	        "type": "bool"
	      }
	    ],
	    "stateMutability": "view",
	    "type": "function"
	  },
	  {
	    "inputs": [],
	    "name": "symbol",
	    "outputs": [
	      {
	        "internalType": "string",
	        "name": "",
	        "type": "string"
	      }
	    ],
	    "stateMutability": "view",
	    "type": "function"
	  },
	  {
	    "inputs": [
	      {
	        "internalType": "uint256",
	        "name": "tokenId",
	        "type": "uint256"
	      }
	    ],
	    "name": "tokenURI",
	    "outputs": [
	      {
	        "internalType": "string",
	        "name": "",
	        "type": "string"
	      }
	    ],
	    "stateMutability": "view",
	    "type": "function"
	  }
	]
	`

	sdk, err := thirdweb.NewThirdwebSDK("mumbai", &thirdweb.SDKOptions{
		PrivateKey: os.Getenv("PRIVATEKEY"),
	})
	if err != nil {
		panic(err)
	}

	contract, err := sdk.GetContractFromAbi(contractAddress, abi)
	fmt.Println("contract", contract)
	balance, err := contract.Call(context.Background(), "balanceOf", "0x7684992428a8E5600C0510c48ba871311067d74c")
	fmt.Println("balance", balance)
	metadataBytes := []byte(strings.Join(metadataSlice, "\n"))

	return c.JSONBlob(http.StatusOK, metadataBytes)

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
