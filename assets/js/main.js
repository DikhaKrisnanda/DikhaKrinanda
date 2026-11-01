/* ===================================================================
   DIKHA KRISNANDA HAFIZD - OFFICIAL PORTFOLIO SCRIPT
   Interactive 3D Badge, Particle Constellations, Lightbox & Filters
=================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  init3DBadge();
  initTypewriter();
  initNavbar();
  initCertificatesLightbox();
  initStatsCounter();
  initContactForm();
  initScrollProgress();
  initCursorSpotlight();
  initScrollReveal();
});

/* ===================================================================
   1. PARTICLES CONSTELLATION CANVAS
=================================================================== */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: null, y: null, radius: 120 };
  let lastScrollY = window.scrollY;
  let scrollVel = 0;

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('scroll', () => {
    const curScroll = window.scrollY;
    scrollVel = (curScroll - lastScrollY) * 0.12;
    lastScrollY = curScroll;
  }, { passive: true });

  const particleCount = Math.min(Math.floor((width * height) / 16000), 75);
  const particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.color = Math.random() > 0.4 ? 'rgba(0, 242, 254, ' : 'rgba(157, 78, 221, ';
      this.alpha = Math.random() * 0.6 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy - scrollVel * 0.35;
      scrollVel *= 0.96;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Mouse collision gentle push
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const opacity = (1 - dist / 110) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ===================================================================
   2. 3D INTERACTIVE TILT ID BADGE
=================================================================== */
function init3DBadge() {
  const card = document.getElementById('badge-card');
  const shine = document.querySelector('.badge-hologram-shine');
  if (!card) return;

  const maxTilt = 18;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    card.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.02)`;

    if (shine) {
      const shineX = (x / rect.width) * 100;
      const shineY = (y / rect.height) * 100;
      shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(0, 242, 254, 0.35) 0%, rgba(157, 78, 221, 0.25) 40%, transparent 70%)`;
      shine.style.opacity = '0.9';
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    if (shine) {
      shine.style.opacity = '0.4';
    }
  });
}

/* ===================================================================
   3. TYPEWRITER EFFECT
=================================================================== */
function initTypewriter() {
  const element = document.getElementById('typewriter-output');
  if (!element) return;

  const roles = [
    'Informatics Student @ Universitas Muhammadiyah Malang',
    'Fullstack Web Developer & UI Designer',
    'Proud Alumnus of SMAN 2 Kaimana',
    'Participant in FEST GoWorld & Startup Competitions',
    'Public Speaker & Entrepreneurship Enthusiast'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typeSpeed = 75;
  const deleteSpeed = 35;
  const pauseTime = 1800;

  function type() {
    const current = roles[roleIdx];

    if (isDeleting) {
      element.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      element.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    if (!isDeleting && charIdx === current.length) {
      setTimeout(() => (isDeleting = true), pauseTime);
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }

    const nextSpeed = isDeleting ? deleteSpeed : typeSpeed;
    setTimeout(type, nextSpeed);
  }

  type();
}

/* ===================================================================
   4. NAVBAR SCROLL & ACTIVE TRACKER
=================================================================== */
function initNavbar() {
  const nav = document.getElementById('main-nav');
  const toggleBtn = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        current = sec.getAttribute('id');
      }
    });

    document.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    // Close when link clicked
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  // Back to top button
  const topBtn = document.getElementById('back-to-top');
  if (topBtn) {
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ===================================================================
   5. CERTIFICATE FILTER & LIGHTBOX MODAL
=================================================================== */
function initCertificatesLightbox() {
  const filterBtns = document.querySelectorAll('.cert-filter-btn');
  const certCards = document.querySelectorAll('.cert-card');
  const modal = document.getElementById('cert-lightbox');
  const modalImg = document.getElementById('lightbox-img');
  const modalTitle = document.getElementById('lightbox-title');
  const modalOrg = document.getElementById('lightbox-org');
  const modalNo = document.getElementById('lightbox-no');
  const modalDate = document.getElementById('lightbox-date');
  const closeBtn = document.getElementById('lightbox-close');

  // Filtering
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      certCards.forEach((card) => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Open Lightbox
  certCards.forEach((card) => {
    card.addEventListener('click', () => {
      const imgSrc = card.dataset.img;
      const title = card.dataset.title;
      const org = card.dataset.org;
      const certNo = card.dataset.no;
      const date = card.dataset.date;

      modalImg.src = imgSrc;
      modalImg.alt = title;
      modalTitle.textContent = title;
      modalOrg.textContent = org;
      modalNo.textContent = `No: ${certNo}`;
      modalDate.textContent = `Date: ${date}`;

      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Global project lightbox preview function
  window.openProjectLightbox = function (imgSrc, title, desc, tech) {
    modalImg.src = imgSrc;
    modalImg.alt = title;
    modalTitle.textContent = title;
    modalOrg.textContent = desc;
    modalNo.textContent = `Tech: ${tech}`;
    modalDate.textContent = `Student Project — Dikha Krisnanda Hafizd`;

    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  };

  // Close Lightbox
  function closeModal() {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-active')) {
      closeModal();
    }
  });
}

/* ===================================================================
   6. STATS NUMBER COUNTER
=================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let started = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          statNumbers.forEach((stat) => {
            const target = parseInt(stat.dataset.target, 10);
            const duration = 1800;
            const start = 0;
            const stepTime = 30;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = start;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                stat.textContent = target + (stat.dataset.suffix || '');
                clearInterval(timer);
              } else {
                stat.textContent = Math.floor(current) + (stat.dataset.suffix || '');
              }
            }, stepTime);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.querySelector('.about-stats-grid');
  if (statsSection) observer.observe(statsSection);
}

/* ===================================================================
   7. CONTACT FORM & DIRECT ACTIONS
=================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('toast-message');

  function showToast(message) {
    if (!toast) return;
    toast.querySelector('.toast-text').textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.');
        return;
      }

      // Simulate sending
      const submitBtn = form.querySelector('.btn-submit-form');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span>Sending Message...</span>`;
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = `<span>Message Sent! ✓</span>`;
        showToast(`Thank you ${name}! Your message has been sent successfully.`);
        form.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 3000);
      }, 1000);
    });
  }
}

/* ===================================================================
   8. SCROLL PROGRESS READING BAR
=================================================================== */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  function updateProgress() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = (window.scrollY / totalHeight) * 100;
    bar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ===================================================================
   9. INTERACTIVE CURSOR SPOTLIGHT
=================================================================== */
function initCursorSpotlight() {
  const spotlight = document.getElementById('cursor-glow');
  if (!spotlight) return;

  if (window.matchMedia('(pointer: coarse)').matches) {
    spotlight.style.display = 'none';
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let curX = mouseX;
  let curY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderSpotlight() {
    curX += (mouseX - curX) * 0.15;
    curY += (mouseY - curY) * 0.15;
    spotlight.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderSpotlight);
  }

  renderSpotlight();
}

/* ===================================================================
   10. SCROLL REVEAL ANIMATIONS — DIRECTIONAL & STAGGERED
=================================================================== */
function initScrollReveal() {

  // Section headers — fade up + underline trigger
  document.querySelectorAll('.section-header').forEach(el => {
    el.classList.add('reveal-on-scroll');
  });

  // About left card — slide from left
  document.querySelectorAll('.about-card-surface').forEach(el => {
    el.classList.add('reveal-from-left');
  });

  // About right info cards — slide from right with stagger
  document.querySelectorAll('.about-info-cards').forEach(el => {
    el.classList.add('reveal-from-right');
  });
  document.querySelectorAll('.info-item-card').forEach((el, i) => {
    el.classList.add('reveal-from-right');
    el.style.transitionDelay = `${0.1 + i * 0.12}s`;
  });

  // Stat boxes — zoom in with stagger
  document.querySelectorAll('.stat-box').forEach((el, i) => {
    el.classList.add('reveal-zoom');
    el.style.transitionDelay = `${i * 0.1}s`;
  });

  // Timeline items — alternating directions
  document.querySelectorAll('.timeline-item').forEach((el, i) => {
    el.classList.add(i % 2 === 0 ? 'reveal-from-left' : 'reveal-from-right');
    el.style.transitionDelay = `${i * 0.15}s`;
  });

  // Cert cards — bottom up with stagger
  document.querySelectorAll('.cert-card').forEach((el, i) => {
    el.classList.add('reveal-on-scroll');
    el.style.transitionDelay = `${(i % 3) * 0.12}s`;
  });

  // Skill cards — zoom in with stagger
  document.querySelectorAll('.skill-category-card').forEach((el, i) => {
    el.classList.add('reveal-zoom');
    el.style.transitionDelay = `${i * 0.1}s`;
  });

  // Project cards — bottom up with stagger
  document.querySelectorAll('.project-card').forEach((el, i) => {
    el.classList.add('reveal-on-scroll');
    el.style.transitionDelay = `${(i % 3) * 0.15}s`;
  });

  // Spotify card — zoom
  document.querySelectorAll('.spotify-card').forEach(el => {
    el.classList.add('reveal-zoom');
  });

  // Contact cards — from left
  document.querySelectorAll('.contact-card-box').forEach((el, i) => {
    el.classList.add('reveal-from-left');
    el.style.transitionDelay = `${i * 0.12}s`;
  });

  // Contact form — from right
  document.querySelectorAll('.contact-form-surface').forEach(el => {
    el.classList.add('reveal-from-right');
  });

  // Gather all reveal targets
  const all = document.querySelectorAll(
    '.reveal-on-scroll, .reveal-from-left, .reveal-from-right, .reveal-zoom'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.06,
    rootMargin: '0px 0px -30px 0px'
  });

  all.forEach((el) => observer.observe(el));
}
