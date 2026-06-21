window.TK168CommonLinks = (() => {
  const FAVORITES_BASE = 'favorites.html';

  function getPhoneHref(phone = '') {
    return `tel:${String(phone).replace(/\s+/g, '')}`;
  }

  function getMailHref(email = '') {
    return `mailto:${String(email || '').trim()}`;
  }

  function getLanguage() {
    return window.TK168I18N?.getLanguage?.() || 'ja';
  }

  function getHomeLogoTitle() {
    const language = getLanguage();
    if (language === 'en') return 'Back to home';
    if (language === 'zh') return '返回首页';
    return 'トップへ戻る';
  }

  function syncFooterLinks(site) {
    const telHref = getPhoneHref(site.phone);
    const mailHref = getMailHref(site.email);

    document.querySelectorAll('[data-footer-col="phone"] a').forEach((link) => {
      link.href = telHref;
    });

    document.querySelectorAll('[data-footer-col="email"] a').forEach((link) => {
      link.href = mailHref;
    });
  }

  function wireHomeLogos() {
    document.querySelectorAll('.nav-logo, .footer-logo').forEach((logo) => {
      logo.style.cursor = 'pointer';
      logo.title = getHomeLogoTitle();
      if (logo.dataset.homeLogoBound === '1') return;
      logo.dataset.homeLogoBound = '1';
      logo.addEventListener('click', () => {
        if (window.TK168LayoutShell?.navigate) {
          window.TK168LayoutShell.navigate('index.html');
        } else {
          window.location.href = 'index.html';
        }
      });
    });
  }

  function updateFavoriteLinks() {
    const ids = window.TK168Renderers?.getFavoriteVehicleIds?.() || [];
    const param = ids.length ? `?fav=${encodeURIComponent(ids.join(','))}` : '';
    const href = `${FAVORITES_BASE}${param}`;
    document.querySelectorAll('a[data-nav-key="favorite"]').forEach((link) => {
      link.href = href;
    });
  }

  function triggerPrimaryLink(card, linkSelector) {
    const primaryLink = card.querySelector(linkSelector);
    if (!primaryLink?.href) return;
    window.TK168HomeScrollRestore?.notifyHomeDetailNavigationFromCard?.(card, primaryLink.href);
    if (window.TK168LayoutShell?.navigate) {
      window.TK168LayoutShell.navigate(primaryLink.href);
    } else {
      window.location.href = primaryLink.href;
    }
  }

  function enhanceClickableCards(root = document) {
    const cardRules = [
      { selector: '.v-card', linkSelector: '.v-detail-btn' },
      { selector: '.featured-card', linkSelector: '.card-button' },
      { selector: '.news-card', linkSelector: '.news-more' }
    ];

    cardRules.forEach(({ selector, linkSelector }) => {
      root.querySelectorAll(selector).forEach((card) => {
        if (card.dataset.cardLinked === '1') return;

        const primaryLink = card.querySelector(linkSelector);
        if (!primaryLink?.href) return;

        card.dataset.cardLinked = '1';
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'link');
        card.setAttribute('aria-label', primaryLink.textContent.trim() || '打开详情');

        card.addEventListener('click', (event) => {
          if (event.target.closest('a, button, input, select, textarea, label')) return;
          triggerPrimaryLink(card, linkSelector);
        });

        card.addEventListener('keydown', (event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          if (event.target !== card) return;
          event.preventDefault();
          triggerPrimaryLink(card, linkSelector);
        });
      });
    });
  }

  function applyCommonLinks() {
    const { site } = window.TK168_DATA;
    syncFooterLinks(site);
    wireHomeLogos();
    updateFavoriteLinks();
    enhanceClickableCards(document);

    if (document.documentElement.dataset.commonLinksLangBound !== '1') {
      document.documentElement.dataset.commonLinksLangBound = '1';
      window.addEventListener('tk168:languagechange', () => {
        wireHomeLogos();
        updateFavoriteLinks();
      });
      window.addEventListener('favorites:changed', updateFavoriteLinks);
    } else {
      wireHomeLogos();
      updateFavoriteLinks();
    }
  }

  return {
    applyCommonLinks,
    enhanceClickableCards
  };
})();
