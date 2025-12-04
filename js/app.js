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

// Glass Shatter Click Effect
(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'fractureCanvas';
  canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:99999;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  
  let fractures = [];
  
  function createShatter(x, y) {
    const segments = [];
    
    // Impact core - dense, short, irregular cracks from center
    const coreRadius = 8 + Math.random() * 6;
    const coreCracks = 12 + Math.floor(Math.random() * 8);
    for (let i = 0; i < coreCracks; i++) {
      const angle = (Math.PI * 2 / coreCracks) * i + (Math.random() - 0.5) * 0.4;
      const len = coreRadius * (0.5 + Math.random() * 0.8);
      const endX = x + Math.cos(angle) * len;
      const endY = y + Math.sin(angle) * len;
      segments.push({ x1: x, y1: y, x2: endX, y2: endY, phase: 0, width: 3 + Math.random() * 3 });
    }
    
    // Primary radial fractures - tapered, variable thickness
    const primaryCount = 8 + Math.floor(Math.random() * 5);
    for (let i = 0; i < primaryCount; i++) {
      const baseAngle = (Math.PI * 2 / primaryCount) * i + (Math.random() - 0.5) * 0.3;
      let cx = x, cy = y;
      let angle = baseAngle;
      const maxLen = 40 + Math.random() * 60;
      let traveled = 0;
      let width = 4.5 + Math.random() * 3;
      
      // Create jagged path with tapering width
      while (traveled < maxLen) {
        const segLen = 8 + Math.random() * 15;
        angle += (Math.random() - 0.5) * 0.6;
        const nx = cx + Math.cos(angle) * segLen;
        const ny = cy + Math.sin(angle) * segLen;
        
        // Taper width as we go outward
        const taper = 1 - (traveled / maxLen) * 0.7;
        segments.push({ x1: cx, y1: cy, x2: nx, y2: ny, phase: 1, width: width * taper });
        
        // Secondary splits - more frequent near center
        if (Math.random() < 0.4 - traveled / maxLen * 0.3) {
          const splitAngle = angle + (Math.random() > 0.5 ? 1 : -1) * (0.4 + Math.random() * 0.6);
          const splitLen = (maxLen - traveled) * (0.3 + Math.random() * 0.4);
          let scx = nx, scy = ny;
          let sAngle = splitAngle;
          let sTraveled = 0;
          let sWidth = width * taper * 0.7;
          
          while (sTraveled < splitLen) {
            const sSegLen = 6 + Math.random() * 10;
            sAngle += (Math.random() - 0.5) * 0.5;
            const snx = scx + Math.cos(sAngle) * sSegLen;
            const sny = scy + Math.sin(sAngle) * sSegLen;
            const sTaper = 1 - (sTraveled / splitLen) * 0.8;
            segments.push({ x1: scx, y1: scy, x2: snx, y2: sny, phase: 1, width: sWidth * sTaper });
            scx = snx; scy = sny;
            sTraveled += sSegLen;
          }
        }
        
        cx = nx; cy = ny;
        traveled += segLen;
      }
    }
    
    // Concentric ring cracks (like pressure waves)
    const rings = 2 + Math.floor(Math.random() * 2);
    for (let r = 0; r < rings; r++) {
      const ringRadius = 25 + r * 25 + Math.random() * 15;
      const arcCount = 4 + Math.floor(Math.random() * 4);
      for (let a = 0; a < arcCount; a++) {
        const startAngle = Math.random() * Math.PI * 2;
        const arcLen = 0.3 + Math.random() * 0.5;
        const steps = 4 + Math.floor(Math.random() * 3);
        for (let s = 0; s < steps; s++) {
          const a1 = startAngle + (arcLen / steps) * s;
          const a2 = startAngle + (arcLen / steps) * (s + 1);
          const r1 = ringRadius + (Math.random() - 0.5) * 8;
          const r2 = ringRadius + (Math.random() - 0.5) * 8;
          segments.push({
            x1: x + Math.cos(a1) * r1,
            y1: y + Math.sin(a1) * r1,
            x2: x + Math.cos(a2) * r2,
            y2: y + Math.sin(a2) * r2,
            phase: 2,
            width: 2 + Math.random() * 2
          });
        }
      }
    }
    
    // Triangular shard hints - short connecting cracks
    const shardCount = 6 + Math.floor(Math.random() * 6);
    for (let i = 0; i < shardCount; i++) {
      const dist = 15 + Math.random() * 40;
      const angle = Math.random() * Math.PI * 2;
      const px = x + Math.cos(angle) * dist;
      const py = y + Math.sin(angle) * dist;
      const shardAngle = angle + Math.PI / 2 + (Math.random() - 0.5) * 0.8;
      const shardLen = 8 + Math.random() * 15;
      segments.push({
        x1: px,
        y1: py,
        x2: px + Math.cos(shardAngle) * shardLen,
        y2: py + Math.sin(shardAngle) * shardLen,
        phase: 2,
        width: 2 + Math.random() * 1.5
      });
    }
    
    return { segments, birth: performance.now() };
  }
  
  function draw(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    fractures = fractures.filter(f => {
      const age = time - f.birth;
      if (age > 500) return false;
      
      ctx.lineCap = 'square';
      
      f.segments.forEach(seg => {
        let visible = false;
        let alpha = 1;
        
        // Staggered appearance
        if (seg.phase === 0 && age >= 0) visible = true;
        else if (seg.phase === 1 && age >= 20) visible = true;
        else if (seg.phase === 2 && age >= 80) visible = true;
        
        if (age > 250) alpha = 1 - (age - 250) / 250;
        
        if (visible && alpha > 0) {
          ctx.strokeStyle = `rgba(255, 79, 163, ${alpha})`;
          ctx.lineWidth = seg.width;
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.stroke();
          
          // Thin white highlight
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
          ctx.lineWidth = seg.width * 0.25;
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.stroke();
        }
      });
      
      return true;
    });
    
    if (fractures.length > 0) requestAnimationFrame(draw);
  }
  
  document.addEventListener('click', (e) => {
    fractures.push(createShatter(e.clientX, e.clientY));
    if (fractures.length === 1) requestAnimationFrame(draw);
  });
})();
