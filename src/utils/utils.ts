export type Address = `0x${string}`;

export type AddressOrEnsName = Address | string;

export const IEXEC_EXPLORER_URL = 'https://explorer.iex.ec/bellecour/dataset/';

export const WEB3MAIL_APP_ENS = 'web3mail.apps.iexec.eth';

const IEXEC_CHAIN_ID = '0x86'; // 134

export function checkIsConnected() {
  if (!window.ethereum) {
    console.log('Please install MetaMask');
    throw new Error('No Ethereum provider found');
  }
}

export async function checkCurrentChain() {
  const currentChainId = await window.ethereum.request({
    method: 'eth_chainId',
    params: [],
  });
  if (currentChainId !== IEXEC_CHAIN_ID) {
    console.log('Please switch to iExec chain');
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x86',
            chainName: 'iExec Sidechain',
            nativeCurrency: {
              name: 'xRLC',
              symbol: 'xRLC',
              decimals: 18,
            },
            rpcUrls: ['https://bellecour.iex.ec'],
            blockExplorerUrls: ['https://blockscout-bellecour.iex.ec'],
          },
        ],
      });
      console.log('Switched to iExec chain');
    } catch (err) {
      console.error('Failed to switch to iExec chain:', err);
      throw err;
    }
  }
}
