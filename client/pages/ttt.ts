// import express, { Request, Response } from 'express';
// import Moralis from 'moralis';
// import cors from 'cors';

// const app = express();
// const port = 3000;

// app.use(cors());
// app.use(express.json());

// app.get('/balance', async (req: Request, res: Response) => {
//   try {
//     const { query } = req;
//     let balance;

//     balance = await Moralis.EvmApi.balance.getNativeBalance({
//       address: query.address as string,
//       chain: query.chain as string,
//     });

//     const result = balance.raw;

//     return res.status(200).json({ result });
//   } catch (e) {
//     console.log(e);
//     console.log('something went wrong');
//     return res.status(400).json();
//   }
// });

// Moralis.start({
//   apiKey: process.env.MORALIS_API_KEY as string,
// }).then(() => {
//   app.listen(port, () => {
//     console.log(`Listening for API Calls`);
//   });
// });
