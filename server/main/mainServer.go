package main

import (
	application "echo-dnft"
	"echo-dnft/config"
	"fmt"
	"io"
	"log"
	"os"
	"testing"
)

func Test_Multiple_Outputs(t *testing.T) {
	logFile, err := os.OpenFile("logfile.txt", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		panic(err)
	}
	defer logFile.Close()

	multiWriter := io.MultiWriter(logFile, os.Stdout)
	log.SetOutput(multiWriter)

	printMsgLog("test msg")
	log.Println("End of Program")
}
func printMsgLog(msg string) {
	log.Print(msg)
}

func main() {
	cfg := config.NewConfig()
	fmt.Println("cfg", cfg)

	//docs.SwaggerInfo.Host = fmt.Sprintf("%s:%s", cfg.HTTP.Host, cfg.HTTP.ExposePort)

	application.Start(cfg)

}
