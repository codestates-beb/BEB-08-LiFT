package main

import (
	application "echo-dnft"
	"echo-dnft/config"
	"fmt"
)

func main() {
	cfg := config.NewConfig()
	fmt.Println("cfg", cfg)

	fmt.Println(config.Print)

	//docs.SwaggerInfo.Host = fmt.Sprintf("%s:%s", cfg.HTTP.Host, cfg.HTTP.ExposePort)

	application.Start(cfg)

}
