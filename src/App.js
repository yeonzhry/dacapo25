import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/main'; // 아래에서 만들 파일
import Highway from './pages/highway';
import Setlist from './pages/setlist';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Onboard />} /> */}
        <Route path="/" element={<Main />} />
        <Route path="/highway" element={<Highway />} />
        <Route path="/setlist" element={<Setlist />} />

      </Routes>
    </Router>
  );
}

export default App;

