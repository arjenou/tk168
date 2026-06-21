window.TK168LayoutShell = (() => {
  const NAV_HTML = `
    <nav id="navbar">
      <div class="nav-wrap">
        <img src="assets/images/logo_TK168.svg" class="nav-logo" alt="TK168">
        <div class="nav-right">
          <div class="nav-links">
            <a href="index.html" class="nav-link" data-nav-key="landing" data-i18n="nav.landing">ホーム</a>
            <a href="about.html" class="nav-link" data-nav-key="home" data-i18n="nav.home">会社概要</a>
            <a href="brand.html" class="nav-link" data-nav-key="inventory" data-i18n="nav.inventory">在庫車両</a>
            <a href="auto-export.html" class="nav-link" data-nav-key="export" data-i18n="nav.export">自動車輸出事業</a>
            <a href="rental.html" class="nav-link" data-nav-key="rental" data-i18n="nav.rental">レンタカー事業</a>
            <a href="service.html" class="nav-link" data-nav-key="service" data-i18n="nav.services">サービス案内</a>
            <a href="favorites.html" class="nav-link" data-nav-key="favorite" data-i18n="nav.favorite">お気に入り</a>
            <a href="https://moon.tk168.co.jp" class="nav-link" data-nav-key="spacekart" data-i18n="nav.spacekart" target="_blank" rel="noopener noreferrer">Spacekart</a>
          </div>

          <div class="nav-lang" data-lang-switcher>
            <button type="button" class="nav-lang-trigger" data-lang-trigger data-i18n-title="lang.switcher" aria-label="言語切替" aria-expanded="false">
              <svg class="nav-lang-globe" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm7.4 9h-3.1a15.6 15.6 0 00-1.2-5A8.02 8.02 0 0119.4 11zM12 4.1c.9 1 2.1 3.2 2.6 6.9H9.4C9.9 7.3 11.1 5.1 12 4.1zM8.9 6a15.6 15.6 0 00-1.2 5H4.6A8.02 8.02 0 018.9 6zM4.6 13h3.1a15.6 15.6 0 001.2 5A8.02 8.02 0 014.6 13zm4.8 0h5.2c-.5 3.7-1.7 5.9-2.6 6.9-.9-1-2.1-3.2-2.6-6.9zm5.7 5a15.6 15.6 0 001.2-5h3.1a8.02 8.02 0 01-4.3 5z"></path>
              </svg>
              <span class="nav-lang-current" data-lang-current-label>JA</span>
              <svg class="nav-lang-caret" viewBox="0 0 10 6" aria-hidden="true">
                <path d="M1 1l4 4 4-4"></path>
              </svg>
            </button>
            <div class="nav-lang-menu">
              <button type="button" class="nav-lang-option" data-lang-option="ja" data-i18n="lang.ja">日本語</button>
              <button type="button" class="nav-lang-option" data-lang-option="zh" data-i18n="lang.zh">中文</button>
              <button type="button" class="nav-lang-option" data-lang-option="en" data-i18n="lang.en">English</button>
            </div>
          </div>

          <a href="contact.html" class="nav-cta" data-i18n="nav.contact">お問い合わせ</a>
          <div class="nav-mobile-menu"><span class="nav-mobile-lines" aria-hidden="true"></span></div>
        </div>
      </div>
    </nav>
  `;

  const SAITAMA_MAPS_HREF = 'https://www.google.com/maps/search/?api=1&query=339-0035%20%E5%9F%BC%E7%8E%89%E7%9C%8C%E3%81%95%E3%81%84%E3%81%9F%E3%81%BE%E5%B8%82%E5%B2%A9%E6%A7%BB%E5%8C%BA%E7%AC%B9%E4%B9%85%E4%BF%9D%E6%96%B0%E7%94%B0';
  /** 移动端底栏「咨询」一键拨号（さいたま店） */
  const MOBILE_INQUIRY_TEL_HREF = 'tel:+81487964907';

  const MOBILE_BOTTOM_BAR_HTML = `
    <nav class="site-mobile-bottom-bar" id="siteMobileBottomBar" aria-label="Mobile shortcuts">
      <div class="site-mobile-bottom-bar__inner">
        <a class="site-mobile-bottom-bar__btn site-mobile-bottom-bar__btn--inquiry" href="${MOBILE_INQUIRY_TEL_HREF}" data-mobile-bar-inquiry>
          <svg class="site-mobile-bottom-bar__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" d="M5 5h14v10H8l-3 3V5z"></path>
          </svg>
          <span data-i18n="mobileBar.inquiry">お問い合わせ</span>
        </a>
        <a class="site-mobile-bottom-bar__btn site-mobile-bottom-bar__btn--access" href="${SAITAMA_MAPS_HREF}" target="_blank" rel="noopener noreferrer">
          <svg class="site-mobile-bottom-bar__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" d="M12 21s7-4.35 7-10a7 7 0 10-14 0c0 5.65 7 10 7 10zm0-10.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"></path>
          </svg>
          <span data-i18n="mobileBar.access">アクセス</span>
        </a>
      </div>
    </nav>
  `;

  const FOOTER_HTML = `
    <footer id="footer" class="site-footer">
      <div class="footer-wrap footer-inner">
        <div class="footer-top">
          <div class="footer-brand">
            <img src="assets/images/logo_TK168.svg" alt="TK168" class="footer-logo">
            <p class="footer-slogan" data-i18n-html="footer.slogan">上質な一台との出会いを、<br>越境サービスとともに丁寧にサポートします。</p>
          </div>
          <div class="footer-newsletter">
            <h4 data-i18n="footer.newsletterTitle">ニュースレター</h4>
            <div class="newsletter-form">
              <input type="email" class="footer-input" placeholder="メールアドレスを入力" data-i18n-placeholder="footer.newsletterPlaceholder">
              <button class="footer-btn" data-i18n="footer.newsletterButton">登録する</button>
            </div>
          </div>
        </div>

        <div class="footer-divider"></div>

        <div class="footer-stores">
          <h4 class="footer-stores-title" data-i18n="footer.storesTitle">店舗ネットワーク</h4>
          <div class="footer-stores-grid">
            <article class="footer-store">
              <p class="footer-store-eyebrow" data-i18n="footer.stores.saitama.eyebrow">JAPAN · TOKYO</p>
              <h5 class="footer-store-name" data-i18n="footer.stores.saitama.name">さいたま店</h5>
              <p class="footer-store-address" data-i18n-html="footer.stores.saitama.address">339-0035<br>埼玉県さいたま市岩槻区笹久保新田</p>
              <div class="footer-store-contact">
                <p data-i18n="footer.stores.saitama.phoneLine">TEL：048-796-4907</p>
                <p data-i18n="footer.stores.saitama.faxLine">FAX：048-796-4946</p>
                <p data-i18n="footer.stores.saitama.emailLine">EMAIL：AUTO@tk168.co.jp</p>
              </div>
            </article>
            <article class="footer-store">
              <p class="footer-store-eyebrow" data-i18n="footer.stores.tokyo.eyebrow">JAPAN · TOKYO</p>
              <h5 class="footer-store-name" data-i18n="footer.stores.tokyo.name">亀戸店</h5>
              <p class="footer-store-address" data-i18n-html="footer.stores.tokyo.address">東京都江東区亀戸<br>住所準備中</p>
              <div class="footer-store-contact">
                <p data-i18n="footer.storePhoneLine">電話番号：準備中</p>
                <p data-i18n="footer.storeEmailLine">メール：準備中</p>
              </div>
            </article>
            <article class="footer-store">
              <p class="footer-store-eyebrow" data-i18n="footer.stores.osaka.eyebrow">JAPAN · OSAKA</p>
              <h5 class="footer-store-name" data-i18n="footer.stores.osaka.name">大阪店</h5>
              <p class="footer-store-address" data-i18n-html="footer.stores.osaka.address">〒595-0042<br>大阪府泉大津市高津町１２−１１</p>
              <div class="footer-store-contact">
                <p data-i18n="footer.stores.osaka.phoneLine">TEL：072-592-9577</p>
                <p data-i18n="footer.stores.osaka.faxLine">FAX：072-592-9631</p>
                <p data-i18n="footer.stores.osaka.emailLine">EMAIL：OSAKA@tk168.co.jp</p>
              </div>
            </article>
            <article class="footer-store">
              <p class="footer-store-eyebrow" data-i18n="footer.stores.malaysia.eyebrow">MALAYSIA</p>
              <h5 class="footer-store-name" data-i18n="footer.stores.malaysia.name">マレーシア支店</h5>
              <p class="footer-store-address" data-i18n-html="footer.stores.malaysia.address">Kuala Lumpur, Malaysia<br>住所準備中</p>
              <div class="footer-store-contact">
                <p data-i18n="footer.storePhoneLine">電話番号：準備中</p>
                <p data-i18n="footer.storeEmailLine">メール：準備中</p>
              </div>
            </article>
          </div>
        </div>

        <div class="footer-divider footer-divider--bottom"></div>
        <p class="footer-copyright" data-i18n="footer.copyright">© 2026 TK168. All rights reserved.</p>
      </div>
    </footer>
  `;

  const MOBILE_BOTTOM_BAR_CSS_HREF = 'css/mobile-bottom-bar.css?v=20260602a';

  function ensureMobileBottomBarStyles() {
    if (document.getElementById('siteMobileBottomBarStyles')) return;
    const link = document.createElement('link');
    link.id = 'siteMobileBottomBarStyles';
    link.rel = 'stylesheet';
    link.href = MOBILE_BOTTOM_BAR_CSS_HREF;
    document.head.appendChild(link);
  }

  function syncMobileBottomBarLinks() {
    const inquiryLink = document.querySelector('[data-mobile-bar-inquiry]');
    if (inquiryLink) {
      inquiryLink.href = MOBILE_INQUIRY_TEL_HREF;
    }
  }

  function injectMobileBottomBar() {
    ensureMobileBottomBarStyles();
    if (document.body.dataset.mobileBarInjected === '1') return;
    if (!document.querySelector('[data-layout-nav]')) return;
    if (document.getElementById('siteMobileBottomBar')) return;

    document.body.dataset.mobileBarInjected = '1';
    document.body.classList.add('has-site-mobile-bar');

    const mount = document.createElement('div');
    mount.innerHTML = MOBILE_BOTTOM_BAR_HTML.trim();
    const bar = mount.firstElementChild;
    if (bar) document.body.appendChild(bar);

    syncMobileBottomBarLinks();
    window.TK168I18N?.applyTranslations?.(document);
  }

  function inject() {
    document.querySelectorAll('[data-layout-nav]').forEach((mount) => {
      if (mount.dataset.layoutInjected === '1') return;
      mount.dataset.layoutInjected = '1';
      mount.innerHTML = NAV_HTML;
    });

    document.querySelectorAll('[data-layout-footer]').forEach((mount) => {
      if (mount.dataset.layoutInjected === '1') return;
      mount.dataset.layoutInjected = '1';
      mount.innerHTML = FOOTER_HTML;
    });

    injectMobileBottomBar();
  }

  function bootstrap() {
    inject();
    syncMobileBottomBarLinks();
  }

  bootstrap();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
  }
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    bootstrap();
  });

  /* ───────────────────────────────────────────────
     全站统一页面转场（Page Transition）
     - 拦截同源 <a> 点击，先淡出再跳转
     - 支持修饰键 / 新标签页 / 锚点 / 下载 / 非 http(s) 协议的放行
     - 兼容 bfcache（pageshow persisted）恢复，避免白屏停留
     - 与 CSS 中的 .is-page-navigating / .is-page-restored 联动
     ─────────────────────────────────────────────── */
  const PageTransition = (() => {
    // Native cross-document View Transitions (Chromium) and skeleton-boot.js
    // handle the visual transition entirely. We no longer intercept link
    // clicks here — the browser's own navigation is the smoothest path and
    // adding a setTimeout just adds latency.
    const TRANSITION_MS = 0;
    const NAV_SAFETY_MS = 900;
    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');

    let isNavigating = false;
    let safetyTimer = 0;

    function isModifiedEvent(event) {
      return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
    }

    function isSameOriginHttpUrl(url) {
      if (!url) return false;
      const protocol = (url.protocol || '').toLowerCase();
      if (protocol !== 'http:' && protocol !== 'https:') return false;
      return url.origin === window.location.origin;
    }

    function isSamePagePath(url) {
      return url.pathname === window.location.pathname && url.search === window.location.search;
    }

    function shouldSkipAnchor(anchor) {
      if (!anchor || !anchor.href) return true;
      if (anchor.hasAttribute('download')) return true;
      if (anchor.dataset?.noTransition === '1') return true;

      const rawHref = anchor.getAttribute('href') || '';
      if (!rawHref || rawHref.startsWith('#')) return true;

      const target = (anchor.getAttribute('target') || '').toLowerCase();
      if (target && target !== '_self') return true;

      const rel = (anchor.getAttribute('rel') || '').toLowerCase();
      if (rel.includes('external')) return true;

      return false;
    }

    function runFadeOut(nextHref, replace) {
      // Kept for the public navigate() API. Performs an immediate navigation;
      // the browser's native transition does the actual visual crossfade.
      if (isNavigating) return;
      isNavigating = true;
      if (replace) {
        window.location.replace(nextHref);
      } else {
        window.location.href = nextHref;
      }
      safetyTimer = window.setTimeout(() => {
        isNavigating = false;
      }, NAV_SAFETY_MS);
    }

    function bindClickInterceptor() {
      // Intentionally no-op: we let the browser handle navigation natively
      // so cross-document View Transitions (Chromium) can crossfade pages.
    }

    function handlePageShow(event) {
      if (safetyTimer) {
        window.clearTimeout(safetyTimer);
        safetyTimer = 0;
      }
      isNavigating = false;
      root.classList.remove('is-page-navigating');

      if (event.persisted) {
        root.classList.add('is-page-restored');
        window.setTimeout(() => root.classList.remove('is-page-restored'), 50);
      }
    }

    function handlePageHide() {
      root.classList.remove('is-page-navigating');
    }

    bindClickInterceptor();
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('pagehide', handlePageHide);

    return {
      navigate(href, { replace = false } = {}) {
        if (!href) return;
        runFadeOut(href, replace);
      }
    };
  })();

  return {
    inject,
    navigate: PageTransition.navigate
  };
})();
