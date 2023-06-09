package application

import (
	"echo-dnft/config"
	"echo-dnft/server"
	"echo-dnft/server/routes"
	"log"
)

func Start(cfg *config.Config) {
	app := server.NewServer(cfg)
	// sdk, err := thirdweb.NewThirdwebSDK("mumbai", &thirdweb.SDKOptions{
	// 	PrivateKey: os.Getenv("PRIVATEKEY"),
	// })
	// if err != nil{
	// 	return err
	// }
	routes.ConfigureRoutes(app)

	err := app.Start(cfg.HTTP.Port)
	if err != nil {
		log.Fatal("Port already used")
	}
}
