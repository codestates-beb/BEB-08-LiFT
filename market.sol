// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract MyNFTs is ERC721URIStorage, Ownable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    ERC721 public erc721; 

    mapping(uint256 => uint256) public sale; 

    constructor() public ERC721("MyNFT", "NFT") {
        erc721 = ERC721(address(this)); 
    }

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

    // 판매 리스트 등록 함수 
    function listNFT(uint256 _tokenId, uint256 _price) public {
        require(_price > 0, "Price must be greater than zero");
        require(msg.sender == ownerOf(_tokenId), "Caller is not  token owner!");
        require(sale[_tokenId] == 0, "This token is already on sale");
        sale[_tokenId] = _price; 
        approve(address(this), _tokenId); //컨트랙트에게 apporve 권한 부여   
    }

    function buyNFT(uint256 _tokenId) public payable {
        require(sale[_tokenId] != 0, "NFT is not for sale");
        uint256 price = sale[_tokenId]; //msg.value는 wei 단위여서 eth단위로 환산하기 위한 계산
        require(msg.value.div(1 ether) == price, "Incorrect payment amount");
        delete sale[_tokenId];
        address seller = ownerOf(_tokenId); 
        erc721.safeTransferFrom(seller, msg.sender, _tokenId); //컨트랙트 approve권한으로 safeTransferFrom함수 호출, safeTransferFrom함수 호출 시 approve 초기화 
        payable(seller).transfer(address(this).balance); //컨트랙트에 들어온 이더를 매도자에게 즉시 전달          
    }

    function removeList(uint256 _tokenId) public {
        require(msg.sender == ownerOf(_tokenId), "Only seller can remove list");
        delete sale[_tokenId]; 
        approve(address(0), _tokenId); // 판매 리스트 제거 시 approve권한 초기화
    }
}

