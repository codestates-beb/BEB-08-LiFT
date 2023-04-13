package handlers

import (
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
	address := os.Getenv(os.Getenv("ADDRESS"))
	nft, err := sdk.GetNFTCollection(address)
	fmt.Println(reflect.TypeOf(nft))
	fmt.Println("nft", nft)
	if err != nil {
		panic(err)
	}

	// nfts, err := nft.GetAll()
	// if err != nil {
	// 	panic(err)
	// }

	return c.JSON(http.StatusOK, nft)
	//return c.String(http.StatusOK, "Hello, World!")
	// return responses.MessageResponse(c, http.StatusCreated, "User successfully created")
}
