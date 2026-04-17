/**
 * Animations — Scroll reveal, particles, micro-interactions
 */
(function() {
  'use strict';

  const Animations = {
    init() {
      this.initScrollReveal();
      this.initParticles();
    },

    /**
     * Intersection Observer for scroll-reveal animations
     */
    initScrollReveal() {
      const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
      } else {
        // Fallback: show all elements immediately
        revealElements.forEach(el => el.classList.add('visible'));
      }
    },

    /**
     * Subtle particle system for background ambiance
     */
    initParticles() {
      const canvas = document.getElementById('particles-canvas');
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      let particles = [];
      let animationId;
      const PARTICLE_COUNT = 40;

      function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      function createParticle() {
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.1,
          pulse: Math.random() * Math.PI * 2
        };
      }

      function initParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          particles.push(createParticle());
        }
      }

      function drawParticle(p) {
        const pulseOpacity = p.opacity + Math.sin(p.pulse) * 0.1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 168, 76, ${Math.max(0, pulseOpacity)})`;
        ctx.fill();
      }

      function drawConnections() {
        const maxDist = 150;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxDist) {
              const opacity = (1 - dist / maxDist) * 0.1;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(201, 168, 76, ${opacity})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      function update() {
        particles.forEach(p => {
          p.x += p.speedX;
          p.y += p.speedY;
          p.pulse += 0.01;

          // Wrap around edges
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;
        });
      }

      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        update();
        drawConnections();
        particles.forEach(drawParticle);
        animationId = requestAnimationFrame(animate);
      }

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (prefersReducedMotion.matches) {
        canvas.style.display = 'none';
        return;
      }

      resize();
      initParticles();
      animate();

      window.addEventListener('resize', () => {
        resize();
        initParticles();
      });

      // Pause animation when tab is not visible
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          cancelAnimationFrame(animationId);
        } else {
          animate();
        }
      });
    }
  };

  window.Animations = Animations;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Animations.init());
  } else {
    Animations.init();
  }
})();
