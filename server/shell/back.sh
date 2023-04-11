#!/bin/bash
#data='[
#    {"name":"First  dynamic NFT1", "description":"first NFT test", "tokenuri":"https://gateway.ipfscdn.io/ipfs/QmerEwUkicVJ1yAPh3R2joLGUEu8kum5XSVD6tadWTgetx/0"},
#    {"name":"Second dynamic NFT2", "description":"second NFT test", "tokenuri":"https://gateway.ipfscdn.io/ipfs/QmUjjnRMbKrG5r8ttk47H5LdZScFfX3ciDaLWwtVzDCEay/0"},
#    {"name":"Third  dynamic NFT3", "description":"third NFT test", "tokenuri":"https://gateway.ipfscdn.io/ipfs/QmaMqPXd1tFWwjBguW1WWWZ1vnq3YAb7XNpZw1xh9tSp2t/0"},
#]'

# {"name":"dynamicNFT", "description":"dynamicNFT test", "tokenuri":"https://gateway.ipfscdn.io/ipfs/QmerEwUkicVJ1yAPh3R2joLGUEu8kum5XSVD6tadWTgetx/0"}'

# curl --user "caspyin" --data '{"description":"Created via API","public":"true","files":{"file1.txt":{"content":"Demo"}}' https://api.github.com/gists
#curl -X POST \
#  -H 'Content-Type: application/json' \
#  -d "${data}" \
#	localhost:1323/nft

# curl --user "caspyin" --data '{"files":{"file1.txt":{"name":"First  dynamic NFT1", "description":"first NFT test",  "tokenuri":"https://gateway.ipfscdn.io/ipfs/QmerEwUkicVJ1yAPh3R2joLGUEu8kum5XSVD6tadWTgetx/0"} } }' https://api.github.com/gists


data {"files":{"file1.txt":{"name":"First  dynamic NFT1", "description":"first NFT test",  "tokenuri":"https://gateway.ipfscdn.io/ipfs/QmerEwUkicVJ1yAPh3R2joLGUEu8kum5XSVD6tadWTgetx/0"} } }

# data='[
#     { "json": {
# 							"1": { "name":"First  dynamic NFT1", "description":"first NFT test",  "tokenuri":"https://gateway.ipfscdn.io/ipfs/QmerEwUkicVJ1yAPh3R2joLGUEu8kum5XSVD6tadWTgetx/0"}, 
# 							"2": { "name":"Second dynamic NFT2", "description":"second NFT test", "tokenuri":"https://gateway.ipfscdn.io/ipfs/QmUjjnRMbKrG5r8ttk47H5LdZScFfX3ciDaLWwtVzDCEay/0"},
# 							"3": { "name":"Third  dynamic NFT3", "description":"third NFT test",  "tokenuri":"https://gateway.ipfscdn.io/ipfs/QmaMqPXd1tFWwjBguW1WWWZ1vnq3YAb7XNpZw1xh9tSp2t/0"},
# 							}
# 		}
# ]'
		


curl -X POST \
  -H 'Content-Type: application/json' \
  -d "${data}" \
	localhost:1323/mnfts


echo ${data}

