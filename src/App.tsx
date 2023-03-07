import "./styles.css";
import { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  Button,
  createTheme,
  ThemeProvider,
  Alert,
  CircularProgress,
  Link
} from "@mui/material";
import createCNFT from "./createCNFT";
const theme = createTheme({
  palette: {
    primary: {
      main: "#FCD15A",
      contrastText: "#1D1D24"
    }
  }
});

export default function BasicTextFields() {
  const [dataType, setDataType] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [file, setFile] = useState(null);
  const [cnftName, setCnftName] = useState("");

  const [isValidEmail, setIsValidEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [cNftAddress, setCNftAddress] = useState("");

  const handleDataTypeChange = (event: any) => {
    setDataType(event.target.value);
  };
  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
    setIsValidEmail(event.target.validity.valid);
  };
  const handleAgeChange = (event: any) => {
    setAge(event.target.value);
  };
  const handleFileChange = (event: any) => {
    setFile(event.target.value);
  };
  const handleCnftNameChange = (event: any) => {
    setCnftName(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    let data: string | null;
    switch (dataType) {
      case "email":
        data = email;
        break;
      case "age":
        data = age;
        break;
      case "file":
        data = file;
        break;
      default:
        data = null;
    }

    if (dataType && cnftName && ((isValidEmail && email) || age || file)) {
      try {
        setLoading(true);
        const response = await createCNFT(data, cnftName);
        setCNftAddress(response);
        setError("");
      } catch (error) {
        setError(String(error));
        setCNftAddress("");
      }
      setLoading(false);
    }
  };

  const dataTypes = [
    { value: "email", label: "Email" },
    { value: "age", label: "Age" },
    { value: "file", label: "File" }
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box className="my-box">
        <Typography component="h1" variant="h5">
          Welcome on iExec sandbox
        </Typography>
        <Typography variant="body2" textAlign="center">
          This example empathise what can be done with the SDK method
        </Typography>
        <Box className="form-box">
          <InputLabel id="demo-simple-select-label">
            Select your data type
          </InputLabel>
          <Select fullWidth value={dataType} onChange={handleDataTypeChange}>
            {dataTypes.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
          {dataType === "email" && (
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
              helperText={!isValidEmail && "Please enter a valid email address"}
            />
          )}
          {dataType === "age" && (
            <TextField
              fullWidth
              type="number"
              id="age"
              label="Age"
              variant="outlined"
              value={age}
              onChange={handleAgeChange}
              sx={{ mt: 3 }}
            />
          )}
          {dataType === "file" && (
            <Button
              variant="contained"
              component="label"
              id="file"
              fullWidth
              onChange={handleFileChange}
              sx={{ mt: 3 }}
            >
              Upload
              <input hidden accept="image/*" multiple type="file" />
            </Button>
          )}
          <Typography>{file}</Typography>
          <TextField
            fullWidth
            required
            id="cnft-name"
            label="cNFT name"
            variant="outlined"
            value={cnftName}
            onChange={handleCnftNameChange}
            sx={{ mt: 3 }}
            error={!cnftName}
            helperText={!cnftName && "Please enter a valid cNFT name"}
          />
          {error && (
            <Alert sx={{ mt: 3, mb: 2 }} severity="error">
              <Typography variant="h6"> Creation failed </Typography>
              It seems the given data is not matching the type required
            </Alert>
          )}
          {cNftAddress && (
            <Alert sx={{ mt: 3, mb: 2 }} severity="success">
              <Typography variant="h6"> Your cNFT has been minted! </Typography>
              <Link
                href="#"
                sx={{ color: "green", textDecorationColor: "green" }}
              >
                You can reach it here
              </Link>
            </Alert>
          )}
          {loading && (
            <CircularProgress
              sx={{ display: "block", margin: "20px auto" }}
            ></CircularProgress>
          )}
          <Button
            sx={{ display: "block", margin: "20px auto" }}
            onClick={handleSubmit}
            variant="contained"
          >
            Create
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
