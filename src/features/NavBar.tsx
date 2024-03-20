import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { Address, useAccount, useDisconnect } from 'wagmi';

export function NavBar() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  //wallet address shortening
  const shortAddress = (address: Address) => {
    return address.slice(0, 6) + '...' + address.slice(-4);
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ backgroundColor: 'transparent', width: '100%' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', padding: 0 }}>
        <Typography
          sx={{
            flexGrow: 1,
            textAlign: 'right',
            mr: 2,
            fontStyle: 'italic',
          }}
        >
          {shortAddress(address as Address)}
        </Typography>
        <Button variant="contained" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </Toolbar>
    </AppBar>
  );
}
