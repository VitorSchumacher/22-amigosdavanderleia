import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import logoImg from '../assets/logo.png'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      if (err.status === 401) {
        setError('E-mail ou senha incorretos.')
      } else {
        setError(err.message ?? 'Erro ao fazer login. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <Card>
        <Logo>
          <LogoImg src={logoImg} alt="Guiar" />
        </Logo>

        <Heading>Bem-vindo de volta</Heading>
        <Subheading>Faça login para acessar sua gestão financeira</Subheading>

        <Form onSubmit={handleSubmit}>
          <Field>
            <Label>E-mail</Label>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </Field>

          <Field>
            <Label>Senha</Label>
            <PasswordWrapper>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Sua senha"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
              <EyeBtn type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </EyeBtn>
            </PasswordWrapper>
          </Field>

          <ForgotLink to="#">Esqueci minha senha</ForgotLink>

          {error && <ErrorMsg>{error}</ErrorMsg>}

          <SubmitBtn type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </SubmitBtn>
        </Form>

        <RegisterText>
          Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </RegisterText>
      </Card>

      <Background />
    </PageWrapper>
  )
}

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%);
  padding: 24px;
`

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 48px 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
`

const Logo = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
`

const LogoImg = styled.img`
  height: 140px;
  width: auto;
`

const Heading = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1A1A2E;
  margin-bottom: 6px;
`

const Subheading = styled.p`
  font-size: 0.875rem;
  color: #6C757D;
  margin-bottom: 32px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1A1A2E;
`

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #DEE2E6;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #1A1A2E;
  outline: none;
  transition: border-color 0.2s;

  &:focus { border-color: #2D6A4F; }
  &::placeholder { color: #ADB5BD; }
`

const PasswordWrapper = styled.div`
  position: relative;
`

const EyeBtn = styled.button`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #6C757D;
  display: flex;
  align-items: center;
`

const ForgotLink = styled(Link)`
  font-size: 0.8125rem;
  color: #2D6A4F;
  text-align: right;
  margin-top: -8px;
  &:hover { text-decoration: underline; }
`

const ErrorMsg = styled.p`
  background: #FFF0EE;
  border: 1px solid #FFCDD2;
  color: #C62828;
  font-size: 0.875rem;
  padding: 10px 14px;
  border-radius: 8px;
`

const SubmitBtn = styled.button`
  background: #2D6A4F;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  padding: 13px;
  border-radius: 8px;
  margin-top: 4px;
  transition: background 0.2s;
  opacity: ${({ disabled }) => disabled ? 0.7 : 1};

  &:hover:not(:disabled) { background: #1B4332; }
`

const RegisterText = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: #6C757D;
  margin-top: 24px;

  a {
    color: #2D6A4F;
    font-weight: 600;
    &:hover { text-decoration: underline; }
  }
`

const Background = styled.div`
  position: fixed;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  z-index: 0;
`
