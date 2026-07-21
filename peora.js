// ---- PRELOADER ----
const fill = document.getElementById('preloaderFill');
const preloader = document.getElementById('preloader');
const pLogo = document.querySelector('.preloader-logo');
if (pLogo) pLogo.style.opacity = '1';
let progress = 0;
let isPageLoaded = false;

const loadInterval = setInterval(() => {
  if (isPageLoaded) {
    progress = 100;
  } else {
    progress += Math.random() * 15 + 5;
    if (progress >= 90) progress = 90; // Cap at 90% until page loads
  }
  if (fill) fill.style.width = progress + '%';
  
  if (progress >= 100) {
    clearInterval(loadInterval);
    setTimeout(() => {
      if (preloader) {
        preloader.style.transition = 'opacity .4s cubic-bezier(.16, 1, .3, 1), transform .4s cubic-bezier(.16, 1, .3, 1)';
        preloader.style.opacity = '0';
        preloader.style.transform = 'scale(1.02)';
        setTimeout(() => { preloader.style.display = 'none'; }, 400);
      }
    }, 150);
  }
}, 40);

window.addEventListener('load', () => {
  isPageLoaded = true;
});

// ---- HERO CANVAS PARTICLES ----
const canvas = document.getElementById('heroCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  function resizeCanvas() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resizeCanvas(); window.addEventListener('resize', resizeCanvas);
  const particles = [];
  const pCount = window.innerWidth < 700 ? 30 : 60;
  const pColors = ['rgba(233,85,33,', 'rgba(253,181,201,', 'rgba(255,181,71,', 'rgba(62,65,181,', 'rgba(127,224,203,'];
  for (let i = 0; i < pCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + .5,
      dx: (Math.random() - .5) * .3,
      dy: -(Math.random() * .5 + .2),
      o: Math.random() * .3 + .08,
      c: pColors[Math.floor(Math.random() * pColors.length)]
    });
  }
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${p.c}${p.o})`; ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      if (p.x < -10 || p.x > canvas.width + 10) p.x = Math.random() * canvas.width;
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(22,23,67,${.04 * (1 - dist / 120)})`; ctx.lineWidth = .5; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

// ---- HEADER SCROLL ----
const header = document.getElementById('mainHeader');
if (header) {
  window.addEventListener('scroll', () => { header.classList.toggle('scrolled', window.scrollY > 60); });
}

// ---- MARQUEE ----
const marqueeItems = ["24 Years of Continuous Supply", "Multi-Barrier Purified", "Bottles · Pouches · 20L Jars", "FSSAI Licensed", "Jabalpur, Madhya Pradesh", "Same-Day Fill & Seal", "BIS (ISI) Certified", "6-Stage Purification"];
const mTrack = document.getElementById('marqueeTrack');
if (mTrack) {
  let mHTML = '';
  for (let r = 0; r < 3; r++) marqueeItems.forEach(t => mHTML += `<span>${t}</span>`);
  mTrack.innerHTML = mHTML;
}

// ---- REVEAL ON SCROLL ----
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObs.unobserve(entry.target); } });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));

// ---- COUNTER ANIMATION ----
const counters = document.querySelectorAll('[data-count]');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const duration = 2000;
      const start = performance.now();
      const startVal = 0;
      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        el.textContent = Math.round(startVal + (target - startVal) * ease);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObs.observe(c));

// ---- PROCESS SCROLLYTELLING ----
const stageData = ["Groundwater drawn & logged", "Particulate reduced to micron-level", "Chlorine & odour stripped", "Dissolved solids brought to range", "Microbiological load neutralised", "Filled, sealed, ready to ship"];
const stageCards = document.querySelectorAll('.stage-card');
const dotRows = document.querySelectorAll('.dot-row');
const readoutValue = document.getElementById('readoutValue');
const stageObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const idx = entry.target.getAttribute('data-stage');
    if (entry.isIntersecting) {
      stageCards.forEach(c => c.classList.remove('active'));
      dotRows.forEach(d => d.classList.remove('active'));
      entry.target.classList.add('active');
      const activeDot = document.querySelector(`.dot-row[data-stage="${idx}"]`);
      if (activeDot) activeDot.classList.add('active');
      if (readoutValue) {
        readoutValue.style.opacity = 0;
        setTimeout(() => { readoutValue.textContent = stageData[idx]; readoutValue.style.opacity = 1; }, 200);
      }
    }
  });
}, { threshold: 0.5 });
stageCards.forEach(c => stageObs.observe(c));
if (stageCards[0]) stageCards[0].classList.add('active');
if (dotRows[0]) dotRows[0].classList.add('active');

// ---- SMOOTH ANCHOR LINKS ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Close mobile navigation drawer if open
      const nav = document.querySelector('nav');
      if (nav) nav.classList.remove('mobile-open');
    }
  });
});

// ---- COLOR SWAP TEXT ----
const csBlock = document.getElementById('colorSwapText');
if (csBlock) {
  const text = csBlock.textContent.trim();
  csBlock.innerHTML = text.split(/\s+/).map(w => `<span class="word">${w}</span>`).join(' ');
  const words = csBlock.querySelectorAll('.word');
  function updateColorSwap() {
    const rect = csBlock.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = vh * 0.9;
    const end = vh * 0.2;
    const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
    const litCount = Math.floor(progress * words.length);
    words.forEach((w, i) => w.classList.toggle('lit', i < litCount));
  }
  window.addEventListener('scroll', updateColorSwap);
  updateColorSwap();
}