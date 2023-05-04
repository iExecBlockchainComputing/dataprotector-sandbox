import './App.css'
import { Routes, Route } from 'react-router-dom'
import { ProtectData, GrantAccess, Naviguate } from './features'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Naviguate />}>
          <Route path="/protectData" element={<ProtectData />} />
          <Route path="/grantAccess" element={<GrantAccess />} />
        </Route>
        <Route path="*" element={<ProtectData />} />
      </Routes>
    </div>
  )
}

export default App
