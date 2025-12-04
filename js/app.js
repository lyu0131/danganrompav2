// Danganronpa v1 – app.js

// Loading Tips
const loadingTips = [
  "Truth Bullets are your navigation.",
  "Hover over the bullets to reveal them.",
  "The music player remembers your last track.",
  "Click character cards to learn more about them.",
  "Hope and despair are two sides of the same coin.",
  "A body has been discovered!",
  "Trust no one. Suspect everyone.",
  "The class trial will decide your fate.",
  "Monokuma is always watching...",
  "Find the contradictions. Expose the truth.",
  "Your Influence is your lifeline in trials.",
  "Upupupu~ Welcome to despair!",
  "Only the blackened can escape... if they get away with it."
];

// Loader (shows once per minute)
const loader = document.getElementById('loader');
const barFill = document.getElementById('barFill');
const loadText = document.getElementById('loadText');
const loadHint = document.getElementById('loadHint');
const player = document.querySelector('.player');
const wheel = document.querySelector('.wheel');

const LOADER_COOLDOWN = 60000;
const lastLoaderTime = localStorage.getItem('lastLoaderTime');
const now = Date.now();
const shouldShowLoader = !lastLoaderTime || (now - parseInt(lastLoaderTime, 10)) > LOADER_COOLDOWN;

if (loader && barFill && loadText) {
  if (loadHint) {
    const randomTip = loadingTips[Math.floor(Math.random() * loadingTips.length)];
    loadHint.textContent = "Tip: " + randomTip;
  }
  
  if (shouldShowLoader) {
    localStorage.setItem('lastLoaderTime', now.toString());
    
    if (player) player.style.display = 'none';
    if (wheel) wheel.style.display = 'none';
    
    let p = 0;
    const timer = setInterval(() => {
      p += Math.random() * 18;
      if (p > 100) p = 100;
      barFill.style.width = p + '%';
      if (p > 85) loadText.innerHTML = 'Despair Loaded!';
      if (p >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          loader.classList.add('hidden');
          if (player) player.style.display = '';
          if (wheel) wheel.style.display = '';
        }, 450);
      }
    }, 180);
  } else {
    loader.classList.add('hidden');
  }
}

// Truth Bullet Navigation
const bullets = document.querySelectorAll('.wheel li');
const flash = document.getElementById('flash');

function setActive(el) {
  bullets.forEach(b => b.classList.remove('active'));
  el?.classList.add('active');
}

bullets.forEach(b => {
  b.addEventListener('click', () => {
    const href = b.getAttribute('data-href');
    if (href) {
      window.location.href = href;
      return;
    }
    
    const target = b.getAttribute('data-target');
    if (target) {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    }
    setActive(b);
  });
});

// Draggable Music Player
const playerEl = document.querySelector('.player');
if (playerEl) {
  let isDragging = false;
  let offsetX, offsetY;
  
  // Restore saved position
  const savedX = localStorage.getItem('playerX');
  const savedY = localStorage.getItem('playerY');
  if (savedX && savedY) {
    playerEl.style.right = 'auto';
    playerEl.style.bottom = 'auto';
    playerEl.style.left = savedX + 'px';
    playerEl.style.top = savedY + 'px';
  }
  
  playerEl.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT') return;
    isDragging = true;
    playerEl.classList.add('dragging');
    offsetX = e.clientX - playerEl.getBoundingClientRect().left;
    offsetY = e.clientY - playerEl.getBoundingClientRect().top;
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    let newX = e.clientX - offsetX;
    let newY = e.clientY - offsetY;
    
    // Keep within viewport
    newX = Math.max(0, Math.min(newX, window.innerWidth - playerEl.offsetWidth));
    newY = Math.max(0, Math.min(newY, window.innerHeight - playerEl.offsetHeight));
    
    playerEl.style.right = 'auto';
    playerEl.style.bottom = 'auto';
    playerEl.style.left = newX + 'px';
    playerEl.style.top = newY + 'px';
  });
  
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      playerEl.classList.remove('dragging');
      // Save position
      localStorage.setItem('playerX', playerEl.offsetLeft);
      localStorage.setItem('playerY', playerEl.offsetTop);
    }
  });
}

// Active Bullet on Scroll
const sections = [
  ['#about', '.b-about'],
  ['#sns', '.b-sns'],
  ['#gameplay', '.b-gameplay'],
  ['#home', '.b-home']
];

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pair = sections.find(([id]) => id === '#' + entry.target.id);
        if (pair) setActive(document.querySelector(pair[1]));
      }
    });
  }, { threshold: 0.55 });

  sections.forEach(([sel]) => {
    const el = document.querySelector(sel);
    if (el) io.observe(el);
  });
}

// Gameplay Slideshow
let slideIndex = 1;

function showSlides(n) {
  const slides = document.getElementsByClassName('mySlides');
  const dots = document.getElementsByClassName('dot');
  
  if (slides.length === 0) return;
  
  if (n > slides.length) slideIndex = 1;
  if (n < 1) slideIndex = slides.length;
  
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
  }
  
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove('active');
  }
  
  slides[slideIndex - 1].style.display = 'block';
  if (dots[slideIndex - 1]) dots[slideIndex - 1].classList.add('active');
}

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

document.addEventListener('DOMContentLoaded', () => showSlides(slideIndex));
