import { useEffect, useRef, useState } from "react";

const images = {
  hero: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2200&q=88",
  chair: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1500&q=86",
  table: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=1500&q=86",
  detail: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1500&q=86",
  room: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=88",
};

const objects = [
  { name: "Aalto Table", material: "European oak · 2026", image: images.table },
  { name: "Mori Lounge", material: "Walnut · 2026", image: images.chair },
  { name: "Kumo Chair", material: "Ash · 2025", image: images.detail },
  { name: "Noma Credenza", material: "Smoked oak · 2025", image: images.room },
];

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add("is-visible");
        observer.unobserve(node);
      }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function App() {
  const storyRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => {
      const story = storyRef.current;
      if (story) {
        const rect = story.getBoundingClientRect();
        const max = Math.max(1, rect.height - window.innerHeight);
        setStoryProgress(Math.min(1, Math.max(0, -rect.top / max)));
      }
      const rail = railRef.current;
      if (rail) {
        const rect = rail.parentElement?.getBoundingClientRect();
        if (rect) {
          const p = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - window.innerHeight)));
          rail.style.transform = `translate3d(${p * Math.min(55, window.innerWidth * 0.055)}%,0,0)`;
        }
      }
    };
    const onMove = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  const storyScale = 1 + storyProgress * 0.16;
  const storyY = storyProgress * -70;

  return (
    <main>
      <div className="cursor" style={{ transform: `translate3d(${cursor.x}px,${cursor.y}px,0)` }} />

      <header className="nav">
        <a className="brand" href="#top">NOMA<span>®</span></a>
        <nav>
          <a href="#collection">Collection</a>
          <a href="#craft">Craft</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="menu" aria-label="Open menu"><i/><i/></button>
      </header>

      <section id="top" className="hero">
        <img src={images.hero} alt="Sculptural furniture in a quiet interior" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow">SOLID WOOD JOINERY · HEIRLOOM TIMBER</p>
          <h1>Objects<br/><em>made to remain.</em></h1>
        </div>
        <div className="hero-foot">
          <span>01 — 05</span>
          <span className="scroll">Scroll to explore <b>↓</b></span>
          <span>Est. 1998</span>
        </div>
      </section>

      <section ref={storyRef} className="story">
        <div className="story-pin">
          <div className="story-image" style={{ transform: `translate3d(0,${storyY}px,0) scale(${storyScale})` }}>
            <img src={images.detail} alt="Close-up of natural timber grain" />
          </div>
          <div className="story-overlay" />
          <div className="story-type">
            <p>THE NOMA METHOD</p>
            <div className="story-word">
              {["Material.", "Form.", "Time."].map((word, i) => (
                <span key={word} style={{ opacity: Math.max(0, Math.min(1, storyProgress * 3 - i * 0.75)), transform: `translateY(${Math.max(0, (i * 28) - storyProgress * 84)}px)` }}>{word}</span>
              ))}
            </div>
          </div>
          <div className="story-index">01 / 03</div>
        </div>
      </section>

      <section id="collection" className="collection">
        <Reveal className="section-intro">
          <p className="eyebrow">THE COLLECTION</p>
          <h2>Quiet forms.<br/><em>Strong presence.</em></h2>
          <p className="intro-copy">Furniture shaped by the grain, not against it. Each object is made slowly, finished by hand, and designed to gather a life around it.</p>
        </Reveal>

        <div className="horizontal-window">
          <div className="horizontal-rail" ref={railRef}>
            {objects.map((object, i) => (
              <article className="object" key={object.name}>
                <div className="object-image"><img src={object.image} alt={object.name}/><span>0{i + 1}</span></div>
                <div className="object-meta"><h3>{object.name}</h3><p>{object.material}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="craft" className="craft">
        <div className="craft-image"><img src={images.chair} alt="Handcrafted timber chair"/></div>
        <Reveal className="craft-copy">
          <p className="eyebrow">CRAFTSMANSHIP / 01</p>
          <h2>Every joint<br/><em>has a reason.</em></h2>
          <p>Generational joinery meets honest natural timber. No veneers. No shortcuts. Just precise cuts, patient hands, and low-sheen organic oils that let the material stay itself.</p>
          <div className="line-list"><span>01 / Selected timber</span><span>02 / Hand-cut joinery</span><span>03 / Natural finish</span></div>
        </Reveal>
      </section>

      <section className="feature">
        <img src={images.room} alt="NOMA furniture in a minimal interior"/>
        <div className="feature-shade"/>
        <div className="feature-copy">
          <p className="eyebrow">FEATURED PIECE · 2026</p>
          <h2>Aalto<br/><em>Dining Table</em></h2>
          <div className="feature-detail"><span>European oak</span><span>240 × 95 cm</span><span>Hand finished</span></div>
        </div>
      </section>

      <section className="philosophy">
        <Reveal>
          <p className="eyebrow">OUR PHILOSOPHY</p>
          <h2>Made slowly.<br/>Designed deliberately.<br/><em>Built to outlast the moment.</em></h2>
        </Reveal>
      </section>

      <section className="selected">
        <Reveal className="selected-head"><p className="eyebrow">SELECTED OBJECTS</p><span>04 / 04</span></Reveal>
        <div className="selected-grid">
          {objects.slice(0, 3).map((object, i) => (
            <Reveal key={object.name} className={`selected-card card-${i}`}>
              <img src={object.image} alt={object.name}/>
              <div><span>0{i + 1}</span><h3>{object.name}</h3><p>{object.material}</p></div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="contact" className="cta">
        <p className="eyebrow">BEGIN A CONVERSATION</p>
        <h2>Make space for<br/><em>something lasting.</em></h2>
        <a className="cta-link" href="mailto:studio@noma.example">studio@noma.example <span>↗</span></a>
      </section>

      <footer><span>NOMA®</span><span>Objects made to remain.</span><span>© 2026</span></footer>
    </main>
  );
}

export default App;