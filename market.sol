// remixd -s /Users/gubeomlee/Desktop/beb/project3/BEB-08-LiFT --remix-ide https://remix.ethereum.org

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./mint.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface LiFTsInterface {
    function ownerOf(uint256 tokenId) external view returns (address); 
    function approve(address to, uint256 tokenId) external;
    function testapprove(uint256 _tokenId) external view returns(address, address);
}

contract MarketPlace is Ownable {
    using SafeMath for uint256;

    mapping(uint256 => uint256) public sale;

    LiFTsInterface LiFT; //Interface
    LiFTs public marketAddress; //컨트랙트 주소를 담을 주소 선언
    constructor() {
        marketAddress = LiFTs(address(this)); 
    }

    //mint.sol 배포 후 market.sol배포 
    //mint.sol MyNFT의 컨트랙트 주소를 입력하면 두 컨트랙트가 연결된다.
    function setInterface(address _contractAddress) public onlyOwner returns(bool) {
        require(_contractAddress != address(0x0));
        LiFT = LiFTsInterface(_contractAddress);
        return true;  
    } 

    // 판매 리스트 등록 함수 
    function saleNFT(uint256 _tokenId, uint256 _price) public {
        require(_price > 0, "Price must be greater than zero");
        require(msg.sender == LiFT.ownerOf(_tokenId), "Caller is not  token owner!");
        require(sale[_tokenId] == 0, "This token is already on sale");
        sale[_tokenId] = _price;
        LiFT.approve(address(this), _tokenId); //컨트랙트에게 apporve 권한 부여   
    }

    function buyNFT(uint256 _tokenId) public payable {
        require(sale[_tokenId] != 0, "NFT is not for sale");
        uint256 price = sale[_tokenId]; //msg.value는 wei 단위여서 eth단위로 환산하기 위한 계산
        require(msg.value.div(1 ether) == price, "Incorrect payment amount");
        delete sale[_tokenId];
        address seller = LiFT.ownerOf(_tokenId); 
        marketAddress.safeTransferFrom(seller, msg.sender, _tokenId); //컨트랙트 approve권한으로 safeTransferFrom함수 호출, safeTransferFrom함수 호출 시 approve 초기화 
        payable(seller).transfer(address(this).balance); //컨트랙트에 들어온 이더를 매도자에게 즉시 전달          
    }

    function removeSale(uint256 _tokenId) public {
        require(msg.sender == LiFT.ownerOf(_tokenId), "Only seller can remove list");
        delete sale[_tokenId]; 
        LiFT.approve(address(0), _tokenId); // 판매 리스트 제거 시 approve권한 초기화
    }

    function test1(uint256 _tokenId) public view returns(address, bool) {
        address a = LiFT.ownerOf(_tokenId);
        bool b = a == msg.sender; 
        return(a, b);
    }

    function test2(uint256 _tokenId) public view returns(address, address) {
        return LiFT.testapprove(_tokenId);
    }
}