// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract LiFTs is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("LiFTs", "NFT") {}

    //urclass에 있는 기본 mint코드에서 일부 수정함. 
    //onlyOwner 제거, msg.sender를 recipient 기본값으로 설정  
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

    function testapprove(uint256 _tokenId) public view returns(address, address) {
        address a = ownerOf(_tokenId); 
        address b = _msgSender(); 
        return (a, b);
    }
}

