package server

import (
	"echo-dnft/config"

	"github.com/labstack/echo/v4"
)

type Server struct {
	Echo *echo.Echo
	// DB     *gorm.DB
	Config *config.Config
}

func NewServer(cfg *config.Config) *Server {
	return &Server{
		Echo: echo.New(),
		// DB:     db.Init(cfg),
		Config: cfg,
	}
}

func (server *Server) Start(addr string) error {
	return server.Echo.Start(":" + addr)
}
