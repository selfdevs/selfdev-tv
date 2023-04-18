import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import Mosaic from './Mosaic/Mosaic';
import './index.css';

export const API_URL = 'http://192.168.1.74:3000';

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <BrowserRouter>
      <Mosaic />
    </BrowserRouter>,
  );
}
