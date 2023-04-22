import React from 'react';
import Mosaic from './components/Mosaic/Mosaic';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import Login from './pages/Login';
import { OBSProvider } from './contexts/obs';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <OBSProvider>
          <Routes>
            <Route path="" Component={Login} />
            <Route path="mosaic/*" Component={Mosaic} />
          </Routes>
        </OBSProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
