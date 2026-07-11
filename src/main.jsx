import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import VagaLogo from './components/VagaLogo.jsx';
import WaitlistForm from './components/WaitlistForm.jsx';
import './styles.css';

const neighbourhoods = [
  { name: 'Alvalade', probability: 91, confidence: 84, x: 12, y: 17, scale: 1.05 },
  { name: 'Avenidas Novas', probability: 76, confidence: 79, x: 58, y: 10, scale: .82 },
  { name: 'Benfica', probability: 64, confidence: 73, x: 67, y: 58, scale: .95 },
  { name: 'Campo Grande', probability: 43, confidence: 68, x: 18, y: 62, scale: .78 },
];

function usePointerParallax() {
  useEffect(() => {
    const move = (event) => {
      const x = event.clientX / window.innerWidth - .5;
      const y = event.clientY / window.innerHeight - .5;
      document.documentElement.style.setProperty('--pointer-x', x.toFixed(4));
      document.documentElement.style.setProperty('--pointer-y', y.toFixed(4));
    };
    const scroll = () => {
      document.documentElement.style.setProperty('--page-scroll', String(window.scrollY));
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('scroll', scroll, { passive: true });
    scroll();
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', scroll);
    };
  }, []);
}

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.target.classList.toggle('visible', entry.isIntersecting)),
      { threshold: .16 }
    );
    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function Brand({ dark = false, className = '' }) {
  return (
    <a className={`brand ${dark ? 'brand-dark' : 'brand-light'} ${className}`} href="#top" aria-label="Vaga, início">
      <VagaLogo />
    </a>
  );
}

function SoftBlob({ className = '', children }) {
  return <div className={`soft-blob ${className}`}>{children}</div>;
}

function Hero() {
  return (
    <section className="hero" id="top">
      <nav className="nav page-width">
        <Brand />
        <div className="nav-links">
          <a href="#ideia">A ideia</a>
          <a href="#sinal">O sinal</a>
          <a href="#piloto">Piloto</a>
        </div>
        <a href="#piloto" className="nav-action">Entrar primeiro</a>
      </nav>

      <div className="hero-copy page-width" data-reveal>
        <p className="kicker">vaga</p>
        <h1>Há sempre um lugar.<br /><span>O problema é saber onde.</span></h1>
        <p className="hero-text">
          A Vaga lê os sinais da cidade e mostra as ruas onde tens mais probabilidade
          de estacionar antes de começares a andar às voltas.
        </p>
        <a href="#piloto" className="round-link">
          <span>Quero experimentar</span>

        </a>
      </div>

      <div className="hero-canvas" aria-hidden="true">
        <SoftBlob className="hero-blob blob-green">
          <span className="blob-word word-one">ALVALADE</span>
          <span className="blob-score score-one">91%</span>
          <span className="blob-word word-two">AGORA</span>
          <span className="blob-score score-two">84% confiança</span>
        </SoftBlob>
        <SoftBlob className="hero-blob blob-cream" />
        <SoftBlob className="hero-blob blob-dark" />
        <div className="hero-ring ring-a" />
        <div className="hero-ring ring-b" />
      </div>

      <div className="scroll-note">desce devagar <span>↓</span></div>
    </section>
  );
}

function Idea() {
  return (
    <section className="idea page-width" id="ideia">
      <div className="idea-lead" data-reveal>
        <p className="section-label">A ideia</p>
        <h2>Não procuras uma vaga.<br />Procuras a rua certa.</h2>
      </div>
      <div className="idea-body" data-reveal>
        <p>
          A Vaga não promete um lugar exato. Junta reports recentes, histórico e
          confiança para te dizer onde vale a pena procurar naquele momento.
        </p>
        <div className="sentence-orbit">
          <SoftBlob className="mini-blob mini-green"><b>91%</b><span>probabilidade</span></SoftBlob>
          <SoftBlob className="mini-blob mini-cream"><b>84%</b><span>confiança</span></SoftBlob>
          <SoftBlob className="mini-blob mini-dark"><b>4 min</b><span>a pé</span></SoftBlob>
        </div>
      </div>
    </section>
  );
}

function SignalField() {
  const [active, setActive] = useState(neighbourhoods[0]);

  return (
    <section className="signal-section" id="sinal">
      <div className="signal-title page-width" data-reveal>
        <p className="section-label">O sinal</p>
        <h2>A cidade deixa pistas.<br />Nós damos-lhes forma.</h2>
      </div>

      <div className="signal-world">
        <div className="signal-intro">
          <span>Passa o cursor</span>
          <small>ou toca numa zona</small>
        </div>

        {neighbourhoods.map((zone, index) => (
          <button
            key={zone.name}
            className={`zone-blob zone-${index + 1} ${active.name === zone.name ? 'active' : ''}`}
            style={{ '--x': `${zone.x}%`, '--y': `${zone.y}%`, '--s': zone.scale }}
            onPointerEnter={() => setActive(zone)}
            onFocus={() => setActive(zone)}
            onClick={() => setActive(zone)}
          >
            <span>{zone.name}</span>
            <b>{zone.probability}%</b>
          </button>
        ))}

        <div className="signal-readout">
          <p>Zona recomendada</p>
          <h3>{active.name}</h3>
          <div className="readout-numbers">
            <div><b>{active.probability}%</b><span>probabilidade</span></div>
            <div><b>{active.confidence}%</b><span>confiança</span></div>
          </div>
          <p className="readout-copy">Dados recentes da comunidade, traduzidos numa resposta simples.</p>
        </div>

        <svg className="organic-path" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true">
          <path d="M-90,420 C180,150 300,580 540,315 C770,60 835,430 1280,120" />
          <path d="M-30,120 C170,330 385,10 610,210 C830,405 1010,215 1260,440" />
        </svg>
      </div>
    </section>
  );
}

function ScrollStory() {
  const [step, setStep] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setStep(Number(visible.target.dataset.step));
    }, { threshold: [.35, .65] });
    refs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const stories = [
    ['Vês a cidade', 'O mapa mostra segmentos reais de estacionamento, não pins soltos.'],
    ['Escolhes melhor', 'Probabilidade e confiança ajudam-te a decidir onde procurar primeiro.'],
    ['Devolves o sinal', 'Quando estacionas ou sais, um toque melhora a cidade para todos.'],
  ];

  return (
    <section className={`story story-step-${step}`}>
      <div className="story-visual">
        <SoftBlob className="story-blob">
          <span className="story-number">0{step + 1}</span>
          <span className="story-verb">{stories[step][0]}</span>
        </SoftBlob>
      </div>
      <div className="story-copy">
        {stories.map(([title, text], index) => (
          <article
            key={title}
            data-step={index}
            ref={(node) => refs.current[index] = node}
            className={step === index ? 'active' : ''}
          >
            <small>0{index + 1}</small>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReportPlayground() {
  const [spots, setSpots] = useState(2);
  const probability = [29, 49, 66, 82, 94][spots];

  return (
    <section className="report page-width">
      <div className="report-copy" data-reveal>
        <p className="section-label">A comunidade</p>
        <h2>Uma pergunta.<br />Um toque.<br />Uma cidade mais útil.</h2>
        <p>Quantos lugares livres viste?</p>
      </div>

      <div className="report-playground" data-reveal>
        <SoftBlob className="report-blob">
          <small>nova probabilidade</small>
          <strong>{probability}%</strong>
          <span>Rua Actor Taborda</span>
        </SoftBlob>

        <div className="spot-options">
          {[0,1,2,3,4].map((number) => (
            <button
              key={number}
              className={spots === number ? 'active' : ''}
              onClick={() => setSpots(number)}
            >
              {number === 4 ? '4+' : number}
            </button>
          ))}
        </div>
        <p className="report-caption">Sem formulários. Sem ranking. Só informação que ajuda.</p>
      </div>
    </section>
  );
}

function Pilot() {
  return (
    <section className="pilot" id="piloto">
      <div className="pilot-inner page-width">
        <Brand dark />
        <div className="pilot-grid">
          <div className="pilot-copy" data-reveal>
            <p className="section-label dark-label">Primeiro piloto Lisboa</p>
            <h2>A Vaga começa pequena.<br />Mas quer mudar a cidade toda.</h2>
            <p>Entra na lista para testar a primeira versão e ajudar a escolher a zona piloto.</p>
          </div>

          <div data-reveal>
            <WaitlistForm />
          </div>
        </div>
      </div>

      <SoftBlob className="pilot-decoration deco-one" />
      <SoftBlob className="pilot-decoration deco-two" />
    </section>
  );
}


function InformationSources() {
  return (
    <section className="information-sources page-width" aria-labelledby="sources-title">
      <div className="sources-copy" data-reveal>
        <p className="section-label">Fontes de informação</p>
        <h2 id="sources-title">A cidade já tem dados.<br />A Vaga torna-os úteis.</h2>
        <p>
          O mapa poderá cruzar informação pública municipal, zonas tarifárias e dados
          colaborativos para transformar regras dispersas numa resposta simples para quem conduz.
        </p>
        <small>
          A Vaga é um projeto independente. A apresentação destas entidades identifica apenas
          possíveis fontes públicas de informação e não representa parceria, apoio ou afiliação institucional.
        </small>
      </div>

      <div className="source-marks" data-reveal>
        <div className="source-mark-card">
          <div className="source-logo source-logo-cml" role="img" aria-label="Câmara Municipal de Lisboa" />
          <span>Dados municipais</span>
        </div>
        <div className="source-mark-card">
          <div className="source-logo source-logo-emel" role="img" aria-label="EMEL" />
          <span>Estacionamento e mobilidade</span>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer page-width">
      <Brand dark />
      <p>Estacionamento inteligente para Lisboa.</p>
      <div>
        <a href="mailto:ola@vaga.pt">ola@vaga.pt</a>
        <a href="#top">voltar ao topo ↑</a>
      </div>
    </footer>
  );
}

function App() {
  usePointerParallax();
  useReveal();

  return (
    <main>
      <Hero />
      <Idea />
      <SignalField />
      <ScrollStory />
      <ReportPlayground />
      <Pilot />
      <InformationSources />
      <Footer />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
