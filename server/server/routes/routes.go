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
	//오토메이션 DNFT
	server.Echo.POST("/mnfts", postHandler.MultipleCreateNFT)
	//심플 DNFT
	server.Echo.POST("/snfts", postHandler.SimpleCreateNFT)
	//WEATHER DNFT API
	server.Echo.POST("/wdnfts", postHandler.WeatherDynamicNFT)
	//검색 API
	//server.Echo.POST("/search   ", postHandler.WeatherDynamicNFT)

}
