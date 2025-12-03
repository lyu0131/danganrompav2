// Danganronpa v1 – app.js
// ====== Loader simulation ======
const loader = document.getElementById('loader');
const barFill = document.getElementById('barFill');
const loadText = document.getElementById('loadText');
const player = document.querySelector('.player');

if (loader && barFill && loadText) {
  // Hide player during loading
  if (player) player.style.display = 'none';
  
  let p = 0;
  const timer = setInterval(() => {
    p += Math.random() * 18; // choppy, chaotic load
    if (p > 100) p = 100;
    barFill.style.width = p + '%';
    if (p > 85) loadText.innerHTML = 'Despair Loaded!';
    if (p >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        loader.classList.add('hidden');
        // Show player after loading completes
        if (player) player.style.display = '';
      }, 450);
    }
  }, 180);
}

// ====== Truth-bullet navigation + muzzle flash ======
const bullets = document.querySelectorAll('.wheel li');
const flash = document.getElementById('flash');
function setActive(el){ bullets.forEach(b=>b.classList.remove('active')); el?.classList.add('active'); }

console.log('[app.js] Found', bullets.length, 'truth bullets');

bullets.forEach(b => {
  b.addEventListener('click', e => {
    console.log('[app.js] Truth bullet clicked:', b.textContent, 'target:', b.getAttribute('data-target'), 'href:', b.getAttribute('data-href'));
    
    // Check if it's a link to another page
    const href = b.getAttribute('data-href');
    if (href) {
      window.location.href = href;
      return;
    }
    
    // Otherwise scroll to section on same page
    const target = b.getAttribute('data-target');
    if (target) { 
      console.log('[app.js] Scrolling to', target);
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' }); 
    }
    setActive(b);
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
// (Removed - using default crosshair cursor)

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

// ====== Gameplay Slideshow ======
let slideIndex = 1;

function showSlides(n) {
  const slides = document.getElementsByClassName("mySlides");
  const dots = document.getElementsByClassName("dot");
  
  if (slides.length === 0) return;
  
  if (n > slides.length) slideIndex = 1;
  if (n < 1) slideIndex = slides.length;
  
  // Hide all slides
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  
  // Remove active class from all dots
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active");
  }
  
  // Show current slide and activate dot
  slides[slideIndex - 1].style.display = "block";
  if (dots[slideIndex - 1]) {
    dots[slideIndex - 1].classList.add("active");
  }
}

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

// Initialize slideshow when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  showSlides(slideIndex);
});
