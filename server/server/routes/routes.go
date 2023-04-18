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

	server.Echo.GET("/main", getHandler.GetHandle)
	server.Echo.GET("/location", getHandler.GetMyWeather)
	server.Echo.GET("/mypage", getHandler.GetMyPage)
	server.Echo.POST("/mnfts", postHandler.MultipleCreateNFT)
	server.Echo.POST("/snfts", postHandler.SimpleCreateNFT)
	server.Echo.POST("/dnfts", postHandler.DefaultCreateNFT)
	// server.Echo.POST("/unmar", postHandler.UnmarshalParam)

}