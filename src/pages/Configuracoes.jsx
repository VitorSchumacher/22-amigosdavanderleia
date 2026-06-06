import styled from 'styled-components'
import { mockUser } from '../data/mockData'
import { MessageCircle } from 'lucide-react'

export default function Configuracoes() {
  return (
    <Page>
      <PageHeader>
        <PageTitle>Configurações</PageTitle>
        <PageSub>Dados da conta e preferências</PageSub>
      </PageHeader>

      <Section>
        <SectionTitle>Perfil</SectionTitle>
        <FormGrid>
          <Field>
            <Label>Nome completo</Label>
            <Input defaultValue={mockUser.name} />
          </Field>
          <Field>
            <Label>E-mail</Label>
            <Input type="email" defaultValue={mockUser.email} />
          </Field>
          <Field>
            <Label>Nome da fazenda</Label>
            <Input defaultValue={mockUser.fazenda} />
          </Field>
          <Field>
            <Label>Cidade / UF</Label>
            <Input defaultValue={mockUser.cidade} />
          </Field>
        </FormGrid>
        <SaveBtn>Salvar alterações</SaveBtn>
      </Section>

      <Section>
        <SectionTitle>WhatsApp vinculado</SectionTitle>
        <WhatsAppCard>
          <MessageCircle size={24} color="#25D366" />
          <WhatsAppInfo>
            <p><strong>{mockUser.phone}</strong></p>
            <p>Número usado para receber e registrar movimentações via WhatsApp</p>
          </WhatsAppInfo>
          <StatusBadge>Ativo</StatusBadge>
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
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

const SaveBtn = styled.button`
  background: #2D6A4F;
  color: #fff;
  padding: 10px 22px;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  transition: background 0.2s;

  &:hover { background: #1B4332; }
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
  background: #E9F5EE;
  color: #2D6A4F;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 99px;
`
