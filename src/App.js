import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CustomPuzzleGame from './components/CustomPuzzleGame';
import Achievement from './components/Achievement';
import './styles/index.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<CustomPuzzleGame />} />
          <Route path="/achievement" element={<Achievement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;