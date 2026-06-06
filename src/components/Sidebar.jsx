import { NavLink, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import {
  LayoutDashboard,
  Receipt,
  BarChart2,
  Settings,
  LogOut,
  Sprout,
  MessageCircle,
} from 'lucide-react'
import { mockUser } from '../data/mockData'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/gastos', icon: Receipt, label: 'Gastos' },
  { to: '/relatorios', icon: BarChart2, label: 'Relatórios' },
  { to: '/configuracoes', icon: Settings, label: 'Configurações' },
]

export default function Sidebar() {
  const navigate = useNavigate()

  return (
    <Aside>
      <LogoArea>
        <Sprout size={26} color="#40916C" />
        <LogoText>Guiar</LogoText>
      </LogoArea>

      <Nav>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavItem key={to} to={to}>
            <Icon size={20} />
            <span>{label}</span>
          </NavItem>
        ))}
      </Nav>

      <WhatsAppInfo>
        <MessageCircle size={16} color="#25D366" />
        <WhatsAppText>
          <strong>WhatsApp vinculado</strong>
          <span>{mockUser.phone}</span>
        </WhatsAppText>
      </WhatsAppInfo>

      <UserArea>
        <Avatar>{mockUser.name.charAt(0)}</Avatar>
        <UserInfo>
          <UserName>{mockUser.name.split(' ')[0]} {mockUser.name.split(' ')[1]}</UserName>
          <UserFarm>{mockUser.fazenda}</UserFarm>
        </UserInfo>
        <LogOutBtn onClick={() => navigate('/login')} title="Sair">
          <LogOut size={18} />
        </LogOutBtn>
      </UserArea>
    </Aside>
  )
}

const Aside = styled.aside`
  width: 240px;
  min-height: 100vh;
  background: #1B4332;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`

const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 24px 20px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
`

const LogoText = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: #fff;
`

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 16px 12px;
  flex: 1;
  gap: 4px;
`

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: rgba(255,255,255,0.65);
  transition: all 0.15s;

  &:hover {
    background: rgba(255,255,255,0.08);
    color: #fff;
  }

  &.active {
    background: #2D6A4F;
    color: #fff;
  }
`

const WhatsAppInfo = styled.div`
  margin: 0 12px 12px;
  padding: 10px 12px;
  background: rgba(37, 211, 102, 0.1);
  border: 1px solid rgba(37, 211, 102, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`

const WhatsAppText = styled.div`
  display: flex;
  flex-direction: column;

  strong {
    font-size: 0.75rem;
    color: #fff;
    font-weight: 600;
  }

  span {
    font-size: 0.7rem;
    color: rgba(255,255,255,0.5);
  }
`

const UserArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 12px;
  border-top: 1px solid rgba(255,255,255,0.08);
`

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  background: #40916C;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #fff;
  font-size: 0.9375rem;
  flex-shrink: 0;
`

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const UserName = styled.p`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const UserFarm = styled.p`
  font-size: 0.7rem;
  color: rgba(255,255,255,0.45);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const LogOutBtn = styled.button`
  color: rgba(255,255,255,0.4);
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transition: color 0.15s;

  &:hover {
    color: #fff;
  }
`
