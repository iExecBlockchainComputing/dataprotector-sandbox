import './App.css'
import { Routes, Route } from 'react-router-dom'
import { CreateCNFT, GrantAccess, Naviguate } from './features'
import { IExecPrivateDataProtector } from 'private-data-protector-testing-sdk'

const web3Provider = window.ethereum

export const PrivateData = new IExecPrivateDataProtector(web3Provider, {
  iexecOptions: {
    smsURL: 'https://v7.sms.prod-tee-services.bellecour.iex.ec',
  },
})

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Naviguate />}>
          <Route path="/createCNFT" element={<CreateCNFT />} />
          <Route path="/grantAccess" element={<GrantAccess />} />
        </Route>
        <Route path="*" element={<CreateCNFT />} />
      </Routes>
    </div>
  )
}

export default App
