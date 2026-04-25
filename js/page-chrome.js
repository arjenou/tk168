window.TK168PageChrome = (() => {
  function setupMobileNav() {
    const MOBILE_BREAKPOINT = 760;
    const navbar = document.getElementById('navbar');
    const toggle = navbar?.querySelector('.nav-mobile-menu');
    const navLinks = navbar?.querySelector('.nav-links');
    if (!navbar || !toggle || !navLinks) return;
    if (toggle.dataset.chromeBound === '1') return;
    toggle.dataset.chromeBound = '1';

    function ensureMobileCta() {
      const desktopCta = navbar.querySelector('.nav-right > .nav-cta');
      if (!desktopCta) return null;

      let mobileCta = navLinks.querySelector('.nav-cta-mobile');
      if (!mobileCta) {
        mobileCta = desktopCta.cloneNode(true);
        mobileCta.classList.add('nav-cta-mobile');
        navLinks.appendChild(mobileCta);
      }

      mobileCta.href = desktopCta.getAttribute('href') || '#';
      mobileCta.textContent = desktopCta.textContent;
      return mobileCta;
    }

    function ensureMobileToggleIcon() {
      let icon = toggle.querySelector('.nav-mobile-lines');
      if (icon) return icon;

      toggle.textContent = '';
      icon = document.createElement('span');
      icon.className = 'nav-mobile-lines';
      icon.setAttribute('aria-hidden', 'true');
      toggle.appendChild(icon);
      return icon;
    }

    function syncMobileMenuHeight() {
      const menuHeight = navLinks ? `${navLinks.offsetHeight}px` : '0px';
      navbar.style.setProperty('--mobile-menu-height', menuHeight);
    }

    function closeMenu() {
      navbar.classList.remove('mobile-open');
      document.body.classList.remove('mobile-nav-open');
      navbar.style.setProperty('--mobile-menu-height', '0px');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', '打开导航菜单');
      toggle.classList.remove('is-open');
    }

    function openMenu() {
      navbar.classList.add('mobile-open');
      document.body.classList.add('mobile-nav-open');
      syncMobileMenuHeight();
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', '关闭导航菜单');
      toggle.classList.add('is-open');
    }

    ensureMobileCta();
    ensureMobileToggleIcon();
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('tabindex', '0');
    closeMenu();

    const handleToggle = () => {
      if (navbar.classList.contains('mobile-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    toggle.addEventListener('click', handleToggle);
    toggle.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleToggle();
      }
      if (event.key === 'Escape') {
        closeMenu();
      }
    });

    navbar.querySelectorAll('.nav-links a, .nav-cta').forEach((link) => {
      if (link.dataset.mobileCloseBound === '1') return;
      link.dataset.mobileCloseBound = '1';
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (event) => {
      if (!navbar.classList.contains('mobile-open')) return;
      if (navbar.contains(event.target)) return;
      closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        closeMenu();
        return;
      }
      if (navbar.classList.contains('mobile-open')) syncMobileMenuHeight();
    });
  }

  function clearCurrentState() {
    document.querySelectorAll('[aria-current="page"]').forEach((element) => {
      element.removeAttribute('aria-current');
    });
  }

  function bindNavbarScrollState({
    threshold = 60,
    navbarId = 'navbar'
  } = {}) {
    const navbar = document.getElementById(navbarId);
    if (!navbar) return;

    const normalizedThreshold = Number.isFinite(Number(threshold))
      ? Math.max(0, Number(threshold))
      : 60;
    const nextToken = `${normalizedThreshold}`;
    const prevToken = navbar.dataset.chromeScrollBound || '';

    if (prevToken === nextToken) {
      const sync = navbar.__tk168ScrollSync;
      if (typeof sync === 'function') sync();
      return;
    }

    if (typeof navbar.__tk168ScrollSync === 'function') {
      window.removeEventListener('scroll', navbar.__tk168ScrollSync);
    }

    const syncNavbarState = () => {
      navbar.classList.toggle('scrolled', window.scrollY > normalizedThreshold);
    };

    navbar.__tk168ScrollSync = syncNavbarState;
    navbar.dataset.chromeScrollBound = nextToken;
    window.addEventListener('scroll', syncNavbarState, { passive: true });
    syncNavbarState();
  }

  function unbindNavbarScrollState({
    navbarId = 'navbar'
  } = {}) {
    const navbar = document.getElementById(navbarId);
    if (!navbar) return;

    if (typeof navbar.__tk168ScrollSync === 'function') {
      window.removeEventListener('scroll', navbar.__tk168ScrollSync);
    }

    delete navbar.__tk168ScrollSync;
    delete navbar.dataset.chromeScrollBound;
    navbar.classList.remove('scrolled');
  }

  function setNavbarMode({
    mode = 'auto',
    navbarId = 'navbar'
  } = {}) {
    const navbar = document.getElementById(navbarId);
    if (!navbar) return;

    navbar.classList.toggle('chrome-solid', mode === 'solid');
  }

  function markCurrentPage(pageKey, landingHref, aboutHref, inventoryHref, serviceHref, rentalHref, exportHref, favoriteHref) {
    const rules = {
      landing: (key, href) => key === 'landing' && href === landingHref,
      about: (key, href) => key === 'home' && href === aboutHref,
      inventory: (key, href) => key === 'inventory' && href === inventoryHref,
      detail: (key, href) => key === 'inventory' && href === inventoryHref,
      service: (key, href) => key === 'service' && href === serviceHref,
      rental: (key, href) => key === 'rental' && href === rentalHref,
      export: (key, href) => key === 'export' && href === exportHref,
      favorite: (key, href) => key === 'favorite' && href === favoriteHref
    };

    const matcher = rules[pageKey];
    if (!matcher) return;

    document.querySelectorAll('a').forEach((link) => {
      const key = link.dataset.navKey || link.dataset.footerLinkKey || '';
      const href = link.getAttribute('href') || '';
      if (matcher(key, href)) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  function applyPageChrome({
    pageKey,
    landingHref = 'index.html',
    aboutHref = 'about.html',
    inventoryHref = 'brand.html',
    serviceHref = 'service.html',
    rentalHref = 'rental.html',
    exportHref = 'auto-export.html',
    favoriteHref = 'favorites.html',
    scrollThreshold = 60,
    navMode = 'auto'
  }) {
    clearCurrentState();

    document.querySelectorAll('a[data-nav-key="landing"], a[data-footer-link-key="landing"]').forEach((link) => {
      link.href = landingHref;
    });
    document.querySelectorAll('a[data-nav-key="home"], a[data-footer-link-key="home"]').forEach((link) => {
      link.href = aboutHref;
    });
    document.querySelectorAll('a[data-nav-key="inventory"], a[data-footer-link-key="inventory"]').forEach((link) => {
      link.href = inventoryHref;
    });
    document.querySelectorAll('a[data-nav-key="service"], a[data-footer-link-key="service"]').forEach((link) => {
      link.href = serviceHref;
    });
    document.querySelectorAll('a[data-nav-key="rental"], a[data-footer-link-key="rental"]').forEach((link) => {
      link.href = rentalHref;
    });
    document.querySelectorAll('a[data-nav-key="export"], a[data-footer-link-key="export"]').forEach((link) => {
      link.href = exportHref;
    });
    document.querySelectorAll('a[data-nav-key="favorite"], a[data-footer-link-key="favorite"]').forEach((link) => {
      link.href = favoriteHref;
    });

    markCurrentPage(pageKey, landingHref, aboutHref, inventoryHref, serviceHref, rentalHref, exportHref, favoriteHref);
    setupMobileNav();
    setNavbarMode({ mode: navMode });

    const shouldUseScrollChrome = navMode !== 'solid';
    if (shouldUseScrollChrome) {
      bindNavbarScrollState({ threshold: scrollThreshold });
    } else {
      unbindNavbarScrollState();
    }
  }

  return {
    applyPageChrome,
    bindNavbarScrollState,
    unbindNavbarScrollState,
    setNavbarMode
  };
})();
