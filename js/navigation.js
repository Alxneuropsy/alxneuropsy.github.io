/**
 * Navigation — Smooth scroll, active section, mobile menu
 */
(function() {
  'use strict';

  const Navigation = {
    navbar: null,
    navMenu: null,
    navToggle: null,
    navLinks: [],
    sections: [],
    backToTop: null,

    init() {
      this.navbar = document.getElementById('navbar');
      this.navMenu = document.getElementById('navbar-menu');
      this.navToggle = document.getElementById('navbar-toggle');
      this.navLinks = document.querySelectorAll('.navbar__link');
      this.sections = document.querySelectorAll('section[id]');
      this.backToTop = document.getElementById('back-to-top');

      this.bindEvents();
      this.onScroll();
    },

    bindEvents() {
      // Scroll events (throttled)
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            this.onScroll();
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });

      // Smooth scroll for nav links
      this.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href').substring(1);
          const target = document.getElementById(targetId);
          if (target) {
            const offset = this.navbar ? this.navbar.offsetHeight : 80;
            const targetPos = target.offsetTop - offset;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
          }
          // Close mobile menu
          this.closeMobileMenu();
        });
      });

      // CTA buttons smooth scroll
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        if (link.classList.contains('navbar__link')) return;
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (href.length > 1) {
            e.preventDefault();
            const target = document.getElementById(href.substring(1));
            if (target) {
              const offset = this.navbar ? this.navbar.offsetHeight : 80;
              window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
            }
          }
        });
      });

      // Mobile menu toggle
      if (this.navToggle) {
        this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
      }

      // Close mobile menu on resize
      window.addEventListener('resize', () => {
        if (window.innerWidth > 768) this.closeMobileMenu();
      });

      // Back to top button
      if (this.backToTop) {
        this.backToTop.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    },

    onScroll() {
      const scrollY = window.scrollY;

      // Navbar background on scroll
      if (this.navbar) {
        if (scrollY > 50) {
          this.navbar.classList.add('scrolled');
        } else {
          this.navbar.classList.remove('scrolled');
        }
      }

      // Active section
      let current = '';
      this.sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionBottom) {
          current = section.getAttribute('id');
        }
      });

      this.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === current) {
          link.classList.add('active');
        }
      });

      // Back to top button visibility
      if (this.backToTop) {
        if (scrollY > 500) {
          this.backToTop.classList.add('visible');
        } else {
          this.backToTop.classList.remove('visible');
        }
      }
    },

    toggleMobileMenu() {
      const isOpen = this.navMenu.classList.contains('open');
      if (isOpen) {
        this.closeMobileMenu();
      } else {
        this.openMobileMenu();
      }
    },

    openMobileMenu() {
      if (this.navMenu) this.navMenu.classList.add('open');
      if (this.navToggle) {
        this.navToggle.classList.add('active');
        this.navToggle.setAttribute('aria-expanded', 'true');
        this.navToggle.setAttribute('aria-label', 'Fermer le menu');
      }
      document.body.style.overflow = 'hidden';
    },

    closeMobileMenu() {
      if (this.navMenu) this.navMenu.classList.remove('open');
      if (this.navToggle) {
        this.navToggle.classList.remove('active');
        this.navToggle.setAttribute('aria-expanded', 'false');
        this.navToggle.setAttribute('aria-label', 'Ouvrir le menu');
      }
      document.body.style.overflow = '';
    }
  };

  window.Navigation = Navigation;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Navigation.init());
  } else {
    Navigation.init();
  }
})();
