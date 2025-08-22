import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import React from 'react'
import { Toaster } from 'sonner'
import { BrowserRouter } from 'react-router-dom'
import ReactQueryProvider from './components/ReactQueryProvider.tsx'
import AuthProvider from './context/authContext.tsx'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster richColors position="bottom-right" />
    <BrowserRouter>
      <ReactQueryProvider>
        <AuthProvider>
          {/* <ShoppingCartProvider> */}
            <App />
          {/* </ShoppingCartProvider> */}
        </AuthProvider>
      </ReactQueryProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
