import { fetchBalance } from '@wagmi/core';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const Balance = () => {
  const { data: session } = useSession();
  const { chainId, address } = session;

  const [balance, setBalance] = useState<number>();
  console.log('balance: ' + balance);
  const showBalance = JSON.stringify(balance);
  //const arrayBal = showBalance.split(',');

  useEffect(() => {
    const getBalance = async () => {
      const fetchedBalance = await fetchBalance({ address, chainId });
      setBalance(fetchedBalance);
    };
    getBalance();
  }, [address, chainId]);

  return (
    <>
      {balance && (
        <p>
          Balance: {balance.formatted} {balance.symbol}
        </p>
      )}
      {!balance && <p>Loading balance...</p>}
    </>
  );
};

export default Balance;
