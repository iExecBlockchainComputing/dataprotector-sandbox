import { useEffect, useState } from 'react';
import { cleanDataProtectorClient, initDataProtectorClient } from '../externals/dataProtectorClient';

export function useWalletConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  useEffect(() => {
    if (!window.ethereum) {
      return;
    }

    const checkConnection = async () => {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });

        if (accounts.length > 0) {
          setIsConnected(true);
          setAddress(accounts[0]);

          const newChainId = await window.ethereum.request({
            method: 'eth_chainId',
          });
          const parsedChainId = parseInt(newChainId, 16);
          setChainId(parsedChainId);

          initDataProtectorClient({ provider: window.ethereum, chainId: parsedChainId });
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    };

    checkConnection();

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setIsConnected(true);
        setAddress(accounts[0]);
        if (chainId) {
          initDataProtectorClient({ provider: window.ethereum, chainId: chainId });
        }
      } else {
        setIsConnected(false);
        setAddress(null);
        cleanDataProtectorClient();
      }
    };

    const handleChainChanged = (newChainHexId: string) => {
      const newChainId = parseInt(newChainHexId, 16);
      setChainId(newChainId);
      initDataProtectorClient({ provider: window.ethereum, chainId: newChainId });
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  return {
    isConnected,
    address,
    chainId,
  };
}
