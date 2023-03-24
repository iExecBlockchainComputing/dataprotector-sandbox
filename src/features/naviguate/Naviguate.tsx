import {
  AppBar,
  Box,
  Button,
  Container,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@mui/material'
import { useWeb3Modal } from '@web3modal/react'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function Naviguate() {
  const [value, setValue] = useState('one')
  const naviguate = useNavigate()
  const { error } = useConnect()
  const { address, isConnecting, isConnected, isDisconnected } = useAccount()
  const { open } = useWeb3Modal()
  const { disconnect } = useDisconnect()

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  useEffect(() => {
    if (value === 'one') {
      naviguate('/createCNFT')
    } else if (value === 'two') {
      naviguate('/grantAccess')
    }
  }, [value])

  const shortAddress = (address: string) => {
    return address.slice(0, 6) + '...' + address.slice(-4)
  }

  return (
    <Container disableGutters>
      {isConnected && (
        <AppBar
          position="static"
          elevation={0}
          sx={{ backgroundColor: 'transparent', width: '100%' }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography
              sx={{
                flexGrow: 1,
                textAlign: 'right',
                mr: 2,
                fontStyle: 'italic',
              }}
            >
              {shortAddress(address as string)}
            </Typography>
            <Button variant="contained" onClick={() => disconnect()}>
              Disconnect
            </Button>
          </Toolbar>
        </AppBar>
      )}
      <Box className="my-box" sx={{ mt: 20 }}>
        {isConnected && (
          <>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="wrapped label tabs example"
              sx={{ mt: 10 }}
            >
              <Tab value="one" label="Protect your data" />
              <Tab value="two" label="Grant & Revoke Access" />
            </Tabs>
            <Box className="my-box">
              <Box className="form-box">
                <Outlet />
              </Box>
            </Box>
          </>
        )}

        {isDisconnected && (
          <Box sx={{ mt: 10 }}>
            <Button variant="contained" onClick={() => open()}>
              Connect
            </Button>
            {error && <Typography>{error.message}</Typography>}
            {isConnecting && <Typography>Connecting…</Typography>}
            {isDisconnected && (
              <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                Connect your Wallet
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Container>
  )
}
