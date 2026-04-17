window.TK168I18N = (() => {
  const STORAGE_KEY = 'tk168_lang';
  const DEFAULT_LANGUAGE = 'ja';
  const SUPPORTED_LANGUAGES = new Set(['ja', 'zh', 'en']);

  const messages = {
    zh: {
      'page.landingTitle': '首页 — TK168 Premium Automotive',
      'nav.landing': '首页',
      'nav.home': '企业简介',
      'nav.inventory': '品牌展厅',
      'nav.services': '服务',
      'nav.favorite': '收藏',
      'nav.rental': '租车',
      'nav.export': '汽车出口',
      'nav.contact': '联系顾问',
      'favorite.title': '收藏',
      'favorite.empty': '暂无收藏车辆，去选几台喜欢的吧。',
      'favorite.clear': '清空收藏',
      'favorite.clearConfirm': '确定要清空收藏吗？',
      'service.appraisal': '车辆评估',
      'service.insurance': '保险办理',
      'service.maintenance': '维修保养',
      'service.finance': '金融方案',
      'hero.title': '探索未来之路',
      'hero.subtitle': '安心、省心，也更高效。<br>以专业甄选与一站式服务，帮你找到真正适合的座驾。',
      'hero.cta': '探索品牌展厅',
      'home.brandsTitle': '精选品牌',
      'home.brandsSubtitle': '根据品牌车标直达车型照片库',
      'home.brandLibraryPanelTitle': '按品牌浏览车型照片库',
      'home.brandLibraryPanelDesc': '每个品牌已整理至少 3 张车型照片，先看风格，再决定是否进入展厅继续看库存。',
      'home.brandLibraryPanelCta': '查看完整品牌库',
      'home.brandLibraryMeta': '已整理 {brands} 个品牌 / {models} 款车型',
      'home.brandLibraryCount': '{count} 款车型',
      'home.brandLibraryEnter': '进入品牌页',
      'home.newsTitle': '最新资讯',
      'home.newsSubtitle': '行业观察 · 新车入库 · 品牌动态',
      'brand.eyebrow': '精选品牌库',
      'brand.defaultTitle': '精选品牌',
      'brand.galleryEyebrow': '品牌照片库',
      'brand.gallerySubtitle': '已整理 {count} 张车型照片，可先浏览外观风格，再决定是否继续查看库存。',
      'brand.noStockMessage': '当前品牌暂无在库车辆，可先浏览上方车型照片。',
      'brand.showAll': '显示全部',
      'brand.resetSort': '恢复默认排序',
      'brand.sortLabel': '最新上架',
      'brand.totalPrice': '总价',
      'brand.basePrice': '车辆价格',
      'brand.year': '上牌年份',
      'brand.mileage': '行驶距离',
      'brand.engine': '排气量',
      'brand.inspection': '车检',
      'brand.repair': '修复历史',
      'brand.new': '新',
      'brand.old': '旧',
      'brand.low': '低',
      'brand.high': '高',
      'brand.yes': '有',
      'brand.no': '无',
      'search.makeModel': '品牌车型',
      'search.brand': '按品牌',
      'search.type': '车身类型',
      'search.price': '价格',
      'search.year': '上牌年份',
      'search.mileage': '行驶里程',
      'search.placeholder': '例如：法拉利 458',
      'search.cta': '搜索车源',
      'search.all': '不限',
      'search.resetTitle': '返回全部在库',
      'news.more': '了解详情',
      'footer.slogan': '专注高端汽车甄选与跨境服务，<br>为每一次购车决策提供更省心的体验。',
      'footer.newsletterTitle': '订阅资讯',
      'footer.newsletterPlaceholder': '输入邮箱地址',
      'footer.newsletterButton': '立即订阅',
      'footer.pages': '页面',
      'footer.phone': '联系电话',
      'footer.email': '联系邮箱',
      'footer.address': '联系地址',
      'footer.addressValue': '339-0035埼玉県さいたま市岩<br>槻区笹久保新田',
      'footer.copyright': '© 2026 TK168. 版权所有。',
      'footer.faq': '常见问题',
      'footer.shopTokyo': 'TK168东京店',
      'footer.shopOsaka': 'TK168大阪店',
      'footer.shopFukuoka': 'TK168福冈店',
      'footer.repair': '维修',
      'footer.care': '保养',
      'footer.inspection': '车检',
      'detail.specsTitle': '参数信息',
      'detail.overviewTitle': '车型概览',
      'detail.contactTitle': '联系顾问',
      'detail.benefitsTitle': '基本规格',
      'detail.featuresTitle': '核心亮点',
      'detail.staffTitle': '员工介绍',
      'detail.staffName': 'TK168 顾问团队',
      'detail.staffRole': '进口车顾问',
      'detail.staffBio': '专注高性能车型与跨境购车沟通，为来店看车、在库确认和方案建议提供更高效的支持。',
      'detail.staffLanguage': '支持中文 / 日文 / 英文',
      'detail.staffSupport': '支持视频看车与到店预约',
      'detail.featuredTitle': '在库推荐',
      'detail.moreInventory': '查看更多车源',
      'detail.backToResults': '返回筛选结果',
      'detail.call': '致电顾问',
      'detail.stockConfirm': '在库确认',
      'detail.storeVisit': '来店预约',
      'detail.lightbox': '车辆大图预览',
      'detail.closeLightbox': '关闭大图预览',
      'price.total': '总价',
      'price.base': '车辆价格',
      'price.baseLong': '车辆价格',
      'price.taxIncluded': '（含税）',
      'price.helpLabel': '查看价格说明',
      'price.modalClose': '关闭说明弹窗',
      'price.helpTotal': '总价（含税）是在车辆价格基础上，加上法定税费、登记等基础费用后的参考金额。',
      'price.helpBase': '车辆价格（含税）指车辆本身的销售价格，不包含延长保修、运输及个别追加服务费用。',
      'inventory.available': '现车',
      'cta.viewDetail': '进入详情',
      'inventory.emptyDefault': '暂无符合条件的在库车辆，敬请期待',
      'inventory.emptyFiltered': '未找到符合 {summary} 的在库车辆',
      'inventory.keywordSummary': '关键词“{keyword}”',
      'gallery.main': '整体',
      'gallery.front': '前脸',
      'gallery.rear': '车尾',
      'gallery.wheel': '车轮',
      'gallery.angle': '视角',
      'lang.switcher': '语言切换',
      'lang.zh': '中文',
      'lang.ja': '日本語',
      'lang.en': 'English'
    },
    ja: {
      'page.landingTitle': 'ホーム — TK168 Premium Automotive',
      'nav.landing': 'ホーム',
      'nav.home': '会社概要',
      'nav.inventory': 'ブランド展示',
      'nav.services': 'サービス',
      'nav.favorite': 'お気に入り',
      'nav.rental': 'レンタル',
      'nav.export': '自動車輸出',
      'nav.contact': 'お問い合わせ',
      'favorite.title': 'お気に入り',
      'favorite.empty': 'お気に入りの車両はまだありません。',
      'favorite.clear': 'お気に入りをクリア',
      'favorite.clearConfirm': 'お気に入りをすべて削除しますか？',
      'service.appraisal': '車両査定',
      'service.insurance': '保険手続き',
      'service.maintenance': '整備メンテナンス',
      'service.finance': 'ファイナンス',
      'hero.title': '未来への道を探る',
      'hero.subtitle': '安心感と効率を両立しながら、<br>理想の一台に出会うための上質な導線を整えます。',
      'hero.cta': 'ブランドを探索',
      'home.brandsTitle': '厳選ブランド',
      'home.brandsSubtitle': 'ブランドロゴから車種フォトライブラリへ直接アクセス',
      'home.brandLibraryPanelTitle': 'ブランド別に車種フォトを比較',
      'home.brandLibraryPanelDesc': '各ブランドごとに最低 3 枚の車種写真を整理し、先に雰囲気を見てから展示ページや在庫確認へ進めます。',
      'home.brandLibraryPanelCta': 'ブランドライブラリを見る',
      'home.brandLibraryMeta': '{brands} ブランド / {models} モデル写真を整理済み',
      'home.brandLibraryCount': '{count} モデル',
      'home.brandLibraryEnter': 'ブランドページへ',
      'home.newsTitle': '最新情報',
      'home.newsSubtitle': 'マーケット情報 ・ 新規入庫 ・ ブランドトピックス',
      'brand.eyebrow': 'セレクテッドブランド',
      'brand.defaultTitle': '厳選ブランド',
      'brand.galleryEyebrow': 'ブランドフォトライブラリ',
      'brand.gallerySubtitle': '{count} 枚の車種写真を整理済みです。外観の雰囲気を確認してから在庫ページへ進めます。',
      'brand.noStockMessage': '現在このブランドの在庫車両はありません。先に上のフォトライブラリをご覧ください。',
      'brand.showAll': 'すべて表示',
      'brand.resetSort': '元の並び順に戻す',
      'brand.sortLabel': '新着順',
      'brand.totalPrice': '支払総額',
      'brand.basePrice': '本体価格',
      'brand.year': '年式',
      'brand.mileage': '走行距離',
      'brand.engine': '排気量',
      'brand.inspection': '車検',
      'brand.repair': '修復歴',
      'brand.new': '新',
      'brand.old': '古',
      'brand.low': '安',
      'brand.high': '高',
      'brand.yes': '付',
      'brand.no': '無',
      'search.makeModel': 'メーカー車名',
      'search.brand': 'ブランド',
      'search.type': 'ボディタイプ',
      'search.price': '価格',
      'search.year': '年式',
      'search.mileage': '走行距離',
      'search.placeholder': '例: フェラーリ 458',
      'search.cta': '検索する',
      'search.all': '指定なし',
      'search.resetTitle': '全在庫へ戻る',
      'news.more': '詳細を見る',
      'footer.slogan': '上質な一台との出会いを、<br>越境サービスとともに丁寧にサポートします。',
      'footer.newsletterTitle': 'ニュースレター',
      'footer.newsletterPlaceholder': 'メールアドレスを入力',
      'footer.newsletterButton': '登録する',
      'footer.pages': 'ページ',
      'footer.phone': '電話番号',
      'footer.email': 'メール',
      'footer.address': '住所',
      'footer.addressValue': '339-0035埼玉県さいたま市岩<br>槻区笹久保新田',
      'footer.copyright': '© 2026 TK168. All rights reserved.',
      'footer.faq': 'よくある質問',
      'footer.shopTokyo': 'TK168東京店',
      'footer.shopOsaka': 'TK168大阪店',
      'footer.shopFukuoka': 'TK168福岡店',
      'footer.repair': '修理',
      'footer.care': 'メンテナンス',
      'footer.inspection': '車検',
      'detail.specsTitle': '車両情報',
      'detail.overviewTitle': '車両概要',
      'detail.contactTitle': 'お問い合わせ',
      'detail.benefitsTitle': '基本スペック',
      'detail.featuresTitle': '注目ポイント',
      'detail.staffTitle': 'スタッフ紹介',
      'detail.staffName': 'TK168 セールスチーム',
      'detail.staffRole': '輸入車アドバイザー',
      'detail.staffBio': 'スーパーカーとハイパフォーマンスモデルを中心に、在庫案内から来店相談まで丁寧にサポートします。',
      'detail.staffLanguage': '中国語・日本語・英語対応',
      'detail.staffSupport': 'オンライン案内・来店予約に対応',
      'detail.featuredTitle': 'おすすめ在庫',
      'detail.moreInventory': '在庫をもっと見る',
      'detail.backToResults': '検索結果へ戻る',
      'detail.call': 'お電話で相談',
      'detail.stockConfirm': '在庫確認',
      'detail.storeVisit': '来店予約',
      'detail.lightbox': '車両画像プレビュー',
      'detail.closeLightbox': '画像プレビューを閉じる',
      'price.total': '支払総額',
      'price.base': '車両本体価格',
      'price.baseLong': '車両本体価格',
      'price.taxIncluded': '（税込）',
      'price.helpLabel': '価格の説明を見る',
      'price.modalClose': '説明ポップアップを閉じる',
      'price.helpTotal': '支払総額（税込）は、車両本体価格に法定費用や登録などの基本費用を含めた参考金額です。',
      'price.helpBase': '車両本体価格（税込）は、車両本体のみの価格で、延長保証や輸送、個別追加サービス費用は含みません。',
      'inventory.available': '在庫あり',
      'cta.viewDetail': '詳細を見る',
      'inventory.emptyDefault': '条件に合う在庫車両は現在ありません',
      'inventory.emptyFiltered': '{summary} に該当する在庫車両は見つかりませんでした',
      'inventory.keywordSummary': 'キーワード「{keyword}」',
      'gallery.main': '全体',
      'gallery.front': 'フロント',
      'gallery.rear': 'リア',
      'gallery.wheel': 'ホイール',
      'gallery.angle': 'ビュー',
      'lang.switcher': '言語切替',
      'lang.zh': '中文',
      'lang.ja': '日本語',
      'lang.en': 'English'
    },
    en: {
      'page.landingTitle': 'Home — TK168 Premium Automotive',
      'nav.landing': 'Home',
      'nav.home': 'About',
      'nav.inventory': 'Brand Gallery',
      'nav.services': 'Services',
      'nav.favorite': 'Favorites',
      'nav.rental': 'Rental',
      'nav.export': 'Auto Export',
      'nav.contact': 'Contact',
      'favorite.title': 'Favorites',
      'favorite.empty': 'No saved vehicles yet. Pick a few and come back.',
      'favorite.clear': 'Clear favorites',
      'favorite.clearConfirm': 'Clear all saved vehicles?',
      'service.appraisal': 'Vehicle appraisal',
      'service.insurance': 'Insurance support',
      'service.maintenance': 'Maintenance',
      'service.finance': 'Finance plan',
      'hero.title': 'Find the right next car',
      'hero.subtitle': 'Calm, efficient, and easier to trust.<br>We connect careful selection with one clear service line.',
      'hero.cta': 'Explore brands',
      'home.brandsTitle': 'Selected Brands',
      'home.brandsSubtitle': 'Jump from the logo directly into each model photo library',
      'home.brandLibraryPanelTitle': 'Browse model photo libraries by brand',
      'home.brandLibraryPanelDesc': 'Each brand keeps at least three model photos ready, so you can compare the look first and open the gallery or stock page after.',
      'home.brandLibraryPanelCta': 'Open full brand library',
      'home.brandLibraryMeta': '{brands} brands / {models} model photo sets prepared',
      'home.brandLibraryCount': '{count} models',
      'home.brandLibraryEnter': 'Open brand page',
      'home.newsTitle': 'Latest News',
      'home.newsSubtitle': 'Market notes · New arrivals · Brand updates',
      'brand.eyebrow': 'Selected Brands',
      'brand.defaultTitle': 'Selected Brands',
      'brand.galleryEyebrow': 'Brand Photo Library',
      'brand.gallerySubtitle': '{count} model photos prepared. Check the exterior style first, then continue to stock if needed.',
      'brand.noStockMessage': 'No stock vehicles for this brand right now. You can still browse the photo library above.',
      'brand.showAll': 'Show all',
      'brand.resetSort': 'Reset order',
      'brand.sortLabel': 'Newest',
      'brand.totalPrice': 'Total price',
      'brand.basePrice': 'Base price',
      'brand.year': 'Year',
      'brand.mileage': 'Mileage',
      'brand.engine': 'Engine',
      'brand.inspection': 'Inspection',
      'brand.repair': 'Repair history',
      'brand.new': 'New',
      'brand.old': 'Old',
      'brand.low': 'Low',
      'brand.high': 'High',
      'brand.yes': 'Yes',
      'brand.no': 'No',
      'search.makeModel': 'Make / Model',
      'search.brand': 'Brand',
      'search.type': 'Body type',
      'search.price': 'Price',
      'search.year': 'Year',
      'search.mileage': 'Mileage',
      'search.placeholder': 'e.g. Ferrari 458',
      'search.cta': 'Search stock',
      'search.all': 'All',
      'search.resetTitle': 'Back to all stock',
      'news.more': 'Learn more',
      'footer.slogan': 'Carefully selected premium cars and cross-border support,<br>built into one calmer buying experience.',
      'footer.newsletterTitle': 'Newsletter',
      'footer.newsletterPlaceholder': 'Enter your email',
      'footer.newsletterButton': 'Subscribe',
      'footer.pages': 'Pages',
      'footer.phone': 'Phone',
      'footer.email': 'Email',
      'footer.address': 'Address',
      'footer.addressValue': '339-0035 Iwatsuki-ku, Saitama-shi, Saitama<br>Sasakubo Shinden',
      'footer.copyright': '© 2026 TK168. All rights reserved.',
      'footer.faq': 'FAQ',
      'footer.shopTokyo': 'TK168 Tokyo',
      'footer.shopOsaka': 'TK168 Osaka',
      'footer.shopFukuoka': 'TK168 Fukuoka',
      'footer.repair': 'Repair',
      'footer.care': 'Maintenance',
      'footer.inspection': 'Inspection',
      'detail.specsTitle': 'Specifications',
      'detail.overviewTitle': 'Overview',
      'detail.contactTitle': 'Contact',
      'detail.benefitsTitle': 'Basic Specs',
      'detail.featuresTitle': 'Highlights',
      'detail.staffTitle': 'Advisor',
      'detail.staffName': 'TK168 Advisory Team',
      'detail.staffRole': 'Imported car advisor',
      'detail.staffBio': 'Focused on performance vehicles and cross-border purchase support, from showroom visits to stock confirmation and proposal guidance.',
      'detail.staffLanguage': 'Chinese / Japanese / English support',
      'detail.staffSupport': 'Video viewing and store booking available',
      'detail.featuredTitle': 'Recommended Stock',
      'detail.moreInventory': 'View more stock',
      'detail.backToResults': 'Back to results',
      'detail.call': 'Call advisor',
      'detail.stockConfirm': 'Confirm stock',
      'detail.storeVisit': 'Book a visit',
      'detail.lightbox': 'Vehicle image preview',
      'detail.closeLightbox': 'Close image preview',
      'price.total': 'Total price',
      'price.base': 'Base price',
      'price.baseLong': 'Vehicle base price',
      'price.taxIncluded': '(tax incl.)',
      'price.helpLabel': 'Price guide',
      'price.modalClose': 'Close guide',
      'price.helpTotal': 'Total price (tax included) is a reference amount that combines the vehicle price with registration and standard statutory costs.',
      'price.helpBase': 'Vehicle base price (tax included) refers to the vehicle itself and does not include optional warranty, transport, or extra service charges.',
      'inventory.available': 'In stock',
      'cta.viewDetail': 'View details',
      'inventory.emptyDefault': 'No vehicles match this view right now',
      'inventory.emptyFiltered': 'No stock vehicles matched {summary}',
      'inventory.keywordSummary': 'keyword "{keyword}"',
      'gallery.main': 'Main',
      'gallery.front': 'Front',
      'gallery.rear': 'Rear',
      'gallery.wheel': 'Wheel',
      'gallery.angle': 'Angle',
      'lang.switcher': 'Language',
      'lang.zh': '中文',
      'lang.ja': '日本語',
      'lang.en': 'English'
    }
  };

  let currentLanguage = DEFAULT_LANGUAGE;

  function interpolate(template, params = {}) {
    return Object.entries(params).reduce((result, [key, value]) => (
      result.replaceAll(`{${key}}`, value)
    ), template);
  }

  function readStoredLanguage() {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return SUPPORTED_LANGUAGES.has(stored) ? stored : DEFAULT_LANGUAGE;
    } catch {
      return DEFAULT_LANGUAGE;
    }
  }

  function writeStoredLanguage(language) {
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Ignore storage failures.
    }
  }

  function t(key, params = {}, language = currentLanguage) {
    const catalog = messages[language] || messages[DEFAULT_LANGUAGE];
    const fallbackCatalog = messages[DEFAULT_LANGUAGE];
    const template = catalog[key] || fallbackCatalog[key] || key;
    return interpolate(template, params);
  }

  function getLanguage() {
    return currentLanguage;
  }

  function getLanguageShortLabel(language = currentLanguage) {
    if (language === 'en') return 'EN';
    if (language === 'zh') return 'ZH';
    return 'JA';
  }

  function closeAllSwitchers() {
    document.querySelectorAll('[data-lang-switcher].is-open').forEach((switcher) => {
      switcher.classList.remove('is-open');
      switcher.querySelector('[data-lang-trigger]')?.setAttribute('aria-expanded', 'false');
    });
  }

  function updateSwitchers() {
    document.querySelectorAll('[data-lang-switcher]').forEach((switcher) => {
      switcher.dataset.currentLang = currentLanguage;
      const trigger = switcher.querySelector('[data-lang-trigger]');
      const currentLabel = switcher.querySelector('[data-lang-current-label]');
      if (trigger) {
        trigger.setAttribute('aria-label', t('lang.switcher'));
        trigger.setAttribute('title', t('lang.switcher'));
      }
      if (currentLabel) currentLabel.textContent = getLanguageShortLabel(currentLanguage);
      switcher.querySelectorAll('[data-lang-option]').forEach((option) => {
        const isActive = option.dataset.langOption === currentLanguage;
        option.classList.toggle('is-active', isActive);
        option.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    });
  }

  function fitCompactNewsletterTitle(root = document) {
    const needsCompactTitle = currentLanguage === 'ja' || currentLanguage === 'en';
    root.querySelectorAll('.footer-newsletter h4[data-i18n="footer.newsletterTitle"]').forEach((title) => {
      title.style.whiteSpace = 'nowrap';
      title.style.fontSize = '';
      title.style.letterSpacing = '';
      if (!needsCompactTitle) return;

      const block = title.closest('.footer-newsletter');
      if (!block) return;

      const rawTarget = window.getComputedStyle(block).getPropertyValue('--footer-newsletter-btn-width').trim();
      let targetWidth = Number.parseFloat(rawTarget);
      if (!Number.isFinite(targetWidth) || targetWidth <= 0) {
        const btn = block.querySelector('.footer-btn');
        targetWidth = btn ? btn.getBoundingClientRect().width : title.getBoundingClientRect().width;
      }

      title.style.letterSpacing = '0px';
      const text = (title.textContent || '').replace(/\s+/g, '');
      const glyphCount = Array.from(text).length;
      if (glyphCount <= 1 || !Number.isFinite(targetWidth) || targetWidth <= 0) return;

      const contentWidth = title.getBoundingClientRect().width;
      if (!Number.isFinite(contentWidth) || contentWidth <= 0) return;

      if (currentLanguage === 'en') {
        title.style.fontSize = '16px';
      }

      const adjustedWidth = title.getBoundingClientRect().width;
      if (!Number.isFinite(adjustedWidth) || adjustedWidth <= 0) return;

      // Measure-to-fit: match title visual width to button width without overflow.
      const spacingPx = Math.max(0, Math.min(7, (targetWidth - adjustedWidth) / (glyphCount - 1)));
      title.style.letterSpacing = `${spacingPx}px`;
    });
  }

  function syncDocumentTitle(root = document) {
    if (root !== document) return;
    const titleKey = document.body?.dataset.i18nPageTitle;
    if (!titleKey) return;
    document.title = t(titleKey);
  }

  function applyTranslations(root = document) {
    root.querySelectorAll('[data-i18n]').forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });

    root.querySelectorAll('[data-i18n-html]').forEach((element) => {
      element.innerHTML = t(element.dataset.i18nHtml);
    });

    root.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
      element.setAttribute('placeholder', t(element.dataset.i18nPlaceholder));
    });

    root.querySelectorAll('[data-i18n-title]').forEach((element) => {
      element.setAttribute('title', t(element.dataset.i18nTitle));
    });

    root.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
      element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
    });

    document.documentElement.lang = currentLanguage === 'en'
      ? 'en'
      : (currentLanguage === 'zh' ? 'zh-CN' : 'ja');
    syncDocumentTitle(root);
    updateSwitchers();
    fitCompactNewsletterTitle(root);
  }

  function setLanguage(language) {
    const nextLanguage = SUPPORTED_LANGUAGES.has(language) ? language : DEFAULT_LANGUAGE;
    if (nextLanguage === currentLanguage) return;
    currentLanguage = nextLanguage;
    writeStoredLanguage(currentLanguage);
    applyTranslations(document);
    window.dispatchEvent(new CustomEvent('tk168:languagechange', {
      detail: { language: currentLanguage }
    }));
  }

  function bindSwitchers() {
    document.querySelectorAll('[data-lang-switcher]').forEach((switcher) => {
      if (switcher.dataset.langBound === '1') return;
      switcher.dataset.langBound = '1';

      const trigger = switcher.querySelector('[data-lang-trigger]');
      const options = switcher.querySelectorAll('[data-lang-option]');

      trigger?.addEventListener('click', (event) => {
        event.stopPropagation();
        const willOpen = !switcher.classList.contains('is-open');
        closeAllSwitchers();
        if (!willOpen) return;
        switcher.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      });

      options.forEach((option) => {
        option.addEventListener('click', (event) => {
          event.stopPropagation();
          const nextLanguage = option.dataset.langOption || DEFAULT_LANGUAGE;
          closeAllSwitchers();
          setLanguage(nextLanguage);
        });
      });

      switcher.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        closeAllSwitchers();
        trigger?.focus();
      });
    });

    document.addEventListener('click', () => {
      closeAllSwitchers();
    });
  }

  function init() {
    applyTranslations(document);
    bindSwitchers();
    let rafId = 0;
    window.addEventListener('resize', () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => fitCompactNewsletterTitle(document));
    });
  }

  currentLanguage = readStoredLanguage();

  return {
    init,
    t,
    getLanguage,
    setLanguage,
    applyTranslations
  };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.TK168I18N.init(), { once: true });
} else {
  window.TK168I18N.init();
}
