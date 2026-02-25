/* ============================================
   Hector O'Franco - Personal Website v2026
   Main JavaScript — iteration 2
   ============================================ */

/* ---- STARTUP DATA ---- */
const STARTUPS = [
  {
    name: "Hero's Diary",
    year: "2024–*",
    status: "active",
    statusLabel: "Active",
    problem: "Social isolation and inconsistent personal growth.",
    short: "AI-powered smart journal that transforms personal reflections into a roadmap for growth, connecting like-minded 'heroes' to pursue life goals together. <a href='https://herosdiary.com' target='_blank' rel='noopener'>herosdiary.com</a>",
    long: "Hero's Diary is a comprehensive digital ecosystem for self-reflection and real-world transformation. It offers diverse input methods — conversational AI, voice recording and dictation, and handwritten page scanning — to capture every insight effortlessly. The platform addresses social isolation by connecting users with aligned goals, ensures habits are SMART and anchored to a long-term vision, and provides AI-generated reports on emotional and physical well-being. Using encrypted, date-stamped logs, it preserves narrative integrity while breaking cycles of emotional stagnation through guided prompts on Stoicism and gratitude. Whether you are an entrepreneur documenting progress or someone searching for a partner with a shared vision, Hero's Diary provides the security, intelligence, and community needed to turn a private diary into a lasting legacy.",
    url: "https://herosdiary.com"
  },
  {
    name: "onceover.ai",
    year: "2024",
    status: "closed",
    statusLabel: "Closed",
    problem: "Reducing costs for hiring.",
    short: "AI-powered platform to process CVs and conduct job interviews as a first filter for shortlisting candidates.",
    long: "An online platform that uses artificial intelligence to process CVs and conduct automated job interviews, providing an intelligent first filter for shortlisting candidates before human review. This significantly reduces the time and cost associated with the early stages of recruitment.",
    url: "https://www.onceover.ai/"
  },
  {
    name: "iKey ★",
    year: "2019–2025",
    status: "trading",
    statusLabel: "Active",
    problem: "Can you see the rainbow after the rain? Many people can't due to preventable blindness.",
    short: "Non-invasive health test based on image processing of retina images for early detection of glaucoma and other eye conditions.",
    long: "iKey developed a non-invasive health test based on advanced image processing of retinal fundus images. The system enables early detection of glaucoma and other preventable eye conditions through routine screening, with the potential to prevent blindness in thousands of patients.",
    url: "https://www.ikey.ie"
  },
  {
    name: "LoyLap",
    year: "2018",
    status: "trading",
    statusLabel: "Active",
    problem: "Helping businesses identify their best customers.",
    short: "Virtual loyalty card and payment platform enabling businesses to engage and reward their best customers.",
    long: "LoyLap is a virtual loyalty card for payments, helping businesses identify and engage their best and most influential customers. The platform allowed merchants to run personalised loyalty programs and gather data-driven insights about customer behaviour.",
    url: "https://www.loylap.com/"
  },
  {
    name: "Predictive Analytics Platform",
    year: "2017–18",
    status: "closed",
    statusLabel: "Closed",
    problem: "Businesses need to identify their best and most influential customers to promote their business.",
    short: "Predictive analytics platform built in collaboration with Technological University of Dublin to identify high-value customers.",
    long: "A predictive analytics platform built in collaboration with Technological University of Dublin. The project aimed to identify businesses' best and most influential customers using machine learning models. The venture was ultimately aborted due to difficulties collaborating with public administration and aligning institutional goals with commercial timelines."
  },
  {
    name: "Airbnb Hosting",
    year: "2015",
    status: "closed",
    statusLabel: "Closed",
    problem: "Personal need for more social interaction.",
    short: "A personal Airbnb hosting experience — profitable, fun, and educational in client relations.",
    long: "Opened an Airbnb listing to gain direct experience dealing with clients and attending to their needs. While not an exponential venture, it was consistently profitable and provided valuable insights into customer service, hospitality, and human behaviour. Voluntarily closed and moved on to higher-leverage opportunities."
  },
  {
    name: "CrowdLending Friends",
    year: "2013",
    status: "closed",
    statusLabel: "Closed",
    problem: "Difficulties getting low-interest loans and facilitating P2P loans to friends.",
    short: "Crowdlending network where funding is provided by a network of friends at increasing interest rates from further relationship nodes.",
    long: "A social lending platform where funding is structured through a network of personal relationships, with interest rates increasing for more distant connection nodes. The concept addressed the difficulty of accessing low-interest personal loans and formalising P2P loans. The project was aborted due to the complexity of testing the market and navigating financial regulations."
  },
  {
    name: "Misakai",
    year: "2013–2015",
    status: "trading",
    statusLabel: "Active",
    problem: "Internet of Things: communication between intelligent objects.",
    short: "General library for broadcasting and filtering messages between devices — Backend as a Service for IoT.",
    long: "Misakai is a general-purpose library for broadcasting and filtering messages between connected devices, positioning itself as a Backend as a Service for IoT applications. While technically sound, the collaboration with the co-founder proved too difficult to sustain meaningful growth. The company still exists but without significant traction."
  },
  {
    name: "Contrastify",
    year: "2012",
    status: "closed",
    statusLabel: "Closed",
    problem: "No specific external problem — exploratory venture.",
    short: "Search engine for public emotion on a keyword, based on real-time sentiment analysis of tweets.",
    long: "Contrastify was a search engine that surfaced public emotional reactions to any keyword by performing real-time sentiment analysis on Twitter data. Users could search for topics and see the emotional tone of the crowd. Despite being technically innovative, it achieved low usage and was discontinued."
  },
  {
    name: "Poem Editor / Romantic Platform",
    year: "2011",
    status: "closed",
    statusLabel: "Closed",
    problem: "Difficulties writing poems.",
    short: "An AI-assisted poem editor that helps find rhyming words, encourages writing through a chatbot, and enables publishing and gifting poems.",
    long: "A poetry writing assistant that used NLP to suggest rhyming words, employed a chatbot to encourage the user to continue writing, and provided a publishing platform to share poems with personal gifts. The venture was abandoned due to NLP technological limitations of the era, excessive distraction from incubator advisors, and personal needs (completing the PhD)."
  },
  {
    name: "Digital Lab Notebook",
    year: "2009",
    status: "closed",
    statusLabel: "Closed",
    problem: "Research workers need to prove what work they did and when to stop patent competitors.",
    short: "A tamper-proof digital lab notebook with timestamped entries — like a blockchain for research documentation.",
    long: "A digital lab notebook in which the company cryptographically proved submission times with immutable timestamps, functioning like a blockchain before blockchain became mainstream. The target users were researchers needing legal-grade documentation. The venture was abandoned due to difficulties identifying buyers: researchers rarely want to be audited, and institutions are notoriously difficult to work with commercially."
  }
];

/* ---- RENDER STARTUPS ---- */
function renderStartups() {
  const grid = document.getElementById('startups-grid');
  if (!grid) return;
  const statusClass = {
    active: 'status-active', trading: 'status-active', closed: 'status-closed'
  };
  STARTUPS.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'startup-card fade-in';
    card.style.animationDelay = `${i * 0.07}s`;
    card.innerHTML = `
      <div class="startup-header">
        <span class="demo-tag tag-year">${s.year}</span>
        <span class="startup-status ${statusClass[s.status]}">${s.statusLabel}</span>
      </div>
      <h3>${s.name}</h3>
      <p class="startup-short">${s.short}</p>
      <div class="startup-long">
        <p>${s.long}${s.url ? ` <a href="${s.url}" target="_blank" rel="noopener">Visit &rarr;</a>` : ''}</p>
      </div>
      <div class="startup-expand">
        <span>Read more</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
      </div>`;
    card.addEventListener('click', () => {
      card.classList.toggle('expanded');
      card.querySelector('.startup-expand span').textContent =
        card.classList.contains('expanded') ? 'Show less' : 'Read more';
    });
    grid.appendChild(card);
  });
}

/* ---- roundRect polyfill ---- */
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x,y,w,h,r) {
    r = Math.min(r, w/2, h/2);
    this.moveTo(x+r,y); this.lineTo(x+w-r,y);
    this.quadraticCurveTo(x+w,y,x+w,y+r); this.lineTo(x+w,y+h-r);
    this.quadraticCurveTo(x+w,y+h,x+w-r,y+h); this.lineTo(x+r,y+h);
    this.quadraticCurveTo(x,y+h,x,y+h-r); this.lineTo(x,y+r);
    this.quadraticCurveTo(x,y,x+r,y); this.closePath(); return this;
  };
}

/* ============================================================
   GITHUB CONTRIBUTION CALENDAR BACKGROUND v3
   - Grey dark background with VISIBLE empty cells (#161b22)
   - Consecutive stretches of empty/active cells (like real GitHub)
   - Green active cells pulse gently
   - Occasional horizontal "wave" sweeps left-to-right
   ============================================================ */
function initCalendarBackground() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // GitHub-style palette (dark grey empty, green active)
  const EMPTY_COLOR = '#161b22';            // visible dark grey for level 0
  const GREEN = [
    null,                                     // 0 – handled by EMPTY_COLOR
    'rgba(14, 68, 41, 0.80)',                // 1 – darkest green
    'rgba(0, 109, 50, 0.80)',                // 2 – dark green
    'rgba(38, 166, 65, 0.75)',               // 3 – medium green
    'rgba(57, 211, 83, 0.70)'                // 4 – bright green
  ];

  const CELL = 12, GAP = 6, STEP = CELL + GAP;
  let cols, rows, cells = [], W, H;

  // Horizontal wave state
  let waves = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cols = Math.ceil(W / STEP) + 2;
    rows = Math.ceil(H / STEP) + 2;
    buildCells();
    initWaves();
  }

  /* Generate row patterns with CONSECUTIVE runs of active/empty cells */
  function generateRowPattern(numCols) {
    const pattern = new Array(numCols);
    let c = 0;
    while (c < numCols) {
      // Decide: active run or empty run
      if (Math.random() < 0.45) {
        // Empty run: 2–7 consecutive cells
        const runLen = 2 + Math.floor(Math.random() * 6);
        for (let i = 0; i < runLen && c < numCols; i++, c++) {
          pattern[c] = 0;
        }
      } else {
        // Active run: 3–12 consecutive cells with varying intensity
        const runLen = 3 + Math.floor(Math.random() * 10);
        const baseIntensity = Math.floor(Math.random() * 4) + 1;
        for (let i = 0; i < runLen && c < numCols; i++, c++) {
          // Vary intensity within the run (±1 from base)
          const vary = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
          pattern[c] = Math.max(1, Math.min(4, baseIntensity + vary));
        }
      }
    }
    return pattern;
  }

  function buildCells() {
    cells = [];
    for (let r = 0; r < rows; r++) {
      const rowPattern = generateRowPattern(cols);
      for (let c = 0; c < cols; c++) {
        cells.push({
          x: c * STEP,
          y: r * STEP,
          baseLevel: rowPattern[c],
          level: 0,
          opacity: rowPattern[c] > 0 ? (Math.random() * 0.25 + 0.10) : 0.5,
          // Independent random pulse per cell
          phase: Math.random() * Math.PI * 2,
          speed: 0.001 + Math.random() * 0.003,
          // Random re-roll timer: each cell occasionally changes its base level
          nextChange: Math.random() * 900 + 400,
          changeCounter: 0,
          col: c,
          row: r
        });
      }
    }
  }

  function initWaves() {
    waves = [];
    for (let i = 0; i < Math.max(3, Math.floor(rows / 8)); i++) {
      waves.push({
        row: Math.floor(Math.random() * rows),
        col: -10 - Math.random() * cols,
        speed: 0.03 + Math.random() * 0.06,
        length: 6 + Math.floor(Math.random() * 12),
        active: Math.random() < 0.5
      });
    }
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    frame++;

    if (prefersReduced) {
      cells.forEach(cell => {
        if (cell.baseLevel === 0) return;
        ctx.globalAlpha = 0.20;
        ctx.fillStyle = GREEN[cell.baseLevel];
        ctx.beginPath();
        ctx.roundRect(cell.x, cell.y, CELL, CELL, 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      return;
    }

    // --- Wave management ---
    if (frame % 240 === 0) {
      waves.forEach(w => {
        if (!w.active && Math.random() < 0.4) {
          w.active = true;
          w.col = -w.length;
          w.row = Math.floor(Math.random() * rows);
          w.speed = 0.03 + Math.random() * 0.06;
        }
      });
    }
    waves.forEach(w => {
      if (w.active) {
        w.col += w.speed;
        if (w.col > cols + w.length) w.active = false;
      }
    });
    const waveMap = {};
    waves.forEach(w => {
      if (w.active) {
        if (!waveMap[w.row]) waveMap[w.row] = [];
        waveMap[w.row].push(w);
      }
    });

    // --- Draw cells ---
    cells.forEach(cell => {
      // Slow re-roll of base intensity (but keep consecutive pattern feel)
      cell.changeCounter++;
      if (cell.changeCounter >= cell.nextChange) {
        cell.changeCounter = 0;
        cell.nextChange = Math.random() * 900 + 400;
        // Only small changes to preserve the consecutive look
        if (cell.baseLevel === 0) {
          // Small chance to activate
          if (Math.random() < 0.15) cell.baseLevel = Math.floor(Math.random() * 3) + 1;
        } else {
          // Small chance to go empty, or shift intensity ±1
          if (Math.random() < 0.12) {
            cell.baseLevel = 0;
          } else {
            const shift = Math.random() < 0.5 ? -1 : 1;
            cell.baseLevel = Math.max(1, Math.min(4, cell.baseLevel + shift));
          }
        }
      }

      let level = cell.baseLevel;
      let alpha = cell.opacity;

      // Slow organic pulse for active cells
      cell.phase += cell.speed;
      if (level > 0) {
        const pulse = Math.sin(cell.phase) * 0.08;
        alpha = Math.min(0.6, alpha + pulse);
      }

      // Horizontal wave boost
      const rowWaves = waveMap[cell.row];
      if (rowWaves) {
        for (const w of rowWaves) {
          const dist = cell.col - w.col;
          if (dist >= 0 && dist < w.length) {
            const t = 1 - dist / w.length;
            if (dist < 1.5) {
              level = 4; alpha = 0.55;
            } else {
              level = Math.max(level, Math.round(t * 4));
              alpha = Math.max(alpha, t * 0.45);
            }
          }
        }
      }

      // Skip empty cells — they blend with the page background,
      // making consecutive missing stretches clearly visible
      if (level === 0) return;

      ctx.globalAlpha = alpha;
      ctx.fillStyle = GREEN[level];
      ctx.beginPath();
      ctx.roundRect(cell.x, cell.y, CELL, CELL, 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
}

/* ---- NAVIGATION ---- */
function initNavigation() {
  const navbar  = document.getElementById('navbar');
  const toggle  = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    highlightNavLink();
  });

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 8;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

function highlightNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === current));
}

/* ---- SCROLL ANIMATIONS ---- */
function initScrollAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* ---- TYPING EFFECT ---- */
function initTypingEffect() {
  const el = document.querySelector('.hero-badge');
  if (!el) return;
  const text = el.textContent; el.textContent = ''; let i = 0;
  const type = () => { if (i < text.length) { el.textContent += text[i++]; setTimeout(type, 40); } };
  setTimeout(type, 600);
}

/* ---- GDPR COOKIE BANNER ---- */
function initCookieBanner() {
  if (localStorage.getItem('cookieConsent')) return;
  const banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.innerHTML = `
    <div class="cookie-inner">
      <p>This site uses cookies to save your preferences (e.g. API keys in developer tools). No tracking cookies are used beyond Google Analytics.</p>
      <div class="cookie-actions">
        <button id="cookie-accept" class="btn btn-primary btn-sm">Accept All</button>
        <button id="cookie-reject" class="btn btn-outline btn-sm">Reject Non-Essential</button>
      </div>
    </div>`;
  document.body.appendChild(banner);
  document.getElementById('cookie-accept').addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'all');
    banner.remove();
  });
  document.getElementById('cookie-reject').addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'essential');
    banner.remove();
    // Disable GA
    window['ga-disable-G-M3TV3Z6VV7'] = true;
  });
}

/* ---- LANGUAGE SWITCHER ---- */
const TRANSLATIONS = {
  en: {
    badge: 'Software Engineer & A.I. Consultant',
    heroTitle1: 'Hi, I\'m ',
    heroName: 'Hector O\'Franco',
    heroSubtitle: 'Building intelligent solutions with over a decade of experience in machine learning, data analytics, and computer vision. Ph.D. in Artificial Intelligence from Trinity College Dublin. Currently Software Engineer at Google Cloud.',
    yearsExp: 'Years Experience',
    startups: 'Start-ups',
    leetcode: 'LeetCode Problems',
    learnMore: 'Learn More',
    viewDemos: 'View Demos',
    aboutTitle: 'About Me',
    startupsTitle: 'Start-up Portfolio',
    startupsSubtitle: 'A journey of entrepreneurship: quick and slow failures and successes (2009\u20132024)',
    demosTitle: 'Demonstrators & Games',
    demosSubtitle: 'Interactive tools, games, and code to explore AI and CS concepts',
    ml: 'Machine Learning',
    mlDesc: 'Expert in developing ML pipelines, from data preprocessing to model deployment, across healthcare, agriculture, and insurance sectors.',
    cv: 'Computer Vision',
    cvDesc: 'Specialized in image processing and computer vision applications, including medical imaging for retinal disease screening.',
    ent: 'Entrepreneurship',
    entDesc: 'Serial entrepreneur with 10 ventures since 2009, spanning fintech, healthtech, IoT, and AI-powered platforms.',
    res: 'Research',
    resDesc: 'Ph.D. in AI from Trinity College Dublin, with published research on Semantic Role Labeling and high-performance computing.',
    bio1: 'Hector O\'Franco is a seasoned A.I. consultant and Software Engineer at Google Cloud with over a decade of experience in machine learning, data analytics, and computer vision. He has contributed to numerous innovative projects across diverse industries, including healthcare, agriculture, and insurance.',
    bio2: 'His expertise lies in transforming complex data into actionable insights, driving technological advancements, and leading cross-functional teams to success. He holds a Ph.D. in Artificial Intelligence from Trinity College Dublin and has a passion for entrepreneurship, evident through his involvement in multiple start-ups.',
  },
  es: {
    badge: 'Ingeniero de Software y Consultor en I.A.',
    heroTitle1: 'Hola, soy ',
    heroName: 'Hector O\'Franco',
    heroSubtitle: 'Construyendo soluciones inteligentes con m\u00e1s de una d\u00e9cada de experiencia en aprendizaje autom\u00e1tico, an\u00e1lisis de datos y visi\u00f3n por computador. Doctor en Inteligencia Artificial por el Trinity College Dublin. Actualmente Ingeniero de Software en Google Cloud.',
    yearsExp: 'A\u00f1os Experiencia',
    startups: 'Start-ups',
    leetcode: 'Problemas LeetCode',
    learnMore: 'Saber M\u00e1s',
    viewDemos: 'Ver Demos',
    aboutTitle: 'Sobre M\u00ed',
    startupsTitle: 'Portafolio de Start-ups',
    startupsSubtitle: 'Un viaje de emprendimiento: fracasos r\u00e1pidos y lentos, y \u00e9xitos (2009\u20132024)',
    demosTitle: 'Demostradores y Juegos',
    demosSubtitle: 'Herramientas interactivas, juegos y c\u00f3digo para explorar conceptos de IA e inform\u00e1tica',
    ml: 'Aprendizaje Autom\u00e1tico',
    mlDesc: 'Experto en desarrollar pipelines de ML, desde el preprocesamiento de datos hasta el despliegue de modelos, en sectores como sanidad, agricultura y seguros.',
    cv: 'Visi\u00f3n por Computador',
    cvDesc: 'Especializado en procesamiento de im\u00e1genes y aplicaciones de visi\u00f3n por computador, incluyendo imagen m\u00e9dica para el cribado de enfermedades retinianas.',
    ent: 'Emprendimiento',
    entDesc: 'Emprendedor en serie con 10 iniciativas desde 2009, abarcando fintech, healthtech, IoT y plataformas potenciadas por IA.',
    res: 'Investigaci\u00f3n',
    resDesc: 'Doctorado en IA por el Trinity College Dublin, con publicaciones sobre Etiquetado de Roles Sem\u00e1nticos y computaci\u00f3n de alto rendimiento.',
    bio1: 'Hector O\'Franco es un experimentado consultor de I.A. e Ingeniero de Software en Google Cloud con m\u00e1s de una d\u00e9cada de experiencia en aprendizaje autom\u00e1tico, an\u00e1lisis de datos y visi\u00f3n por computador.',
    bio2: 'Su especialidad reside en transformar datos complejos en conocimientos accionables, impulsar avances tecnol\u00f3gicos y liderar equipos multifuncionales hacia el \u00e9xito. Es Doctor en Inteligencia Artificial por el Trinity College Dublin.',
  },
  va: {
    badge: 'Enginyer de Programari i Consultor en I.A.',
    heroTitle1: 'Hola, soc ',
    heroName: 'Hector O\'Franco',
    heroSubtitle: 'Construint solucions intel\u00b7ligents amb m\u00e9s d\'una d\u00e8cada d\'experi\u00e8ncia en aprenentatge autom\u00e0tic, an\u00e0lisi de dades i visi\u00f3 per computador. Doctor en Intel\u00b7lig\u00e8ncia Artificial pel Trinity College Dublin. Actualment Enginyer de Programari a Google Cloud.',
    yearsExp: 'Anys Experi\u00e8ncia',
    startups: 'Start-ups',
    leetcode: 'Problemes LeetCode',
    learnMore: 'Saber M\u00e9s',
    viewDemos: 'Veure Demos',
    aboutTitle: 'Sobre Mi',
    startupsTitle: 'Portafoli de Start-ups',
    startupsSubtitle: 'Un viatge d\'emprenedoria: fracassos r\u00e0pids i lents, i \u00e8xits (2009\u20132024)',
    demosTitle: 'Demostradors i Jocs',
    demosSubtitle: 'Eines interactives, jocs i codi per explorar conceptes d\'IA i inform\u00e0tica',
    ml: 'Aprenentatge Autom\u00e0tic',
    mlDesc: 'Expert en desenvolupar pipelines de ML, des del preprocessament de dades fins al desplegament de models.',
    cv: 'Visi\u00f3 per Computador',
    cvDesc: 'Especialitzat en processament d\'imatges i aplicacions de visi\u00f3 per computador.',
    ent: 'Emprenedoria',
    entDesc: 'Emprenedor en s\u00e8rie amb 10 iniciatives des de 2009.',
    res: 'Investigaci\u00f3',
    resDesc: 'Doctorat en IA pel Trinity College Dublin, amb publicacions sobre Etiquetatge de Rols Sem\u00e0ntics.',
    bio1: 'Hector O\'Franco \u00e9s un experimentat consultor d\'I.A. i Enginyer de Programari a Google Cloud amb m\u00e9s d\'una d\u00e8cada d\'experi\u00e8ncia.',
    bio2: 'La seua especialitat rau en transformar dades complexes en coneixements accionables i liderar equips multifuncionals cap a l\'\u00e8xit.',
  }
};

let currentLang = 'en';

function switchLanguage(lang) {
  currentLang = lang;
  const t = TRANSLATIONS[lang];
  if (!t) return;
  // Update translatable elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) el.textContent = t[key];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    if (t[key]) el.innerHTML = t[key];
  });
  // Highlight active lang button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  initCalendarBackground();
  initNavigation();
  renderStartups();
  initScrollAnimations();
  initTypingEffect();
  initCookieBanner();

  // Language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => switchLanguage(btn.dataset.lang));
  });
});
