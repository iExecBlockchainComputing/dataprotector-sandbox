import { Box, Button, Typography } from "@mui/material";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useConnect } from "wagmi";
import { useEffect } from "react";

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
      {isConnecting && <Typography>Connecting…</Typography>}
      {isDisconnected && (
        <Typography variant="body2" sx={{ mt: 2, fontStyle: "italic" }}>
          Connect your Wallet
        </Typography>
      )}
    </Box>
  );
}
