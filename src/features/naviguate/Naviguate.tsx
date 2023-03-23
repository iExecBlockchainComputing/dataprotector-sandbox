import { Box, Tab, Tabs, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export default function Naviguate() {
  const [value, setValue] = useState('one')
  const naviguate = useNavigate()

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

  return (
    <Box className="my-box" sx={{ mt: 20 }}>
      <Typography component="h1" variant="h5">
        Welcome on iExec sandbox
      </Typography>
      <Typography variant="body2" textAlign="center">
        This example empathise what can be done with the SDK method
      </Typography>
      <Box className="form-box" sx={{ mt: 10 }}></Box>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="wrapped label tabs example"
      >
        <Tab value="one" label="Create CNFT" wrapped />
        <Tab value="two" label="Grant & Revoke Access" />
      </Tabs>
      <Box className="my-box">
        <Box className="form-box">
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
