package main

import (
	"context"
	"fmt"
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

	metadata := map[string]interface{}{
		"name":        "Test NFT",
		"image":       "https://gateway.ipfscdn.io/ipfs/QmerEwUkicVJ1yAPh3R2joLGUEu8kum5XSVD6tadWTgetx/0",
		"description": "yongari NFT TEST",
	}
	uri, _ := sdk.Storage.Upload(context.Background(), metadata, "", "")
	fmt.Println("uri", uri)
}

//mypage db schema
//nft db schema

