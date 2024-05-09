import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Thay đổi import Routes

import Board from '~/pages/Boards/_id';
import ListBoards from '~/pages/Home/ListBoards';

function App() {
  return (
    <Router>
      <Routes> {/* Thay thế Switch bằng Routes */}
      <Route path="/" element={<ListBoards />} /> {/* Sử dụng element thay vì component */}
        <Route path="/boards/:id" element={<Board />} /> {/* Sử dụng element thay vì component */}
      </Routes>
    </Router>
  );
}

export default App;
