import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import revokeAccessFunc from './revokeAccessFunc'
import { isAddress } from 'ethers/lib/utils.js'
import { useAppSelector } from '../../app/hooks'
import {
  selectProtectedDataCreated,
  selectUserAddressRestricted,
} from '../../app/appSlice'

export default function RevokeAccess() {
  //global state
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [revokeAccess, setRevokeAccess] = useState([''])
  const grantAccessAddress = useAppSelector(selectProtectedDataCreated)
  const userAddress = useAppSelector(selectUserAddressRestricted)

  //for order state
  const [dataProtectedAddress, setDataProtectedAddress] = useState(
    grantAccessAddress,
  )
  const [
    isValidDataProtectedAddress,
    setIsValidDataProtectedAddress,
  ] = useState(true)

  //handle function
  const handleOrderAddressChange = (event: any) => {
    setDataProtectedAddress(event.target.value)
    setIsValidDataProtectedAddress(isAddress(event.target.value))
    setIsValidDataProtectedAddress(true)
  }
  const handleSubmit = async () => {
    const tx = await revokeAccessFunc(dataProtectedAddress, userAddress)
    setRevokeAccess(tx)
    setLoading(true)
  }

  return (
    <Box className="form-box">
      <TextField
        required
        fullWidth
        id="dataorderAddresssetAddress"
        label="Data Address"
        variant="outlined"
        sx={{ mt: 3 }}
        value={dataProtectedAddress}
        onChange={handleOrderAddressChange}
        type="text"
        error={!isValidDataProtectedAddress}
        helperText={
          !isValidDataProtectedAddress && 'Please enter a valid dataset address'
        }
      />
      {!loading && (
        <Button
          sx={{ display: 'block', margin: '20px auto' }}
          onClick={handleSubmit}
          variant="contained"
        >
          Revoke Access
        </Button>
      )}
      {loading && (
        <CircularProgress
          sx={{ display: 'block', margin: '20px auto' }}
        ></CircularProgress>
      )}
      {revokeAccess.length && !error && (
        <>
          <Alert sx={{ mt: 3, mb: 2 }} severity="success">
            <Typography variant="h6">
              You have successfully revoke access!
            </Typography>
          </Alert>
          <RevokeAccess />
        </>
      )}
    </Box>
  )
}
