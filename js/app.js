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
