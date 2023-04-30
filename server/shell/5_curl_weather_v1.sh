#!/bin/bash

curl --location --request POST 'http://localhost:1323/mnfts' \
--header 'Content-Type: application/json' \
--data-raw '{
    "sun": {
        "name": "sun ",
        "description": "sun description",
        "image": "https://gateway.ipfscdn.io/ipfs/QmaMqPXd1tFWwjBguW1WWWZ1vnq3YAb7XNpZw1xh9tSp2t/0",
        "attributes": [
            {
                "trait_type": "location name",
                "value": "서울"
            },
            {
                "trait_type": "latitude",
                "value": "37"
            },
            {
                "trait_type": "longitude",
                "value": "127"
            }
        ]
    },
    "rain": {
        "name": "rain",
        "description": "rain description",
        "image": "https://gateway.ipfscdn.io/ipfs/bafybeifsthtekd7aq6o4c4dfghokz2g7tc34ep4hb5jmfqadmt5ulvf6ue/0",
        "attributes": [
            {
                "trait_type": "location name",
                "value": "싱가폴"
            },
            {
                "trait_type": "latitude",
                "value": "1.28400"
            },
            {
                "trait_type": "longitude",
                "value": "103.85912"
            }
        ]
    },
    "cloud": {
        "name": "cloud",
        "description": "cloud description",
        "image": "https://gateway.ipfscdn.io/ipfs/QmUjjnRMbKrG5r8ttk47H5LdZScFfX3ciDaLWwtVzDCEay/0",
        "attributes": [
            {
                "trait_type": "location name",
                "value": "런던"
            },
            {
                "trait_type": "latitude",
                "value": "51.5072"
            },
            {
                "trait_type": "longitude",
                "value": "-0.1275"
            }
        ]
    },
    "snow": {
        "name": "snow",
        "description": "snow description",
        "image": "https://gateway.ipfscdn.io/ipfs/QmerEwUkicVJ1yAPh3R2joLGUEu8kum5XSVD6tadWTgetx/0",
        "attributes": [
            {
                "trait_type": "location name",
                "value": "뉴욕"
            },
            {
                "trait_type": "latitude",
                "value": "40.75805"
            },
            {
                "trait_type": "longitude",
                "value": "-73.98557"
            }
        ]
    }
}'
