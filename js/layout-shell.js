window.TK168LayoutShell = (() => {
  const NAV_HTML = `
    <nav id="navbar">
      <div class="nav-wrap">
        <img src="assets/images/logo_TK168.svg" class="nav-logo" alt="TK168">
        <div class="nav-right">
          <div class="nav-links">
            <a href="index.html" class="nav-link" data-nav-key="landing" data-i18n="nav.landing">ホーム</a>
            <a href="about.html" class="nav-link" data-nav-key="home" data-i18n="nav.home">会社概要</a>
            <a href="brand.html" class="nav-link" data-nav-key="inventory" data-i18n="nav.inventory">ブランド展示</a>
            <a href="auto-export.html" class="nav-link" data-nav-key="export" data-i18n="nav.export">自動車輸出</a>
            <a href="rental.html" class="nav-link" data-nav-key="rental" data-i18n="nav.rental">レンタル</a>
            <a href="service.html" class="nav-link" data-nav-key="service" data-i18n="nav.services">サービス</a>
            <a href="favorites.html" class="nav-link" data-nav-key="favorite" data-i18n="nav.favorite">お気に入り</a>
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

          <a href="inquiry.html" class="nav-cta" data-i18n="nav.contact">お問い合わせ</a>
          <div class="nav-mobile-menu"><span class="nav-mobile-lines" aria-hidden="true"></span></div>
        </div>
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

        <div class="footer-links">
          <div class="footer-col">
            <h4 data-i18n="footer.pages">ページ</h4>
            <a href="service.html#service-faq" data-link-key="faq" data-i18n="footer.faq">よくある質問</a>
          </div>
          <div class="footer-col" data-footer-col="phone">
            <h4 data-i18n="footer.phone">電話番号</h4>
            <a href="tel:+819012220168">+81 09012220168</a>
          </div>
          <div class="footer-col" data-footer-col="email">
            <h4 data-i18n="footer.email">メール</h4>
            <a href="mailto:AUTO@tk168.co.jp">AUTO@tk168.co.jp</a>
          </div>
          <div class="footer-col" data-footer-col="address">
            <h4 data-i18n="footer.address">住所</h4>
            <p class="footer-text" data-i18n-html="footer.addressValue">339-0035埼玉県さいたま市岩<br>槻区笹久保新田</p>
          </div>
        </div>

        <div class="footer-divider footer-divider--bottom"></div>
        <p class="footer-copyright" data-i18n="footer.copyright">© 2026 TK168. All rights reserved.</p>
      </div>
    </footer>
  `;

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
  }

  inject();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject, { once: true });
  }

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
