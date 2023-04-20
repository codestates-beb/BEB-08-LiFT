// import React, { useEffect, useState } from 'react';
// import { AbiItem } from 'web3-utils';
// import Web3 from 'web3';
// import { contractType } from '@thirdweb-dev/react';
// import { Contract } from 'ethers';
// import { getAccount } from '@wagmi/core';

// export default function market() {
//   const web3 = new Web3(window.ethereum?);
//   const weatherAbi: AbiItem[] = []; // abi 추가해야 함.
//   const marketAbi: AbiItem[] = [];
//   const weatherAddress = ''; // 주소 추가해야 함.
//   const marketAddress = '';

//   const weatherContract = new web3.eth.Contract(weatherAbi, weatherAddress);
//   const marketContract = new web3.eth.Contract(marketAbi, marketAddress);

//   //contract를 nft contract로 바꿔줘야 함.

//   const [myNft, setMyNft] = useState([]);

//   // 나의 NFT를 가져 오는 함수
//   const getMyNft = async (account) => {
//     try {
//       const totalSupply = await weatherContract.methods.totalSupply().call();
//       const myNftArray = [];
//       for (let i = 0; i <= totalSupply; i++) {
//         if ((await weatherContract.methods.ownerOf(i).call()) == account) {
//           myNftArray.push(i);
//         }
//       }
//       setMyNft(myNftArray);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const [saleNft, setSaleNft] = useState([{}]);

//   //
//   const getOnSale = async () => {
//     try {
//       const onSaleCount = await marketContract.methods.saleId().call();
//       const onSaleArray = [];
//       for (let i = 0; i <= onSaleCount; i++) {
//         const onSaleNftTokenId = await marketContract.methods
//           .saleIdToTokenId(i)
//           .call();
//         const onSalePrice = await marketContract.methods
//           .sale(onSaleNftTokenId)
//           .call();
//         onSaleArray.push({ tokenId: onSaleNftTokenId, price: onSalePrice });
//       }
//       setSaleNft(onSaleArray);
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   //

//   const onClickSale = async () => {
//     try {
//       const response = await marketContract.methods
//         .SaleNFT(_tokenId, _price, _contractAddress)
//         .send({ from: account }); // 주소는 프롭스로 받는것.
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   //

//   const onClickApprove = async () => {
//     try {
//       const response = await weatherContract.methods
//         .approve(marketAddress, _tokenId)
//         .send({ from: account }); // 주소는 프롭스로 받는것.
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   //

//   const onClickBuy = async () => {
//     try {
//       const response = await marketContract.methods
//         .buyNFT(_tokenId, _contractAddress)
//         .send({ from: account, value: _price }); // 주소는 프롭스로 받는것.
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return <div>main</div>;
// }

// // 0x302705ed9AE255b368401aA14c007CCF445Afc5B
// // 0x302705ed9AE255b368401aA14c007CCF445Afc5B
