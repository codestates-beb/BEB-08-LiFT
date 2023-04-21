package routes

import (
	s "echo-dnft/server"
	"echo-dnft/server/handlers"

	"github.com/labstack/echo/v4/middleware"
)

func ConfigureRoutes(server *s.Server) {
	postHandler := handlers.NewPostHandlers(server)
	getHandler := handlers.NewGetHandler(server)

	server.Echo.Use(middleware.Logger())
	server.Echo.Use(middleware.Recover())
	server.Echo.Use(middleware.CORS())

	//Main Api
	server.Echo.GET("/", getHandler.GetMainPage)

	//Location Api
	server.Echo.GET("/location", getHandler.GetMyWeather)

	//MyPage Api
	server.Echo.GET("/mypage", getHandler.GetMyPage)

	//NFT Detail Page Api
	server.Echo.GET("/detail/:num", getHandler.GetDetail)

	//검색 API
	server.Echo.GET("/search", getHandler.Search)

	//MyPage Edit Api
	server.Echo.POST("/mypage/edit", postHandler.UpdateMyPage)

	//Automation DNFT
	server.Echo.POST("/mnfts", postHandler.MultipleCreateNFT)

	//WEATHER DNFT API
	server.Echo.POST("/wdnfts", postHandler.WeatherDynamicNFT)

	//Simple DNFT
	server.Echo.POST("/snfts", postHandler.SimpleCreateNFT)

	//MetaData Update
	server.Echo.POST("/metadata", postHandler.UpdateMetaData)

}
