import React from 'react';
import Mosaic from './components/Mosaic/Mosaic';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Mosaic />
    </BrowserRouter>
  );
}

export default App;
