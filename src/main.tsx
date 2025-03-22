/**
 * Main entry point for the Penny-Fincher application
 * 
 * Sets up React with StrictMode and BrowserRouter for navigation.
 * Renders the App component into the root DOM element.
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Create root and render the application
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
