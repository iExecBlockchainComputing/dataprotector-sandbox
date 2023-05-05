import './App.css';
import { Routes, Route } from 'react-router-dom';
import { ProtectData, GrantAccess, Navigate } from './features';

function App() {
  return (
    <div id="App">
      <Routes>
        <Route path="/" element={<Navigate />}>
          <Route path="/protectData" element={<ProtectData />} />
          <Route path="/grantAccess" element={<GrantAccess />} />
        </Route>
        <Route path="*" element={<ProtectData />} />
      </Routes>
    </div>
  );
}

export default App;
