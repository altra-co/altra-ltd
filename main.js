/* ====== ALTRA MAIN JAVASCRIPT ====== */
/* |Loading screen| */
/* |Scroll progress bar| */
/* |Navbar scroll behavior| */
/* |Mobile menu toggle| */
/* |Scroll reveal animations| */
/* |Counter animation| */
/* |Testimonials carousel| */
/* |Portfolio filter + modal| */
/* |FAQ accordion| */
/* |Contact form validation| */
/* |Typing effects| */
/* |Smooth anchor scrolling| */

(function () {
  'use strict';

  /* ====== DOM READY ====== */
  window.addEventListener('DOMContentLoaded', () => {

    /* ---------- LOADING SCREEN ---------- */
    const loading = document.getElementById('loading');
    if (loading) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          loading.classList.add('hidden');
          setTimeout(() => loading.remove(), 600);
        }, 600);
      });
    }

    /* ---------- SCROLL PROGRESS ---------- */
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
      window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = (scrolled / total) * 100 + '%';
      }, { passive: true });
    }

    /* ---------- NAVBAR ---------- */
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
      }, { passive: true });
    }

    /* ---------- MOBILE MENU ---------- */
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const expanded = navMenu.classList.contains('open');
        navToggle.setAttribute('aria-expanded', expanded);
      });

      navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        });
      });

      document.addEventListener('click', e => {
        if (!navbar.contains(e.target)) navMenu.classList.remove('open');
      });
    }

    /* ---------- SCROLL REVEAL ---------- */
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      revealEls.forEach(el => revealObserver.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('visible'));
    }

    /* ---------- COUNTER ANIMATION ---------- */
    const counters = document.querySelectorAll('.counter');
    if (counters.length) {
      const counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const el = entry.target;
              const target = +el.dataset.target;
              const duration = 2000;
              const start = performance.now();

              const tick = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                el.textContent = Math.floor(eased * target);
                if (progress < 1) requestAnimationFrame(tick);
              };

              requestAnimationFrame(tick);
              counterObserver.unobserve(el);
            }
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach(c => counterObserver.observe(c));
    }

    /* ---------- TESTIMONIALS CAROUSEL ---------- */
    const track = document.getElementById('testimonialTrack');
    const dotsContainer = document.getElementById('testimonialDots');
    if (track && dotsContainer) {
      const slides = track.querySelectorAll('.testimonial-card');
      let current = 0;
      const total = slides.length;

      // Create dots
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      });

      const dots = dotsContainer.querySelectorAll('button');

      function goToSlide(index) {
        current = ((index % total) + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
      }

      // Auto-play
      let auto = setInterval(() => goToSlide(current + 1), 5000);
      goToSlide(0);

      // Reset auto-play on user interaction
      dotsContainer.addEventListener('click', () => { clearInterval(auto); auto = setInterval(() => goToSlide(current + 1), 5000); });

      // Keyboard
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') goToSlide(current + 1);
        if (e.key === 'ArrowLeft') goToSlide(current - 1);
      });
    }

    /* ---------- PORTFOLIO FILTER ---------- */
    const filterBtns = document.querySelectorAll('.portfolio-filters button');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    if (filterBtns.length) {
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const filter = btn.dataset.filter;

          portfolioCards.forEach(card => {
            const show = filter === 'all' || card.dataset.category === filter;
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = show ? '1' : '0';
            card.style.transform = show ? 'scale(1)' : 'scale(0.95)';
            card.style.pointerEvents = show ? 'auto' : 'none';
            card.style.display = show ? '' : 'none';
          });
        });
      });
    }

    /* ---------- PORTFOLIO MODAL ---------- */
    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const modalImg = document.getElementById('modalImg');
    const modalBody = document.getElementById('modalBody');

    const projectData = {
      'Nova Analytics Platform': {
        desc: 'A real-time business intelligence platform built for enterprise clients. Features include drag-and-drop dashboard builders, predictive forecasting using machine learning, custom report scheduling, role-based access control, and embedded analytics widgets. The platform handles 10M+ events daily with sub-second query response times.',
        tech: ['React', 'Python/Django', 'PostgreSQL', 'AWS Redshift', 'TensorFlow', 'Redis'],
        challenge: 'Unifying 12 siloed data sources across 4 different business units in a single, performant analytics interface.'
      },
      'Voss ERP Overhaul': {
        desc: 'A complete modernization of Voss Logistics\' legacy ERP — replacing a cobol-based monolith with a .NET microservices architecture running on Kubernetes. New modules include automated dispatch, real-time freight tracking, AI-driven route optimization, and a unified financial module.',
        tech: ['.NET Core', 'SQL Server', 'Docker', 'Kubernetes', 'Angular', 'Azure Service Bus'],
        challenge: 'Migrating 30 years of historical logistics data with zero downtime during the transition.'
      },
      'Solara Health Companion': {
        desc: 'A HIPAA-compliant health management mobile app for Solara HealthTech. Features include virtual appointments, secure messaging, medication adherence tracking, health vitals log, and integration with wearable devices and Apple HealthKit.',
        tech: ['Flutter', 'Firebase', 'AWS IoT', 'HealthKit', 'Twilio'],
        challenge: 'Building a deeply accessible, offline-capable health app that meets strict HIPAA compliance requirements.'
      },
      'Meridian E-Commerce Platform': {
        desc: 'A headless e-commerce platform powering Meridian Apparel\'s re-platforming from Shopify to a custom solution. Supports 50,000+ concurrent shoppers, multi-currency checkout, dynamic pricing, real-time inventory, and advanced personalization through an embedded ML recommendation engine.',
        tech: ['Next.js', 'GraphQL', 'MongoDB', 'Stripe', 'Algolia', 'ElasticSearch'],
        challenge: 'Handling peak traffic during Black Friday without any performance degradation or downtime.'
      },
      'TeamSync Pro': {
        desc: 'A cross-functional collaboration platform that unifies task management, shared documents, and real-time communication. Features AI-powered task prioritization that analyses team velocity and suggests optimal task ordering, plus real-time presence indicators.',
        tech: ['React', 'Node.js', 'Socket.io', 'Redis', 'AWS ECS', 'OpenAI API'],
        challenge: 'Delivering real-time collaboration at scale — keeping sync latency under 100ms for 5,000+ concurrent users.'
      },
      'Atlas Banking Portal': {
        desc: 'A secure digital banking portal for Atlas Financial Services. Includes multi-currency custodial accounts, smart money transfers, automated bill payments, real-time fraud detection via ML anomaly scoring, and comprehensive compliance reporting tools.',
        tech: ['Java', 'Apache Kafka', 'Oracle DB', 'Kubernetes', 'OAuth 2.0', 'Snowflake'],
        challenge: 'Building a bank-grade security architecture that passes SOC 2 Type II audit with real-time fraud detection alongside existing legacy infrastructure.'
      },
      'Tranzit Fleet Manager': {
        desc: 'Offline-capable fleet management app for commercial transport networks. Used by drivers and dispatchers across rural connectivity to track vehicles, log fuel stops, collect proof-of-delivery signatures, and run geofenced route optimization algorithms.',
        tech: ['React Native', 'GraphQL', 'Google Maps API', 'SQLite (WatermelonDB)', 'Push Notifications'],
        challenge: 'Delivering reliable GPS tracking and map navigation in areas with patchy cellular coverage while keeping battery drain under 5% per hour.'
      },
      'Evergreen CRM': {
        desc: 'A custom CRM platform built for the Evergreen Real Estate group with 2,000+ agents. Includes AI lead-scoring (365k+ records scored daily), automated email drip campaigns, contract-to-signature workflow, and real-time commission dashboards — reducing admin burden by 40%.',
        tech: ['Vue.js', 'Laravel', 'MySQL', 'Redis', 'ElasticSearch', 'Stripe Connect'],
        challenge: 'Processing 500k+ events per day across lead scoring, email campaigns, and commission calculations in real-time, keeping the CRM snappy at all times.'
      },
      'Aura Learning Platform': {
        desc: 'An AI-driven education SaaS for K–12 schools and district networks. Adaptive learning paths adjust based on student performance, auto-graded assignments with explanation feedback, live video classrooms built on WebRTC, and parental dashboards with progress analytics.',
        tech: ['Next.js', 'Python/FastAPI', 'TensorFlow', 'WebRTC', 'Pusher', 'AWS S3'],
        challenge: 'Designing an adaptive learning engine that correctly adjusts difficulty across 30+ subject areas while maintaining engagement and preventing frustration.'
      }
    };

    if (modal && modalClose && portfolioCards.length) {
      portfolioCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
          const title = card.querySelector('h3').textContent.trim();
          const industry = card.querySelector('.industry').textContent.trim();
          const data = projectData[title];
          if (!data) return;

          modalImg.style.background = card.querySelector('.portfolio-img').style.background || 'linear-gradient(135deg, #0a1628, #2563eb)';

          modalBody.innerHTML = `
            <span class="industry">${industry}</span>
            <h3 id="modalTitle">${title}</h3>
            <p>${data.desc}</p>
            <h4 style="font-size:0.9rem; color:var(--gray-700); margin-bottom:12px">Technologies</h4>
            <div class="portfolio-tech" style="margin-bottom:24px">
              ${data.tech.map(t => `<span>${t}</span>`).join('')}
            </div>
            <h4 style="font-size:0.9rem; color:var(--gray-700); margin-bottom:8px">Our Approach</h4>
            <p style="color:var(--gray-500); font-size:0.95rem; margin-bottom:0">${data.challenge}</p>
          `;

          modal.classList.add('open');
          document.body.style.overflow = 'hidden';
        });
      });

      function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }

      modalClose.addEventListener('click', closeModal);
      modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
    }

    /* ---------- FAQ ACCORDION ---------- */
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length) {
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
          const alreadyOpen = item.classList.contains('open');
          faqItems.forEach(i => i.classList.remove('open'));
          if (!alreadyOpen) item.classList.add('open');
          question.setAttribute('aria-expanded', !alreadyOpen);
        });
        question.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); question.click();
        }});
      });
    }

    /* ---------- CONTACT FORM ---------- */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      const requiredFields = ['firstName', 'lastName', 'email', 'service', 'message'];

      function validateField(id) {
        const field = document.getElementById(id);
        const error = document.getElementById(id + 'Error');
        if (!field) return true;

        let valid = true;
        if (id === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          valid = emailRegex.test(field.value.trim());
        } else if (id === 'message') {
          valid = field.value.trim().length >= 20;
        } else {
          valid = field.value.trim() !== '';
        }

        field.classList.toggle('error', !valid);
        if (error) error.classList.toggle('show', !valid);
        return valid;
      }

      requiredFields.forEach(id => {
        const field = document.getElementById(id);
        if (field) {
          field.addEventListener('blur', () => validateField(id));
          field.addEventListener('input', () => {
            field.classList.remove('error');
            const err = document.getElementById(id + 'Error');
            if (err) err.classList.remove('show');
          });
        }
      });

      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let allValid = true;
        requiredFields.forEach(id => { if (!validateField(id)) allValid = false; });

        if (allValid) {
          const btn = document.getElementById('submitBtn');
          btn.disabled = true;
          btn.style.opacity = '0.7';
          btn.textContent = 'Sending…';

          setTimeout(() => {
            contactForm.reset();
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.innerHTML = 'Send Message <span>→</span>';
            document.getElementById('formSuccess').style.display = 'block';
            document.getElementById('formSuccess').scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 1500);
        }
      });
    }

    /* ---------- SMOOTH ANCHOR SCROLLING ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    /* ---------- CHAT WIDGET TOGGLE (placeholder) ---------- */
    const chatBtn = document.getElementById('chatBtn');
    if (chatBtn) {
      chatBtn.addEventListener('click', () => {
        alert('Live chat is coming soon! In the meantime, email us at hello@altra.dev or use the contact form.');
      });
    }

  }); // DOMContentLoaded end

  /* ====== PARTICLES ANIMATION ====== */
  window.addEventListener('load', () => {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
      const section = canvas.parentElement;
      w = canvas.width = section.offsetWidth;
      h = canvas.height = section.offsetHeight;
    }
    resize();
    new ResizeObserver(resize).observe(canvas.parentElement);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.r = Math.random() * 2 + 0.5;
        this.alpha = Math.random() * 0.4 + 0.1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96,165,250,${this.alpha})`;
        ctx.fill();
      }
    }

    const count = 80;
    for (let i = 0; i < count; i++) particles.push(new Particle());

    function animate() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => { p.update(); p.draw(); });
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59,130,246,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  });

}());
