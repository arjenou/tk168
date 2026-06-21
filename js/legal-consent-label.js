window.TK168LegalConsentLabel = (() => {
  const TERMS_HREF = 'terms-of-use.html';
  const PRIVACY_HREF = 'privacy-policy.html';

  const COPY = {
    zh: {
      prefix: '同意',
      termsLink: '使用条款',
      middle: '与',
      privacyLink: '隐私政策',
      suffix: '',
      consentRequired: '请先同意使用条款与隐私政策。'
    },
    ja: {
      prefix: '',
      termsLink: '利用規約',
      middle: 'と',
      privacyLink: 'プライバシーポリシー',
      suffix: 'に同意する',
      consentRequired: '利用規約とプライバシーポリシーへの同意が必要です。'
    },
    en: {
      prefix: 'I agree to the ',
      termsLink: 'terms of use',
      middle: ' and ',
      privacyLink: 'privacy policy',
      suffix: '',
      consentRequired: 'You must agree to the terms of use and privacy policy first.'
    }
  };

  function getLanguage() {
    return window.TK168I18N?.getLanguage?.() || 'ja';
  }

  function getCopy(lang = getLanguage()) {
    return COPY[lang] || COPY.ja;
  }

  function getConsentRequiredMessage(lang = getLanguage()) {
    return getCopy(lang).consentRequired;
  }

  function setText(el, value) {
    if (!el) return;
    const text = String(value || '');
    el.textContent = text;
    el.hidden = !text;
  }

  function markupHtml() {
    return `
      <span data-legal-consent-prefix></span>
      <a href="${TERMS_HREF}" class="inq-policy-link" data-legal-consent-terms target="_blank" rel="noopener noreferrer"></a>
      <span data-legal-consent-middle></span>
      <a href="${PRIVACY_HREF}" class="inq-policy-link" data-legal-consent-privacy target="_blank" rel="noopener noreferrer"></a>
      <span data-legal-consent-suffix></span>
    `.trim();
  }

  function applyToContainer(container, lang = getLanguage()) {
    if (!container) return;
    const copy = getCopy(lang);
    setText(container.querySelector('[data-legal-consent-prefix]'), copy.prefix);
    setText(container.querySelector('[data-legal-consent-terms]'), copy.termsLink);
    setText(container.querySelector('[data-legal-consent-middle]'), copy.middle);
    setText(container.querySelector('[data-legal-consent-privacy]'), copy.privacyLink);
    setText(container.querySelector('[data-legal-consent-suffix]'), copy.suffix);
  }

  function bindLinks(root = document) {
    root.querySelectorAll('[data-legal-consent-terms], [data-legal-consent-privacy]').forEach((link) => {
      if (link.dataset.legalLinkBound === '1') return;
      link.dataset.legalLinkBound = '1';
      ['click', 'mousedown'].forEach((eventName) => {
        link.addEventListener(eventName, (event) => {
          event.stopPropagation();
        });
      });
    });
  }

  function ensureMarkup(container) {
    if (!container || container.querySelector('[data-legal-consent-terms]')) return;
    container.innerHTML = markupHtml();
  }

  function init(root = document, lang = getLanguage()) {
    root.querySelectorAll('[data-legal-consent-label]').forEach((container) => {
      ensureMarkup(container);
      applyToContainer(container, lang);
    });
    bindLinks(root);
  }

  return {
    init,
    getCopy,
    getConsentRequiredMessage,
    applyToContainer,
    bindLinks
  };
})();
