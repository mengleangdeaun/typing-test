// Import PWA install manager first so beforeinstallprompt is captured
// before React mounts — this guarantees the event is never missed.
import './lib/pwaInstallManager'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)