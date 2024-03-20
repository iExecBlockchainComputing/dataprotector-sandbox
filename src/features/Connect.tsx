import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useConnect } from 'wagmi';

export default function Connect() {
  const { open } = useWeb3Modal();
  const { error } = useConnect();
  const { isConnecting, isDisconnected } = useAccount();

  useEffect(() => {
    if (isDisconnected) {
      open();
    }
  }, [isDisconnected, open]);

  return (
    <Box sx={{ mt: 10 }}>
      {error && <Typography>{error.message}</Typography>}
      {isConnecting && <Typography>Connecting...</Typography>}
      {isDisconnected && <Typography>Connect your Wallet</Typography>}
    </Box>
  );
}
