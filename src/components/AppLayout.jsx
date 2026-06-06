import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import Sidebar from './Sidebar'

export default function AppLayout() {
  return (
    <Wrapper>
      <Sidebar />
      <Main>
        <Outlet />
      </Main>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
`

const Main = styled.main`
  flex: 1;
  overflow-y: auto;
  background: #F8F9FA;
`
