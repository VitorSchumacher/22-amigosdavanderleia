import { Component } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
  background: ${({ theme }) => theme?.colors?.background ?? '#f9fafb'};
  color: ${({ theme }) => theme?.colors?.text ?? '#111'};
`

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`

const Message = styled.p`
  font-size: 1rem;
  opacity: 0.7;
  margin-bottom: 1.5rem;
`

const Button = styled.button`
  padding: 0.6rem 1.4rem;
  border: none;
  border-radius: 6px;
  background: ${({ theme }) => theme?.colors?.primary ?? '#2563eb'};
  color: #fff;
  font-size: 0.95rem;
  cursor: pointer;

  &:hover {
    opacity: 0.85;
  }
`

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    if (this.props.onReset) this.props.onReset()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback(this.state.error, this.handleReset)

      return (
        <Wrapper>
          <Title>Algo deu errado</Title>
          <Message>
            {this.state.error?.message ?? 'Um erro inesperado ocorreu. Tente recarregar a página.'}
          </Message>
          <Button onClick={this.handleReset}>Tentar novamente</Button>
        </Wrapper>
      )
    }

    return this.props.children
  }
}
