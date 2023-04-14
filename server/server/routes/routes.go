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

	server.Echo.GET("/get", getHandler.GetHandle)
	server.Echo.POST("/mnfts", postHandler.MultipleCreateNFT)
	server.Echo.POST("/snfts", postHandler.SimpleCreateNFT)

}
