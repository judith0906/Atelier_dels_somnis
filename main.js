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