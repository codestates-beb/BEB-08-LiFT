import { MoralisNextApi } from '@moralisweb3/next';

export default MoralisNextApi({
  apiKey: process.env.MORALIS_API_KEY,
  authentication: {
    domain: process.env.NEXTAUTH_URL
      ? new URL(process.env.NEXTAUTH_URL).host // TODO : 이 부분 변경후 wagmi 작동됨
      : '',
    uri: process.env.NEXTAUTH_URL,
    timeout: 120,
  },
});
