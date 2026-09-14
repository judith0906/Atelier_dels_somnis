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
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (dict[key]) el.placeholder = dict[key];
  });
  document.documentElement.lang = lang;
  document.getElementById('label-es').classList.toggle('active', lang === 'es');
  document.getElementById('label-ca').classList.toggle('active', lang === 'ca');
  document.getElementById('toggle-thumb').classList.toggle('ca', lang === 'ca');
  renderHorarios();
}

function setLang(lang) { applyLang(lang); }

function toggleLang() {
  applyLang(currentLang === 'es' ? 'ca' : 'es');
}

/* ── HORARIOS ── */
const HORARIOS_REMOTE_API = 'https://REEMPLAZA-ESTE-SITIO.netlify.app/api/horarios';
const HORARIOS_CACHE_KEY = 'atelier_horarios_cache';

let horariosData = null;

function renderHorarios() {
  const grid = document.getElementById('horarios-grid');
  const days = (horariosData && horariosData[currentLang]) || [];
  if (!grid) return;

  grid.innerHTML = '';

  days.forEach((d, dayIdx) => {
    const card = document.createElement('div');
    card.className = 'horario-day hd-' + dayIdx;

    const header = document.createElement('div');
    header.className = 'horario-day-header';

    const d1 = document.createElement('span');
    d1.className = 'horario-day-name-diamond';
    d1.textContent = '✦';

    const name = document.createElement('span');
    name.className = 'horario-day-name';
    name.textContent = d.day;

    const d2 = document.createElement('span');
    d2.className = 'horario-day-name-diamond';
    d2.textContent = '✦';

    header.appendChild(d1);
    header.appendChild(name);
    header.appendChild(d2);
    card.appendChild(header);

    d.groups.forEach(g => {
      const group = document.createElement('div');
      group.className = 'horario-time-group';

      const time = document.createElement('div');
      time.className = 'horario-time';
      time.textContent = g.time;

      const rowsWrap = document.createElement('div');
      rowsWrap.className = 'horario-group-classes';

      g.classes.forEach(c => {
        const row = document.createElement('div');
        row.className = 'horario-class' + (c.pending ? ' pending' : '');

        const activity = document.createElement('div');
        activity.className = 'horario-class-activity';
        activity.textContent = c.activity;
        row.appendChild(activity);

        if (c.teacher) {
          const teacher = document.createElement('div');
          teacher.className = 'horario-class-teacher';
          teacher.textContent = c.teacher;
          row.appendChild(teacher);
        }

        if (c.pending) {
          const badge = document.createElement('span');
          badge.className = 'horario-pending-badge';
          badge.textContent = i18n[currentLang].horarios_pending;
          row.appendChild(badge);
        }

        rowsWrap.appendChild(row);
      });

      group.appendChild(time);
      group.appendChild(rowsWrap);
      card.appendChild(group);
    });

    grid.appendChild(card);
  });

  const searchInput = document.getElementById('horarios-search');
  if (searchInput) searchInput.placeholder = i18n[currentLang].horarios_search;
  filterHorarios();
}

/* ── FILTRO DE BÚSQUEDA ── */
let horariosQuery = '';

function filterHorarios() {
  const grid = document.getElementById('horarios-grid');
  if (!grid) return;

  let anyVisible = false;

  grid.querySelectorAll('.horario-day').forEach(card => {
    let dayVisible = false;
    card.querySelectorAll('.horario-time-group').forEach(group => {
      const groupTime = (group.querySelector('.horario-time').textContent || '').toLowerCase();
      let groupVisible = false;
      group.querySelectorAll('.horario-class').forEach(row => {
        const text = (row.textContent || '').toLowerCase();
        const match = !horariosQuery || text.includes(horariosQuery) || groupTime.includes(horariosQuery);
        row.classList.toggle('hidden', !match);
        if (match) groupVisible = true;
      });
      group.classList.toggle('hidden', !groupVisible);
      if (groupVisible) dayVisible = true;
    });
    card.classList.toggle('hidden', !dayVisible);
    if (dayVisible) anyVisible = true;
  });

  const empty = document.getElementById('horarios-empty');
  if (empty) empty.style.display = (horariosQuery && !anyVisible) ? 'block' : 'none';
}

const horariosSearch = document.getElementById('horarios-search');
if (horariosSearch) {
  horariosSearch.addEventListener('input', () => {
    horariosQuery = horariosSearch.value.trim().toLowerCase();
    filterHorarios();
  });
}

/* ── CARGA DEL HORARIO DESDE LA BBDD (NEON) ── */
function startMinutes(time) {
  const m = (time || '').match(/(\d{1,2}):(\d{2})/);
  return m ? parseInt(m[1], 10) * 60 + parseInt(m[2], 10) : 0;
}

function groupHorarios(rows) {
  const map = {};
  rows.forEach(r => {
    if (!map[r.lang]) map[r.lang] = {};
    if (!map[r.lang][r.dia]) map[r.lang][r.dia] = [];
    map[r.lang][r.dia].push({
      time: (r.horas || '').replace(/\s*-\s*/g, ' – '),
      activity: r.clase,
      teacher: r.profe || null,
      pending: !!r.pendiente
    });
  });

  const result = {};
  Object.keys(map).forEach(lang => {
    result[lang] = Object.keys(map[lang]).map(dia => {
      const classes = map[lang][dia].slice().sort((a, b) => startMinutes(a.time) - startMinutes(b.time));
      const groups = [];
      classes.forEach(c => {
        const last = groups[groups.length - 1];
        if (last && last.time === c.time) last.classes.push(c);
        else groups.push({ time: c.time, classes: [c] });
      });
      return { day: dia, groups };
    });
  });
  return result;
}

function cacheHorariosGet() {
  try {
    return JSON.parse(localStorage.getItem(HORARIOS_CACHE_KEY) || 'null');
  } catch (e) {
    return null;
  }
}

function cacheHorariosSet(rows) {
  try {
    localStorage.setItem(HORARIOS_CACHE_KEY, JSON.stringify({
      savedAt: new Date().toISOString(),
      rows: rows
    }));
  } catch (e) {}
}

function formatHorariosDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(currentLang === 'ca' ? 'ca-ES' : 'es-ES', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  } catch (e) {
    return '';
  }
}

function showHorariosStatus(type, fecha) {
  const el = document.getElementById('horarios-status');
  if (!el) return;
  el.style.display = 'block';
  if (type === 'error') {
    el.className = 'horarios-status error';
    el.textContent = i18n[currentLang].horarios_error || '';
  } else {
    el.className = 'horarios-status cached';
    el.textContent = (i18n[currentLang].horarios_cached || '').replace('{fecha}', fecha || '');
  }
}

function hideHorariosStatus() {
  const el = document.getElementById('horarios-status');
  if (el) el.style.display = 'none';
}

async function loadHorarios() {
  const url = (window.location.protocol === 'file:') ? HORARIOS_REMOTE_API : '/api/horarios';
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const rows = await res.json();
    horariosData = groupHorarios(rows);
    cacheHorariosSet(rows);
    hideHorariosStatus();
  } catch (e) {
    console.error('No se pudo cargar el horario desde la BBDD:', e);
    const cached = cacheHorariosGet();
    if (cached && cached.rows && cached.rows.length) {
      horariosData = groupHorarios(cached.rows);
      showHorariosStatus('cached', formatHorariosDate(cached.savedAt));
    } else {
      horariosData = null;
      showHorariosStatus('error');
    }
  }
  renderHorarios();
}

// Init
applyLang('es');
loadHorarios();

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

  /* 3. Eventos hover */
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

function initFlyerGallery(path, containerId) {
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
    const src = `assets/images/${path}/f${i}.${FLYER_EXTENSIONS[extIdx]}`;
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

initFlyerGallery('flyers/clases',   'flyers-clases');
initFlyerGallery('flyers/alquiler', 'flyers-alquiler');
initFlyerGallery('casals',          'flyers-casals');

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

      card.addEventListener('click', () => openLightbox(src));
    });
  }

  loadChain(1, 0);
}

initPromoBoard('promos', 'promo-grid', 'promo-empty');

/* ── LIGHTBOX NOVETATS ── */
const lightbox   = document.getElementById('promo-lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

function openLightbox(src) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lightboxImg.src = '';
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

/* ── GALERÍA COLLAGE INSTALACIONES ── */
const COLLAGE_EXTENSIONS = ['jpeg', 'jpg', 'png', 'webp'];

function initCollageGallery(path, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const images = [];

  function loadChain(i, extIdx) {
    if (extIdx >= COLLAGE_EXTENSIONS.length) {
      if (images.length > 0) buildCollage();
      return;
    }
    const probe = new Image();
    probe.onload = () => {
      images.push(`${path}f${i}.${COLLAGE_EXTENSIONS[extIdx]}`);
      loadChain(i + 1, 0);
    };
    probe.onerror = () => loadChain(i, extIdx + 1);
    probe.src = `${path}f${i}.${COLLAGE_EXTENSIONS[extIdx]}`;
  }

  function buildCollage() {
    container.classList.add('collage');

    images.forEach((src, idx) => {
      const figure = document.createElement('div');
      figure.className = 'collage-item';

      const el = document.createElement('img');
      el.src = src;
      el.alt = 'Instalaciones de la sala';
      el.loading = 'lazy';

      const zoom = document.createElement('div');
      zoom.className = 'collage-zoom';

      figure.appendChild(el);
      figure.appendChild(zoom);
      figure.addEventListener('click', () => openCollageLightbox(idx));
      container.appendChild(figure);
    });
  }

  loadChain(1, 0);
}

function initCollageLightbox() {
  const lb       = document.getElementById('collage-lightbox');
  const imgEl    = document.getElementById('collage-lb-img');
  const closeBtn = document.getElementById('collage-lb-close');
  const prevBtn  = document.getElementById('collage-lb-prev');
  const nextBtn  = document.getElementById('collage-lb-next');
  const counter  = document.getElementById('collage-lb-counter');
  if (!lb || !imgEl) return;

  const srcs = () => Array.from(document.querySelectorAll('.collage-item img')).map(i => i.src);
  let which = -1;

  function show(dir) {
    const list = srcs();
    if (list.length === 0) return;
    which = (which + dir + list.length) % list.length;
    imgEl.src = list[which];
    if (counter) counter.textContent = `${which + 1} / ${list.length}`;
  }

  window.openCollageLightbox = (idx) => {
    const list = srcs();
    if (list.length === 0) return;
    which = idx;
    imgEl.src = list[which];
    if (counter) counter.textContent = `${which + 1} / ${list.length}`;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  function close() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    imgEl.src = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (prevBtn) prevBtn.addEventListener('click', () => show(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => show(1));
  if (lb) {
    lb.addEventListener('click', (e) => {
      if (e.target === lb) close();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(-1);
    if (e.key === 'ArrowRight') show(1);
  });
}

initCollageGallery('assets/images/alquiler/instalaciones/', 'collage-alquiler');
initCollageLightbox();

/* ── HAMBURGER MENU ── */
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Cierra el menú al hacer click en un enlace
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── FORMULARIO DE CONTACTO (EMAILJS) ── */
/* Sustituir los [..] por los valores reales de tu cuenta EmailJS */
const EMAILJS_PUBLIC_KEY  = '6G_XcLBlJOl_sngk5';
const EMAILJS_SERVICE_ID  = 'service_me3rq8d';
const EMAILJS_TEMPLATE_ID = 'template_17jq4zx';

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('form-status');
  const success = document.getElementById('form-success');

  function showStatus(type, i18nKey) {
    status.textContent = i18n[currentLang]?.[i18nKey] || '';
    status.className = 'form-status ' + type;
    status.style.display = 'block';
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const configMissing =
      EMAILJS_PUBLIC_KEY.startsWith('[') ||
      EMAILJS_SERVICE_ID.startsWith('[') ||
      EMAILJS_TEMPLATE_ID.startsWith('[');

    if (configMissing || typeof emailjs === 'undefined') {
      showStatus('error', 'form_error_config');
      return;
    }

    const submitBtn = form.querySelector('.form-submit');
    submitBtn.disabled = true;
    status.style.display = 'none';

    const templateParams = {
      nombre:    document.getElementById('cf-nombre').value.trim(),
      apellidos: document.getElementById('cf-apellidos').value.trim(),
      correo:    document.getElementById('cf-correo').value.trim(),
      telefono:  document.getElementById('cf-telefono').value.trim(),
      asunto:    document.getElementById('cf-asunto').value.trim(),
      cuerpo:    document.getElementById('cf-cuerpo').value.trim(),
    };

    emailjs.init(EMAILJS_PUBLIC_KEY);

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(() => {
        form.style.display = 'none';
        success.style.display = 'block';
      })
      .catch((error) => {
        console.error('Error enviando el mensaje:', error);
        submitBtn.disabled = false;
        showStatus('error', 'form_error');
      });
  });
}

initContactForm();