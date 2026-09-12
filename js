!function(){"use strict";const t={init(){document.body.classList.add("loaded"),document.querySelectorAll(".safe-mail").forEach(t=>{const e=t.getAttribute("data-u"),n=t.getAttribute("data-d");if(e&&n){const o=e+"@"+n;t.textContent=o,t.removeAttribute("href"),t.removeEventListener("click",null),t.style.textDecoration="none",t.style.color="inherit",t.style.cursor="text",t.removeAttribute("data-u"),t.removeAttribute("data-d")}})}};"loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>t.init()):t.init()}();
/**
 * Cookie Consent Management
 * RGPD-compliant cookie banner with localStorage persistence
 */
(function() {
  'use strict';

  const STORAGE_KEY = 'cookie_consent';
  const CONSENT_VERSION = '1.0';

  const CookieManager = {
    /**
     * Get stored consent preferences
     */
    getConsent() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;
        const consent = JSON.parse(stored);
        if (consent.version !== CONSENT_VERSION) return null;
        return consent;
      } catch (e) {
        return null;
      }
    },

    /**
     * Save consent preferences to localStorage
     */
    saveConsent(preferences) {
      const consent = {
        version: CONSENT_VERSION,
        timestamp: new Date().toISOString(),
        preferences: {
          essential: true, // Always true
          analytics: preferences.analytics || false,
          thirdParty: preferences.thirdParty || false
        }
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
      } catch (e) {
        console.warn('Cookie consent could not be saved to localStorage.');
      }
      this.applyConsent(consent.preferences);
      this.hideBanner();
      this.hideModal();
    },

    /**
     * Apply consent decisions (enable/disable features)
     */
    applyConsent(preferences) {
      // Analytics: future Google Analytics or similar
      if (preferences.analytics) {
        document.documentElement.dataset.analyticsConsent = 'granted';
      } else {
        document.documentElement.dataset.analyticsConsent = 'denied';
      }

      // Third-party: Docorga, Doctolib, etc.
      if (preferences.thirdParty) {
        document.documentElement.dataset.thirdPartyConsent = 'granted';
        // Third-party services enabled
      } else {
        document.documentElement.dataset.thirdPartyConsent = 'denied';
      }
    },

    /**
     * Show the cookie banner
     */
    showBanner() {
      const banner = document.getElementById('cookie-banner');
      if (banner) {
        // Small delay for animation
        setTimeout(() => banner.classList.add('visible'), 500);
      }
    },

    /**
     * Hide the cookie banner
     */
    hideBanner() {
      const banner = document.getElementById('cookie-banner');
      if (banner) banner.classList.remove('visible');
    },

    /**
     * Show the cookie settings modal
     */
    showModal() {
      const modal = document.getElementById('cookie-modal');
      if (modal) {
        modal.classList.add('visible');
        document.body.style.overflow = 'hidden';

        // Load existing preferences into toggles
        const consent = this.getConsent();
        if (consent) {
          const analyticsToggle = document.getElementById('cookie-analytics');
          const thirdPartyToggle = document.getElementById('cookie-third-party');
          if (analyticsToggle) analyticsToggle.checked = consent.preferences.analytics;
          if (thirdPartyToggle) thirdPartyToggle.checked = consent.preferences.thirdParty;
        }
      }
    },

    /**
     * Hide the cookie settings modal
     */
    hideModal() {
      const modal = document.getElementById('cookie-modal');
      if (modal) {
        modal.classList.remove('visible');
        document.body.style.overflow = '';
      }
    },

    /**
     * Accept all cookies
     */
    acceptAll() {
      this.saveConsent({ analytics: true, thirdParty: true });
    },

    /**
     * Refuse all non-essential cookies
     */
    refuseAll() {
      this.saveConsent({ analytics: false, thirdParty: false });
    },

    /**
     * Save custom preferences from the modal
     */
    saveCustom() {
      const analyticsToggle = document.getElementById('cookie-analytics');
      const thirdPartyToggle = document.getElementById('cookie-third-party');
      this.saveConsent({
        analytics: analyticsToggle ? analyticsToggle.checked : false,
        thirdParty: thirdPartyToggle ? thirdPartyToggle.checked : false
      });
    },

    /**
     * Initialize cookie consent system
     */
    init() {
      const consent = this.getConsent();

      if (consent) {
        // User already made a choice
        this.applyConsent(consent.preferences);
      } else {
        // First visit: show banner
        this.showBanner();
      }

      // Event listeners
      const acceptBtn = document.getElementById('cookie-accept-btn');
      const refuseBtn = document.getElementById('cookie-refuse-btn');
      const customizeBtn = document.getElementById('cookie-customize-btn');
      const saveBtn = document.getElementById('cookie-save-btn');
      const acceptAllBtn = document.getElementById('cookie-accept-all-btn');
      const modalClose = document.getElementById('cookie-modal-close');
      const modalOverlay = document.getElementById('cookie-modal-overlay');
      const settingsBtn = document.getElementById('cookie-settings-btn');

      if (acceptBtn) acceptBtn.addEventListener('click', () => this.acceptAll());
      if (refuseBtn) refuseBtn.addEventListener('click', () => this.refuseAll());
      if (customizeBtn) {
        customizeBtn.addEventListener('click', () => {
          this.hideBanner();
          this.showModal();
        });
      }
      if (saveBtn) saveBtn.addEventListener('click', () => this.saveCustom());
      if (acceptAllBtn) acceptAllBtn.addEventListener('click', () => this.acceptAll());
      if (modalClose) modalClose.addEventListener('click', () => this.hideModal());
      if (modalOverlay) modalOverlay.addEventListener('click', () => this.hideModal());
      if (settingsBtn) settingsBtn.addEventListener('click', () => this.showModal());

      // Escape key closes modal
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.hideModal();
      });
    }
  };

  // Expose globally
  window.CookieManager = CookieManager;

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CookieManager.init());
  } else {
    CookieManager.init();
  }
})();

/**
 * Contact Form — Client-side validation & local submission
 */
(function() {
  'use strict';

  const ContactForm = {
    form: null,
    feedbackEl: null,
    lastSubmitTime: 0,

    init() {
      this.form = document.getElementById('contact-form');
      this.feedbackEl = document.getElementById('form-feedback');

      if (this.form) {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      }
    },

    /**
     * Validate email format
     */
    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    /**
     * Validate phone format (French)
     */
    isValidPhone(phone) {
      if (!phone) return true; // Optional field
      return /^(?:(?:\+33|0)\s?[1-9])(?:[\s.-]?\d{2}){4}$/.test(phone.replace(/\s/g, ''));
    },

    /**
     * Show feedback message
     */
    showFeedback(message, type) {
      if (!this.feedbackEl) return;
      this.feedbackEl.className = `form-message form-message--${type}`;
      this.feedbackEl.textContent = message;
      this.feedbackEl.style.display = 'block';

      // Auto-hide after 8 seconds
      if (type === 'success') {
        setTimeout(() => {
          this.feedbackEl.style.display = 'none';
        }, 8000);
      }
    },

    /**
     * Handle form submission
     */
    handleSubmit(e) {
      e.preventDefault();

      // Throttle: prevent multiple submissions within 30 seconds
      const now = Date.now();
      if (now - this.lastSubmitTime < 30000) {
        this.showFeedback('Veuillez patienter quelques secondes avant de renvoyer un message.', 'error');
        return;
      }

      // Honeypot anti-spam check: if this hidden field is filled, it's a bot
      const honeypot = this.form.querySelector('#contact-website');
      if (honeypot && honeypot.value) {
        // Silently block — show fake success to fool the bot
        this.showFeedback('Votre message a bien été envoyé. Merci !', 'success');
        this.form.reset();
        return;
      }

      // Gather form data directly (sanitization happens natively via encodeURIComponent during URI building)
      const name = this.form.querySelector('#contact-name').value.trim();
      const email = this.form.querySelector('#contact-email').value.trim();
      const phone = this.form.querySelector('#contact-phone').value.trim();
      const subject = this.form.querySelector('#contact-subject').value.trim();
      const message = this.form.querySelector('#contact-message').value.trim();
      const rgpd = this.form.querySelector('#contact-rgpd').checked;

      // Validate
      if (!name || name.length < 2) {
        this.showFeedback('Veuillez entrer votre nom complet.', 'error');
        this.form.querySelector('#contact-name').focus();
        return;
      }

      if (!email || !this.isValidEmail(email)) {
        this.showFeedback('Veuillez entrer une adresse email valide.', 'error');
        this.form.querySelector('#contact-email').focus();
        return;
      }

      if (phone && !this.isValidPhone(phone)) {
        this.showFeedback('Le format du numéro de téléphone est invalide.', 'error');
        this.form.querySelector('#contact-phone').focus();
        return;
      }

      if (!subject || subject.length < 3) {
        this.showFeedback('Veuillez indiquer l\'objet de votre message.', 'error');
        this.form.querySelector('#contact-subject').focus();
        return;
      }

      if (!message || message.length < 10) {
        this.showFeedback('Votre message doit contenir au moins 10 caractères.', 'error');
        this.form.querySelector('#contact-message').focus();
        return;
      }

      if (!rgpd) {
        this.showFeedback('Vous devez accepter la politique de confidentialité.', 'error');
        return;
      }

      // Construct mailto link (email assembled dynamically for anti-spam)
      const mailBody = `Nom : ${name}\nEmail : ${email}\nTéléphone : ${phone ? phone : 'Non renseigné'}\n\nMessage :\n${message}`;
      const recipient = ['pacas.neuropsy', 'gmail.com'].join('@');
      const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent('[Site Web] ' + subject)}&body=${encodeURIComponent(mailBody)}`;
      
      // Open default mail client
      window.location.href = mailtoLink;

      this.lastSubmitTime = now;

      this.showFeedback(
        'Votre messagerie s\'ouvre pour envoyer l\'email. N\'oubliez pas de l\'envoyer !',
        'success'
      );
      this.form.reset();
    }
  };

  window.ContactForm = ContactForm;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ContactForm.init());
  } else {
    ContactForm.init();
  }
})();

!function(){"use strict";const e="cookie_consent",t={getConsent(){try{const t=localStorage.getItem(e);if(!t)return null;const n=JSON.parse(t);return"1.0"!==n.version?null:n}catch(e){return null}},saveConsent(t){const n={version:"1.0",timestamp:(new Date).toISOString(),preferences:{essential:!0,analytics:t.analytics||!1,thirdParty:t.thirdParty||!1}};try{localStorage.setItem(e,JSON.stringify(n))}catch(e){console.warn("Cookie consent could not be saved to localStorage.")}this.applyConsent(n.preferences),this.hideBanner(),this.hideModal()},applyConsent(e){e.analytics?document.documentElement.dataset.analyticsConsent="granted":document.documentElement.dataset.analyticsConsent="denied",e.thirdParty?document.documentElement.dataset.thirdPartyConsent="granted":document.documentElement.dataset.thirdPartyConsent="denied"},showBanner(){const e=document.getElementById("cookie-banner");e&&setTimeout(()=>e.classList.add("visible"),500)},hideBanner(){const e=document.getElementById("cookie-banner");e&&e.classList.remove("visible")},showModal(){const e=document.getElementById("cookie-modal");if(e){e.classList.add("visible"),document.body.style.overflow="hidden";const t=this.getConsent();if(t){const e=document.getElementById("cookie-analytics"),n=document.getElementById("cookie-third-party");e&&(e.checked=t.preferences.analytics),n&&(n.checked=t.preferences.thirdParty)}}},hideModal(){const e=document.getElementById("cookie-modal");e&&(e.classList.remove("visible"),document.body.style.overflow="")},acceptAll(){this.saveConsent({analytics:!0,thirdParty:!0})},refuseAll(){this.saveConsent({analytics:!1,thirdParty:!1})},saveCustom(){const e=document.getElementById("cookie-analytics"),t=document.getElementById("cookie-third-party");this.saveConsent({analytics:!!e&&e.checked,thirdParty:!!t&&t.checked})},init(){const e=this.getConsent();e?this.applyConsent(e.preferences):this.showBanner();const t=document.getElementById("cookie-accept-btn"),n=document.getElementById("cookie-refuse-btn"),o=document.getElementById("cookie-customize-btn"),i=document.getElementById("cookie-save-btn"),s=document.getElementById("cookie-accept-all-btn"),a=document.getElementById("cookie-modal-close"),c=document.getElementById("cookie-modal-overlay"),r=document.getElementById("cookie-settings-btn");t&&t.addEventListener("click",()=>this.acceptAll()),n&&n.addEventListener("click",()=>this.refuseAll()),o&&o.addEventListener("click",()=>{this.hideBanner(),this.showModal()}),i&&i.addEventListener("click",()=>this.saveCustom()),s&&s.addEventListener("click",()=>this.acceptAll()),a&&a.addEventListener("click",()=>this.hideModal()),c&&c.addEventListener("click",()=>this.hideModal()),r&&r.addEventListener("click",()=>this.showModal()),document.addEventListener("keydown",e=>{"Escape"===e.key&&this.hideModal()})}};window.CookieManager=t,"loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>t.init()):t.init()}(),function(){"use strict";const e={navbar:null,navMenu:null,navToggle:null,navLinks:[],sections:[],backToTop:null,init(){this.navbar=document.getElementById("navbar"),this.navMenu=document.getElementById("navbar-menu"),this.navToggle=document.getElementById("navbar-toggle"),this.navLinks=document.querySelectorAll(".navbar__link"),this.sections=document.querySelectorAll("section[id]"),this.backToTop=document.getElementById("back-to-top"),this.bindEvents(),this.onScroll()},bindEvents(){let e=!1;window.addEventListener("scroll",()=>{e||(requestAnimationFrame(()=>{this.onScroll(),e=!1}),e=!0)},{passive:!0}),this.navLinks.forEach(e=>{e.addEventListener("click",t=>{t.preventDefault();const n=e.getAttribute("href").substring(1),o=document.getElementById(n);if(o){const e=this.navbar?this.navbar.offsetHeight:80,t=o.offsetTop-e;window.scrollTo({top:t,behavior:"smooth"})}this.closeMobileMenu()})}),document.querySelectorAll('a[href^="#"]').forEach(e=>{e.classList.contains("navbar__link")||e.addEventListener("click",t=>{const n=e.getAttribute("href");if(n.length>1){t.preventDefault();const e=document.getElementById(n.substring(1));if(e){const t=this.navbar?this.navbar.offsetHeight:80;window.scrollTo({top:e.offsetTop-t,behavior:"smooth"})}}})}),this.navToggle&&this.navToggle.addEventListener("click",()=>this.toggleMobileMenu()),window.addEventListener("resize",()=>{window.innerWidth>768&&this.closeMobileMenu()}),this.backToTop&&this.backToTop.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})})},onScroll(){const e=window.scrollY;this.navbar&&(e>50?this.navbar.classList.add("scrolled"):this.navbar.classList.remove("scrolled"));let t="";this.sections.forEach(n=>{const o=n.offsetTop-120,i=o+n.offsetHeight;e>=o&&e<i&&(t=n.getAttribute("id"))}),this.navLinks.forEach(e=>{e.classList.remove("active"),e.getAttribute("data-section")===t&&e.classList.add("active")}),this.backToTop&&(e>500?this.backToTop.classList.add("visible"):this.backToTop.classList.remove("visible"))},toggleMobileMenu(){this.navMenu.classList.contains("open")?this.closeMobileMenu():this.openMobileMenu()},openMobileMenu(){this.navMenu&&this.navMenu.classList.add("open"),this.navToggle&&(this.navToggle.classList.add("active"),this.navToggle.setAttribute("aria-expanded","true"),this.navToggle.setAttribute("aria-label","Fermer le menu")),document.body.style.overflow="hidden"},closeMobileMenu(){this.navMenu&&this.navMenu.classList.remove("open"),this.navToggle&&(this.navToggle.classList.remove("active"),this.navToggle.setAttribute("aria-expanded","false"),this.navToggle.setAttribute("aria-label","Ouvrir le menu")),document.body.style.overflow=""}};window.Navigation=e,"loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>e.init()):e.init()}(),function(){"use strict";const e={init(){this.initScrollReveal(),this.initParticles()},initScrollReveal(){const e=document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");if("IntersectionObserver"in window){const t=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(e.target.classList.add("visible"),t.unobserve(e.target))})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});e.forEach(e=>t.observe(e))}else e.forEach(e=>e.classList.add("visible"))},initParticles(){const e=document.getElementById("particles-canvas");if(!e)return;const t=e.getContext("2d");let n,o=[];function i(){e.width=window.innerWidth,e.height=window.innerHeight}function s(){return{x:Math.random()*e.width,y:Math.random()*e.height,size:2*Math.random()+.5,speedX:.3*(Math.random()-.5),speedY:.3*(Math.random()-.5),opacity:.5*Math.random()+.1,pulse:Math.random()*Math.PI*2}}function a(){o=[];for(let e=0;e<40;e++)o.push(s())}function c(e){const n=e.opacity+.1*Math.sin(e.pulse);t.beginPath(),t.arc(e.x,e.y,e.size,0,2*Math.PI),t.fillStyle=`rgba(201, 168, 76, ${Math.max(0,n)})`,t.fill()}function r(){t.clearRect(0,0,e.width,e.height),o.forEach(t=>{t.x+=t.speedX,t.y+=t.speedY,t.pulse+=.01,t.x<0&&(t.x=e.width),t.x>e.width&&(t.x=0),t.y<0&&(t.y=e.height),t.y>e.height&&(t.y=0)}),function(){for(let e=0;e<o.length;e++)for(let n=e+1;n<o.length;n++){const i=o[e].x-o[n].x,s=o[e].y-o[n].y,a=Math.sqrt(i*i+s*s);if(a<150){const i=.1*(1-a/150);t.beginPath(),t.moveTo(o[e].x,o[e].y),t.lineTo(o[n].x,o[n].y),t.strokeStyle=`rgba(201, 168, 76, ${i})`,t.lineWidth=.5,t.stroke()}}}(),o.forEach(c),n=requestAnimationFrame(r)}window.matchMedia("(prefers-reduced-motion: reduce)").matches?e.style.display="none":(i(),a(),r(),window.addEventListener("resize",()=>{i(),a()}),document.addEventListener("visibilitychange",()=>{document.hidden?cancelAnimationFrame(n):r()}))}};window.Animations=e,"loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>e.init()):e.init()}(),function(){"use strict";const e={form:null,feedbackEl:null,lastSubmitTime:0,init(){this.form=document.getElementById("contact-form"),this.feedbackEl=document.getElementById("form-feedback"),this.form&&this.form.addEventListener("submit",e=>this.handleSubmit(e))},isValidEmail:e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e),isValidPhone:e=>!e||/^(?:(?:\+33|0)\s?[1-9])(?:[\s.-]?\d{2}){4}$/.test(e.replace(/\s/g,"")),showFeedback(e,t){this.feedbackEl&&(this.feedbackEl.className=`form-message form-message--${t}`,this.feedbackEl.textContent=e,this.feedbackEl.style.display="block","success"===t&&setTimeout(()=>{this.feedbackEl.style.display="none"},8e3))},handleSubmit(e){e.preventDefault();const t=Date.now();if(t-this.lastSubmitTime<3e4)return void this.showFeedback("Veuillez patienter quelques secondes avant de renvoyer un message.","error");const n=this.form.querySelector("#contact-website");if(n&&n.value)return this.showFeedback("Votre message a bien été envoyé. Merci !","success"),void this.form.reset();const o=this.form.querySelector("#contact-name").value.trim(),i=this.form.querySelector("#contact-email").value.trim(),s=this.form.querySelector("#contact-phone").value.trim(),a=this.form.querySelector("#contact-subject").value.trim(),c=this.form.querySelector("#contact-message").value.trim(),r=this.form.querySelector("#contact-rgpd").checked;if(!o||o.length<2)return this.showFeedback("Veuillez entrer votre nom complet.","error"),void this.form.querySelector("#contact-name").focus();if(!i||!this.isValidEmail(i))return this.showFeedback("Veuillez entrer une adresse email valide.","error"),void this.form.querySelector("#contact-email").focus();if(s&&!this.isValidPhone(s))return this.showFeedback("Le format du numéro de téléphone est invalide.","error"),void this.form.querySelector("#contact-phone").focus();if(!a||a.length<3)return this.showFeedback("Veuillez indiquer l'objet de votre message.","error"),void this.form.querySelector("#contact-subject").focus();if(!c||c.length<10)return this.showFeedback("Votre message doit contenir au moins 10 caractères.","error"),void this.form.querySelector("#contact-message").focus();if(!r)return void this.showFeedback("Vous devez accepter la politique de confidentialité.","error");const l=`Nom : ${o}\nEmail : ${i}\nTéléphone : ${s||"Non renseigné"}\n\nMessage :\n${c}`,d=`mailto:${["pacas.neuropsy","gmail.com"].join("@")}?subject=${encodeURIComponent("[Site Web] "+a)}&body=${encodeURIComponent(l)}`;window.location.href=d,this.lastSubmitTime=t,this.showFeedback("Votre messagerie s'ouvre pour envoyer l'email. N'oubliez pas de l'envoyer !","success"),this.form.reset()}};window.ContactForm=e,"loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>e.init()):e.init()}(),function(){"use strict";const e={init(){document.body.classList.add("loaded"),document.querySelectorAll(".safe-mail").forEach(e=>{const t=e.getAttribute("data-u"),n=e.getAttribute("data-d");if(t&&n){const o=t+"@"+n;e.textContent=o,e.removeAttribute("href"),e.removeEventListener("click",null),e.style.textDecoration="none",e.style.color="inherit",e.style.cursor="text",e.removeAttribute("data-u"),e.removeAttribute("data-d")}})}};"loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>e.init()):e.init()}();
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

/**
 * App — Main application initialization
 */
(function() {
  'use strict';

  const App = {
    init() {
      // Add loaded class for initial animations
      document.body.classList.add('loaded');

      // Email Obfuscation Decoder (Auto-resolve on load safely)
      document.querySelectorAll('.safe-mail').forEach(el => {
        const u = el.getAttribute('data-u');
        const d = el.getAttribute('data-d');
        if (u && d) {
          const email = u + '@' + d;
          el.textContent = email; // Replace text with real email
          el.removeAttribute('href'); // Remove link behavior completely
          el.removeEventListener('click', null); // Prevent any clicks if it was a button
          el.style.textDecoration = 'none';
          el.style.color = 'inherit';
          el.style.cursor = 'text'; // Make it look and act like normal text
          el.removeAttribute('data-u');
          el.removeAttribute('data-d');
        }
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
  } else {
    App.init();
  }
})();
