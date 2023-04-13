package main

import (
	"context"
	"fmt"

	"github.com/ipfs/go-ipfs/core"
	"github.com/ipfs/go-ipfs/core/coreapi"
	"github.com/ipfs/go-ipfs/core/coreunix"
	"github.com/ipfs/go-ipfs/plugin/loader"
	"github.com/ipfs/go-ipfs/repo/fsrepo"
)

func main() {
	// Create a new IPFS node
	cfg, err := loadConfig()
	if err != nil {
		panic(err)
	}
	node, err := core.NewNode(context.Background(), &core.BuildCfg{
		Repo:   fsrepo.New(cfg.Repo),
		Online: true,
	})
	if err != nil {
		panic(err)
	}

	// Load plugins
	if err := loader.PluginLoader(node.Plugins(), ""); err != nil {
		panic(err)
	}

	// Get the core API
	api, err := coreapi.NewCoreAPI(node)
	if err != nil {
		panic(err)
	}

	// Add the files in the folder to IPFS
	folderPath := "/home/robertseo/work/codeProject3/BEB-08-final-01/server/nft-json"
	//GO 언어를 사용하여 폴더의 모든 파일을 https://gateway.ipfscdn.io/ 에서 IPFS 게이트웨이에 업로드하려면 go-ipfs 패키지의 coreunix.Add 함수를 사용하여 파일과 디렉터리를 IPFS에 추가할 수 있습니다
	cid, err := coreunix.Add(node, folderPath)
	fmt.Println("cid", cid)
	if err != nil {
		panic(err)
	}

	// Publish the files to the IPFS gateway
	//파일이 IPFS에 추가되면 api.Name().Publish 함수가 호출되어 파일을 IPFS 게이트웨이에 게시합니다.
	err = api.Name().Publish(context.Background(), cid, coreapi.NameOpts{
		AllowOffline:   true,
		Resolve:        false,
		StreamChannels: true,
		IPFSPath:       true,
	})
	if err != nil {
		panic(err)
	}

	// Print the URL of the published files
	fmt.Printf("Published files to: https://gateway.ipfscdn.io/ipfs/%s\n", cid.String())

	// Shutdown the IPFS node
	if err := node.Close(); err != nil {
		panic(err)
	}
}

func loadConfig() (*core.BuildCfg, error) {
	// TODO: Replace with your custom IPFS config
	cfg := &core.BuildCfg{
		Repo:   "/path/to/repo",
		Online: true,
	}

	return cfg, nil
}
