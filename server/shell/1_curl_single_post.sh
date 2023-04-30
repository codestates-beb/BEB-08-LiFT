#!/bin/bash

curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{"name":"dynamicNFT", "description":"dynamicNFT test", "tokenuri":"https://gateway.ipfscdn.io/ipfs/QmerEwUkicVJ1yAPh3R2joLGUEu8kum5XSVD6tadWTgetx/0"}' \
   localhost:1323/nft



