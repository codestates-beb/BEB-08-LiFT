package main

import (
	"encoding/json"
	"fmt"

	"github.com/thirdweb-dev/go-sdk/v2/thirdweb"
)

func main() {
	// Get your private key securely (preferably from an environment variable)
	privateKey := "..."

	// Instantiate the SDK with your privateKey
	sdk, err := thirdweb.NewThirdwebSDK("mumbai", &thirdweb.SDKOptions{
		PrivateKey: privateKey,
	})
	if err != nil {
		panic(err)
	}

	// Replace your contract address here
	address := "0x..."
	nft, err := sdk.GetNFTCollection(address)
	if err != nil {
		panic(err)
	}

	// Now you can execute transactions using the SDK contract functions
	tx, err := nft.Mint(
		&thirdweb.NFTMetadataInput{
			Name:        "Test NFT",
			Description: "Minted with the thirdweb Go SDK",
			Image:       "ipfs://QmcCJC4T37rykDjR6oorM8hpB9GQWHKWbAi2YR1uTabUZu/0",
		},
	)
	if err != nil {
		panic(err)
	}

	result, _ := json.Marshal(&tx)
	fmt.Println(string(result))
}
