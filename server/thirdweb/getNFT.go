package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/thirdweb-dev/go-sdk/v2/thirdweb"
)

type NFT struct {
	Name        string
	Description string
	TokenURI    string
}

// type ThirdwebSDK struct {
// 	*ProviderHandler
// 	Storage  IpfsStorage
// 	Deployer ContractDeployer
// 	Auth     WalletAuthenticator
// }

func getNFT() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	sdk, err := thirdweb.NewThirdwebSDK(os.Getenv("NETWORK"), nil)
	if err != nil {
		panic(err)
	}
	fmt.Println("sdk", sdk)

	//address := os.Args[1] //0x7684992428a8E5600C0510c48ba871311067d74c
	address := os.Getenv(os.Getenv("ADDRESS"))
	nft, err := sdk.GetNFTCollection(address)
	fmt.Println("nft", nft)
	if err != nil {
		panic(err)
	}

	// nfts, err := nft.GetAll()
	// if err != nil {
	// 	panic(err)
	// }

	// fmt.Println("nfts", nfts)
	// fmt.Println("length nfts", len(nfts))
	// if err != nil {
	// 	panic(err)
	// }

	fmt.Printf("%d NFTs found on this contract\n", nft)
}

func main() {
	getNFT()
}
