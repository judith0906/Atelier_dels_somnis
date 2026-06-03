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

  /* 2. Guardar src original del emoticono y preparar versión hover */
  const iconImg = card.querySelector('.class-icon img');
  if (iconImg) {
    const originalSrc = iconImg.getAttribute('src');
    // Construye la ruta hover añadiendo -hover antes de la extensión
    // Ej: "emoticonos/artes plasticas/lapiz.png" → "emoticonos/artes plasticas/lapiz-hover.png"
    const hoverSrc = originalSrc.replace(/(\.\w+)$/, '-hover$1');
    iconImg.setAttribute('data-src-default', originalSrc);
    iconImg.setAttribute('data-src-hover', hoverSrc);

    // Precarga para evitar parpadeo al hover
    const preload = new Image();
    preload.src = hoverSrc;
  }

  /* 3. Manchas de pintura aleatorias en los bordes */
  const splashContainer = document.createElement('div');
  splashContainer.className = 'paint-splashes';

  // Pool de posiciones posibles alrededor del perímetro
  const positions = [
    { top: '-18px',  left:  `${10 + Math.random() * 25}%`, rotation: Math.random() * 60 - 30 },
    { top: '-18px',  right: `${10 + Math.random() * 25}%`, rotation: Math.random() * 60 - 30 },
    { bottom: '-18px', left:  `${10 + Math.random() * 30}%`, rotation: 180 + Math.random() * 40 - 20 },
    { bottom: '-18px', right: `${10 + Math.random() * 20}%`, rotation: 180 + Math.random() * 40 - 20 },
    { top:  `${15 + Math.random() * 30}%`, left:  '-18px', rotation: -90 + Math.random() * 40 - 20 },
    { bottom: `${15 + Math.random() * 30}%`, left: '-16px', rotation: -90 + Math.random() * 30 - 15 },
    { top:  `${10 + Math.random() * 35}%`, right: '-18px', rotation:  90 + Math.random() * 40 - 20 },
    { bottom: `${10 + Math.random() * 30}%`, right: '-16px', rotation: 90 + Math.random() * 30 - 15 },
  ];

  // Seleccionar entre 4 y 6 manchas aleatorias
  const shuffled = positions.sort(() => Math.random() - 0.5).slice(0, 4 + Math.floor(Math.random() * 3));

  shuffled.forEach(pos => {
    const splash = document.createElement('img');
    splash.src = 'assets/images/pintura-hover.png';
    splash.className = 'paint-splash';

    // Tamaño aleatorio para variedad visual (entre 55px y 100px)
    const size = 55 + Math.random() * 45;
    splash.style.width  = size + 'px';
    splash.style.height = size + 'px';

    if (pos.top    !== undefined) splash.style.top    = pos.top;
    if (pos.bottom !== undefined) splash.style.bottom = pos.bottom;
    if (pos.left   !== undefined) splash.style.left   = pos.left;
    if (pos.right  !== undefined) splash.style.right  = pos.right;
    splash.style.transform = `rotate(${pos.rotation}deg)`;

    splashContainer.appendChild(splash);
  });

  card.appendChild(splashContainer);

  /* 4. Eventos de hover para intercambiar el emoticono */
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