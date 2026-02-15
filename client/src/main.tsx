import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Providers } from "./providers.tsx"
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
    <Providers>
      <App />
    </Providers>
    </BrowserRouter>

)
