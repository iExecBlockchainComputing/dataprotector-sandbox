import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import RevokeAccess from '../revokeAccess/RevokeAccess'
import grantAccessFunc from './GrantAccess'
import { isAddress } from 'ethers/lib/utils.js'

export default function GrantAccess() {
  //global state
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [grantAccess, setGrantAccess] = useState('')

  //for dataset address
  const [datasetAddress, setDatasetAddress] = useState('')
  const [isValidDatasetAddress, setIsValidDatasetAddress] = useState(true)

  //for access number
  const [accessNumber, setAccessNumber] = useState('')

  //for app restricted address
  const [appRestrictedAddress, setAppRestrictedAddress] = useState('')
  const [
    isValidAppRestrictedAddress,
    setIsValidAppRestrictedAddress,
  ] = useState(true)

  //for user restricted address
  const [userRestrictedAddress, setUserRestrictedAddress] = useState('')
  const [
    isValidUserRestrictedAddress,
    setIsValidUserRestrictedAddress,
  ] = useState(true)

  //handle functions
  const handleDatasetAddressChange = (event: any) => {
    setDatasetAddress(event.target.value)
    if (!isAddress(datasetAddress)) {
      setIsValidDatasetAddress(false)
    }
  }

  const handleAccessNumberChange = (event: any) => {
    setAccessNumber(event.target.value)
  }

  const handleAppRestrictedAddressChange = (event: any) => {
    setAppRestrictedAddress(event.target.value)
    if (!isAddress(appRestrictedAddress)) {
      setIsValidAppRestrictedAddress(false)
    }
  }

  const userRestrictedAddressChange = (event: any) => {
    setUserRestrictedAddress(event.target.value)
    if (!isAddress(userRestrictedAddress)) {
      setIsValidUserRestrictedAddress(false)
    }
  }

  const handleSubmit = async () => {
    console.log('call SDK function here')
    // const { accessHash } = await grantAccessFunc(
    //   datasetAddress,
    //   accessNumber,
    //   appRestrictedAddress,
    //   userRestrictedAddress,
    // )
    // setGrantAccess(accessHash)
    setGrantAccess('0x123456789')
  }

  return (
    <div>
      <TextField
        required
        fullWidth
        id="datasetAddress"
        label="Dataset Address"
        variant="outlined"
        sx={{ mt: 3 }}
        value={datasetAddress}
        onChange={handleDatasetAddressChange}
        type="text"
        error={!isValidDatasetAddress}
        helperText={
          !isValidDatasetAddress && 'Please enter a valid dataset address'
        }
      />
      <TextField
        fullWidth
        type="number"
        id="age"
        label="Access Number"
        variant="outlined"
        value={accessNumber}
        InputProps={{ inputProps: { min: 0 } }}
        onChange={handleAccessNumberChange}
        sx={{ mt: 3 }}
      />
      <TextField
        fullWidth
        id="appRestrictedAddress"
        label="Application Address restricted"
        variant="outlined"
        sx={{ mt: 3 }}
        value={appRestrictedAddress}
        onChange={handleAppRestrictedAddressChange}
        type="text"
        error={!isValidAppRestrictedAddress}
        helperText={
          !isValidAppRestrictedAddress &&
          'Please enter a valid application address'
        }
      />
      <TextField
        fullWidth
        id="userRestrictedAddress"
        label="Dataset Address"
        variant="outlined"
        sx={{ mt: 3 }}
        value={userRestrictedAddress}
        onChange={userRestrictedAddressChange}
        type="text"
        error={!isValidUserRestrictedAddress}
        helperText={
          !isValidUserRestrictedAddress &&
          'Please enter a valid dataset address'
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
      {error && (
        <Alert sx={{ mt: 3, mb: 2 }} severity="error">
          <Typography variant="h6"> Creation failed </Typography>
          {error}
        </Alert>
      )}
      {grantAccess && !error && (
        <>
          <Alert sx={{ mt: 3, mb: 2 }} severity="success">
            <Typography variant="h6"> Your cNFT has been minted! </Typography>
            <Link
              href={`https://explorer.iex.ec/bellecour/dataset/`}
              target="_blank"
              sx={{ color: 'green', textDecorationColor: 'green' }}
            >
              You can reach it here
            </Link>
          </Alert>
          <RevokeAccess />
        </>
      )}
      {loading && (
        <CircularProgress
          sx={{ display: 'block', margin: '20px auto' }}
        ></CircularProgress>
      )}
    </div>
  )
}
