import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { theme } from './styles/theme'
import { GlobalStyles } from './styles/GlobalStyles'
import { AuthProvider } from './contexts/AuthContext'
import AppLayout from './components/AppLayout'
import PrivateRoute from './components/PrivateRoute'
import { ErrorBoundary } from './components/ErrorBoundary'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Dashboard from './pages/Dashboard'
import Gastos from './pages/Gastos'
import Relatorios from './pages/Relatorios'
import Configuracoes from './pages/Configuracoes'
import NotasFiscais from './pages/NotasFiscais'
import Sefaz from './pages/Sefaz'
import Estoque from './pages/Estoque'
import WhatsappOTP from './pages/WhatsappOTP'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/whatsapp/send-otp" element={<WhatsappOTP />} />
            <Route element={<PrivateRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<ErrorBoundary key="dashboard"><Dashboard /></ErrorBoundary>} />
                <Route path="/gastos" element={<ErrorBoundary key="gastos"><Gastos /></ErrorBoundary>} />
                <Route path="/relatorios" element={<ErrorBoundary key="relatorios"><Relatorios /></ErrorBoundary>} />
                <Route path="/notas-fiscais" element={<ErrorBoundary key="notas-fiscais"><NotasFiscais /></ErrorBoundary>} />
                <Route path="/sefaz" element={<ErrorBoundary key="sefaz"><Sefaz /></ErrorBoundary>} />
                <Route path="/estoque" element={<ErrorBoundary key="estoque"><Estoque /></ErrorBoundary>} />
                <Route path="/configuracoes" element={<ErrorBoundary key="configuracoes"><Configuracoes /></ErrorBoundary>} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
