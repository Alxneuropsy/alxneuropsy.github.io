/**
 * App — Main application initialization
 */
(function() {
  'use strict';

  const App = {
    init() {
      console.log('%c✦ Cabinet Alexia Pacas — Neuropsychologue', 
        'color: #c9a84c; font-size: 14px; font-weight: bold; font-family: serif;');
      console.log('%cSite développé avec ♥', 
        'color: #8a93a3; font-size: 11px;');

      // Add loaded class for initial animations
      document.body.classList.add('loaded');

      // Email Obfuscation Decoder (Anti-Spam)
      const emailLinks = document.querySelectorAll('.obfuscated-email');
      emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          // If already decoded, do nothing to allow standard mailto behavior
          if (!this.hasAttribute('data-user')) return;
          
          e.preventDefault();
          const user = this.getAttribute('data-user');
          const domain = this.getAttribute('data-domain');
          
          if (user && domain) {
            const email = user + '@' + domain;
            this.textContent = email; // Show email
            this.href = 'mailto:' + email; // Make it a mailto link
            this.removeAttribute('data-user');
            this.removeAttribute('data-domain');
            this.classList.remove('obfuscated-email');
            
            // Open mail client immediately
            window.location.href = this.href;
          }
        });
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
  } else {
    App.init();
  }
})();
