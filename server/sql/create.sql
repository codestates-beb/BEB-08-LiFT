create database lift;

use lift;

CREATE TABLE `nft` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `token_id` int,
  `name_description` varchar(255),
  `ipfs_url` varchar(255),
  `tx_hash` varchar(255)
);

CREATE TABLE `Weather` (
`id` int PRIMARY KEY AUTO_INCREMENT,
`address`  varchar(255)
);

-- 트랜잭션 데몬을 위한 테이블 테스트 용도임, 추후 변경할 수도 있음
CREATE TABLE `Block` (
`id` int PRIMARY KEY AUTO_INCREMENT,
`FROM_ADDRESS` varchar(255),
`CREATED_CONTRACT_ADDRESS` varchar(255),
`VALUE`  float,
GAS_USED  int,
GAS_LIMIT   int,
MINED_ON_BLOCK  timestamp ,
BLOCKHASH varchar(255)
);

CREATE TABLE `Transaction` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `SENDER` varchar(255),
`CREATED_CONTRACT_ADDRESS` varchar(255),
`VALUE` float,
`GAS_USED` int,
`GAS_PRICE`   bigint,
`GAS_LIMIT`   int,
`MINED_IN_BLOCK` int,
`TXDATA`  varchar(255)
);

