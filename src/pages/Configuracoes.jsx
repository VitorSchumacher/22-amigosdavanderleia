import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { MessageCircle, Save } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

function maskPhone(v) {
  v = v.replace(/\D/g, '').slice(0, 11)
  return v
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{4})$/, '$1-$2')
}

export default function Configuracoes() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', phone: '', birthDate: '' })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        birthDate: user.birthDate ? user.birthDate.slice(0, 10) : '',
      })
    }
  }, [user])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: undefined })
    setSuccess(false)
  }

  function handlePhone(e) {
    setForm({ ...form, phone: maskPhone(e.target.value) })
    setSuccess(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrors({})
    setSuccess(false)
    setLoading(true)
    try {
      await updateUser(user.slug, {
        name: form.name,
        email: form.email,
        phone: form.phone.replace(/\D/g, ''),
        birthDate: form.birthDate,
      })
      setSuccess(true)
    } catch (err) {
      if (err.status === 422 && err.errors) {
        setErrors(err.errors)
      } else {
        setErrors({ global: err.message ?? 'Erro ao salvar alterações.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Page>
      <PageHeader>
        <PageTitle>Configurações</PageTitle>
        <PageSub>Dados da conta e preferências</PageSub>
      </PageHeader>

      <Section>
        <SectionTitle>Perfil</SectionTitle>
        <Form onSubmit={handleSubmit}>
          <FormGrid>
            <Field>
              <Label>Nome completo</Label>
              <Input name="name" value={form.name} onChange={handleChange} required />
              {errors.name && <FieldError>{errors.name[0]}</FieldError>}
            </Field>
            <Field>
              <Label>E-mail</Label>
              <Input name="email" type="email" value={form.email} onChange={handleChange} required />
              {errors.email && <FieldError>{errors.email[0]}</FieldError>}
            </Field>
            <Field>
              <Label>WhatsApp</Label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handlePhone}
                maxLength={15}
              />
              {errors.phone && <FieldError>{errors.phone[0]}</FieldError>}
            </Field>
            <Field>
              <Label>Data de nascimento</Label>
              <Input name="birthDate" type="date" value={form.birthDate} onChange={handleChange} />
              {errors.birthDate && <FieldError>{errors.birthDate[0]}</FieldError>}
            </Field>
          </FormGrid>

          {errors.global && <ErrorMsg>{errors.global}</ErrorMsg>}
          {success && <SuccessMsg>Alterações salvas com sucesso!</SuccessMsg>}

          <SaveBtn type="submit" disabled={loading}>
            <Save size={16} />
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </SaveBtn>
        </Form>
      </Section>

      <Section>
        <SectionTitle>WhatsApp vinculado</SectionTitle>
        <WhatsAppCard>
          <MessageCircle size={24} color="#25D366" />
          <WhatsAppInfo>
            <p><strong>{user?.phone || 'Não informado'}</strong></p>
            <p>Número usado para receber e registrar movimentações via WhatsApp</p>
          </WhatsAppInfo>
          <StatusBadge active={!!user?.phone}>
            {user?.phone ? 'Ativo' : 'Não vinculado'}
          </StatusBadge>
        </WhatsAppCard>
      </Section>
    </Page>
  )
}

const Page = styled.div`padding: 32px; max-width: 800px;`

const PageHeader = styled.div`margin-bottom: 28px;`
const PageTitle = styled.h1`font-size: 1.5rem; font-weight: 700; color: #1A1A2E;`
const PageSub = styled.p`font-size: 0.875rem; color: #6C757D; margin-top: 2px;`

const Section = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
  margin-bottom: 20px;
`

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #1A1A2E;
  margin-bottom: 18px;
`

const Form = styled.form``

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
`

const Field = styled.div`display: flex; flex-direction: column; gap: 6px;`

const Label = styled.label`font-size: 0.875rem; font-weight: 500; color: #1A1A2E;`

const Input = styled.input`
  padding: 10px 13px;
  border: 1.5px solid #DEE2E6;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #1A1A2E;
  outline: none;
  transition: border-color 0.2s;

  &:focus { border-color: #2D6A4F; }
`

const FieldError = styled.span`font-size: 0.78rem; color: #C62828;`

const ErrorMsg = styled.p`
  background: #FFF0EE;
  border: 1px solid #FFCDD2;
  color: #C62828;
  font-size: 0.875rem;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 14px;
`

const SuccessMsg = styled.p`
  background: #E9F5EE;
  border: 1px solid #B7DFC8;
  color: #1B4332;
  font-size: 0.875rem;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 14px;
`

const SaveBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #2D6A4F;
  color: #fff;
  padding: 10px 22px;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  transition: background 0.2s;
  opacity: ${({ disabled }) => disabled ? 0.7 : 1};

  &:hover:not(:disabled) { background: #1B4332; }
`

const WhatsAppCard = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  background: #F6FDF8;
  border: 1px solid #D3F0DC;
  border-radius: 10px;
  padding: 16px 18px;
`

const WhatsAppInfo = styled.div`
  flex: 1;

  p:first-child { font-size: 0.9375rem; color: #1A1A2E; }
  p:last-child { font-size: 0.8rem; color: #6C757D; margin-top: 2px; }
`

const StatusBadge = styled.span`
  background: ${({ active }) => active ? '#E9F5EE' : '#F1F3F5'};
  color: ${({ active }) => active ? '#2D6A4F' : '#6C757D'};
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 99px;
`
