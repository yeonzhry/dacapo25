import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Onboard from './pages/onboard';
import Main from './pages/main'; // 아래에서 만들 파일

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboard />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </Router>
  );
}

export default App;

