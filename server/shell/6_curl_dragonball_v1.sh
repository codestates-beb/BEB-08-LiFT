#!/bin/bash

curl --location --request POST 'http://localhost:1323/mnfts' \
--header 'Content-Type: application/json' \
--data-raw '{
    "sun": {
        "name": "sun ",
        "description": "sun description",
        "image": "ipfs://QmSK8392GF11ZJ3vnpLiSvx1ciE7B5d7UT27ctkLwNa79x/goku1.png",
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
        "image": "ipfs://QmSK8392GF11ZJ3vnpLiSvx1ciE7B5d7UT27ctkLwNa79x/goku2.png",
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
        "image": "ipfs://QmSK8392GF11ZJ3vnpLiSvx1ciE7B5d7UT27ctkLwNa79x/goku3.png",
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
        "image": "ipfs://QmSK8392GF11ZJ3vnpLiSvx1ciE7B5d7UT27ctkLwNa79x/goku4.png",
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
