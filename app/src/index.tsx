import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import Mosaic from './Mosaic/Mosaic';
import './index.css';

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <BrowserRouter>
      <Mosaic />
    </BrowserRouter>,
  );
}
