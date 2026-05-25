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

/* ── I18N DATA ── */
const i18n = {
  es: {
    nav_classes: "Clases",
    nav_rental: "Sala de Alquiler",
    nav_contact: "Contacto",
    hero_tagline: "Crea · Imagina · Sueña",
    hero_cta1: "Descubrir Clases",
    hero_cta2: "Sala de Alquiler",
    scroll: "Explorar",
    classes_eyebrow: "Escuela de Artes",
    classes_title: "Clases & Talleres",
    classes_desc: "Aprende, crea y diviértete explorando tu talento en un ambiente inspirador. Clases para niños a partir de 5 años y adultos de todos los niveles.",
    classes_arts: "Artes Plásticas",
    classes_music: "Música",
    classes_dance: "Danza",
    card_drawing: "Dibujo a Lápiz",
    card_drawing_desc: "Sombras, proporciones, volumen y perspectiva. Desarrolla tu mirada artística desde cero.",
    card_paint: "Pintura Acrílica y Acuarela",
    card_paint_desc: "Mezcla de colores, texturas, degradados y técnicas húmedas. Crea obras llenas de luz.",
    card_crafts: "Manualidades Creativas",
    card_crafts_desc: "Reciclaje, collage, papelería creativa, foamy, telas y mucho más. La creatividad no tiene límites.",
    card_manga: "Manga & Ilustración",
    card_manga_desc: "Aprende el estilo manga japonés: personajes, expresiones y narrativa visual. Para fans del anime.",
    card_singing: "Canto",
    card_singing_desc: "Desarrolla tu voz, respiración y confianza mientras te diviertes.",
    card_flamenco_sing: "Cante Flamenco",
    card_flamenco_sing_desc: "Conoce la fuerza y la emoción del flamenco. Ritmo, compás y expresión.",
    card_percusion: "Percusión & Batería",
    card_percusion_desc: "Explora ritmos, coordina tu cuerpo y mejora tu concentración. Aprende ritmo y disciplina de forma divertida.",
    card_guitar: "Guitarra & Más",
    card_guitar_desc: "Guitarra, teclado, bajo, ukelele e iniciación musical. Acompaña tus canciones favoritas.",
    card_dance: "Clases y Talleres de Danza",
    card_dance_desc: "Para niños, niñas y adultos. Un amplio repertorio de estilos para descubrir el movimiento que te hace brillar.",
    card_wellness: "Yoga · Pilates · Entrenamiento",
    card_wellness_desc: "Clases reducidas y personalizadas de yoga, pilates y entrenamiento funcional. Cuerpo, mente y bienestar.",
    dance_flamenco: "Flamenco",
    dance_sevillanas: "Sevillanas",
    dance_salsa: "Salsa y Bachata en Línea",
    dance_broadway: "Broadway",
    dance_urban: "Danzas Urbanas",
    dance_belly: "Danza del Vientre",
    dance_polynesian: "Danzas Polinesias",
    dance_bollywood: "Bollywood",
    dance_zumba: "Zumba",
    dance_individual: "Bailes Individuales",
    tag_kids: "Niños +5",
    tag_adults: "Adultos",
    tag_alllevels: "Todos los niveles",
    tag_from5: "A partir de 5 años",
    tag_reduced: "Grupos reducidos",
    benefits_title: "Beneficios de nuestras clases",
    benefit1: "Fomenta la creatividad y la imaginación",
    benefit2: "Mejora la concentración y la paciencia",
    benefit3: "Aumenta la autoestima y la confianza",
    benefit4: "Desarrolla la motricidad fina y la expresión emocional",
    benefit5: "Y, sobre todo... ¡se divierten creando!",
    divider_rental: "Sala de Alquiler",
    divider_sub: "Tu evento, nuestro espacio",
    rental_eyebrow: "Sala de Eventos",
    rental_title: "Sala de Alquileres",
    rental_desc: "El lugar perfecto para cada ocasión. Un espacio versátil, amplio y equipado para tus momentos más especiales.",
    rental_headline: "Tu evento, nuestro espacio",
    rental_headline_sub: "Creamos momentos inolvidables · Calle dels Velers, 50 · Reus",
    rental_pros: "Para Profesionales",
    rental_particulars: "Para Particulares",
    pro1: "Reuniones y congresos",
    pro2: "Talleres multidisciplinares",
    pro3: "Eventos culturales",
    pro4: "Cenas de empresa",
    pro5: "Conferencias y presentaciones",
    pro6: "Estudio fotográfico o audiovisual",
    pro7: "Desfiles y exposiciones",
    part1: "Aniversarios (bodas de oro, de plata, 18 años...)",
    part2: "Baby shower",
    part3: "Graduaciones",
    part4: "Despedidas de soltera",
    part5: "Fiestas de henna",
    part6: "Bodas y bautizos",
    part7: "Fiestas Chiqui Park para niños",
    part8: "Y mucho más...",
    services_title: "Servicios",
    svc_wedding: "Wedding Planner",
    svc_deco: "Decoración",
    svc_catering: "Catering",
    svc_dj: "DJ",
    svc_shows: "Espectáculos",
    svc_chiquipark: "Chiqui Park",
    workshops_title: "Talleres y Actividades",
    ws_dance: "Talleres de Danza",
    ws_dance_desc: "Danza del vientre, Salsa, Bachata y más",
    ws_pastry: "Talleres de Pastelería",
    ws_pastry_desc: "Para cumpleaños, despedidas de soltera...",
    ws_crafts: "Talleres de Manualidades",
    ws_crafts_desc: "Fiestas infantiles y cumpleaños de niños",
    ws_resin: "Talleres de Resina",
    ws_resin_desc: "Crea piezas únicas con técnicas de resina",
    ws_choreo: "Coreografías para Novios",
    ws_choreo_desc: "Haz inolvidable tu primer baile",
    contact_eyebrow: "Contacto",
    contact_title: "Ven a Conocernos",
    contact_desc: "Estamos en la Calle dels Velers, 50 de Reus. Ven a descubrir tu pasión y haz realidad tus ideas.",
    contact_cta: "Contactar Ahora",
    footer_tagline: "donde cada creación cuenta una historia",
  },
  ca: {
    nav_classes: "Classes",
    nav_rental: "Sala de Lloguer",
    nav_contact: "Contacte",
    hero_tagline: "Crea · Imagina · Somia",
    hero_cta1: "Descobrir Classes",
    hero_cta2: "Sala de Lloguer",
    scroll: "Explorar",
    classes_eyebrow: "Escola d'Arts",
    classes_title: "Classes & Tallers",
    classes_desc: "Aprèn, crea i diverteix-te explorant el teu talent en un ambient inspirador. Classes per a nens a partir de 5 anys i adults de tots els nivells.",
    classes_arts: "Arts Plàstiques",
    classes_music: "Música",
    classes_dance: "Dansa",
    card_drawing: "Dibuix a Llapis",
    card_drawing_desc: "Ombres, proporcions, volum i perspectiva. Desenvolupa la teva mirada artística des de zero.",
    card_paint: "Pintura Acrílica i Aquarel·la",
    card_paint_desc: "Barreja de colors, textures, degradats i tècniques humides. Crea obres plenes de llum.",
    card_crafts: "Manualitats Creatives",
    card_crafts_desc: "Reciclatge, collage, papereria creativa, foamy, teles i molt més. La creativitat no té límits.",
    card_manga: "Manga & Il·lustració",
    card_manga_desc: "Aprèn l'estil manga japonès: personatges, expressions i narrativa visual. Per a fans de l'anime.",
    card_singing: "Cant",
    card_singing_desc: "Desenvolupa la teva veu, respiració i confiança mentre et diverteixes.",
    card_flamenco_sing: "Cant Flamenc",
    card_flamenco_sing_desc: "Coneix la força i l'emoció del flamenc. Ritme, compàs i expressió.",
    card_percusion: "Percussió & Bateria",
    card_percusion_desc: "Explora ritmes, coordina el teu cos i millora la teva concentració. Aprèn ritme i disciplina d'una manera divertida.",
    card_guitar: "Guitarra & Més",
    card_guitar_desc: "Guitarra, teclat, baix, ukelele i iniciació musical. Acompanya les teves cançons preferides.",
    card_dance: "Classes i Tallers de Dansa",
    card_dance_desc: "Per a nens, nenes i adults. Un ampli repertori d'estils per descobrir el moviment que et fa brillar.",
    card_wellness: "Ioga · Pilates · Entrenament",
    card_wellness_desc: "Classes reduïdes i personalitzades de ioga, pilates i entrenament funcional. Cos, ment i benestar.",
    dance_flamenco: "Flamenc",
    dance_sevillanas: "Sevillanes",
    dance_salsa: "Salsa i Bachata en Línia",
    dance_broadway: "Broadway",
    dance_urban: "Danses Urbanes",
    dance_belly: "Dansa del Ventre",
    dance_polynesian: "Danses Polinèsies",
    dance_bollywood: "Bollywood",
    dance_zumba: "Zumba",
    dance_individual: "Balls Individuals",
    tag_kids: "Nens +5",
    tag_adults: "Adults",
    tag_alllevels: "Tots els nivells",
    tag_from5: "A partir de 5 anys",
    tag_reduced: "Grups reduïts",
    benefits_title: "Beneficis de les nostres classes",
    benefit1: "Fomenta la creativitat i la imaginació",
    benefit2: "Millora la concentració i la paciència",
    benefit3: "Augmenta l'autoestima i la confiança",
    benefit4: "Desenvolupa la motricitat fina i l'expressió emocional",
    benefit5: "I, sobretot... es diverteixen creant!",
    divider_rental: "Sala de Lloguer",
    divider_sub: "El teu event, el nostre espai",
    rental_eyebrow: "Sala d'Events",
    rental_title: "Sala de Lloguers",
    rental_desc: "El lloc perfecte per a cada ocasió. Un espai versàtil, ampli i equipat per als teus moments més especials.",
    rental_headline: "El teu event, el nostre espai",
    rental_headline_sub: "Creem moments inoblidables · Carrer dels Velers, 50 · Reus",
    rental_pros: "Per a Professionals",
    rental_particulars: "Per a Particulars",
    pro1: "Reunions i congressos",
    pro2: "Tallers multidisciplinaris",
    pro3: "Esdeveniments culturals",
    pro4: "Sopars d'empresa",
    pro5: "Conferències i presentacions",
    pro6: "Estudi fotogràfic o audiovisual",
    pro7: "Desfilades i exposicions",
    part1: "Aniversaris (noces d'or, de plata, 18 anys...)",
    part2: "Baby shower",
    part3: "Graduacions",
    part4: "Despedides de soltera",
    part5: "Festes de henna",
    part6: "Casaments i batejos",
    part7: "Festes Chiqui Park per a nens",
    part8: "I molt més...",
    services_title: "Serveis",
    svc_wedding: "Wedding Planner",
    svc_deco: "Decoració",
    svc_catering: "Càtering",
    svc_dj: "DJ",
    svc_shows: "Espectacles",
    svc_chiquipark: "Chiqui Park",
    workshops_title: "Tallers i Activitats",
    ws_dance: "Tallers de Dansa",
    ws_dance_desc: "Dansa del ventre, Salsa, Bachata i més",
    ws_pastry: "Tallers de Pastisseria",
    ws_pastry_desc: "Per a aniversaris, despedides de soltera...",
    ws_crafts: "Tallers de Manualitats",
    ws_crafts_desc: "Festes infantils i aniversaris de nens",
    ws_resin: "Tallers de Resina",
    ws_resin_desc: "Crea peces úniques amb tècniques de resina",
    ws_choreo: "Coreografies per a Nuvis",
    ws_choreo_desc: "Fes inoblidable el teu primer ball",
    contact_eyebrow: "Contacte",
    contact_title: "Vine a Conèixer-nos",
    contact_desc: "Estem al Carrer dels Velers, 50 de Reus. Vine a descobrir la teva passió i fes realitat les teves idees.",
    contact_cta: "Contactar Ara",
    footer_tagline: "on cada creació explica una història",
  }
};

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