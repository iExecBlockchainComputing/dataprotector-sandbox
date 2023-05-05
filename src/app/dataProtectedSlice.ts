import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface DataProtected {
  filePath: string;
  file: File;
  email: string;
  age: string;
  name: string;
  dataType: string;
}

const initialState: DataProtected = {
  filePath: '',
  file: new File([], ''),
  email: '',
  age: '',
  name: '',
  dataType: '',
};

export const dataProtectedSlice = createSlice({
  name: 'dataProtected',
  initialState,
  reducers: {
    setMemoFilePath: (state, action) => {
      state.filePath = action.payload;
    },
    setMemoFile: (state, action) => {
      state.file = action.payload;
    },
    setMemoEmail: (state, action) => {
      state.email = action.payload;
    },
    setMemoAge: (state, action) => {
      state.age = action.payload;
    },
    setMemoName: (state, action) => {
      state.name = action.payload;
    },
    setMemoDataType: (state, action) => {
      state.dataType = action.payload;
    },
  },
});

export default dataProtectedSlice.reducer;
export const selectFilePath = (state: RootState) =>
  state.dataProtected.filePath;
export const selectFile = (state: RootState) => state.dataProtected.file;
export const selectEmail = (state: RootState) => state.dataProtected.email;
export const selectAge = (state: RootState) => state.dataProtected.age;
export const selectName = (state: RootState) => state.dataProtected.name;
export const selectDataType = (state: RootState) =>
  state.dataProtected.dataType;
export const {
  setMemoFilePath,
  setMemoFile,
  setMemoEmail,
  setMemoAge,
  setMemoName,
  setMemoDataType,
} = dataProtectedSlice.actions;
