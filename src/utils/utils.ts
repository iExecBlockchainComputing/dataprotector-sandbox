export type Address = `0x${string}`;

export type AddressOrEnsName = Address | string;

export const IEXEC_EXPLORER_URL = 'https://explorer.iex.ec/bellecour/dataset/';

export const WEB3MAIL_APP_ENS = 'web3mail.apps.iexec.eth';

const IEXEC_CHAIN_ID = '0x86'; // 134

export const SUPPORTED_CHAINS = [
  {
    id: 134,
    name: 'Bellecour',
    blockExplorerUrl: 'https://blockscout-bellecour.iex.ec',
    tokenSymbol: 'xRLC',
    rpcUrls: ['https://bellecour.iex.ec'],
    explorerUrl: 'https://explorer.iex.ec/bellecour/dataset/',
    web3mailAppAddress: 'web3mail.apps.iexec.eth',
  },
  {
    id: 421614,
    name: 'Arbitrum Sepolia',
    blockExplorerUrl: 'https://sepolia.arbiscan.io/',
    tokenSymbol: 'RLC',
    rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
    explorerUrl: 'https://explorer.iex.ec/arbitrum-sepolia-testnet/dataset/',
    web3mailAppAddress: '0x54f48937d1a26dd250dc8adbef07bc76f6e27df3',
  },
  {
    id: 42161,
    name: 'Arbitrum',
    blockExplorerUrl: 'https://arbiscan.io/',
    tokenSymbol: 'RLC',
    rpcUrls: ['https://arb1.arbitrum.io/rpc', 'https://1rpc.io/arb'],
    explorerUrl: 'https://explorer.iex.ec/abritrum-mainnet/dataset/',
    web3mailAppAddress: '0xcf0289a65a455a8d3c90153b796e8133e985b26c',
  },
];

export function checkIsConnected() {
  if (!window.ethereum) {
    // eslint-disable-next-line no-console
    console.log('Please install MetaMask');
    throw new Error('No Ethereum provider found');
  }
}

export async function checkCurrentChain(selectedChainId?: number) {
  const currentChainId = await window.ethereum.request({
    method: 'eth_chainId',
    params: [],
  });

  const targetChainId = selectedChainId
    ? `0x${selectedChainId.toString(16)}`
    : IEXEC_CHAIN_ID;

  if (currentChainId !== targetChainId) {
    const chain = SUPPORTED_CHAINS.find((c) => c.id === selectedChainId);
    if (!chain) {
      throw new Error(`Chain with ID ${selectedChainId} not supported`);
    }

    // eslint-disable-next-line no-console
    console.log(`Please switch to ${chain.name} chain`);
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: targetChainId,
            chainName: chain.name,
            nativeCurrency: {
              name: chain.tokenSymbol,
              symbol: chain.tokenSymbol,
              decimals: 18,
            },
            rpcUrls: chain.rpcUrls || ['https://bellecour.iex.ec'],
            blockExplorerUrls: [chain.blockExplorerUrl],
          },
        ],
      });
      // eslint-disable-next-line no-console
      console.log(`Switched to ${chain.name} chain`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Failed to switch to ${chain.name} chain:`, err);
      throw err;
    }
  }
}
