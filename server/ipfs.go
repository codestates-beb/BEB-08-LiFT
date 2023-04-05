package main

import (
	"fmt"
	"os"

	thirdweb "github.com/thirdwebio/go-thirdweb-sdk"
)

func main() {
	// Thirdweb Go SDK 초기화
	thirdweb.Init()

	// 파일 업로드
	filePath := "./example.txt"
	file, err := os.Open(filePath)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer file.Close()

	hash, err := thirdweb.UploadToIPFS(file)
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println("File uploaded successfully. Hash:", hash)
}
