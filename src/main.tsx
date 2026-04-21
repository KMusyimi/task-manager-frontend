import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import FlashMessageProvider from './components/providers/FlashMessageProvider.tsx'
import ThemeProvider from './components/providers/ThemeProvider.tsx'
import './index.css'


// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <FlashMessageProvider>
        <App />
      </FlashMessageProvider>
    </ThemeProvider>
  </StrictMode >,
)
