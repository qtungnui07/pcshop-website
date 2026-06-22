import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_aG9wZWZ1bC1sYW1iLTk0LmNsZXJrLmFjY291bnRzLmRldiQ"

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  console.warn("Warning: VITE_CLERK_PUBLISHABLE_KEY is missing. Using the default fallback key.")
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      signInUrl="/auth"
      signUpUrl="/auth"
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </ClerkProvider>
  </StrictMode>,
)
