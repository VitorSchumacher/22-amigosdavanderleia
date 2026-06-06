import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import styled, { keyframes, css } from 'styled-components'
import {
  Sprout, MessageCircle, LayoutDashboard, Bot, TrendingUp,
  CloudRain, ArrowRight, ChevronDown, CheckCircle2, Smartphone,
  BarChart2, Wheat, MapPin, Users, Star, Menu, X,
  FileText, ShieldCheck, Package,
} from 'lucide-react'
import logoImg from '../assets/logo.png'
import { useInView } from '../hooks/useInView'

/* ─── IMAGES ─────────────────────────────────────────────────── */
const IMG_HERO    = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80'
const IMG_FIELD   = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80'
const IMG_FARMER  = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=900&q=80'
const IMG_AERIAL  = 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=900&q=80'
const IMG_TRACTOR = 'https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?w=900&q=80'

/* ─── ANIMATIONS ──────────────────────────────────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
`
const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-12px); }
`
const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
`
const slideRight = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
`
const scaleIn = keyframes`
  from { transform: scale(0.85); opacity: 0; }
  to   { transform: scale(1);    opacity: 1; }
`
const tickerMove = keyframes`
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`
const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

const animateWhen = (inView, animation, delay = '0s', duration = '0.7s') =>
  inView
    ? css`animation: ${animation} ${duration} ease forwards ${delay};`
    : css`opacity: 0;`

/* ─── COUNTER ─────────────────────────────────────────────────── */
function Counter({ to, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView()
  const started = useRef(false)

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.floor(eased * to))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, to, duration])

  return <span ref={ref}>{count.toLocaleString('pt-BR')}{suffix}</span>
}

/* ─── COMPONENT ───────────────────────────────────────────────── */
export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const [heroRef, heroIn]         = useInView(0.05)
  const [statsRef, statsIn]       = useInView()
  const [featRef, featIn]         = useInView()
  const [howRef, howIn]           = useInView()
  const [fieldRef, fieldIn]       = useInView()
  const [previewRef, previewIn]   = useInView()
  const [testRef, testIn]         = useInView()
  const [ctaRef, ctaIn]           = useInView()

  const ticker = [
    '🌱 Soja · R$ 145,50/sc · +2,3%',
    '🌽 Milho · R$ 37,80/sc · -0,8%',
    '☁️ Algodão · R$ 89,20/@ · +1,1%',
    '🌧️ Chuva prevista: 12mm amanhã em Sorriso-MT',
    '📊 Controle seus gastos em tempo real',
    '🌱 Soja · R$ 145,50/sc · +2,3%',
    '🌽 Milho · R$ 37,80/sc · -0,8%',
    '☁️ Algodão · R$ 89,20/@ · +1,1%',
    '🌧️ Chuva prevista: 12mm amanhã em Sorriso-MT',
    '📊 Controle seus gastos em tempo real',
  ]

  return (
    <Wrapper>

      {/* ── NAVBAR ── */}
      <Navbar scrolled={scrolled}>
        <NavInner>
          <NavLogo>
            <NavLogoImg src={logoImg} alt="Guiar" />
          </NavLogo>
          <NavLinks>
            <a href="#funcionalidades">Funcionalidades</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#campo">Seu campo</a>
          </NavLinks>
          <NavActions>
            <NavLink to="/login">Entrar</NavLink>
            <NavCta to="/cadastro">Começar grátis</NavCta>
          </NavActions>
          <HamburgerBtn onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </HamburgerBtn>
        </NavInner>
        {menuOpen && (
          <MobileMenu>
            <a href="#funcionalidades" onClick={() => setMenuOpen(false)}>Funcionalidades</a>
            <a href="#como-funciona" onClick={() => setMenuOpen(false)}>Como funciona</a>
            <a href="#campo" onClick={() => setMenuOpen(false)}>Seu campo</a>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Entrar</Link>
            <Link to="/cadastro" onClick={() => setMenuOpen(false)} style={{ background: '#2D6A4F', color: '#fff', borderRadius: '8px', padding: '10px 16px' }}>
              Começar grátis
            </Link>
          </MobileMenu>
        )}
      </Navbar>

      {/* ── TICKER ── */}
      <Ticker>
        <TickerTrack>
          {ticker.map((t, i) => (
            <TickerItem key={i}>{t}</TickerItem>
          ))}
        </TickerTrack>
      </Ticker>

      {/* ── HERO ── */}
      <Hero ref={heroRef} bg={IMG_HERO}>
        <HeroOverlay />
        <HeroContent>
          <HeroBadge inView={heroIn}>
            <PulseDot />
            Mais de 500 produtores já usam
          </HeroBadge>
          <HeroTitle inView={heroIn}>
            Controle financeiro feito para quem vive da terra
          </HeroTitle>
          <HeroSub inView={heroIn}>
            Registre seus gastos pelo <strong>WhatsApp</strong>, visualize tudo num dashboard
            completo e deixe a IA responder suas dúvidas sobre cotações, clima e muito mais.
          </HeroSub>
          <HeroActions inView={heroIn}>
            <HeroCta to="/cadastro">
              Começar grátis <ArrowRight size={18} />
            </HeroCta>
            <HeroSecondary href="#como-funciona">
              Ver como funciona <ChevronDown size={16} />
            </HeroSecondary>
          </HeroActions>
          <HeroTags inView={heroIn}>
            {['Sem mensalidade no 1º mês', 'Funciona no seu WhatsApp', 'Setup em 2 minutos'].map(t => (
              <HeroTag key={t}><CheckCircle2 size={14} />{t}</HeroTag>
            ))}
          </HeroTags>
        </HeroContent>
        <HeroImageCard inView={heroIn}>
          <PhoneMockup>
            <PhoneScreen>
              <PhoneHeader>
                <Sprout size={14} color="#40916C" />
                <span>Guiar IA</span>
                <OnlineStatus />
              </PhoneHeader>
              <PhoneBubble bot>Olá João! Soja fechou hoje a R$ 145,50/sc. Alta de 2,3% 📈</PhoneBubble>
              <PhoneBubble>gastei 4800 com herbicida hoje</PhoneBubble>
              <PhoneBubble bot>✅ Gasto registrado!<br/>🌱 Insumos · R$ 4.800,00<br/>Saldo atual: R$ 18.900,00</PhoneBubble>
              <PhoneTyping><PulseDot small />digitando...</PhoneTyping>
            </PhoneScreen>
          </PhoneMockup>
        </HeroImageCard>
        <ScrollHint href="#stats"><ChevronDown size={22} /></ScrollHint>
      </Hero>

      {/* ── STATS ── */}
      <StatsBar ref={statsRef} id="stats">
        {[
          { val: 500, suffix: '+', label: 'Produtores ativos' },
          { val: 12000, suffix: '+', label: 'Lançamentos registrados' },
          { val: 98, suffix: '%', label: 'Satisfação' },
          { val: 8, suffix: 'M+', label: 'Em gastos gerenciados' },
        ].map(({ val, suffix, label }, i) => (
          <StatItem key={i} inView={statsIn} delay={`${i * 0.12}s`}>
            <StatValue><Counter to={val} suffix={suffix} /></StatValue>
            <StatLabel>{label}</StatLabel>
          </StatItem>
        ))}
      </StatsBar>

      {/* ── FEATURES ── */}
      <Section id="funcionalidades" ref={featRef}>
        <SectionTag inView={featIn}>Funcionalidades</SectionTag>
        <SectionTitle inView={featIn}>Tudo que você precisa, onde você já está</SectionTitle>
        <SectionSub inView={featIn}>
          Sem aplicativo novo para aprender. Só o WhatsApp que você já usa todo dia.
        </SectionSub>
        <FeatGrid>
          {[
            {
              icon: <MessageCircle size={28} color="#25D366" />,
              bg: '#E7FBEF',
              title: 'WhatsApp First',
              desc: 'Registre gastos e receitas com uma mensagem simples. A IA entende linguagem natural — sem formulários, sem complicação.',
              tag: 'Mais usado',
            },
            {
              icon: <LayoutDashboard size={28} color="#4C6EF5" />,
              bg: '#EEF2FF',
              title: 'Dashboard Completo',
              desc: 'Visualize gráficos de evolução, gastos por categoria, saldo e relatórios da safra em tempo real pelo navegador.',
              tag: null,
            },
            {
              icon: <Bot size={28} color="#F4A261" />,
              bg: '#FFF8EE',
              title: 'IA Especializada',
              desc: 'Pergunte sobre cotação da soja, previsão do tempo, alertas de tempestade ou faça análises do seu financeiro.',
              tag: 'Diferencial',
            },
            {
              icon: <TrendingUp size={28} color="#E63946" />,
              bg: '#FFF0EE',
              title: 'Relatórios por Safra',
              desc: 'Compare safras, identifique onde está gastando mais e tome decisões baseadas em dados reais da sua fazenda.',
              tag: null,
            },
            {
              icon: <CloudRain size={28} color="#457B9D" />,
              bg: '#EEF6FF',
              title: 'Alertas Climáticos',
              desc: 'Receba alertas de chuva forte, granizo e geada direto no WhatsApp antes de sair para o campo.',
              tag: null,
            },
            {
              icon: <Wheat size={28} color="#2D6A4F" />,
              bg: '#E9F5EE',
              title: 'Cotações em Tempo Real',
              desc: 'Soja, milho, algodão e mais. Acompanhe a variação diária e receba avisos quando atingir o preço-alvo.',
              tag: null,
            },
            {
              icon: <FileText size={28} color="#6B46C1" />,
              bg: '#F3F0FF',
              title: 'Emissão de NF-e / NFS-e',
              desc: 'Emita notas fiscais eletrônicas diretamente pela plataforma, com transmissão automática à SEFAZ e DANFE disponível para download.',
              tag: 'Novo',
            },
            {
              icon: <ShieldCheck size={28} color="#1D4ED8" />,
              bg: '#EFF6FF',
              title: 'Integração SEFAZ',
              desc: 'Receba automaticamente todas as NF-e emitidas no seu CNPJ — receitas e despesas são lançadas sem nenhum lançamento manual.',
              tag: 'Novo',
            },
            {
              icon: <Package size={28} color="#B45309" />,
              bg: '#FFFBEB',
              title: 'Controle de Estoque',
              desc: 'Gerencie insumos, combustíveis e materiais da propriedade. Receba alertas de estoque baixo e vincule entradas às NF-e.',
              tag: 'Novo',
            },
          ].map(({ icon, bg, title, desc, tag }, i) => (
            <FeatCard key={i} inView={featIn} delay={`${0.1 + i * 0.09}s`}>
              {tag && <FeatTag>{tag}</FeatTag>}
              <FeatIcon bg={bg}>{icon}</FeatIcon>
              <FeatTitle>{title}</FeatTitle>
              <FeatDesc>{desc}</FeatDesc>
            </FeatCard>
          ))}
        </FeatGrid>
      </Section>

      {/* ── HOW IT WORKS ── */}
      <HowSection id="como-funciona" ref={howRef}>
        <SectionTag inView={howIn} light>Como funciona</SectionTag>
        <SectionTitle inView={howIn} light>Simples como mandar uma mensagem</SectionTitle>
        <StepsGrid>
          {[
            {
              num: '01',
              icon: <Smartphone size={24} color="#40916C" />,
              title: 'Cadastre-se na web',
              desc: 'Crie sua conta em 2 minutos e informe seu número de WhatsApp. É só isso.',
            },
            {
              num: '02',
              icon: <MessageCircle size={24} color="#25D366" />,
              title: 'Registre pelo WhatsApp',
              desc: 'Mande uma mensagem como "gastei R$ 2.400 em diesel hoje" e pronto — a IA registra automaticamente.',
            },
            {
              num: '03',
              icon: <BarChart2 size={24} color="#4C6EF5" />,
              title: 'Visualize no dashboard',
              desc: 'Acesse pelo celular ou computador e veja seus gráficos, saldo e relatórios da safra atualizados.',
            },
          ].map(({ num, icon, title, desc }, i) => (
            <StepCard key={i} inView={howIn} delay={`${0.15 + i * 0.15}s`}>
              <StepNum>{num}</StepNum>
              <StepIconWrap>{icon}</StepIconWrap>
              <StepTitle>{title}</StepTitle>
              <StepDesc>{desc}</StepDesc>
              {i < 2 && <StepArrow><ArrowRight size={20} /></StepArrow>}
            </StepCard>
          ))}
        </StepsGrid>
        <HowImage inView={howIn}>
          <img src={IMG_FARMER} alt="Produtor rural usando celular no campo" loading="lazy" />
          <HowImageOverlay>
            <HowImageTag>
              <MessageCircle size={14} color="#25D366" />
              "quanto gastei com insumos esse mês?"
            </HowImageTag>
          </HowImageOverlay>
        </HowImage>
      </HowSection>

      {/* ── CAMPO DE PLANTIO ── */}
      <FieldSection id="campo" ref={fieldRef} bg={IMG_FIELD}>
        <FieldOverlay />
        <FieldContent>
          <FieldLeft>
            <SectionTag inView={fieldIn} light>Seu campo, suas finanças</SectionTag>
            <FieldTitle inView={fieldIn}>
              Do plantio à colheita,<br />cada centavo registrado
            </FieldTitle>
            <FieldDesc inView={fieldIn}>
              Acompanhe os custos de cada talhão da sua propriedade. Saiba exatamente quanto custou
              plantar, tratar e colher cada hectare — e compare safra a safra.
            </FieldDesc>
            <FieldList inView={fieldIn}>
              {[
                'Controle de insumos por área plantada',
                'Custo por saca produzida',
                'Comparativo safra anterior',
                'Alertas de estouro de orçamento',
                'Integração com previsão do tempo',
                'Emissão de NF-e e NFS-e integrada à SEFAZ',
                'Recebimento automático de notas de receitas e despesas',
                'Controle de estoque com alertas de nível mínimo',
              ].map(item => (
                <FieldListItem key={item}>
                  <CheckCircle2 size={16} color="#74C69D" />
                  {item}
                </FieldListItem>
              ))}
            </FieldList>
            <FieldCta to="/cadastro" inView={fieldIn}>
              Começar agora <ArrowRight size={18} />
            </FieldCta>
          </FieldLeft>
          <FieldRight inView={fieldIn}>
            <AerialCard>
              <img src={IMG_AERIAL} alt="Vista aérea de campo plantado" loading="lazy" />
              <AerialBadge>
                <MapPin size={13} />
                Fazenda Boa Esperança · 340 ha
              </AerialBadge>
              <AerialStats>
                <AerialStat>
                  <span>Custo/ha</span>
                  <strong>R$ 2.840</strong>
                </AerialStat>
                <AerialDivider />
                <AerialStat>
                  <span>Produtividade</span>
                  <strong>58 sc/ha</strong>
                </AerialStat>
                <AerialDivider />
                <AerialStat>
                  <span>Margem</span>
                  <strong color="#40916C">+34%</strong>
                </AerialStat>
              </AerialStats>
            </AerialCard>
          </FieldRight>
        </FieldContent>
      </FieldSection>

      {/* ── DASHBOARD PREVIEW ── */}
      <Section ref={previewRef}>
        <SectionTag inView={previewIn}>Dashboard</SectionTag>
        <SectionTitle inView={previewIn}>Tudo numa tela só</SectionTitle>
        <SectionSub inView={previewIn}>
          Visualize seu financeiro completo, cotações e previsão do tempo em um único lugar.
        </SectionSub>
        <PreviewWrapper inView={previewIn}>
          <PreviewBar>
            <BarDot color="#FF5F57" /><BarDot color="#FEBC2E" /><BarDot color="#28C840" />
            <BarUrl>agrofinance.com.br/dashboard</BarUrl>
          </PreviewBar>
          <PreviewScreen>
            <PreviewSidebar>
              <PreviewLogo><Sprout size={16} color="#40916C" />Guiar</PreviewLogo>
              {['Dashboard', 'Gastos', 'Relatórios'].map((item, i) => (
                <PreviewNavItem key={item} active={i === 0}>{item}</PreviewNavItem>
              ))}
            </PreviewSidebar>
            <PreviewContent>
              <PreviewCards>
                {[
                  { label: 'Saldo', val: 'R$ 18.900', color: '#2D6A4F' },
                  { label: 'Entradas', val: 'R$ 47.500', color: '#40916C' },
                  { label: 'Saídas', val: 'R$ 43.600', color: '#E63946' },
                  { label: 'Resultado', val: 'R$ 3.900', color: '#F4A261' },
                ].map(c => (
                  <PreviewCard key={c.label} color={c.color}>
                    <PreviewCardLabel>{c.label}</PreviewCardLabel>
                    <PreviewCardVal>{c.val}</PreviewCardVal>
                  </PreviewCard>
                ))}
              </PreviewCards>
              <PreviewChartArea>
                <PreviewChartTitle>Evolução Mensal</PreviewChartTitle>
                <PreviewChart>
                  {[40, 55, 35, 70, 85, 20].map((h, i) => (
                    <PreviewBarGroup key={i}>
                      <PreviewBarItem height={h * 0.6} color="#40916C" />
                      <PreviewBarItem height={h * 0.5} color="#E63946" />
                    </PreviewBarGroup>
                  ))}
                </PreviewChart>
              </PreviewChartArea>
            </PreviewContent>
          </PreviewScreen>
        </PreviewWrapper>
      </Section>

      {/* ── TESTIMONIALS ── */}
      <TestSection ref={testRef}>
        <SectionTag inView={testIn}>Depoimentos</SectionTag>
        <SectionTitle inView={testIn}>O que os produtores falam</SectionTitle>
        <TestGrid>
          {[
            {
              name: 'João Aparecido',
              local: 'Sorriso - MT · Soja/Milho',
              text: 'Antes eu anotava tudo no caderno e sempre perdia. Agora mando uma mensagem no WhatsApp e já tá registrado. Muito prático.',
              stars: 5,
              img: 'https://i.pravatar.cc/80?img=11',
            },
            {
              name: 'Maria Fernanda',
              local: 'Campo Verde - MT · Algodão',
              text: 'Os alertas de chuva no WhatsApp me salvaram duas vezes de pulverizar antes de temporal. Isso sozinho já valeu.',
              stars: 5,
              img: 'https://i.pravatar.cc/80?img=47',
            },
            {
              name: 'Carlos Henrique',
              local: 'Lucas do Rio Verde - MT · Soja',
              text: 'O dashboard mostra custo por hectare da safra. Nunca tinha esse controle antes. Agora sei exatamente onde estou perdendo.',
              stars: 5,
              img: 'https://i.pravatar.cc/80?img=33',
            },
          ].map(({ name, local, text, stars, img }, i) => (
            <TestCard key={i} inView={testIn} delay={`${0.1 + i * 0.12}s`}>
              <TestStars>{Array.from({ length: stars }).map((_, j) => <Star key={j} size={14} fill="#F4A261" color="#F4A261" />)}</TestStars>
              <TestText>"{text}"</TestText>
              <TestAuthor>
                <TestAvatar src={img} alt={name} />
                <TestAuthorInfo>
                  <strong>{name}</strong>
                  <span><MapPin size={11} />{local}</span>
                </TestAuthorInfo>
              </TestAuthor>
            </TestCard>
          ))}
        </TestGrid>
      </TestSection>

      {/* ── CTA ── */}
      <CtaSection ref={ctaRef} bg={IMG_TRACTOR}>
        <CtaOverlay />
        <CtaContent inView={ctaIn}>
          <CtaTitle>Pronto para ter controle de verdade?</CtaTitle>
          <CtaSub>Cadastre-se agora, é grátis no primeiro mês. Sem cartão de crédito.</CtaSub>
          <CtaActions>
            <CtaBtn to="/cadastro">Criar minha conta <ArrowRight size={18} /></CtaBtn>
            <CtaLink to="/login">Já tenho conta</CtaLink>
          </CtaActions>
        </CtaContent>
      </CtaSection>

      {/* ── FOOTER ── */}
      <Footer>
        <FooterInner>
          <FooterLogo>
            <FooterLogoImg src={logoImg} alt="Guiar" />
          </FooterLogo>
          <FooterTagline>Gestão financeira para o produtor rural brasileiro.</FooterTagline>
        </FooterInner>
        <FooterBottom>
          <span>© 2026 Guiar. Todos os direitos reservados.</span>
          <span>Feito com ❤️ para o campo brasileiro</span>
        </FooterBottom>
      </Footer>

    </Wrapper>
  )
}

/* ─── STYLES ──────────────────────────────────────────────────── */

const Wrapper = styled.div`
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
`

/* NAVBAR */
const Navbar = styled.header`
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  transition: all 0.3s;
  background: ${({ scrolled }) => scrolled ? 'rgba(10,22,40,0.95)' : 'transparent'};
  backdrop-filter: ${({ scrolled }) => scrolled ? 'blur(12px)' : 'none'};
  border-bottom: ${({ scrolled }) => scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none'};
`

const NavInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 68px;
  display: flex;
  align-items: center;
  gap: 32px;
`

const NavLogo = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`

const NavLogoImg = styled.img`
  height: 32px;
  width: auto;
  filter: brightness(0) invert(1);
`

const NavLinks = styled.nav`
  display: flex;
  gap: 28px;
  flex: 1;

  a {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.75);
    transition: color 0.2s;
    &:hover { color: #fff; }
  }

  @media (max-width: 768px) { display: none; }
`

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
  @media (max-width: 768px) { display: none; }
`

const NavLink = styled(Link)`
  font-size: 0.9rem;
  color: rgba(255,255,255,0.8);
  font-weight: 500;
  padding: 7px 14px;
  border-radius: 7px;
  transition: all 0.2s;
  &:hover { color: #fff; background: rgba(255,255,255,0.08); }
`

const NavCta = styled(Link)`
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  background: #2D6A4F;
  padding: 8px 18px;
  border-radius: 8px;
  transition: background 0.2s;
  &:hover { background: #40916C; }
`

const HamburgerBtn = styled.button`
  display: none;
  color: #fff;
  margin-left: auto;
  @media (max-width: 768px) { display: flex; }
`

const MobileMenu = styled.div`
  background: rgba(10,22,40,0.98);
  padding: 16px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top: 1px solid rgba(255,255,255,0.08);

  a {
    color: rgba(255,255,255,0.85);
    font-size: 1rem;
    font-weight: 500;
  }
`

/* TICKER */
const Ticker = styled.div`
  position: fixed;
  top: 68px;
  left: 0; right: 0;
  z-index: 99;
  background: rgba(27,67,50,0.9);
  backdrop-filter: blur(8px);
  height: 36px;
  overflow: hidden;
  display: flex;
  align-items: center;
`

const TickerTrack = styled.div`
  display: flex;
  white-space: nowrap;
  animation: ${tickerMove} 40s linear infinite;
`

const TickerItem = styled.span`
  padding: 0 48px;
  font-size: 0.78rem;
  color: rgba(255,255,255,0.8);
  font-weight: 500;
`

/* HERO */
const Hero = styled.section`
  min-height: 100vh;
  background: url(${({ bg }) => bg}) center/cover no-repeat;
  display: flex;
  align-items: center;
  position: relative;
  padding: 140px 5% 80px;
  gap: 48px;
`

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(10,22,40,0.85) 0%,
    rgba(27,67,50,0.75) 60%,
    rgba(10,22,40,0.5) 100%
  );
`

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 600px;
  flex: 1;
`

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(64,145,108,0.25);
  border: 1px solid rgba(64,145,108,0.5);
  color: #74C69D;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 99px;
  margin-bottom: 20px;
  ${({ inView }) => animateWhen(inView, fadeUp, '0s', '0.6s')}
`

const PulseDot = styled.span`
  width: ${({ small }) => small ? '6px' : '8px'};
  height: ${({ small }) => small ? '6px' : '8px'};
  background: #40916C;
  border-radius: 50%;
  display: inline-block;
  animation: ${pulse} 1.5s ease-in-out infinite;
  flex-shrink: 0;
`

const HeroTitle = styled.h1`
  font-size: clamp(2rem, 4.5vw, 3.25rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.15;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #fff 40%, #74C69D 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  ${({ inView }) => animateWhen(inView, fadeUp, '0.1s', '0.7s')}
`

const HeroSub = styled.p`
  font-size: 1.0625rem;
  color: rgba(255,255,255,0.75);
  line-height: 1.7;
  margin-bottom: 32px;
  strong { color: #fff; }
  ${({ inView }) => animateWhen(inView, fadeUp, '0.2s', '0.7s')}
`

const HeroActions = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 28px;
  ${({ inView }) => animateWhen(inView, fadeUp, '0.3s', '0.7s')}
`

const HeroCta = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #2D6A4F, #40916C);
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  padding: 14px 28px;
  border-radius: 10px;
  transition: all 0.25s;
  box-shadow: 0 8px 24px rgba(45,106,79,0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(45,106,79,0.55);
  }
`

const HeroSecondary = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: rgba(255,255,255,0.8);
  font-weight: 500;
  font-size: 0.9375rem;
  padding: 14px 20px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.2);
  transition: all 0.2s;

  &:hover { background: rgba(255,255,255,0.08); color: #fff; }
`

const HeroTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  ${({ inView }) => animateWhen(inView, fadeUp, '0.4s', '0.7s')}
`

const HeroTag = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.65);
`

const HeroImageCard = styled.div`
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  animation: ${float} 6s ease-in-out infinite;
  ${({ inView }) => inView ? css`opacity: 1;` : css`opacity: 0;`}
  transition: opacity 0.8s ease 0.5s;

  @media (max-width: 900px) { display: none; }
`

const PhoneMockup = styled.div`
  width: 280px;
  background: #1A1A2E;
  border-radius: 32px;
  padding: 12px;
  box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 0 2px rgba(255,255,255,0.1);
`

const PhoneScreen = styled.div`
  background: #0D1117;
  border-radius: 24px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 340px;
`

const PhoneHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.06);

  span {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.8);
    font-weight: 600;
    flex: 1;
  }
`

const OnlineStatus = styled.div`
  width: 8px; height: 8px;
  background: #25D366;
  border-radius: 50%;
`

const PhoneBubble = styled.div`
  padding: 10px 12px;
  border-radius: ${({ bot }) => bot ? '4px 14px 14px 14px' : '14px 4px 14px 14px'};
  background: ${({ bot }) => bot ? '#1E3A2F' : '#2D6A4F'};
  color: rgba(255,255,255,0.9);
  font-size: 0.78rem;
  line-height: 1.55;
  max-width: 88%;
  align-self: ${({ bot }) => bot ? 'flex-start' : 'flex-end'};
`

const PhoneTyping = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  color: rgba(255,255,255,0.35);
`

const ScrollHint = styled.a`
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255,255,255,0.4);
  animation: ${float} 2s ease-in-out infinite;
  z-index: 1;
`

/* STATS */
const StatsBar = styled.div`
  background: #1B4332;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0;
`

const StatItem = styled.div`
  padding: 36px 48px;
  text-align: center;
  border-right: 1px solid rgba(255,255,255,0.08);
  flex: 1;
  min-width: 160px;
  ${({ inView, delay }) => animateWhen(inView, fadeUp, delay)}

  &:last-child { border-right: none; }
`

const StatValue = styled.p`
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, #fff, #74C69D);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 4px;
`

const StatLabel = styled.p`
  font-size: 0.85rem;
  color: rgba(255,255,255,0.5);
`

/* SECTIONS */
const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 96px 24px;
  text-align: center;
`

const SectionTag = styled.p`
  display: inline-block;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ light }) => light ? '#74C69D' : '#2D6A4F'};
  background: ${({ light }) => light ? 'rgba(64,145,108,0.15)' : '#E9F5EE'};
  padding: 4px 14px;
  border-radius: 99px;
  margin-bottom: 14px;
  ${({ inView }) => animateWhen(inView, fadeUp, '0s', '0.6s')}
`

const SectionTitle = styled.h2`
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 800;
  color: ${({ light }) => light ? '#fff' : '#1A1A2E'};
  margin-bottom: 14px;
  line-height: 1.2;
  ${({ inView }) => animateWhen(inView, fadeUp, '0.1s', '0.6s')}
`

const SectionSub = styled.p`
  font-size: 1.0625rem;
  color: #6C757D;
  max-width: 540px;
  margin: 0 auto 56px;
  line-height: 1.6;
  ${({ inView }) => animateWhen(inView, fadeUp, '0.2s', '0.6s')}
`

/* FEATURES */
const FeatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  text-align: left;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`

const FeatCard = styled.div`
  background: #fff;
  border: 1px solid #F1F3F5;
  border-radius: 16px;
  padding: 28px;
  position: relative;
  transition: all 0.25s;
  ${({ inView, delay }) => animateWhen(inView, fadeUp, delay)}

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 36px rgba(0,0,0,0.1);
    border-color: #D3F0DC;
  }
`

const FeatTag = styled.span`
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 0.7rem;
  font-weight: 700;
  background: linear-gradient(135deg, #2D6A4F, #40916C);
  color: #fff;
  padding: 3px 10px;
  border-radius: 99px;
`

const FeatIcon = styled.div`
  width: 52px; height: 52px;
  border-radius: 12px;
  background: ${({ bg }) => bg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`

const FeatTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #1A1A2E;
  margin-bottom: 8px;
`

const FeatDesc = styled.p`
  font-size: 0.875rem;
  color: #6C757D;
  line-height: 1.6;
`

/* HOW IT WORKS */
const HowSection = styled.section`
  background: linear-gradient(135deg, #0A1628 0%, #1B4332 100%);
  padding: 96px 5%;
  text-align: center;
`

const StepsGrid = styled.div`
  max-width: 900px;
  margin: 0 auto 56px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  position: relative;
  text-align: left;

  @media (max-width: 700px) { grid-template-columns: 1fr; }
`

const StepCard = styled.div`
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 28px;
  position: relative;
  ${({ inView, delay }) => animateWhen(inView, fadeUp, delay)}
`

const StepNum = styled.span`
  font-size: 2.5rem;
  font-weight: 900;
  color: rgba(255,255,255,0.06);
  line-height: 1;
  display: block;
  margin-bottom: 12px;
`

const StepIconWrap = styled.div`
  width: 44px; height: 44px;
  background: rgba(255,255,255,0.08);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
`

const StepTitle = styled.h3`
  font-size: 0.9375rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
`

const StepDesc = styled.p`
  font-size: 0.85rem;
  color: rgba(255,255,255,0.55);
  line-height: 1.6;
`

const StepArrow = styled.div`
  position: absolute;
  right: -18px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255,255,255,0.2);
  z-index: 2;

  @media (max-width: 700px) { display: none; }
`

const HowImage = styled.div`
  max-width: 700px;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 24px 80px rgba(0,0,0,0.4);
  ${({ inView }) => animateWhen(inView, scaleIn, '0.3s', '0.8s')}

  img {
    width: 100%;
    height: 340px;
    object-fit: cover;
    display: block;
  }
`

const HowImageOverlay = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
`

const HowImageTag = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(10,22,40,0.85);
  backdrop-filter: blur(8px);
  color: rgba(255,255,255,0.9);
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 10px 16px;
  border-radius: 99px;
  border: 1px solid rgba(255,255,255,0.1);
`

/* FIELD SECTION */
const FieldSection = styled.section`
  min-height: 600px;
  background: url(${({ bg }) => bg}) center/cover no-repeat;
  position: relative;
  display: flex;
  align-items: center;
  padding: 96px 5%;
`

const FieldOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(10,22,40,0.92) 0%,
    rgba(27,67,50,0.8) 50%,
    rgba(10,22,40,0.4) 100%
  );
`

const FieldContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  align-items: center;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
`

const FieldLeft = styled.div``

const FieldTitle = styled.h2`
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 18px;
  ${({ inView }) => animateWhen(inView, fadeUp, '0.1s', '0.7s')}
`

const FieldDesc = styled.p`
  font-size: 1rem;
  color: rgba(255,255,255,0.7);
  line-height: 1.7;
  margin-bottom: 24px;
  ${({ inView }) => animateWhen(inView, fadeUp, '0.2s', '0.7s')}
`

const FieldList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 32px;
  ${({ inView }) => animateWhen(inView, fadeUp, '0.3s', '0.7s')}
`

const FieldListItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.8);
`

const FieldCta = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #2D6A4F, #40916C);
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  padding: 14px 28px;
  border-radius: 10px;
  transition: all 0.25s;
  box-shadow: 0 8px 24px rgba(45,106,79,0.4);
  ${({ inView }) => animateWhen(inView, fadeUp, '0.4s', '0.7s')}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(45,106,79,0.55);
  }
`

const FieldRight = styled.div`
  ${({ inView }) => animateWhen(inView, fadeUp, '0.25s', '0.8s')}
  @media (max-width: 900px) { display: none; }
`

const AerialCard = styled.div`
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0,0,0,0.4);
  position: relative;

  img {
    width: 100%;
    height: 280px;
    object-fit: cover;
    display: block;
  }
`

const AerialBadge = styled.div`
  position: absolute;
  top: 14px; left: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(10,22,40,0.8);
  backdrop-filter: blur(8px);
  color: rgba(255,255,255,0.9);
  font-size: 0.78rem;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 99px;
`

const AerialStats = styled.div`
  display: flex;
  align-items: center;
  background: rgba(10,22,40,0.9);
  backdrop-filter: blur(12px);
  padding: 16px 20px;
`

const AerialStat = styled.div`
  flex: 1;
  text-align: center;

  span { font-size: 0.72rem; color: rgba(255,255,255,0.5); display: block; }
  strong { font-size: 1rem; color: #fff; font-weight: 700; }
`

const AerialDivider = styled.div`
  width: 1px; height: 32px;
  background: rgba(255,255,255,0.1);
`

/* DASHBOARD PREVIEW */
const PreviewWrapper = styled.div`
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0,0,0,0.15);
  border: 1px solid #E9ECEF;
  ${({ inView }) => animateWhen(inView, scaleIn, '0.2s', '0.8s')}
`

const PreviewBar = styled.div`
  background: #F1F3F5;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`

const BarDot = styled.div`
  width: 12px; height: 12px;
  border-radius: 50%;
  background: ${({ color }) => color};
`

const BarUrl = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 6px;
  font-size: 0.78rem;
  color: #6C757D;
  padding: 4px 12px;
  text-align: center;
`

const PreviewScreen = styled.div`
  display: flex;
  background: #F8F9FA;
  min-height: 280px;
`

const PreviewSidebar = styled.div`
  width: 160px;
  background: #1B4332;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
`

const PreviewLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
  padding: 0 4px;
`

const PreviewNavItem = styled.div`
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  color: ${({ active }) => active ? '#fff' : 'rgba(255,255,255,0.45)'};
  background: ${({ active }) => active ? '#2D6A4F' : 'transparent'};
  font-weight: ${({ active }) => active ? 600 : 400};
`

const PreviewContent = styled.div`
  flex: 1;
  padding: 20px;
`

const PreviewCards = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 16px;
`

const PreviewCard = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  border-left: 3px solid ${({ color }) => color};
`

const PreviewCardLabel = styled.p`
  font-size: 0.65rem;
  color: #6C757D;
  margin-bottom: 4px;
`

const PreviewCardVal = styled.p`
  font-size: 0.875rem;
  font-weight: 700;
  color: #1A1A2E;
`

const PreviewChartArea = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 14px;
`

const PreviewChartTitle = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  color: #1A1A2E;
  margin-bottom: 12px;
`

const PreviewChart = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 80px;
`

const PreviewBarGroup = styled.div`
  flex: 1;
  display: flex;
  gap: 3px;
  align-items: flex-end;
`

const PreviewBarItem = styled.div`
  flex: 1;
  height: ${({ height }) => height}px;
  background: ${({ color }) => color};
  border-radius: 3px 3px 0 0;
  opacity: 0.85;
`

/* TESTIMONIALS */
const TestSection = styled.section`
  background: #F8F9FA;
  padding: 96px 5%;
  text-align: center;
`

const TestGrid = styled.div`
  max-width: 1100px;
  margin: 40px auto 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  text-align: left;

  @media (max-width: 900px) { grid-template-columns: 1fr; max-width: 480px; }
`

const TestCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  border: 1px solid #F1F3F5;
  transition: all 0.25s;
  ${({ inView, delay }) => animateWhen(inView, fadeUp, delay)}

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 36px rgba(0,0,0,0.08);
  }
`

const TestStars = styled.div`
  display: flex;
  gap: 3px;
  margin-bottom: 14px;
`

const TestText = styled.p`
  font-size: 0.9375rem;
  color: #495057;
  line-height: 1.7;
  margin-bottom: 20px;
  font-style: italic;
`

const TestAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const TestAvatar = styled.img`
  width: 42px; height: 42px;
  border-radius: 50%;
  object-fit: cover;
`

const TestAuthorInfo = styled.div`
  strong { font-size: 0.875rem; color: #1A1A2E; display: block; }
  span {
    font-size: 0.75rem;
    color: #6C757D;
    display: flex;
    align-items: center;
    gap: 3px;
    margin-top: 2px;
  }
`

/* CTA SECTION */
const CtaSection = styled.section`
  background: url(${({ bg }) => bg}) center/cover no-repeat;
  position: relative;
  padding: 100px 5%;
  text-align: center;
`

const CtaOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(10,22,40,0.9), rgba(27,67,50,0.85));
`

const CtaContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 600px;
  margin: 0 auto;
  ${({ inView }) => animateWhen(inView, fadeUp, '0s', '0.7s')}
`

const CtaTitle = styled.h2`
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 800;
  color: #fff;
  margin-bottom: 14px;
`

const CtaSub = styled.p`
  font-size: 1.0625rem;
  color: rgba(255,255,255,0.7);
  margin-bottom: 36px;
`

const CtaActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
`

const CtaBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #2D6A4F, #40916C);
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  padding: 15px 32px;
  border-radius: 10px;
  transition: all 0.25s;
  box-shadow: 0 8px 24px rgba(45,106,79,0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(45,106,79,0.55);
  }
`

const CtaLink = styled(Link)`
  color: rgba(255,255,255,0.7);
  font-size: 0.9375rem;
  font-weight: 500;
  padding: 15px 20px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.2);
  transition: all 0.2s;

  &:hover { background: rgba(255,255,255,0.08); color: #fff; }
`

/* FOOTER */
const Footer = styled.footer`
  background: #0A1628;
  padding: 40px 5% 24px;
`

const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
`

const FooterLogoImg = styled.img`
  height: 28px;
  width: auto;
  filter: brightness(0) invert(1);
`

const FooterTagline = styled.p`
  font-size: 0.875rem;
  color: rgba(255,255,255,0.4);
`

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.06);
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.3);
`
