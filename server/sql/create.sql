create database lift;

use lift;


-- 마이페이지에서 주로 사용할 예정 
-- 유저 로그인상황 체크하거나 할 때 사용할 예정 
-- 유저조회, 유저 정보 업데이트시 사용
CREATE TABLE `user` (
  `id` int PRIMARY KEY AUTO_INCREMENT ,
  `name` varchar(255),
  `owner_address` varchar(255),
  `description` varchar(255)
);
ALTER TABLE user ADD UNIQUE (`owner_address`);

-- 마이페이지 및 전체페이지에서 불러올 데이터
-- 마이페이지에서 해당하는 owner_address == user 테이블에서 해당하는 address에 있는 nft만 불러오도록 하면 될듯 
-- user테이블과 라이트 조인해서 nft 테이블에서 해당하는 어드레스의 데이터만 마이페이지에서 불러주면 될듯
-- 메인페이지에서는 전체 nft 테이블을 가져오면 될 듯 
-- 1 1 서울 37.5 126.9 (테스트 데이터)  
CREATE TABLE `nft` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int default 0,
  `token_id` int default 0, 
  `owner_address` varchar(255),
  `name` varchar(255),
  `description` varchar(255), 
  `ipfs_url` varchar(255),
  `nft_contract_address` varchar(255)

);

-- 인덱스 사용시 최적화를 위한 방법 가능함 
CREATE INDEX idx_nft_name ON nft(name);
CREATE INDEX idx_nft_description ON nft(description);
CREATE INDEX idx_nft_ownerAddress ON nft(owner_address);
 
-- 판매, 구매 관련한 테이블
CREATE TABLE market (
  `id` int PRIMARY KEY AUTO_INCREMENT,
   `nft_contract_address` varchar(255),
   `market_contract_address` varchar(255),
   `token_id` varchar(255),
   `owner_address` varchar(255),
   `price` int ,
   `sale_status` varchar(255)
);


-- client > approve > set interface > sell NFT 
-- backend  > approve(to: 계정주소, tokenId: nft코드 ), sale nft, buy nft >> 스마트 컨트랙트 db에서 업데이트 하면 좋겠다.
-- post buy >> 구매 백엔드 >> db 업데이트  
CREATE TABLE `nft_test` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `token_id` int, 
  `owner_address` varchar(255),
  `name` varchar(255),
  `description` varchar(255), 
  `ipfs_url` varchar(255),
  `nft_contract_address` varchar(255)
);


CREATE TABLE `Weather` (
`id` int PRIMARY KEY AUTO_INCREMENT,
`locationID` int, 
`name` varchar(255),
`latitude` float,  
`longitude` float,
);



-- 트랜잭션 데몬 블록정보 조회용
CREATE TABLE `Block` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
FROM_ADDRESS varchar(255)
CCREATED_CONTRACT_ADDRESS varchar(255)
VALUE 0.00 float
GAS_USED 1358457 int
GAS_LIMIT 1358457  int
MINED_ON_BLOCK 274 timestamp 
BLOCKHASH varchar(255)
);

-- 트랜잭션 데몬 트랜잭션 정보 조회용
CREATE TABLE `Transaction` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
SENDER ADDRESS varchar(255)
CREATED_CONTRACT_ADDRESS varchar(255)
VALUE 0.00 float
GAS_USED 1358457 int
GAS_PRICE 20000000000  int
GAS_LIMIT 1358457  int
MINED_IN BLOCK 274 int
TX DATA  varchar(255)  
);