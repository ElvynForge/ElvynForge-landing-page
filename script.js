// --- 1. Background Particle Grid Canvas ---
const bgCanvas = document.getElementById('bg-canvas');
const ctx = bgCanvas.getContext('2d');

let width, height;
let particles = [];
let mouse = { x: null, y: null, radius: 180 };

function resizeCanvas() {
  width = bgCanvas.width = window.innerWidth;
  height = bgCanvas.height = window.innerHeight;
  initParticles();
}

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 1.5 + 0.5;
    this.baseX = this.x;
    this.baseY = this.y;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.5 + 0.15;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;

    // Mouse Interactivity
    if (mouse.x !== null) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        let force = (mouse.radius - dist) / mouse.radius;
        this.x -= (dx / dist) * force * 2;
        this.y -= (dy / dist) * force * 2;
      }
    }
  }

  draw() {
    ctx.fillStyle = `rgba(0, 229, 153, ${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const particleCount = Math.floor((width * height) / 18000);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function animateBg() {
  ctx.clearRect(0, 0, width, height);

  // Draw faint connections between nearby particles
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      let dx = particles[a].x - particles[b].x;
      let dy = particles[a].y - particles[b].y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 110) {
        let opacity = (1 - dist / 110) * 0.12;
        ctx.strokeStyle = `rgba(0, 229, 153, ${opacity})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animateBg);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

resizeCanvas();
animateBg();

// --- 2. Sticky Header Scroll & Reveal Observer ---
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// --- 3. Spotlight Card Cursor Physics ---
document.querySelectorAll('.spotlight-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// --- 4. Interactive Project Visualizers ---
// Canvas 1: Orbital Solar System
function initSolarCanvas() {
  const cvs = document.getElementById('canvas-solar');
  if (!cvs) return;
  const c = cvs.getContext('2d');
  let t = 0;

  function draw() {
    cvs.width = cvs.parentElement.clientWidth;
    cvs.height = cvs.parentElement.clientHeight;
    const cx = cvs.width / 2;
    const cy = cvs.height / 2;
    c.clearRect(0, 0, cvs.width, cvs.height);

    // Sun
    c.shadowBlur = 30;
    c.shadowColor = '#00E599';
    c.fillStyle = '#00E599';
    c.beginPath();
    c.arc(cx, cy, 22, 0, Math.PI * 2);
    c.fill();
    c.shadowBlur = 0;

    // Orbit 1
    c.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    c.lineWidth = 1;
    c.beginPath();
    c.ellipse(cx, cy, 110, 50, -0.2, 0, Math.PI * 2);
    c.stroke();

    let x1 = cx + Math.cos(t) * 110;
    let y1 = cy + Math.sin(t) * 50;
    c.fillStyle = '#35BFFF';
    c.beginPath();
    c.arc(x1, y1, 8, 0, Math.PI * 2);
    c.fill();

    // Orbit 2
    c.strokeStyle = 'rgba(0, 229, 153, 0.25)';
    c.beginPath();
    c.ellipse(cx, cy, 170, 75, 0.3, 0, Math.PI * 2);
    c.stroke();

    let x2 = cx + Math.cos(t * 0.7 + 1) * 170;
    let y2 = cy + Math.sin(t * 0.7 + 1) * 75;
    c.fillStyle = '#00E599';
    c.beginPath();
    c.arc(x2, y2, 11, 0, Math.PI * 2);
    c.fill();

    t += 0.015;
    requestAnimationFrame(draw);
  }
  draw();
}

// Canvas 2: Nexus Node Network
function initNexusCanvas() {
  const cvs = document.getElementById('canvas-nexus');
  if (!cvs) return;
  const c = cvs.getContext('2d');
  let t = 0;

  function draw() {
    cvs.width = cvs.parentElement.clientWidth;
    cvs.height = cvs.parentElement.clientHeight;
    c.clearRect(0, 0, cvs.width, cvs.height);

    const nodes = [
      { x: cvs.width * 0.25, y: cvs.height * 0.4 },
      { x: cvs.width * 0.5, y: cvs.height * 0.6 + Math.sin(t) * 10 },
      { x: cvs.width * 0.75, y: cvs.height * 0.35 }
    ];

    // Draw Lines
    c.strokeStyle = 'rgba(0, 229, 153, 0.35)';
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(nodes[0].x, nodes[0].y);
    c.lineTo(nodes[1].x, nodes[1].y);
    c.lineTo(nodes[2].x, nodes[2].y);
    c.stroke();

    // Nodes
    nodes.forEach((n, idx) => {
      c.fillStyle = idx === 1 ? '#00E599' : '#35BFFF';
      c.beginPath();
      c.arc(n.x, n.y, 6, 0, Math.PI * 2);
      c.fill();
    });

    t += 0.02;
    requestAnimationFrame(draw);
  }
  draw();
}

// Canvas 3: FFI Code Graph Visualizer
function initFFICanvas() {
  const cvs = document.getElementById('canvas-ffi');
  if (!cvs) return;
  const c = cvs.getContext('2d');
  let offset = 0;

  function draw() {
    cvs.width = cvs.parentElement.clientWidth;
    cvs.height = cvs.parentElement.clientHeight;
    c.clearRect(0, 0, cvs.width, cvs.height);

    // Draw grid spectrum bars
    c.fillStyle = 'rgba(0, 229, 153, 0.18)';
    const barWidth = 14;
    const gap = 8;
    const total = Math.floor(cvs.width / (barWidth + gap));

    for (let i = 0; i < total; i++) {
      let h = (Math.sin(i * 0.5 + offset) + 1.2) * (cvs.height * 0.3);
      c.fillRect(i * (barWidth + gap) + 12, cvs.height - h - 16, barWidth, h);
    }

    offset += 0.04;
    requestAnimationFrame(draw);
  }
  draw();
}

// Canvas 4: Physics Wave Motion
function initMotionCanvas() {
  const cvs = document.getElementById('canvas-motion');
  if (!cvs) return;
  const c = cvs.getContext('2d');
  let step = 0;

  function draw() {
    cvs.width = cvs.parentElement.clientWidth;
    cvs.height = cvs.parentElement.clientHeight;
    c.clearRect(0, 0, cvs.width, cvs.height);

    c.strokeStyle = '#00E599';
    c.lineWidth = 2;
    c.beginPath();
    for (let x = 0; x < cvs.width; x += 5) {
      let y = cvs.height / 2 + Math.sin(x * 0.015 + step) * 35 * Math.cos(step * 0.5);
      if (x === 0) c.moveTo(x, y);
      else c.lineTo(x, y);
    }
    c.stroke();

    step += 0.025;
    requestAnimationFrame(draw);
  }
  draw();
}

window.addEventListener('load', () => {
  initSolarCanvas();
  initNexusCanvas();
  initFFICanvas();
  initMotionCanvas();
});

// --- 5. Project Category Filtering ---
function filterProjects(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.project-card').forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (cat === 'all' || cardCat === cat) {
      card.style.display = card.classList.contains('full-width') ? 'grid' : 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// --- 6. Repo Live Search & Copy Snippet ---
function searchRepos() {
  const query = document.getElementById('repo-search-input').value.toLowerCase();
  document.querySelectorAll('.repo-row').forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(query) ? 'flex' : 'none';
  });
}

function copySnippet(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied: "${text}"`);
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast-notification');
  toast.innerText = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// --- 7. Contact Modal & Drawer Controls ---
function openContactModal() {
  document.getElementById('contact-modal').classList.add('active');
}

function closeContactModal() {
  document.getElementById('contact-modal').classList.remove('active');
}

function closeContactModalOnOverlay(e) {
  if (e.target.id === 'contact-modal') closeContactModal();
}

function toggleMobileMenu() {
  document.getElementById('mobile-drawer').classList.toggle('active');
}

function submitForm(e) {
  e.preventDefault();
  closeContactModal();
  showToast("Message sent! We'll get back to you shortly.");
  e.target.reset();
}

// Keyboard ESC listener
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeContactModal();
});

// --- 8. Video Play / Pause Controller ---
function toggleVideoPlay(videoId, btn) {
  const vid = document.getElementById(videoId);
  if (!vid) return;
  const iconPause = btn.querySelector('.icon-pause');
  const iconPlay = btn.querySelector('.icon-play');

  if (vid.paused) {
    vid.play();
    if (iconPause) iconPause.style.display = 'block';
    if (iconPlay) iconPlay.style.display = 'none';
  } else {
    vid.pause();
    if (iconPause) iconPause.style.display = 'none';
    if (iconPlay) iconPlay.style.display = 'block';
  }
}
