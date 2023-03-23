import { Box, Button, CircularProgress, TextField } from '@mui/material'
import { isAddress } from 'ethers'
import { useState } from 'react'
import revokeAccessFunc from './RevokeAccess'

export default function RevokeAccess() {
  //global state
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [revokeAccess, setRevokeAccess] = useState('')

  //for order state
  const [orderAddress, setOrderAddress] = useState('')
  const [isValidOrderAddress, setIsValidOrderAddress] = useState(true)

  //handle function
  const handleOrderAddressChange = (event: any) => {
    setOrderAddress(event.target.value)
    if (!isAddress(orderAddress)) {
      setIsValidOrderAddress(false)
    }
  }
  const handleSubmit = () => {
    console.log('submit')
    // const {tx} = revokeAccessFunc(orderAddress)
    // setRevokeAccess(tx)
    setLoading(true)
  }

  return (
    <Box className="form-box">
      <TextField
        required
        fullWidth
        id="dataorderAddresssetAddress"
        label="Order Address"
        variant="outlined"
        sx={{ mt: 3 }}
        value={orderAddress}
        onChange={handleOrderAddressChange}
        type="text"
        error={!isValidOrderAddress}
        helperText={
          !isValidOrderAddress && 'Please enter a valid dataset address'
        }
      />
      {!loading && (
        <Button
          sx={{ display: 'block', margin: '20px auto' }}
          onClick={handleSubmit}
          variant="contained"
        >
          Grant Access
        </Button>
      )}
      {loading && (
        <CircularProgress
          sx={{ display: 'block', margin: '20px auto' }}
        ></CircularProgress>
      )}
    </Box>
  )
}
