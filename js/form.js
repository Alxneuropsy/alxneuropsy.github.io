/**
 * Contact Form — Client-side validation & local submission
 */
(function() {
  'use strict';

  const ContactForm = {
    form: null,
    feedbackEl: null,

    init() {
      this.form = document.getElementById('contact-form');
      this.feedbackEl = document.getElementById('form-feedback');

      if (this.form) {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      }
    },

    /**
     * Sanitize input to prevent XSS
     */
    sanitize(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
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

      // Gather form data
      const name = this.sanitize(this.form.querySelector('#contact-name').value.trim());
      const email = this.sanitize(this.form.querySelector('#contact-email').value.trim());
      const phone = this.sanitize(this.form.querySelector('#contact-phone').value.trim());
      const subject = this.sanitize(this.form.querySelector('#contact-subject').value.trim());
      const message = this.sanitize(this.form.querySelector('#contact-message').value.trim());
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

      // Construct mailto link
      const mailBody = `Nom : ${name}\nEmail : ${email}\nTéléphone : ${phone ? phone : 'Non renseigné'}\n\nMessage :\n${message}`;
      const mailtoLink = `mailto:pacas.neuropsy@gmail.com?subject=${encodeURIComponent('[Site Web] ' + subject)}&body=${encodeURIComponent(mailBody)}`;
      
      // Open default mail client
      window.location.href = mailtoLink;

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
