import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import { Sprout, Eye, EyeOff } from 'lucide-react'

export default function Cadastro() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    fazenda: '',
    cidade: '',
    password: '',
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handlePhoneChange(e) {
    let v = e.target.value.replace(/\D/g, '')
    if (v.length <= 11) {
      v = v
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d{4})$/, '$1-$2')
    }
    setForm({ ...form, telefone: v })
  }

  function handleSubmit(e) {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <PageWrapper>
      <Card>
        <Logo>
          <Sprout size={28} color="#2D6A4F" />
          <LogoText>AgroFinance</LogoText>
        </Logo>

        <Heading>Criar conta</Heading>
        <Subheading>Preencha seus dados para começar</Subheading>

        <Form onSubmit={handleSubmit}>
          <Row>
            <Field>
              <Label>Nome completo</Label>
              <Input name="nome" placeholder="João da Silva" value={form.nome} onChange={handleChange} required />
            </Field>
          </Row>

          <Row>
            <Field>
              <Label>E-mail</Label>
              <Input name="email" type="email" placeholder="seu@email.com" value={form.email} onChange={handleChange} required />
            </Field>
          </Row>

          <Row>
            <Field>
              <Label>
                WhatsApp
                <PhoneBadge>usado para identificação</PhoneBadge>
              </Label>
              <Input
                name="telefone"
                placeholder="(65) 99999-9999"
                value={form.telefone}
                onChange={handlePhoneChange}
                maxLength={15}
                required
              />
            </Field>
          </Row>

          <TwoCol>
            <Field>
              <Label>Nome da fazenda</Label>
              <Input name="fazenda" placeholder="Fazenda Boa Esperança" value={form.fazenda} onChange={handleChange} />
            </Field>
            <Field>
              <Label>Cidade / UF</Label>
              <Input name="cidade" placeholder="Sorriso - MT" value={form.cidade} onChange={handleChange} />
            </Field>
          </TwoCol>

          <Field>
            <Label>Senha</Label>
            <PasswordWrapper>
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 8 caracteres"
                value={form.password}
                onChange={handleChange}
                minLength={8}
                required
              />
              <EyeBtn type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </EyeBtn>
            </PasswordWrapper>
          </Field>

          <TermsText>
            Ao criar uma conta, você concorda com os <a href="#">Termos de Uso</a> e <a href="#">Política de Privacidade</a>.
          </TermsText>

          <SubmitBtn type="submit">Criar conta</SubmitBtn>
        </Form>

        <LoginText>
          Já tem conta? <Link to="/login">Entrar</Link>
        </LoginText>
      </Card>
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
  padding: 40px 40px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
`

const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1B4332;
`

const Heading = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1A1A2E;
  margin-bottom: 4px;
`

const Subheading = styled.p`
  font-size: 0.875rem;
  color: #6C757D;
  margin-bottom: 28px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Row = styled.div``

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
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
  display: flex;
  align-items: center;
  gap: 8px;
`

const PhoneBadge = styled.span`
  font-size: 0.7rem;
  font-weight: 400;
  background: #E9F5EE;
  color: #2D6A4F;
  padding: 2px 7px;
  border-radius: 99px;
`

const Input = styled.input`
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid #DEE2E6;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #1A1A2E;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #2D6A4F;
  }

  &::placeholder {
    color: #ADB5BD;
  }
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

const TermsText = styled.p`
  font-size: 0.8rem;
  color: #6C757D;
  line-height: 1.5;

  a {
    color: #2D6A4F;
    font-weight: 500;
    &:hover { text-decoration: underline; }
  }
`

const SubmitBtn = styled.button`
  background: #2D6A4F;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  padding: 13px;
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background: #1B4332;
  }
`

const LoginText = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: #6C757D;
  margin-top: 20px;

  a {
    color: #2D6A4F;
    font-weight: 600;
    &:hover { text-decoration: underline; }
  }
`
