// import { NextApiRequest, NextApiResponse } from 'next';
// import Moralis from 'moralis';

// interface MoralisConfig {
//   apiKey: string;
//   // add any other configuration options here
// }

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     const { query } = req;
//     let balance;

// MoralisError [Moralis SDK Error]: [C0009] Modules are started already. This method should be called only one time. (이 에러가 발생함)
//     await Moralis.start({
//       apiKey:
//         'X3naFUNLyEWLTvQUlQ6m8hzGyNEJs20vIhtSmpp0u7NvtbEsjCQ2QjFAGMIwxVUR',
//       // ...and any other configuration
//     });

//     balance = await Moralis.EvmApi.balance.getNativeBalance({
//       address: query.address as string,
//       chain: query.chain as string,
//     });

//     const result = balance.raw;

//     return res.status(200).json({ result });
//   } catch (e) {
//     console.log(e);
//     console.log('something went wrong');
//     return res.status(400);
//   }
// }
