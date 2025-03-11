import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/room/:roomId" element={<App />} />
        <Route path="/" element={<div>Enter a room ID (e.g., /room/123)</div>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
