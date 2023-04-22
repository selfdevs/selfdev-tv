import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App';

const root = document.getElementById('root');

if (root === undefined) throw new Error('Root element not found');

createRoot(root).render(<App />);
