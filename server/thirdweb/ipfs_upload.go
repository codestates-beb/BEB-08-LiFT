package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/thirdweb-dev/go-sdk/v2/thirdweb"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	sdk, _ := thirdweb.NewThirdwebSDK(os.Getenv("NETWORK"), nil)

	dat, err := ioutil.ReadFile("/home/robertseo/work/codeProject3/BEB-08-final-01/server/cherry1.png")

	// metadata := map[string]interface{}{
	// 	"name":        "Test NFT",
	// 	"image":       "https://gateway.ipfscdn.io/ipfs/QmerEwUkicVJ1yAPh3R2joLGUEu8kum5XSVD6tadWTgetx/0",
	// 	"description": "yongari NFT TEST",
	// }

	metadata := map[string]interface{}{
		"name":        "Test NFT",
		"image":       "/home/robertseo/work/codeProject3/BEB-08-final-01/server/cherry1.png",
		"description": "yongari NFT TEST",
	}

	fmt.Println("metadata", metadata)
	fmt.Println("dat", dat)
	//uri, _ := sdk.Storage.Upload(context.Background(), dat, "", "")

	uri, _ := sdk.Storage.Upload(context.Background(), metadata, "", "")
	//resolveScheme
	fmt.Println("uri", uri)
}
