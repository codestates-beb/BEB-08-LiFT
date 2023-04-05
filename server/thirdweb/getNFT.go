package main

import (
	"fmt"
	"os"

	"github.com/thirdweb-dev/go-sdk/v2/thirdweb"
)

type NFT struct {
	Name        string
	Description string
	TokenURI    string
}

func getNFT() {

	sdk, err := thirdweb.NewThirdwebSDK("mumbai", nil)
	if err != nil {
		panic(err)
	}
	fmt.Println("sdk", sdk)

	address := os.Args[1] //0x7684992428a8E5600C0510c48ba871311067d74c
	nft, err := sdk.GetNFTCollection(address)
	fmt.Println("nft", nft)
	if err != nil {
		panic(err)
	}

	//nfts, err := nft.GetAll()
	//fmt.Println("nfts", nfts)
	if err != nil {
		panic(err)
	}

	fmt.Printf("%d NFTs found on this contract\n", nft)
}

func main() {
	getNFT()
}
