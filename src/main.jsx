import { Routes, BrowserRouter, Route, Link } from "react-router"
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { EthWallet } from "./EthWallet.jsx"
import { SolanaWallet } from "./SolanaWallet.jsx"

createRoot(document.getElementById('root')).render(
  <App/>      
)
