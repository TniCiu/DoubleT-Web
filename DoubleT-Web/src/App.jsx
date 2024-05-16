import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Board from '~/pages/Boards/_id';
import ListBoards from '~/pages/Home/ListBoards';
import LoginSignUp from './components/LoginSignUp/LoginSignUp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignUp />} />
        <Route path="/boards" element={<ListBoards />} />
        <Route path="/boards/:id" element={<Board />} />
      </Routes>
    </Router>
  );
}

export default App;
