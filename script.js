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

// Helper: Stable canvas sizing with HiDPI (devicePixelRatio) support without layout thrashing
function setupCanvasResize(cvs) {
  function resize() {
    const parent = cvs.parentElement;
    if (!parent) return;
    const dpr = window.devicePixelRatio || 1;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    if (w > 0 && h > 0) {
      const targetW = Math.floor(w * dpr);
      const targetH = Math.floor(h * dpr);
      // Only update buffer size if physical pixel dimensions change by > 2px
      if (Math.abs(cvs.width - targetW) > 2 || Math.abs(cvs.height - targetH) > 2) {
        cvs.width = targetW;
        cvs.height = targetH;
      }
    }
  }
  resize();
  window.addEventListener('resize', resize);
}

// --- 4. Interactive Project Visualizers ---
// Canvas 1: Orbital Solar System
function initSolarCanvas() {
  const cvs = document.getElementById('canvas-solar');
  if (!cvs) return;
  const c = cvs.getContext('2d');
  setupCanvasResize(cvs);
  let t = 0;

  function draw() {
    const parent = cvs.parentElement;
    const w = parent ? parent.clientWidth : 300;
    const h = parent ? parent.clientHeight : 180;
    if (w <= 0 || h <= 0) {
      requestAnimationFrame(draw);
      return;
    }
    const dpr = window.devicePixelRatio || 1;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cx = w / 2;
    const cy = h / 2;
    c.clearRect(0, 0, w, h);

    // Sun
    c.shadowBlur = 20;
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
  setupCanvasResize(cvs);
  let t = 0;

  function draw() {
    const parent = cvs.parentElement;
    const w = parent ? parent.clientWidth : 300;
    const h = parent ? parent.clientHeight : 180;
    if (w <= 0 || h <= 0) {
      requestAnimationFrame(draw);
      return;
    }
    const dpr = window.devicePixelRatio || 1;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, w, h);

    const nodes = [
      { x: w * 0.25, y: h * 0.4 },
      { x: w * 0.5, y: h * 0.6 + Math.sin(t) * 10 },
      { x: w * 0.75, y: h * 0.35 }
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
  setupCanvasResize(cvs);
  let offset = 0;

  function draw() {
    const parent = cvs.parentElement;
    const w = parent ? parent.clientWidth : 300;
    const h = parent ? parent.clientHeight : 180;
    if (w <= 0 || h <= 0) {
      requestAnimationFrame(draw);
      return;
    }
    const dpr = window.devicePixelRatio || 1;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, w, h);

    // Draw grid spectrum bars
    c.fillStyle = 'rgba(0, 229, 153, 0.18)';
    const barWidth = 14;
    const gap = 8;
    const total = Math.floor(w / (barWidth + gap));

    for (let i = 0; i < total; i++) {
      let barH = (Math.sin(i * 0.5 + offset) + 1.2) * (h * 0.3);
      c.fillRect(i * (barWidth + gap) + 12, h - barH - 16, barWidth, barH);
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
  setupCanvasResize(cvs);
  let step = 0;

  function draw() {
    const parent = cvs.parentElement;
    const w = parent ? parent.clientWidth : 300;
    const h = parent ? parent.clientHeight : 180;
    if (w <= 0 || h <= 0) {
      requestAnimationFrame(draw);
      return;
    }
    const dpr = window.devicePixelRatio || 1;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, w, h);

    c.strokeStyle = '#00E599';
    c.lineWidth = 2;
    c.beginPath();
    for (let x = 0; x < w; x += 5) {
      let y = h / 2 + Math.sin(x * 0.015 + step) * 35 * Math.cos(step * 0.5);
      if (x === 0) c.moveTo(x, y);
      else c.lineTo(x, y);
    }
    c.stroke();

    step += 0.025;
    requestAnimationFrame(draw);
  }
  draw();
}

// Canvas 5: Paari AI Resume & ATS Match Engine
function initPaariCanvas() {
  const cvs = document.getElementById('canvas-paari');
  if (!cvs) return;
  const c = cvs.getContext('2d');
  setupCanvasResize(cvs);

  let scanY = 30;
  let scanDir = 1;
  let scoreAngle = 0;

  const keywords = ['AI Resume Match', 'ATS Fit Score', 'Cover Letter Gen', 'Software Engineers', 'System Design', 'React / Node'];

  function draw() {
    const parent = cvs.parentElement;
    const w = parent ? parent.clientWidth : 300;
    const h = parent ? parent.clientHeight : 180;

    if (w <= 0 || h <= 0) {
      requestAnimationFrame(draw);
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, w, h);

    // Subtle background HUD grid lines
    c.strokeStyle = 'rgba(0, 229, 153, 0.05)';
    c.lineWidth = 1;
    const step = 24;
    for (let x = 0; x < w; x += step) {
      c.beginPath();
      c.moveTo(x, 0);
      c.lineTo(x, h);
      c.stroke();
    }
    for (let y = 0; y < h; y += step) {
      c.beginPath();
      c.moveTo(0, y);
      c.lineTo(w, y);
      c.stroke();
    }

    // --- ANIMATED SCANNING LASER BEAM ---
    const scanTop = 20;
    const scanBottom = Math.max(scanTop + 10, h - 20);

    scanY += 1.2 * scanDir;

    if (scanY >= scanBottom) {
      scanY = scanBottom;
      scanDir = -1;
    }

    if (scanY <= scanTop) {
      scanY = scanTop;
      scanDir = 1;
    }

    // Gradient glow clamped strictly inside safe area [scanTop, scanBottom]
    const glowHeight = 28;
    const glowTop = Math.max(scanTop, scanY - glowHeight);

    if (scanY > glowTop) {
      const scanGrad = c.createLinearGradient(0, glowTop, 0, scanY);
      scanGrad.addColorStop(0, 'rgba(0, 229, 153, 0)');
      scanGrad.addColorStop(1, 'rgba(0, 229, 153, 0.12)');
      c.fillStyle = scanGrad;
      c.fillRect(0, glowTop, w, scanY - glowTop);
    }

    // Scan line beam with reduced shadowBlur (6px)
    c.shadowBlur = 6;
    c.shadowColor = '#00E599';
    c.strokeStyle = 'rgba(0, 229, 153, 0.65)';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(0, scanY);
    c.lineTo(w, scanY);
    c.stroke();
    c.shadowBlur = 0;

    // Circular ATS Score Gauge (right side on large screens, center on small)
    const gaugeCenterX = w > 480 ? w - 90 : w / 2;
    const gaugeCenterY = h / 2;
    const radius = Math.min(38, Math.max(20, h * 0.26));

    // Gauge background ring
    c.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    c.lineWidth = 6;
    c.beginPath();
    c.arc(gaugeCenterX, gaugeCenterY, radius, 0, Math.PI * 2);
    c.stroke();

    // Gauge progress ring (Target 98%)
    const targetAngle = Math.PI * 1.76;
    if (scoreAngle < targetAngle) scoreAngle += 0.03;

    c.strokeStyle = '#00E599';
    c.shadowBlur = 6;
    c.shadowColor = '#00E599';
    c.lineWidth = 6;
    c.beginPath();
    c.arc(gaugeCenterX, gaugeCenterY, radius, -Math.PI / 2, -Math.PI / 2 + scoreAngle);
    c.stroke();
    c.shadowBlur = 0;

    // Gauge Text Score
    c.fillStyle = '#F4F7FB';
    c.font = '700 13px "JetBrains Mono", monospace';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('98%', gaugeCenterX, gaugeCenterY - 4);
    c.fillStyle = '#00E599';
    c.font = '500 8px "JetBrains Mono", monospace';
    c.fillText('ATS MATCH', gaugeCenterX, gaugeCenterY + 12);

    // Floating AI status line
    const kwX = w > 480 ? 40 : 20;
    const kwY = h / 2 + 10;
    const kwText = keywords[Math.floor(scoreAngle * 1.8) % keywords.length];
    c.fillStyle = `rgba(53, 191, 255, ${Math.sin(scoreAngle * 3) * 0.3 + 0.7})`;
    c.font = '500 11px "JetBrains Mono", monospace';
    c.textAlign = 'left';
    c.fillText(`⚡ ANALYSIS: ${kwText}`, kwX, kwY);

    requestAnimationFrame(draw);
  }
  draw();
}

window.addEventListener('load', () => {
  initPaariCanvas();
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

async function submitForm(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnContent = submitBtn.innerHTML;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');

  const name = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const message = messageInput ? messageInput.value.trim() : '';

  if (!name || !email || !message) return;

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Sending Message... ⏳</span>';

  try {
    const response = await fetch('https://formsubmit.co/ajax/info@elvynforge.xyz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        message: message,
        _subject: `New Inquiry from ${name} (Elvyn Forge)`
      })
    });

    if (response.ok) {
      showToast("Message sent to info@elvynforge.xyz!");
      form.reset();
      closeContactModal();
    } else {
      const subject = encodeURIComponent(`Project Inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      window.location.href = `mailto:info@elvynforge.xyz?subject=${subject}&body=${body}`;
      showToast("Opened email client to dispatch message.");
      form.reset();
      closeContactModal();
    }
  } catch (err) {
    const subject = encodeURIComponent(`Project Inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:info@elvynforge.xyz?subject=${subject}&body=${body}`;
    showToast("Opened email client to dispatch message.");
    form.reset();
    closeContactModal();
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnContent;
  }
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
