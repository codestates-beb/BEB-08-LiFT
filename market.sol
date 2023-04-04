// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract MyNFTs is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    ERC721 public erc721; 

    mapping(uint256 => uint256) public sale; 

    constructor() public ERC721("MyNFT", "NFT") {
        erc721 = ERC721(address(this)); 
    }

    function mintNFT(string memory tokenURI)
        public
        returns (uint256)
    {
        address recipient = msg.sender; 
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
 
        return newItemId;
    }

    function listNFT(uint256 _tokenId, uint256 _price) public {
        require(_price > 0, "Price must be greater than zero");
        require(msg.sender == ownerOf(_tokenId), "Caller is not  token owner!");
        require(sale[_tokenId] == 0, "This  token is already on sale");
        sale[_tokenId] = _price; 
        approve(address(this), _tokenId);  
    }

    function buyNFT(uint256 _tokenId) public payable {
        require(sale[_tokenId] != 0, "NFT is not for sale");
        uint256 price = sale[_tokenId] * 1000000000000000000; 
        require(msg.value == price, "Incorrect payment amount");
        delete sale[_tokenId];
        address seller = ownerOf(_tokenId); 
        erc721.safeTransferFrom(seller, msg.sender, _tokenId);
        payable(seller).transfer(address(this).balance);          
    }

    function removeList(uint256 _tokenId) public {
        require(msg.sender == ownerOf(_tokenId), "Only seller can remove list");
        delete sale[_tokenId];
        approve(address(0), _tokenId);
    }
}

