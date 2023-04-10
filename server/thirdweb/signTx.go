package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/thirdweb-dev/go-sdk/thirdweb"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	// Get your private key securely (preferably from an environment variable)
	fmt.Println(os.Getenv("NETWORK"), os.Getenv("PRIVATEKEY"))
	privateKey := os.Getenv("PRIVATEKEY")

	// Instantiate the SDK with your privateKey
	sdk, err := thirdweb.NewThirdwebSDK(os.Getenv("NETWORK"), &thirdweb.SDKOptions{
		PrivateKey: privateKey,
	})
	if err != nil {
		panic(err)
	}

	// Replace your contract address here
	address := os.Getenv("ADDRESS")
	nft, err := sdk.GetNFTCollection(address)
	if err != nil {
		panic(err)
	}

	fmt.Println("nft", nft)
	//Now you can execute transactions using the SDK contract functions
	tx, err := nft.Mint(
		&thirdweb.NFTMetadataInput{
			Name:        "Test NFT",
			Description: "Minted with the thirdweb Go SDK",
			Image:       "ipfs://QmcCJC4T37rykDjR6oorM8hpB9GQWHKWbAi2YR1uTabUZu/0",
		},
	)

	fmt.Println("tx", tx)
	if err != nil {
		panic(err)
	}

	result, _ := json.Marshal(&tx)
	fmt.Println(string(result))
}
