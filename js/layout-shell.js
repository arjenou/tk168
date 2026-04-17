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

  return {
    inject
  };
})();
