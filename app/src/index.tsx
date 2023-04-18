import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import Mosaic from './Mosaic/Mosaic';
import './index.css';

export const API_URL = 'http://bc.talpa-world.com:3000';

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <BrowserRouter>
      <Mosaic />
    </BrowserRouter>,
  );
}
