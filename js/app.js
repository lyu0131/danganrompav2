// Danganronpa v1 – app.js
// ====== Loader simulation ======
const loader = document.getElementById('loader');
const barFill = document.getElementById('barFill');
const loadText = document.getElementById('loadText');
if (loader && barFill && loadText) {
  let p = 0;
  const timer = setInterval(() => {
    p += Math.random() * 18; // choppy, chaotic load
    if (p > 100) p = 100;
    barFill.style.width = p + '%';
    if (p > 85) loadText.innerHTML = 'Despair Loaded!';
    if (p >= 100) {
      clearInterval(timer);
      setTimeout(() => loader.classList.add('hidden'), 450);
    }
  }, 180);
}

// ====== Truth-bullet navigation + muzzle flash ======
const bullets = document.querySelectorAll('.wheel li');
const flash = document.getElementById('flash');
function setActive(el){ bullets.forEach(b=>b.classList.remove('active')); el?.classList.add('active'); }

bullets.forEach(b => {
  b.addEventListener('click', e => {
    const target = b.getAttribute('data-target');
    if (target) { document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' }); }
    setActive(b);
    // flash at cursor position
    const x = e.clientX + 'px';
    const y = e.clientY + 'px';
    if (flash) {
      flash.style.setProperty('--x', x);
      flash.style.setProperty('--y', y);
      flash.classList.add('show');
      setTimeout(() => flash.classList.remove('show'), 180);
    }
  });
});

// Back to top
const backtopBtn = document.getElementById('backtop');
if (backtopBtn) {
  backtopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const homeBtn = document.querySelector('.b-home');
    setActive(homeBtn);
  });
}

// Optional: set custom cursor if asset exists
(function setCrosshairCursor(){
  const testImg = new Image();
  testImg.onload = () => { document.body.style.cursor = 'url("danganrompav1/images/cursor.png") 16 16, crosshair'; };
  testImg.src = 'danganrompav1/images/cursor.png';
})();

// ====== Update active bullet while scrolling (IntersectionObserver) ======
const sections = [
  ['#home', '.b-home'],
  ['#about', '.b-about'],
  ['#characters', '.b-chars'],
  ['#sns', '.b-sns']
];

if ('IntersectionObserver' in window) {
  const opts = { root: null, rootMargin: '0px', threshold: 0.55 };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pair = sections.find(([id]) => id === '#' + entry.target.id);
        if (pair) {
          const btn = document.querySelector(pair[1]);
          setActive(btn);
        }
      }
    });
  }, opts);

  sections.forEach(([sel]) => {
    const el = document.querySelector(sel);
    if (el) io.observe(el);
  });
}

// ====== Accessibility: keyboard arrows to rotate wheel ======
const wheel = document.querySelector('.wheel');
if (wheel) {
  wheel.tabIndex = 0; // ensure focusable
  wheel.addEventListener('keydown', (e) => {
    const order = ['.b-home', '.b-about', '.b-chars', '.b-sns'];
    const currentIndex = order.findIndex(sel => document.querySelector(sel)?.classList.contains('active'));
    if (['ArrowRight','ArrowDown'].includes(e.key)) {
      e.preventDefault();
      const next = document.querySelector(order[(currentIndex + 1) % order.length]);
      next?.dispatchEvent(new MouseEvent('click', { bubbles:true, cancelable:true, view:window }));
    }
    if (['ArrowLeft','ArrowUp'].includes(e.key)) {
      e.preventDefault();
      const prev = document.querySelector(order[(currentIndex - 1 + order.length) % order.length]);
      prev?.dispatchEvent(new MouseEvent('click', { bubbles:true, cancelable:true, view:window }));
    }
  });
}
