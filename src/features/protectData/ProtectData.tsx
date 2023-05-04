import { useState } from 'react';
import {
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
} from '@mui/material';
import { Verified } from '@mui/icons-material';
import protectDataFunc from './protectDataFunc';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectProtectedDataCreated,
  setLastProtectedDataCreated,
} from '../../app/appSlice';
import {
  selectName,
  selectFilePath,
  selectFile,
  selectEmail,
  selectAge,
  selectDataType,
  setMemoName,
  setMemoFilePath,
  setMemoFile,
  setMemoEmail,
  setMemoAge,
  setMemoDataType,
} from '../../app/dataProtectedSlice';
import { DataSchema } from '@iexec/dataprotector';

export default function ProtectData() {
  //global state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const protectedDataRegistered = useAppSelector(selectProtectedDataCreated);
  const [protectedData, setProtectedData] = useState(protectedDataRegistered);
  const memoName = useAppSelector(selectName);
  const memoFilePath = useAppSelector(selectFilePath);
  const memoFile = useAppSelector(selectFile);
  const memoEmail = useAppSelector(selectEmail);
  const memoAge = useAppSelector(selectAge);
  const memoDataType = useAppSelector(selectDataType);

  //for name et dataType
  const [name, setName] = useState(memoName);
  const [dataType, setDataType] = useState(memoDataType);

  //for email
  const [email, setEmail] = useState(memoEmail);
  const [isValidEmail, setIsValidEmail] = useState(true);

  //for age
  const [age, setAge] = useState(memoAge);

  //for file
  const [filePath, setFilePath] = useState(memoFilePath);
  const [file, setFile] = useState<File | undefined>(memoFile);

  //handle functions
  const handleDataTypeChange = (event: any) => {
    setDataType(event.target.value);
    dispatch(setMemoDataType(event.target.value));
  };
  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
    setIsValidEmail(event.target.validity.valid);
    dispatch(setMemoEmail(event.target.value));
  };
  const handleAgeChange = (event: any) => {
    setAge(event.target.value);
    dispatch(setMemoAge(event.target.value));
  };
  const handleFileChange = (event: any) => {
    setFilePath(event.target.value);
    setFile(event.target.files?.[0]);
    dispatch(setMemoFilePath(event.target.value));
    dispatch(setMemoFile(event.target.files?.[0]));
  };
  const handleNameChange = (event: any) => {
    setName(event.target.value);
    dispatch(setMemoName(event.target.value));
  };

  async function create_ArrayBuffer(file?: File): Promise<ArrayBuffer> {
    const fileReader = new FileReader();
    if (file) {
      return new Promise((resolve, reject) => {
        fileReader.onerror = () => {
          fileReader.abort();
          reject(new DOMException('Error parsing input file.'));
        };
        fileReader.onload = () => {
          resolve(fileReader.result as ArrayBuffer);
        };
        fileReader.readAsArrayBuffer(file);
      });
    } else {
      return Promise.reject(new Error('No file selected'));
    }
  }

  const handleSubmit = async () => {
    let data: DataSchema;
    let bufferFile: ArrayBuffer;
    switch (dataType) {
      case 'email':
        data = { email: email };
        break;
      case 'age':
        data = { age: age };
        break;
      case 'file':
        bufferFile = await create_ArrayBuffer(file);
        data = { file: bufferFile };
        break;
    }

    if (dataType && name && ((isValidEmail && email) || age || file)) {
      try {
        setLoading(true);
        const ProtectedDataAddress = await protectDataFunc(data, name);
        setProtectedData(ProtectedDataAddress);
        dispatch(setLastProtectedDataCreated(ProtectedDataAddress));
        setError('');
      } catch (error) {
        setError(String(error));
        setProtectedData('');
      }
      setLoading(false);
    }
  };

  const dataTypes = [
    { value: 'email', label: 'Email' },
    { value: 'age', label: 'Age' },
    { value: 'file', label: 'File' },
  ];
  return (
    <div>
      <FormControl fullWidth sx={{ mt: '24px' }}>
        <InputLabel>Select your data type</InputLabel>
        <Select
          fullWidth
          value={dataType}
          onChange={handleDataTypeChange}
          label="Select your data type"
          sx={{ textAlign: 'left' }}
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
          id="name"
          label="Name"
          variant="outlined"
          value={name}
          onChange={handleNameChange}
          sx={{ mt: 3 }}
        />
      )}
      {error && (
        <Alert sx={{ mt: 3, mb: 2 }} severity="error">
          <Typography variant="h6"> Creation failed </Typography>
          {error}
        </Alert>
      )}
      {protectedData && !error && (
        <Alert sx={{ mt: 3, mb: 2 }} severity="success">
          <Typography variant="h6"> Your data has been protected!</Typography>
          <Link
            href={`https://explorer.iex.ec/bellecour/dataset/${protectedData}`}
            target="_blank"
            sx={{ color: 'green', textDecorationColor: 'green' }}
          >
            You can reach it here
          </Link>
          <p>Your protected data address: {protectedData}</p>
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
  );
}
