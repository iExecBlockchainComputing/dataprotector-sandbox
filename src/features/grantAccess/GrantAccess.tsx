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
import grantAccessFunc from './grantAccessFunc'
import { isAddress } from 'ethers/lib/utils.js'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import {
  selectProtectedDataCreated,
  setUserAddressRestricted,
} from '../../app/appSlice'

export default function GrantAccess() {
  //global state
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [grantAccess, setGrantAccess] = useState('')
  const dispatch = useAppDispatch()
  const protectedDataAddress = useAppSelector(selectProtectedDataCreated)

  //for dataset address
  const [datasetAddress, setDatasetAddress] = useState(protectedDataAddress)
  const [isValidDatasetAddress, setIsValidDatasetAddress] = useState(true)

  //for access number
  const [accessNumber, setAccessNumber] = useState<number>(1)

  //for user restricted address
  const [userRestrictedAddress, setUserRestrictedAddress] = useState('')
  const [
    isValidUserRestrictedAddress,
    setIsValidUserRestrictedAddress,
  ] = useState(true)

  //handle functions
  const handleDatasetAddressChange = (event: any) => {
    setDatasetAddress(event.target.value)
    setIsValidDatasetAddress(isAddress(event.target.value))
  }

  const handleAccessNumberChange = (event: any) => {
    setAccessNumber(event.target.value)
  }

  const userRestrictedAddressChange = (event: any) => {
    setUserRestrictedAddress(event.target.value)
    setIsValidUserRestrictedAddress(isAddress(event.target.value))
  }

  const handleSubmit = async () => {
    try {
      const action = setUserAddressRestricted(userRestrictedAddress)
      dispatch(setUserAddressRestricted(userRestrictedAddress))
      setLoading(true)
      const accessHash = await grantAccessFunc(
        datasetAddress,
        accessNumber,
        userRestrictedAddress,
      )
      setError('')
      console.log('accessHash', accessHash)
      setGrantAccess(accessHash)
    } catch (error) {
      setError(String(error))
      setGrantAccess('')
    }
    setLoading(false)
    console.log('grantAccess', grantAccess)
  }

  return (
    <div>
      <TextField
        required
        fullWidth
        id="dataAddress"
        label="Data Address"
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
        InputProps={{ inputProps: { min: 1 } }}
        onChange={handleAccessNumberChange}
        sx={{ mt: 3 }}
      />
      <TextField
        fullWidth
        id="userRestrictedAddress"
        label="User Address Restricted"
        variant="outlined"
        sx={{ mt: 3 }}
        value={userRestrictedAddress}
        onChange={userRestrictedAddressChange}
        type="text"
        error={!isValidUserRestrictedAddress}
        helperText={
          !isValidUserRestrictedAddress && 'Please enter a valid user address'
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
          <Typography variant="h6"> Grant Access failed </Typography>
          {error}
        </Alert>
      )}
      {grantAccess && !error && (
        <>
          <Alert sx={{ mt: 3, mb: 2 }} severity="success">
            <Typography variant="h6">Your access has been granted !</Typography>
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
