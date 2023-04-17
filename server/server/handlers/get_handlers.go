package handlers

import (
	"context"
	s "echo-dnft/server"
	"fmt"
	"net/http"
	"os"
	"reflect"

	"github.com/labstack/echo/v4"
	"github.com/thirdweb-dev/go-sdk/thirdweb"
)

type GetHandler struct {
	server *s.Server
}

func NewGetHandler(server *s.Server) *GetHandler {
	return &GetHandler{server: server}
}

func (g *GetHandler) GetHandle(c echo.Context) error {
	fmt.Println("test")
	sdk, err := thirdweb.NewThirdwebSDK(os.Getenv("NETWORK"), nil)
	if err != nil {
		panic(err)
	}
	fmt.Println("sdk", sdk)
	address := os.Getenv(os.Getenv("LOCATIONMANAGER"))
	fmt.Println("address", address)
	nft, err := sdk.GetNFTCollection(address)

	fmt.Println(reflect.TypeOf(nft))
	fmt.Println("nft", nft)

	if err != nil {
		panic(err)
	}

	nfts, err := nft.GetAll(context.Background())
	if err != nil {
		panic(err)
	}

	fmt.Println("nfts", nfts)
	return c.JSON(http.StatusOK, nfts)

}

func (g *GetHandler) GetMyPage(c echo.Context) error {
	fmt.Println("test")
	sdk, err := thirdweb.NewThirdwebSDK(os.Getenv("NETWORK"), nil)
	if err != nil {
		panic(err)
	}
	address := os.Getenv(os.Getenv("ADDRESS"))
	nft, err := sdk.GetNFTCollection(address)
	fmt.Println(reflect.TypeOf(nft))
	fmt.Println("nft", nft)
	if err != nil {
		panic(err)
	}
	// nfts, err := nft.GetAll(context.Background())
	// if err != nil {
	// 	panic(err)
	// }
	// fmt.Println("nfts", nfts)
	return c.JSON(http.StatusOK, nft)

}
