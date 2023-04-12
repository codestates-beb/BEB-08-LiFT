package main

import (
	"fmt"
	"os"
	"path/filepath"

	shell "github.com/ipfs/go-ipfs-api"
)

func main() {
	// Create an IPFS API instance
	sh := shell.NewShell("localhost:5001")

	// Create a new IPFS directory
	dir, err := sh.NewObject("unixfs-dir")
	fmt.Println("dir", dir)
	if err != nil {
		panic(err)
	}

	// Walk through the directory and add each file to IPFS
	err = filepath.Walk("/home/robertseo/work/codeProject3/BEB-08-final-01/server/nft-json", func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.Mode().IsRegular() {
			return nil
		}

		file, err := os.Open(path)
		if err != nil {
			return err
		}

		// Add the file to IPFS
		cid, err := sh.Add(file)
		if err != nil {
			return err
		}

		// Add the file to the IPFS directory
		_, err = sh.PatchLink(dir, info.Name(), cid, true)
		if err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		panic(err)
	}

	// Print the CID of the IPFS directory
	fmt.Printf("CID of the IPFS directory: %s\n", dir)
}
