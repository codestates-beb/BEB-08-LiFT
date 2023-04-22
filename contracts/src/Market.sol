// remixd -s /Users/gubeomlee/Desktop/beb/project3/BEB-08-LiFT --remix-ide https://remix.ethereum.org

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Market is Ownable {
    // NFT address => tokenId => price
    mapping(address => mapping(uint256 => uint256)) public getPrice;

    uint256 public tradingFee;

    event Sell(address _from, address _contract, uint256 _tokenId, uint256 _price); 
    event Buy(address _from, address _to, address _contract, uint256 _tokenId, uint256 _price);
    event Cancel(address _from, address _contract, uint256 _tokenId); 

    function sell(
        address _contract,
        uint256 _tokenId,
        uint256 _price
    ) external {
        // 가격이 0 이상인지 확인
        require(_price > 0, "Price must be greater than zero");
        // 판매하려는 사람이 토큰의 소유자인지 확인
        address owner = IERC721(_contract).ownerOf(_tokenId);
        require(msg.sender == owner, "Caller is not  token owner!");
        // 판매중인 NFT인지 확인
        require(
            getPrice[_contract][_tokenId] == 0,
            "This token is already on sale"
        );
        // 판매 권한 조회
        bool isApprovedForAll = IERC721(_contract).isApprovedForAll(
            owner,
            address(this)
        );
        // 판매 권한 여부 확인
        require(isApprovedForAll == true, "sales not approved");
        // 판매 등록
        getPrice[_contract][_tokenId] = _price;

        emit Sell(msg.sender, _contract, _tokenId, _price);
    }

    function buy(address _contract, uint256 _tokenId) external payable {
        // 판매 중인 가격 가져오기
        uint256 price = getPrice[_contract][_tokenId];
        // 판매 중인 NFT인지 확인
        // 판매 중이 아닐 경우 기본 값 0이 나오기 때문에 0을 초과할 경우 판매 중으로 판단
        require(price > 0, "NFT is not for sale");
        // msg.value는 wei 단위여서 eth단위로 환산하기 위한 계산
        // 테스트를 위해서 wei 단위로 계산 
        require(msg.value == price, "Incorrect payment amount");
        // 판매자 확인
        address seller = IERC721(_contract).ownerOf(_tokenId);
        // 컨트랙트 approve권한으로 safeTransferFrom함수 호출, safeTransferFrom함수 호출 시 approve 초기화
        IERC721(_contract).safeTransferFrom(seller, msg.sender, _tokenId);
        // 컨트랙트에 들어온 이더를 수수료 계산 후 매도자에게 즉시 전달
        payable(seller).transfer((msg.value * (100 - tradingFee)) / 100);
        // 판매 중인 가격 제거
        delete getPrice[_contract][_tokenId];

        emit Buy(seller, msg.sender, _contract, _tokenId, price);
    }

    function cancel(address _contract, uint256 _tokenId) external {
        // NFT에 대한 소유자 확인
        address owner = IERC721(_contract).ownerOf(_tokenId);
        // 소유자만 판매를 취소할 수 있음
        require(msg.sender == owner, "Only seller can remove list");
        // 판매 중인 가격 제거
        delete getPrice[_contract][_tokenId];

        emit Cancel(msg.sender, _contract, _tokenId);
    }

    function setTradingFee(uint256 _tradingFee) public onlyOwner {
        tradingFee = _tradingFee;
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance); 
    }
}