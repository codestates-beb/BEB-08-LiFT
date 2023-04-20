// remixd -s /Users/gubeomlee/Desktop/beb/project3/BEB-08-LiFT --remix-ide https://remix.ethereum.org

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface erc721Interface {
    function ownerOf(uint256 tokenId) external view returns (address); 
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
}

contract MarketPlace is Ownable {
    // nft판매 경로를 추적하기 위한 event
    event SaleNFT(address from, uint256 tokenId, uint256 price); 
    event BuyNFT(address from, address to, uint tokenId, uint256 price);
    event RemoveSale(address from, uint256 tokenId); 

    using SafeMath for uint256;

    uint256 tradingFee = 0;
    uint256 public saleId = 0;   

    mapping(uint256 => uint256) public sale;
    mapping(uint256 => uint256) public saleIdToTokenId; 

    erc721Interface erc721; //Interface

    //mint.sol 배포 후 market.sol배포 
    //mint.sol MyNFT의 컨트랙트 주소를 입력하면 두 컨트랙트가 연결된다.
    function setInterface(address _contractAddress) public onlyOwner returns(bool) {
        require(_contractAddress != address(0x0));
        erc721 = erc721Interface(_contractAddress);
        return true;  
    } 
 
    // 판매 등록 함수 
    function saleNFT(uint256 _tokenId, uint256 _price) public {
        require(_price > 0, "Price must be greater than zero");
        require(msg.sender == erc721.ownerOf(_tokenId), "Caller is not  token owner!");
        require(sale[_tokenId] == 0, "This token is already on sale");
        sale[_tokenId] = _price;
        //컨트랙트에게 apporve 권한 부여하는 것은 mint contract에서 실행한다.
        if(saleIdToTokenId[_tokenId] == 0){
            saleId++; 
            saleIdToTokenId[_tokenId] = saleId; 
        }
        emit SaleNFT(msg.sender, _tokenId, _price);    
    }
    
    function buyNFT(uint256 _tokenId) public payable {
        require(sale[_tokenId] != 0, "NFT is not for sale");
        uint256 price = sale[_tokenId]; //msg.value는 wei 단위여서 eth단위로 환산하기 위한 계산
        require(msg.value == price, "Incorrect payment amount");
        address seller = erc721.ownerOf(_tokenId); 
        erc721.safeTransferFrom(seller, msg.sender, _tokenId); //컨트랙트 approve권한으로 safeTransferFrom함수 호출, safeTransferFrom함수 호출 시 approve 초기화 
        payable(seller).transfer(msg.value * (100 - tradingFee) / 100); //컨트랙트에 들어온 이더를 매도자에게 즉시 전달
        delete sale[_tokenId];
        emit BuyNFT(seller, msg.sender, _tokenId, price);          
    }

    // removeSale 함수의 기능중 approve 기능은 mint contract의 approve함수를 통해 실행한다. 
    function removeSale(uint256 _tokenId) public {
        require(msg.sender == erc721.ownerOf(_tokenId), "Only seller can remove list");
        delete sale[_tokenId]; 
        // 판매 리스트 제거 시 approve권한 초기화
        emit RemoveSale(msg.sender, _tokenId);
    }

    function setTradingFee(uint256 _tradingFee) public onlyOwner {
        tradingFee = _tradingFee;
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance); 
    }
}