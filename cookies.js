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
