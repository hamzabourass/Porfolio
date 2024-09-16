import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import './index.css';

// Create a root and render the App
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
