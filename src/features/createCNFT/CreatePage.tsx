import { useState } from 'react'
import {
  Box,
  TextField,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Link,
  FormControl,
  Grid,
} from '@mui/material'
import { Verified } from '@mui/icons-material'
import createCNFT from './createCnftFunc'

export default function CreatePage() {
  const [dataType, setDataType] = useState('')
  const [email, setEmail] = useState('')
  const [age, setAge] = useState('')
  const [filePath, setFilePath] = useState('')
  const [file, setFile] = useState<File>()
  const [cnftName, setCnftName] = useState('')

  const [isValidEmail, setIsValidEmail] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [cNftAddress, setCNftAddress] = useState('')

  const handleDataTypeChange = (event: any) => {
    setDataType(event.target.value)
  }
  const handleEmailChange = (event: any) => {
    setEmail(event.target.value)
    setIsValidEmail(event.target.validity.valid)
  }
  const handleAgeChange = (event: any) => {
    setAge(event.target.value)
  }
  const handleFileChange = (event: any) => {
    setFilePath(event.target.value)
    setFile(event.target.files?.[0])
  }
  const handleCnftNameChange = (event: any) => {
    setCnftName(event.target.value)
  }

  async function create_ArrayBuffer(file?: File): Promise<ArrayBuffer> {
    const fileReader = new FileReader()
    if (file) {
      return new Promise((resolve, reject) => {
        fileReader.onerror = () => {
          fileReader.abort()
          reject(new DOMException('Error parsing input file.'))
        }
        fileReader.onload = () => {
          resolve(fileReader.result as ArrayBuffer)
        }
        fileReader.readAsArrayBuffer(file)
      })
    } else {
      return Promise.reject(new Error('No file selected'))
    }
  }

  const handleSubmit = async (event: any) => {
    let data: string | ArrayBuffer
    switch (dataType) {
      case 'email':
        data = email
        break
      case 'age':
        data = age
        break
      case 'file':
        data = await create_ArrayBuffer(file)
        break
    }

    if (dataType && cnftName && ((isValidEmail && email) || age || file)) {
      try {
        setLoading(true)
        const response = await createCNFT(data!, cnftName)
        setCNftAddress(response)
        setError('')
      } catch (error) {
        setError(String(error))
        setCNftAddress('')
      }
      setLoading(false)
    }
  }

  const dataTypes = [
    { value: 'email', label: 'Email' },
    { value: 'age', label: 'Age' },
    { value: 'file', label: 'File' },
  ]
  return (
    <div>
      <FormControl fullWidth sx={{ mt: '24px' }}>
        <InputLabel>Select your data type</InputLabel>
        <Select
          fullWidth
          value={dataType}
          onChange={handleDataTypeChange}
          label="Select your data type"
        >
          {dataTypes.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {dataType === 'email' && (
        <TextField
          required
          fullWidth
          id="email"
          label="Email"
          variant="outlined"
          sx={{ mt: 3 }}
          value={email}
          onChange={handleEmailChange}
          type="email"
          error={!isValidEmail}
          helperText={!isValidEmail && 'Please enter a valid email address'}
        />
      )}
      {dataType === 'age' && (
        <TextField
          fullWidth
          type="number"
          id="age"
          label="Age"
          variant="outlined"
          value={age}
          InputProps={{ inputProps: { min: 0 } }}
          onChange={handleAgeChange}
          sx={{ mt: 3 }}
        />
      )}
      {dataType === 'file' && (
        <Button
          variant="contained"
          component="label"
          id="file"
          fullWidth
          onChange={handleFileChange}
          sx={{ mt: 3 }}
        >
          {!filePath ? 'Upload' : 'Updated File'}
          <input hidden multiple type="file" />
        </Button>
      )}
      {filePath && dataType === 'file' && (
        <Grid container columnSpacing={1} sx={{ mt: 1 }}>
          <Grid item>
            <Typography>{filePath.split('\\').slice(-1)}</Typography>
          </Grid>
          <Grid item>
            <Verified color="success" />
          </Grid>
        </Grid>
      )}
      {dataType && (
        <TextField
          fullWidth
          id="cnft-name"
          label="cNFT name"
          variant="outlined"
          value={cnftName}
          onChange={handleCnftNameChange}
          sx={{ mt: 3 }}
        />
      )}
      {error && (
        <Alert sx={{ mt: 3, mb: 2 }} severity="error">
          <Typography variant="h6"> Creation failed </Typography>
          It seems the given data is not matching the type required
        </Alert>
      )}
      {cNftAddress && !error && (
        <Alert sx={{ mt: 3, mb: 2 }} severity="success">
          <Typography variant="h6"> Your cNFT has been minted! </Typography>
          <Link
            href={`https://explorer.iex.ec/bellecour/dataset/${cNftAddress}`}
            target="_blank"
            sx={{ color: 'green', textDecorationColor: 'green' }}
          >
            You can reach it here
          </Link>
        </Alert>
      )}
      {loading && (
        <CircularProgress
          sx={{ display: 'block', margin: '20px auto' }}
        ></CircularProgress>
      )}
      {dataType && !loading && (
        <Button
          sx={{ display: 'block', margin: '20px auto' }}
          onClick={handleSubmit}
          variant="contained"
        >
          Create
        </Button>
      )}
    </div>
  )
}
