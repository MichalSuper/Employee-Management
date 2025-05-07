import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UserProvider } from './contexts/UserContext.tsx'
import { ThemeProvider } from '@mui/material/styles';
import greenTheme from './theme/theme.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <ThemeProvider theme={greenTheme}>
         <App />
      </ThemeProvider>
    </UserProvider>
  </StrictMode>,
)
