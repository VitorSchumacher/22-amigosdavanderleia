import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import logoImg from '../assets/logo.png'
import { whatsapp } from '../services/api'

export default function WhatsappOTP() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const phone = state?.phone ?? ''
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(30)
  const [verified, setVerified] = useState(false)
  const inputs = useRef([])

  useEffect(() => {
    inputs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendCooldown])

  function handleChange(index, value) {
    if (!/^\d?$/.test(value)) return
    const next = [...digits]
    next[index] = value
    setDigits(next)
    setError('')
    if (value && index < 5) {
      inputs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const next = [...digits]
    for (let i = 0; i < 6; i++) next[i] = pasted[i] ?? ''
    setDigits(next)
    const focusIndex = Math.min(pasted.length, 5)
    inputs.current[focusIndex]?.focus()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const code = digits.join('')
    if (code.length < 6) {
      setError('Digite os 6 dígitos do código enviado.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await whatsapp.verifyOtp(code)
      setVerified(true)
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err) {
      if (err.status === 422 || err.status === 400) {
        setError('Código inválido. Verifique e tente novamente.')
      } else if (err.status === 410) {
        setError('Código expirado. Solicite um novo código.')
      } else {
        setError(err.message ?? 'Erro ao verificar. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (resendCooldown > 0) return
    try {
      await whatsapp.resendOtp()
    } catch (err) {
      setError(err.message ?? 'Erro ao reenviar código. Tente novamente.')
      return
    }
    setDigits(['', '', '', '', '', ''])
    setError('')
    setResendCooldown(30)
    inputs.current[0]?.focus()
  }

  if (verified) {
    return (
      <PageWrapper>
        <Card>
          <SuccessIcon>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="#40916C" fillOpacity="0.12" />
              <path d="M14 24l8 8 12-14" stroke="#2D6A4F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </SuccessIcon>
          <Heading>WhatsApp verificado!</Heading>
          <Subheading>Seu número foi vinculado com sucesso. Redirecionando...</Subheading>
        </Card>
        <Background />
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <Card>
        <Logo>
          <LogoImg src={logoImg} alt="Guiar" />
        </Logo>

        <WhatsappBadge>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Verificação WhatsApp
        </WhatsappBadge>

        <Heading>Confirme seu número</Heading>
        <Subheading>
          Enviamos um código de 6 dígitos via WhatsApp
          {phone ? <> para <strong>{phone}</strong></> : ''}.{' '}
          Digite abaixo para vincular sua conta.
        </Subheading>

        <Form onSubmit={handleSubmit}>
          <OTPRow onPaste={handlePaste}>
            {digits.map((d, i) => (
              <OTPInput
                key={i}
                ref={el => (inputs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                filled={!!d}
                autoComplete="one-time-code"
              />
            ))}
          </OTPRow>

          {error && <ErrorMsg>{error}</ErrorMsg>}

          <SubmitBtn type="submit" disabled={loading || digits.join('').length < 6}>
            {loading ? 'Verificando...' : 'Confirmar código'}
          </SubmitBtn>
        </Form>

        <ResendRow>
          {resendCooldown > 0 ? (
            <ResendText>Reenviar código em <strong>{resendCooldown}s</strong></ResendText>
          ) : (
            <ResendBtn type="button" onClick={handleResend}>
              Reenviar código
            </ResendBtn>
          )}
        </ResendRow>
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
  text-align: center;
`

const Logo = styled.div`
  margin-bottom: 24px;
  display: flex;
  justify-content: flex-start;
`

const LogoImg = styled.img`
  height: 44px;
  width: auto;
`

const WhatsappBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #F0FFF4;
  border: 1px solid #C6F6D5;
  color: #276749;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 999px;
  margin-bottom: 20px;
`

const Heading = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1A1A2E;
  margin-bottom: 8px;
`

const Subheading = styled.p`
  font-size: 0.875rem;
  color: #6C757D;
  margin-bottom: 32px;
  line-height: 1.6;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

const OTPRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`

const OTPInput = styled.input`
  width: 48px;
  height: 56px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1A1A2E;
  border: 2px solid ${({ filled }) => filled ? '#2D6A4F' : '#DEE2E6'};
  border-radius: 10px;
  outline: none;
  background: ${({ filled }) => filled ? '#F0FFF4' : '#fff'};
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
  caret-color: #2D6A4F;

  &:focus {
    border-color: #2D6A4F;
    box-shadow: 0 0 0 3px rgba(45, 106, 79, 0.15);
  }

  &::selection { background: #C6F6D5; }
`

const ErrorMsg = styled.p`
  width: 100%;
  background: #FFF0EE;
  border: 1px solid #FFCDD2;
  color: #C62828;
  font-size: 0.875rem;
  padding: 10px 14px;
  border-radius: 8px;
  text-align: left;
`

const SubmitBtn = styled.button`
  width: 100%;
  background: #2D6A4F;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  padding: 13px;
  border-radius: 8px;
  transition: background 0.2s;
  opacity: ${({ disabled }) => disabled ? 0.55 : 1};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};

  &:hover:not(:disabled) { background: #1B4332; }
`

const ResendRow = styled.div`
  margin-top: 20px;
`

const ResendText = styled.p`
  font-size: 0.875rem;
  color: #6C757D;
`

const ResendBtn = styled.button`
  font-size: 0.875rem;
  font-weight: 600;
  color: #2D6A4F;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`

const SuccessIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`

const Background = styled.div`
  position: fixed;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  z-index: 0;
`
