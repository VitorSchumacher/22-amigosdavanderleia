import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import logoImg from '../assets/logo.png'
import farmVideo from '../assets/farm-bg.mp4'

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
      <VideoBg autoPlay loop muted playsInline src={farmVideo} />
      <Overlay />
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

          <ForgotText>Esqueci minha senha</ForgotText>

          {error && <ErrorMsg>{error}</ErrorMsg>}

          <SubmitBtn type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </SubmitBtn>
        </Form>

        <RegisterText>
          Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </RegisterText>
      </Card>

    </PageWrapper>
  )
}

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
  overflow: hidden;
`

const VideoBg = styled.video`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1;
`

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 48px 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  position: relative;
  z-index: 2;
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
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 6px;
`

const Subheading = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
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
  color: ${({ theme }) => theme.colors.text.primary};
`

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text.primary};
  outline: none;
  transition: border-color 0.2s;

  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
  &::placeholder { color: ${({ theme }) => theme.colors.text.muted}; }
`

const PasswordWrapper = styled.div`
  position: relative;
`

const EyeBtn = styled.button`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
`

const ForgotText = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: right;
  margin-top: -8px;
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
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  padding: 13px;
  border-radius: 8px;
  margin-top: 4px;
  transition: background 0.2s;
  opacity: ${({ disabled }) => disabled ? 0.7 : 1};

  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.primaryDark}; }
`

const RegisterText = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 24px;

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
    &:hover { text-decoration: underline; }
  }
`

