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
    
    const loaderAudio = new Audio('music/DANGANRONPA.mp3');
    loaderAudio.volume = 0.7;
    loaderAudio.play().catch(() => {});
    
    if (player) player.style.display = 'none';
    
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
          const fadeOut = setInterval(() => {
            if (loaderAudio.volume > 0.1) {
              loaderAudio.volume -= 0.1;
            } else {
              loaderAudio.pause();
              clearInterval(fadeOut);
            }
          }, 100);
          if (player) player.style.display = '';
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

// Back to Top
const backtopBtn = document.getElementById('backtop');
if (backtopBtn) {
  backtopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActive(document.querySelector('.b-home'));
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
