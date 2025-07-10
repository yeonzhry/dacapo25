import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/main'; // 아래에서 만들 파일
import Highway from './pages/highway';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Onboard />} /> */}
        <Route path="/" element={<Main />} />
        <Route path="/highway" element={<Highway />} />
      </Routes>
    </Router>
  );
}

export default App;

