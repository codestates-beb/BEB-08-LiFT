curl --location --request POST 'localhost:1323/mnfts' \
--header 'Content-Type: application/json' \
--data-raw '{
    "array": [
        {
            "name": "dynamicNFT",
            "description": "dynamicNFT test",
            "tokenuri": "https://gateway.ipfscdn.io/ipfs/QmerEwUkicVJ1yAPh3R2joLGUEu8kum5XSVD6tadWTgetx/0"
        },
        {
            "name": "Second dynamic NFT2",
            "description": "second NFT test",
            "tokenuri": "https://gateway.ipfscdn.io/ipfs/QmUjjnRMbKrG5r8ttk47H5LdZScFfX3ciDaLWwtVzDCEay/0"
        },
        {
            "name": "Third  dynamic NFT3",
            "description": "third NFT test",
            "tokenuri": "https://gateway.ipfscdn.io/ipfs/QmaMqPXd1tFWwjBguW1WWWZ1vnq3YAb7XNpZw1xh9tSp2t/0"
        }
    ]
}'
