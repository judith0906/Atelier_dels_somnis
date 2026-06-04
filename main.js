/* ── STARS ── */
const starsEl = document.getElementById('stars');
for (let i = 0; i < 80; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  s.style.cssText = `
    left:${Math.random()*100}%;
    top:${Math.random()*100}%;
    --d:${2+Math.random()*4}s;
    --delay:${Math.random()*4}s;
    width:${1+Math.random()*2}px;
    height:${1+Math.random()*2}px;
  `;
  starsEl.appendChild(s);
}

/* ── REVEAL ON SCROLL ── */
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => io.observe(el));

/* ── I18N LOGIC ── */
let currentLang = 'es';

function applyLang(lang) {
  currentLang = lang;
  const dict = i18n[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });
  document.documentElement.lang = lang;
  document.getElementById('label-es').classList.toggle('active', lang === 'es');
  document.getElementById('label-ca').classList.toggle('active', lang === 'ca');
  document.getElementById('toggle-thumb').classList.toggle('ca', lang === 'ca');
}

function setLang(lang) { applyLang(lang); }

function toggleLang() {
  applyLang(currentLang === 'es' ? 'ca' : 'es');
}

// Init
applyLang('es');

/* ── HOVER FOTOS + EMOTICONO HOVER + MANCHAS ── */
document.querySelectorAll('.class-card[data-hover-imgs]').forEach(card => {
  const imgs = card.getAttribute('data-hover-imgs').split(',');

  /* 1. Overlay con las fotos de clase */
  const overlay = document.createElement('div');
  overlay.className = 'hover-overlay';
  imgs.forEach(src => {
    const img = document.createElement('img');
    img.src = src.trim();
    overlay.appendChild(img);
  });
  card.appendChild(overlay);

  /* 2. Emoticono hover */
  const iconImg = card.querySelector('.class-icon img');
  if (iconImg) {
    const originalSrc = iconImg.getAttribute('src');
    const hoverSrc = originalSrc.replace(/(\.\w+)$/, '-hover$1');
    iconImg.setAttribute('data-src-default', originalSrc);
    iconImg.setAttribute('data-src-hover', hoverSrc);
    const preload = new Image();
    preload.src = hoverSrc;
  }

  /* 3. Manchas de pintura — posiciones fijas en bordes, rotaciones libres */
  const splashContainer = document.createElement('div');
  splashContainer.className = 'paint-splashes';

  // Cada mancha tiene: anclaje al borde, desplazamiento, rotación y escala propios
  // Se mezclan tamaños y rotaciones para que parezca orgánico
  const splashDefs = [
    // Borde superior
    { side: 'top',    offset: '8%',  rotation:  14, scale: 0.55 },
    { side: 'top',    offset: '55%', rotation: -22, scale: 0.90 },
    { side: 'top',    offset: '35%', rotation:  38, scale: 0.40 },
    // Borde inferior
    { side: 'bottom', offset: '12%', rotation: 160, scale: 0.75 },
    { side: 'bottom', offset: '60%', rotation: 200, scale: 0.50 },
    { side: 'bottom', offset: '40%', rotation: 185, scale: 1.10 },
    // Borde izquierdo
    { side: 'left',   offset: '18%', rotation: -75, scale: 0.65 },
    { side: 'left',   offset: '55%', rotation: -55, scale: 0.85 },
    // Borde derecho
    { side: 'right',  offset: '22%', rotation:  80, scale: 0.45 },
    { side: 'right',  offset: '62%', rotation: 110, scale: 0.95 },
  ];

  // Seleccionar 5-7 manchas aleatorias del pool
  const count = 5 + Math.floor(Math.random() * 3);
  const chosen = splashDefs.sort(() => Math.random() - 0.5).slice(0, count);

  const BASE_SIZE = 110; // px base antes de aplicar scale

  chosen.forEach(def => {
    const splash = document.createElement('img');
    splash.src = 'assets/images/pintura-hover.png';
    splash.className = 'paint-splash';

    const size = BASE_SIZE * def.scale;
    splash.style.width  = size + 'px';
    splash.style.height = size + 'px';

    // Pequeña variación aleatoria adicional sobre la rotación definida
    const finalRotation = def.rotation + (Math.random() * 24 - 12);

    switch (def.side) {
      case 'top':
        splash.style.top  = (-size * 0.45) + 'px';
        splash.style.left = def.offset;
        break;
      case 'bottom':
        splash.style.bottom = (-size * 0.45) + 'px';
        splash.style.left   = def.offset;
        break;
      case 'left':
        splash.style.left = (-size * 0.45) + 'px';
        splash.style.top  = def.offset;
        break;
      case 'right':
        splash.style.right = (-size * 0.45) + 'px';
        splash.style.top   = def.offset;
        break;
    }

    splash.style.transform = `rotate(${finalRotation}deg)`;
    splashContainer.appendChild(splash);
  });

  card.appendChild(splashContainer);

  /* 4. Eventos hover */
  card.addEventListener('mouseenter', () => {
    if (iconImg) {
      const hoverSrc = iconImg.getAttribute('data-src-hover');
      if (hoverSrc) iconImg.src = hoverSrc;
    }
  });

  card.addEventListener('mouseleave', () => {
    if (iconImg) {
      const defaultSrc = iconImg.getAttribute('data-src-default');
      if (defaultSrc) iconImg.src = defaultSrc;
    }
  });
});

/* ── FLYERS DINÁMICOS ── */
const FLYER_INTERVAL = 4000; // ms entre cambio automático de foto
const FLYER_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

function initFlyerGallery(folder, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const track = container.querySelector('.flyer-track');
  const dotsEl = container.querySelector('.flyer-dots');
  const prevBtn = container.querySelector('.flyer-prev');
  const nextBtn = container.querySelector('.flyer-next');

  const images = [];   // srcs cargadas
  let current = 0;
  let timer = null;

  // --- Carga encadenada de imágenes f1, f2, f3... ---
  function loadChain(i, extIdx) {
    if (extIdx >= FLYER_EXTENSIONS.length) {
      // Número i no existe en ningún formato: fin de la cadena
      onAllLoaded();
      return;
    }
    const src = `assets/images/flyers/${folder}/f${i}.${FLYER_EXTENSIONS[extIdx]}`;
    const probe = new Image();
    probe.onload  = () => { images.push(src); loadChain(i + 1, 0); };
    probe.onerror = () => { loadChain(i, extIdx + 1); };
    probe.src = src;
  }

  // --- Una vez cargadas todas, construir la galería ---
  function onAllLoaded() {
    if (images.length === 0) {
      container.innerHTML = '<p class="flyers-empty">Próximamente...</p>';
      return;
    }

    // Crear slides
    images.forEach((src, idx) => {
      const slide = document.createElement('div');
      slide.className = 'flyer-slide' + (idx === 0 ? ' active' : '');

      const img = document.createElement('img');
      img.src = src;
      img.alt = `Flyer ${idx + 1}`;
      img.loading = 'lazy';

      slide.appendChild(img);
      track.appendChild(slide);
    });

    // Crear dots
    images.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = 'flyer-dot' + (idx === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Flyer ${idx + 1}`);
      dot.addEventListener('click', () => goTo(idx));
      dotsEl.appendChild(dot);
    });

    // Mostrar/ocultar flechas si solo hay 1 imagen
    if (images.length <= 1) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    }

    prevBtn.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
    nextBtn.addEventListener('click', () => { goTo(current + 1); resetTimer(); });

    // Pausa al hacer hover
    container.addEventListener('mouseenter', () => clearInterval(timer));
    container.addEventListener('mouseleave', () => startTimer());

    startTimer();
  }

  function goTo(idx) {
    const slides = track.querySelectorAll('.flyer-slide');
    const dots   = dotsEl.querySelectorAll('.flyer-dot');

    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');

    // Wrap alrededor
    current = ((idx % images.length) + images.length) % images.length;

    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function startTimer() {
    if (images.length <= 1) return;
    timer = setInterval(() => goTo(current + 1), FLYER_INTERVAL);
  }

  function resetTimer() {
    clearInterval(timer);
    startTimer();
  }

  loadChain(1, 0);
}

initFlyerGallery('clases',   'flyers-clases');
initFlyerGallery('alquiler', 'flyers-alquiler');

/* ── PROMOCIONS DINÀMIQUES ── */
function initPromoBoard(folder, gridId, emptyId) {
  const grid  = document.getElementById(gridId);
  const empty = document.getElementById(emptyId);
  if (!grid) return;

  const images = [];

  function loadChain(i, extIdx) {
    if (extIdx >= FLYER_EXTENSIONS.length) {
      onAllLoaded();
      return;
    }
    const src = `assets/images/promos/f${i}.${FLYER_EXTENSIONS[extIdx]}`;
    const probe = new Image();
    probe.onload  = () => { images.push(src); loadChain(i + 1, 0); };
    probe.onerror = () => { loadChain(i, extIdx + 1); };
    probe.src = src;
  }

  function onAllLoaded() {
    if (images.length === 0) {
      if (empty) empty.style.display = 'block';
      return;
    }

    images.forEach((src, idx) => {
      const card = document.createElement('div');
      card.className = 'promo-card';

      const img = document.createElement('img');
      img.src = src;
      img.alt = `Promoció ${idx + 1}`;
      img.loading = 'lazy';

      card.appendChild(img);
      grid.appendChild(card);
    });
  }

  loadChain(1, 0);
}

initPromoBoard('promos', 'promo-grid', 'promo-empty');