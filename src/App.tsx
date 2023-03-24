import './App.css'
import { Routes, Route } from 'react-router-dom'
import { CreateCNFT, GrantAccess, Naviguate } from './features'

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
