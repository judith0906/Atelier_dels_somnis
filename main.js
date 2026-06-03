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
// Carga imágenes f1, f2, f3... hasta que una falle.
// Para añadir flyers solo tienes que meter f4.jpg, f5.jpg, etc. en la carpeta.
// Soporta .jpg, .jpeg, .png y .webp

function loadFlyers(folder, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const extensions = ['jpg', 'jpeg', 'png', 'webp'];
  let index = 1;
  let loaded = 0;

  function tryNext() {
    const extIndex = 0;
    tryExtension(index, extIndex);
  }

  function tryExtension(i, extIdx) {
    if (extIdx >= extensions.length) {
      // Ninguna extensión funcionó para este número: paramos
      if (loaded === 0) {
        container.innerHTML = '<p class="flyers-empty">Próximamente...</p>';
      }
      return;
    }

    const src = `assets/images/flyers/${folder}/f${i}.${extensions[extIdx]}`;
    const img = new Image();

    img.onload = () => {
      // La imagen existe: crear la card y continuar con la siguiente
      const card = document.createElement('div');
      card.className = 'flyer-card';

      const imgEl = document.createElement('img');
      imgEl.src = src;
      imgEl.alt = `Flyer ${i}`;
      imgEl.loading = 'lazy';

      card.appendChild(imgEl);
      container.appendChild(card);

      loaded++;
      index++;
      tryNext();
    };

    img.onerror = () => {
      // Esta extensión no existe, probar la siguiente
      tryExtension(i, extIdx + 1);
    };

    img.src = src;
  }

  tryNext();
}

loadFlyers('clases',   'flyers-clases');
loadFlyers('alquiler', 'flyers-alquiler');