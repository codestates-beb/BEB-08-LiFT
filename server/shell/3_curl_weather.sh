#!/bin/bash

#curl --location --request POST 'http://localhost:1323/mnfts' \

curl --location --request POST 'http://152.69.231.140:1323/mnfts' \
--header 'Content-Type: application/json' \
--data-raw '{
    "sunny": {
    "name": "sunny",
    "description": "sunny description",
    "image": "https://gateway.ipfscdn.io/ipfs/QmaMqPXd1tFWwjBguW1WWWZ1vnq3YAb7XNpZw1xh9tSp2t/0"
},
"cloud": {
    "name": "cloud",
    "description": "cloud description",
    "image": "https://gateway.ipfscdn.io/ipfs/bafybeifsthtekd7aq6o4c4dfghokz2g7tc34ep4hb5jmfqadmt5ulvf6ue/0"
},
"rain": {
    "name": "rain",
    "description": "rain description",
    "image": "https://gateway.ipfscdn.io/ipfs/QmUjjnRMbKrG5r8ttk47H5LdZScFfX3ciDaLWwtVzDCEay/0"
},
"snow": {
    "name": "snow",
    "description": "snow description",
    "image": "https://gateway.ipfscdn.io/ipfs/QmerEwUkicVJ1yAPh3R2joLGUEu8kum5XSVD6tadWTgetx/0"
}
}'


