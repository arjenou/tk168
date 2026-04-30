// Isolated homepage brand carousel without showroom linkage.
(function () {
  const shell = document.querySelector('#brands [data-carousel]');
  const stage = document.querySelector('#brands [data-stage]');
  const gestureLayer = document.querySelector('#brands [data-gesture]');
  const thumbs = document.querySelector('#brands [data-thumbs]');
  const prevButton = document.querySelector('#brands [data-nav="prev"]');
  const nextButton = document.querySelector('#brands [data-nav="next"]');
  const swipeHint = document.querySelector('#brands [data-swipe-hint]');
  const swipeHintText = swipeHint?.querySelector('.lisboa-mobile-swipe-hint__text');
  /** 手机：奇数个槽位，当前选中项居中，配合循环取模轮播 */
  const MOBILE_VISIBLE_THUMBS = 5;

  if (!shell || !stage || !thumbs) return;

  const AUTOPLAY_INTERVAL = 2000;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const LEXUS_MARK_PATH = 'M 84.704167,22.970199 C 86.764955,23.027247 86.545978,24.475396 86.205112,24.974648 C 80.12338,34.435632 65.753144,51.09449 55.289759,69.37193 C 53.557436,72.333426 52.267318,74.512206 52.267318,77.762127 C 52.267318,82.168229 55.017987,87.377599 60.543774,89.613072 C 64.178853,91.069371 66.467121,91.114017 70.39027,91.170709 C 99.516608,92.071418 111.19322,91.28445 137.25637,90.40004 C 138.76157,90.395788 140.16117,89.381694 140.66432,88.769056 C 145.70326,83.51504 148.60806,74.070001 148.60806,65.736497 C 148.60806,47.175238 135.23987,30.45579 114.3861,22.414609 L 111.03909,26.706971 C 129.31653,34.261301 138.76157,49.349766 138.76157,65.509371 C 138.76157,69.144804 138.14468,72.666143 137.02889,76.02945 C 136.20153,78.374765 135.18318,79.721576 132.22133,79.766222 C 110.98204,80.220473 98.956766,80.55319 77.660782,79.993347 C 74.91401,79.936655 74.025703,78.934607 73.579246,76.759726 C 73.23838,75.469607 73.522554,74.398466 74.411215,72.779883 C 85.706215,52.77012 105.38326,29.899845 109.24582,24.475396 C 109.97999,23.473349 109.63523,21.452955 107.11558,20.783625 C 99.743734,18.604845 91.47153,17.720436 83.08523,17.720436 C 45.114444,17.874569 18.333067,39.231144 17.716531,65.736497 C 19.238027,97.552914 46.90346,113.98429 83.08523,113.98429 C 105.22523,113.98429 125.50676,106.15784 137.37401,93.747048 L 126.41137,94.189253 C 116.28885,103.19209 100.07255,108.0039 83.300309,108.0039 C 52.729719,108.0039 27.839051,92.801694 27.839051,65.509371 C 27.839051,42.034963 52.725467,22.913506 83.300309,22.913506 C 83.300309,22.913506 84.704167,22.970199 84.704167,22.970199 z';
  const HERO_ADJUSTMENTS = {
    'rolls-royce': { scale: 1.02, y: '0.42rem' },
    bentley: { scale: 0.86, y: '1.02rem' },
    mercedes: { scale: 0.95, y: '0.2rem' },
    bmw: { scale: 0.96, y: '0.12rem' },
    porsche: { scale: 0.9, y: '0.2rem' },
    ferrari: { scale: 0.96, y: '0.24rem' },
    lamborghini: { scale: 0.92, y: '0.18rem' },
    audi: { scale: 0.9, y: '0.05rem' },
    lexus: { scale: 0.96, y: '0.12rem' },
    'land-rover': { scale: 0.9, y: '0.1rem' },
    maserati: { scale: 0.96, y: '0.18rem' },
    'aston-martin': { scale: 0.86, y: '1.5rem' },
    mclaren: { scale: 0.92, y: '0.1rem' },
    jaguar: { scale: 0.74, y: '0.08rem' },
    cadillac: { scale: 0.96, y: '0.12rem' }
  };
  const UI_COPY = {
    zh: {
      prev: '上一张',
      next: '下一张',
      thumbs: '品牌缩略图列表',
      swipe: '左右滑动',
      thumbAria: (name) => `切换到 ${name}`
    },
    ja: {
      prev: '前へ',
      next: '次へ',
      thumbs: 'ブランド一覧',
      swipe: '左右にスワイプ',
      thumbAria: (name) => `${name} に切り替え`
    },
    en: {
      prev: 'Previous',
      next: 'Next',
      thumbs: 'Brand thumbnails',
      swipe: 'Swipe left or right',
      thumbAria: (name) => `Switch to ${name}`
    }
  };
  const slides = [
    {
      id: 'rolls-royce',
      assetKey: 'rollsroyce',
      name: 'Rolls-Royce',
      country: { zh: '英国', ja: 'イギリス', en: 'United Kingdom' },
      story: { zh: '以极致静谧与定制豪华著称，是超豪华轿车领域的标杆品牌。', ja: '静粛性とビスポークの頂点に立つ、ウルトララグジュアリーの象徴。', en: 'Known for near-silent comfort and bespoke luxury, it remains a benchmark for ultra-luxury sedans.' },
      theme: {
        bgStart: '#d8d7d2',
        bgMid: '#ebe9e4',
        bgEnd: '#d8d5cf',
        glowA: 'rgba(228, 232, 238, 0.36)',
        glowB: 'rgba(255, 225, 192, 0.14)',
        glowC: 'rgba(255, 255, 255, 0.12)',
        tileStart: 'rgba(252, 252, 250, 0.92)',
        tileEnd: 'rgba(224, 224, 220, 0.42)'
      }
    },
    {
      id: 'bentley',
      assetKey: 'bentley',
      name: 'Bentley',
      country: { zh: '英国', ja: 'イギリス', en: 'United Kingdom' },
      story: { zh: '将英式手工豪华与长途 GT 性能结合，风格沉稳而有力量。', ja: '英国の手仕事とGT性能を融合した、重厚で品格あるブランド。', en: 'Blending British craftsmanship with long-distance GT performance, it feels composed, solid, and powerful.' },
      theme: {
        bgStart: '#d7e3dc',
        bgMid: '#eef4f0',
        bgEnd: '#d7e4de',
        glowA: 'rgba(214, 241, 231, 0.26)',
        glowB: 'rgba(255, 224, 187, 0.12)',
        glowC: 'rgba(255, 255, 255, 0.1)',
        tileStart: 'rgba(247, 251, 247, 0.9)',
        tileEnd: 'rgba(201, 233, 222, 0.42)'
      }
    },
    {
      id: 'mercedes',
      assetKey: 'mercedes',
      name: 'Mercedes-Benz',
      country: { zh: '德国', ja: 'ドイツ', en: 'Germany' },
      story: { zh: '以豪华、安全与工程标准见长，长期引领高端轿车审美。', ja: '安全とラグジュアリーの両面で、プレミアムセダンを牽引する存在。', en: 'Strong in luxury, safety, and engineering discipline, it has long shaped the premium sedan standard.' },
      theme: {
        bgStart: '#dce5f5',
        bgMid: '#eff4fb',
        bgEnd: '#d8e1f2',
        glowA: 'rgba(164, 196, 255, 0.3)',
        glowB: 'rgba(255, 206, 147, 0.18)',
        glowC: 'rgba(255, 255, 255, 0.12)',
        tileStart: 'rgba(246, 249, 255, 0.92)',
        tileEnd: 'rgba(196, 216, 255, 0.48)'
      }
    },
    {
      id: 'bmw',
      assetKey: 'bmw',
      name: 'BMW',
      country: { zh: '德国', ja: 'ドイツ', en: 'Germany' },
      story: { zh: '兼顾驾驶乐趣与豪华质感，在运动型豪华车市场拥有极高认知度。', ja: '駆けぬける歓びを軸に、スポーツ性と高級感を両立した代表格。', en: 'Balancing driving pleasure with premium refinement, it stays highly recognizable in performance luxury.' },
      theme: {
        bgStart: '#d8e2f1',
        bgMid: '#eef3fb',
        bgEnd: '#d7e3f5',
        glowA: 'rgba(170, 210, 255, 0.28)',
        glowB: 'rgba(255, 255, 255, 0.14)',
        glowC: 'rgba(133, 164, 226, 0.12)',
        tileStart: 'rgba(246, 250, 255, 0.92)',
        tileEnd: 'rgba(204, 221, 246, 0.44)'
      }
    },
    {
      id: 'porsche',
      assetKey: 'porsche',
      name: 'Porsche',
      country: { zh: '德国', ja: 'ドイツ', en: 'Germany' },
      story: { zh: '赛道基因深厚，操控反馈直接，跑车与高性能 SUV 都极具辨识度。', ja: 'モータースポーツ由来の切れ味ある操縦性で、SUVまで強い個性を持つ。', en: 'With deep motorsport roots and precise feedback, its sports cars and performance SUVs are instantly recognizable.' },
      theme: {
        bgStart: '#eadfce',
        bgMid: '#f6ede4',
        bgEnd: '#e6d8c6',
        glowA: 'rgba(255, 245, 218, 0.3)',
        glowB: 'rgba(116, 63, 26, 0.14)',
        glowC: 'rgba(255, 255, 255, 0.12)',
        tileStart: 'rgba(255, 251, 245, 0.9)',
        tileEnd: 'rgba(245, 223, 206, 0.46)'
      }
    },
    {
      id: 'ferrari',
      assetKey: 'ferrari',
      name: 'Ferrari',
      country: { zh: '意大利', ja: 'イタリア', en: 'Italy' },
      story: { zh: '以赛道血统与高转速声浪闻名，是意式性能美学的象征。', ja: '情熱的なデザインと高回転サウンドで、イタリアンスーパーカーを象徴する。', en: 'Famous for racing heritage and high-rev drama, it stands as an icon of Italian performance design.' },
      theme: {
        bgStart: '#f2ddd6',
        bgMid: '#faf0eb',
        bgEnd: '#efd4cc',
        glowA: 'rgba(255, 228, 166, 0.2)',
        glowB: 'rgba(255, 255, 255, 0.12)',
        glowC: 'rgba(255, 114, 88, 0.12)',
        tileStart: 'rgba(255, 248, 236, 0.9)',
        tileEnd: 'rgba(255, 214, 184, 0.42)'
      }
    },
    {
      id: 'lamborghini',
      assetKey: 'lamborghini',
      name: 'Lamborghini',
      country: { zh: '意大利', ja: 'イタリア', en: 'Italy' },
      story: { zh: '锋利线条与强烈存在感并存，主打极致视觉冲击与大排量性能。', ja: '鋭い造形と強烈な存在感で、視覚的インパクトと大排気量を体現する。', en: 'Sharp surfaces and strong presence define a brand built for visual drama and big-displacement performance.' },
      theme: {
        bgStart: '#ece6cd',
        bgMid: '#f7f3e1',
        bgEnd: '#e6dfc0',
        glowA: 'rgba(255, 240, 179, 0.22)',
        glowB: 'rgba(255, 255, 255, 0.1)',
        glowC: 'rgba(210, 182, 95, 0.12)',
        tileStart: 'rgba(255, 251, 239, 0.9)',
        tileEnd: 'rgba(241, 222, 171, 0.42)'
      }
    },
    {
      id: 'audi',
      assetKey: 'audi',
      name: 'Audi',
      country: { zh: '德国', ja: 'ドイツ', en: 'Germany' },
      story: { zh: '以科技感、灯光语言与德系精密制造建立了强烈品牌识别度。', ja: '先進的な灯火表現と精密な仕立てで、強いテック感を持つブランド。', en: 'Recognizable for its technical character, lighting design, and precise German execution.' },
      theme: {
        bgStart: '#e1e4e8',
        bgMid: '#f5f6f8',
        bgEnd: '#dde2e8',
        glowA: 'rgba(213, 221, 232, 0.28)',
        glowB: 'rgba(255, 227, 199, 0.1)',
        glowC: 'rgba(255, 255, 255, 0.1)',
        tileStart: 'rgba(251, 252, 253, 0.9)',
        tileEnd: 'rgba(220, 228, 238, 0.42)'
      }
    },
    {
      id: 'lexus',
      assetKey: 'lexus',
      name: 'Lexus',
      country: { zh: '日本', ja: '日本', en: 'Japan' },
      story: { zh: '擅长把静谧性、舒适性与东方克制审美结合到豪华车体验里。', ja: '静粛性と快適性に、東洋的な繊細さを重ねたプレミアムブランド。', en: 'Combining quiet comfort with restrained Japanese aesthetics, it delivers a refined luxury experience.' },
      theme: {
        bgStart: '#ede5dc',
        bgMid: '#f7f2ed',
        bgEnd: '#e7ddd4',
        glowA: 'rgba(232, 223, 214, 0.28)',
        glowB: 'rgba(255, 228, 205, 0.1)',
        glowC: 'rgba(255, 255, 255, 0.1)',
        tileStart: 'rgba(252, 248, 244, 0.92)',
        tileEnd: 'rgba(231, 220, 210, 0.42)'
      }
    },
    {
      id: 'land-rover',
      assetKey: 'landrover',
      name: 'Land Rover',
      country: { zh: '英国', ja: 'イギリス', en: 'United Kingdom' },
      story: { zh: '兼顾豪华与越野属性，在高端 SUV 领域始终拥有稳定号召力。', ja: 'ラグジュアリーと悪路走破性を両立し、上質なSUV像を築き続けている。', en: 'It pairs luxury with genuine off-road strength and keeps strong appeal in the premium SUV space.' },
      theme: {
        bgStart: '#dde8dd',
        bgMid: '#eef5ee',
        bgEnd: '#d8e5d7',
        glowA: 'rgba(207, 233, 210, 0.24)',
        glowB: 'rgba(255, 233, 208, 0.1)',
        glowC: 'rgba(255, 255, 255, 0.1)',
        tileStart: 'rgba(248, 251, 248, 0.92)',
        tileEnd: 'rgba(210, 229, 209, 0.42)'
      }
    },
    {
      id: 'maserati',
      assetKey: 'maserati',
      name: 'Maserati',
      country: { zh: '意大利', ja: 'イタリア', en: 'Italy' },
      story: { zh: '意式优雅与运动声浪兼具，适合追求个性化豪华体验的用户。', ja: 'イタリアらしい優雅さと官能的なサウンドで、個性派ラグジュアリーを体現。', en: 'Italian elegance and an emotional soundtrack make it fit buyers who want a more individual luxury feel.' },
      theme: {
        bgStart: '#dce4f2',
        bgMid: '#eef4fb',
        bgEnd: '#d7e0ef',
        glowA: 'rgba(142, 211, 255, 0.22)',
        glowB: 'rgba(255, 220, 167, 0.12)',
        glowC: 'rgba(255, 255, 255, 0.12)',
        tileStart: 'rgba(246, 250, 255, 0.9)',
        tileEnd: 'rgba(202, 226, 255, 0.42)'
      }
    },
    {
      id: 'aston-martin',
      assetKey: 'astonmartin',
      name: 'Aston Martin',
      country: { zh: '英国', ja: 'イギリス', en: 'United Kingdom' },
      story: { zh: '以英伦跑车比例与优雅 GT 气质闻名，兼具收藏感与戏剧性。', ja: '英国流の気品あるプロポーションで、GTらしい優雅さとドラマ性を持つ。', en: 'Known for elegant GT proportions and British sports-car character, with both collectability and drama.' },
      theme: {
        bgStart: '#dde7e2',
        bgMid: '#eff5f1',
        bgEnd: '#d7e3dc',
        glowA: 'rgba(213, 236, 225, 0.24)',
        glowB: 'rgba(255, 255, 255, 0.1)',
        glowC: 'rgba(166, 196, 181, 0.12)',
        tileStart: 'rgba(249, 252, 250, 0.92)',
        tileEnd: 'rgba(209, 228, 218, 0.42)'
      }
    },
    {
      id: 'mclaren',
      assetKey: 'mclaren',
      name: 'McLaren',
      country: { zh: '英国', ja: 'イギリス', en: 'United Kingdom' },
      story: { zh: '超跑气质鲜明，擅长用轻量化与空气动力学塑造未来感比例。', ja: '軽量化と空力を核に、未来的なプロポーションを見せるスーパーカーブランド。', en: 'A supercar brand that uses lightweight construction and aerodynamics to create a distinctly futuristic stance.' },
      theme: {
        bgStart: '#f1e0d7',
        bgMid: '#fbf0ea',
        bgEnd: '#edd7cc',
        glowA: 'rgba(255, 219, 191, 0.24)',
        glowB: 'rgba(255, 255, 255, 0.12)',
        glowC: 'rgba(255, 154, 104, 0.12)',
        tileStart: 'rgba(255, 249, 244, 0.92)',
        tileEnd: 'rgba(245, 217, 199, 0.42)'
      }
    },
    {
      id: 'jaguar',
      assetKey: 'jaguar',
      name: 'Jaguar',
      country: { zh: '英国', ja: 'イギリス', en: 'United Kingdom' },
      story: { zh: '强调速度感与雕塑感并存，是英式性能豪华的代表之一。', ja: 'スピード感と造形美を両立した、英国プレミアムスポーツの代表格。', en: 'It balances speed and sculptural form, representing a classic British take on performance luxury.' },
      theme: {
        bgStart: '#e2e6e7',
        bgMid: '#f3f6f6',
        bgEnd: '#dde1e3',
        glowA: 'rgba(212, 224, 225, 0.24)',
        glowB: 'rgba(255, 229, 203, 0.08)',
        glowC: 'rgba(255, 255, 255, 0.1)',
        tileStart: 'rgba(249, 251, 251, 0.92)',
        tileEnd: 'rgba(216, 223, 225, 0.4)'
      }
    },
    {
      id: 'cadillac',
      assetKey: 'cadillac',
      name: 'Cadillac',
      country: { zh: '美国', ja: 'アメリカ', en: 'United States' },
      story: { zh: '美系豪华代表，近年来在电动化与旗舰轿车上持续强化高级感。', ja: 'アメリカンラグジュアリーを代表し、近年はEVと旗艦感をさらに強めている。', en: 'A classic American luxury name that has recently strengthened its flagship and electrified presence.' },
      theme: {
        bgStart: '#e8dde1',
        bgMid: '#f7eff2',
        bgEnd: '#e4d7dc',
        glowA: 'rgba(229, 210, 217, 0.22)',
        glowB: 'rgba(255, 227, 203, 0.1)',
        glowC: 'rgba(255, 255, 255, 0.1)',
        tileStart: 'rgba(252, 248, 249, 0.92)',
        tileEnd: 'rgba(232, 214, 220, 0.42)'
      }
    }
  ];

  let activeIndex = 0;
  let previousIndex = 0;
  let isAnimating = false;
  let cleanupTimer = null;
  let autoplayVisible = false;
  let autoplayTimer = null;
  let resizeFrame = 0;
  let lastThumbLayoutMobile = window.matchMedia('(max-width: 48rem)').matches;
  const preloadedSlideAssets = new Set();
  const queuedSteps = [];
  const dragState = {
    pointerId: null,
    startX: 0,
    startY: 0,
    deltaX: 0,
    dragging: false
  };
  const thumbSwipeState = {
    tracking: false,
    dragging: false,
    startX: 0,
    startY: 0,
    deltaX: 0,
    suppressClickUntil: 0
  };

  function getLanguage() {
    return window.TK168I18N?.getLanguage?.() || 'ja';
  }

  function getUiCopy() {
    return UI_COPY[getLanguage()] || UI_COPY.ja || UI_COPY.zh;
  }

  function getLocalizedText(value, language = getLanguage()) {
    if (value && typeof value === 'object') {
      return value[language] || value.ja || value.zh || Object.values(value)[0] || '';
    }

    return value || '';
  }

  function getHeroLogo(item) {
    return `assets/images/brands/hero-png/${item.assetKey}.png`;
  }

  function getThumbLogo(item) {
    return `assets/images/brands/logos/${item.assetKey}.svg`;
  }

  function getFlagLogo(item) {
    return `assets/images/flags/ui/${getCountryCode(item)}.svg`;
  }

  function preloadSlideAsset(url) {
    if (!url || preloadedSlideAssets.has(url)) return;
    const image = new Image();
    image.decoding = 'async';
    image.src = url;
    preloadedSlideAssets.add(url);
  }

  function preloadCarouselAssets() {
    if (isMobileViewport()) {
      const active = slides[activeIndex];
      if (active) {
        preloadSlideAsset(getHeroLogo(active));
        preloadSlideAsset(getFlagLogo(active));
      }
      return;
    }
    slides.forEach((item) => {
      preloadSlideAsset(getHeroLogo(item));
      preloadSlideAsset(getFlagLogo(item));
    });
  }

  function getCountryCode(item) {
    if (item.id === 'rolls-royce' || item.id === 'bentley' || item.id === 'land-rover' || item.id === 'aston-martin' || item.id === 'mclaren' || item.id === 'jaguar') return 'gb';
    if (item.id === 'mercedes' || item.id === 'bmw' || item.id === 'porsche' || item.id === 'audi') return 'de';
    if (item.id === 'ferrari' || item.id === 'lamborghini' || item.id === 'maserati') return 'it';
    if (item.id === 'lexus') return 'jp';
    return 'us';
  }

  function hexToRgba(hex, alpha) {
    const value = hex.replace('#', '');
    const normalized = value.length === 3
      ? value.split('').map((char) => char + char).join('')
      : value;
    const number = Number.parseInt(normalized, 16);
    const r = (number >> 16) & 255;
    const g = (number >> 8) & 255;
    const b = number & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function isMobileViewport() {
    return window.matchMedia('(max-width: 48rem)').matches;
  }

  function applyShellCopy() {
    const copy = getUiCopy();

    if (prevButton) prevButton.setAttribute('aria-label', copy.prev);
    if (nextButton) nextButton.setAttribute('aria-label', copy.next);
    if (thumbs) thumbs.setAttribute('aria-label', copy.thumbs);
    if (swipeHintText) swipeHintText.textContent = copy.swipe;
  }

  function createSlide(item, index) {
    const language = getLanguage();
    const slide = document.createElement('article');
    const heroAdjust = HERO_ADJUSTMENTS[item.id] || {};
    slide.className = 'lisboa-slide';
    slide.dataset.slideId = item.id;
    slide.style.setProperty('--bg-start', item.theme.bgStart);
    slide.style.setProperty('--bg-mid', item.theme.bgMid);
    slide.style.setProperty('--bg-end', item.theme.bgEnd);
    slide.style.setProperty('--glow-a', item.theme.glowA);
    slide.style.setProperty('--glow-b', item.theme.glowB);
    slide.style.setProperty('--glow-c', item.theme.glowC);
    slide.style.setProperty('--tile-start', item.theme.tileStart);
    slide.style.setProperty('--tile-end', item.theme.tileEnd);
    slide.style.setProperty('--hero-logo-scale', String(heroAdjust.scale ?? 1));
    slide.style.setProperty('--hero-logo-y', heroAdjust.y ?? '0rem');
    slide.innerHTML = `
      <div class="lisboa-slide__bg"></div>
      <div class="lisboa-slide__grain"></div>
      <div class="lisboa-slide__hero" aria-hidden="true">
        <img
          class="lisboa-slide__hero-logo"
          src="${getHeroLogo(item)}"
          alt=""
          loading="${index === activeIndex ? 'eager' : 'lazy'}"
          fetchpriority="${index === activeIndex ? 'high' : 'low'}"
          decoding="async"
        >
      </div>
      <div class="lisboa-slide__copy">
        <div class="slide-panel-meta">
          <span class="slide-panel-flag" aria-hidden="true">
            <img class="slide-panel-flag-icon" src="${getFlagLogo(item)}" alt="" loading="lazy" decoding="async">
          </span>
          <p class="slide-panel-country">${getLocalizedText(item.country, language)}</p>
        </div>
        <h2 class="slide-panel-brand">${item.name}</h2>
        <p class="slide-panel-story">${getLocalizedText(item.story, language)}</p>
      </div>
    `;

    return slide;
  }

  function createThumb(item, index) {
    const copy = getUiCopy();
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'lisboa-thumb';
    button.dataset.index = String(index);
    button.dataset.brand = item.id;
    button.setAttribute('aria-label', copy.thumbAria(item.name));

    const logoMarkup = item.id === 'lexus'
      ? `
        <svg class="lisboa-thumb__logo lexus-mark" viewBox="16 16 134 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path d="${LEXUS_MARK_PATH}" fill="currentColor"></path>
        </svg>
      `
      : `<img class="lisboa-thumb__logo" src="${getThumbLogo(item)}" alt="" loading="lazy" decoding="async">`;

    button.innerHTML = `
      ${logoMarkup}
      <span class="lisboa-thumb__label">${item.name}</span>
    `;

    const label = button.querySelector('.lisboa-thumb__label');
    if (label) {
      if (item.name.length >= 13) {
        label.classList.add('is-tighter');
      } else if (item.name.length >= 10) {
        label.classList.add('is-tight');
      }
    }

    button.addEventListener('click', () => {
      if (Date.now() < thumbSwipeState.suppressClickUntil) return;
      setActive(index);
    });

    return button;
  }

  function getVisibleThumbIndexes() {
    const n = Math.min(MOBILE_VISIBLE_THUMBS, slides.length);
    if (slides.length <= n) {
      return slides.map((_, index) => index);
    }
    const half = Math.floor(n / 2);
    return Array.from({ length: n }, (_, i) => {
      const raw = activeIndex - half + i;
      return ((raw % slides.length) + slides.length) % slides.length;
    });
  }

  function renderThumbs() {
    shell.querySelectorAll('.lisboa-thumb--mobile').forEach((node) => node.remove());
    thumbs.innerHTML = '';

    if (isMobileViewport()) {
      const visibleIndexes = getVisibleThumbIndexes();
      visibleIndexes.forEach((index, slot) => {
        const thumb = createThumb(slides[index], index);
        thumb.classList.add('lisboa-thumb--mobile');
        thumb.style.setProperty('--mobile-thumb-slot', String(slot));
        shell.appendChild(thumb);
      });
      return;
    }

    slides.forEach((item, index) => {
      thumbs.appendChild(createThumb(item, index));
    });
  }

  function flushQueuedStep() {
    if (isAnimating || queuedSteps.length === 0) return;
    performStep(queuedSteps.shift());
  }

  function updateThumbState() {
    const thumbButtons = isMobileViewport()
      ? [...shell.querySelectorAll('.lisboa-thumb--mobile')]
      : [...thumbs.querySelectorAll('.lisboa-thumb')];

    thumbButtons.forEach((thumb) => {
      const thumbIndex = Number(thumb.dataset.index);
      const isActive = thumbIndex === activeIndex;
      thumb.classList.toggle('is-active', isActive);
      thumb.setAttribute('aria-pressed', String(isActive));
    });
  }

  function scrollActiveThumbIntoView() {
    if (isMobileViewport()) return;
    window.requestAnimationFrame(() => {
      const active = thumbs.querySelector(`.lisboa-thumb[data-index="${activeIndex}"]`);
      if (!active) return;
      const pad = 6;
      const cr = thumbs.getBoundingClientRect();
      const ar = active.getBoundingClientRect();
      if (ar.left >= cr.left + pad && ar.right <= cr.right - pad) {
        return;
      }
      active.scrollIntoView({
        block: 'nearest',
        inline: 'center',
        behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
      });
    });
  }

  function updateView(direction, immediate = false) {
    const nodes = [...stage.querySelectorAll('.lisboa-slide')];
    const activeNode = nodes[activeIndex];
    const previousNode = nodes[previousIndex];

    if (cleanupTimer) {
      window.clearTimeout(cleanupTimer);
      cleanupTimer = null;
    }

    nodes.forEach((node, index) => {
      node.className = 'lisboa-slide';
      if (immediate && index === activeIndex) {
        node.classList.add('is-active');
      }
    });

    if (!immediate && activeNode && previousNode && previousNode !== activeNode) {
      const enterClass = direction === 'right' ? 'is-enter-right' : 'is-enter-left';
      const exitClass = direction === 'right' ? 'is-exit-left' : 'is-exit-right';

      previousNode.className = `lisboa-slide ${exitClass}`;
      activeNode.className = `lisboa-slide ${enterClass} is-active`;

      cleanupTimer = window.setTimeout(() => {
        previousNode.className = 'lisboa-slide';
        activeNode.className = 'lisboa-slide is-active';
        isAnimating = false;
        flushQueuedStep();
      }, 620);
    } else {
      isAnimating = false;
    }

    if (isMobileViewport()) {
      renderThumbs();
    }
    updateThumbState();
    if (!isMobileViewport()) {
      scrollActiveThumbIntoView();
    }
  }

  function resetTransientState() {
    if (cleanupTimer) {
      window.clearTimeout(cleanupTimer);
      cleanupTimer = null;
    }

    queuedSteps.length = 0;
    isAnimating = false;
    dragState.pointerId = null;
    dragState.deltaX = 0;
    dragState.dragging = false;
    thumbSwipeState.tracking = false;
    thumbSwipeState.dragging = false;
    thumbSwipeState.deltaX = 0;
  }

  function render(immediate = true) {
    applyShellCopy();
    stage.innerHTML = '';

    slides.forEach((item, index) => {
      stage.appendChild(createSlide(item, index));
    });

    renderThumbs();
    previousIndex = activeIndex;
    updateView('right', immediate);
  }

  function setActive(nextIndex) {
    if (isAnimating || nextIndex === activeIndex) return;
    isAnimating = true;
    previousIndex = activeIndex;

    const forwardDistance = (nextIndex - activeIndex + slides.length) % slides.length;
    const backwardDistance = (activeIndex - nextIndex + slides.length) % slides.length;

    activeIndex = nextIndex;
    updateView(forwardDistance <= backwardDistance ? 'right' : 'left');
  }

  function performStep(offset) {
    if (isAnimating) return;
    isAnimating = true;
    previousIndex = activeIndex;
    activeIndex = (activeIndex + offset + slides.length) % slides.length;
    updateView(offset > 0 ? 'right' : 'left');
  }

  function step(offset) {
    const normalizedOffset = offset > 0 ? 1 : -1;

    if (isAnimating) {
      queuedSteps.push(normalizedOffset);
      return;
    }

    performStep(normalizedOffset);
  }

  function beginHeroDrag(id, clientX, clientY) {
    dragState.pointerId = id;
    dragState.startX = clientX;
    dragState.startY = clientY;
    dragState.deltaX = 0;
    dragState.dragging = false;
  }

  function moveHeroDrag(clientX, clientY) {
    const deltaX = clientX - dragState.startX;
    const deltaY = clientY - dragState.startY;

    if (!dragState.dragging) {
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 12) {
        dragState.pointerId = null;
        return 'cancel';
      }

      if (Math.abs(deltaX) < 10) {
        return 'pending';
      }

      dragState.dragging = true;
    }

    dragState.deltaX = deltaX;
    return 'dragging';
  }

  function endHeroDrag(cancelled = false) {
    const deltaX = dragState.deltaX;
    const shouldStep = !cancelled && dragState.dragging && Math.abs(deltaX) > 42;
    const direction = deltaX < 0 ? 1 : -1;

    dragState.pointerId = null;
    dragState.deltaX = 0;
    dragState.dragging = false;

    if (shouldStep) {
      step(direction);
    }
  }

  function handlePointerDown(event) {
    if (isAnimating) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    beginHeroDrag(event.pointerId, event.clientX, event.clientY);
    gestureLayer?.setPointerCapture?.(event.pointerId);
  }

  function handlePointerMove(event) {
    if (dragState.pointerId !== event.pointerId || isAnimating) return;
    moveHeroDrag(event.clientX, event.clientY);
  }

  function finishPointer(event, cancelled = false) {
    if (dragState.pointerId !== event.pointerId) return;

    gestureLayer?.releasePointerCapture?.(event.pointerId);
    endHeroDrag(cancelled);
  }

  function handleTouchStart(event) {
    if (isAnimating) return;

    const touch = event.touches[0];
    if (!touch) return;

    beginHeroDrag('touch', touch.clientX, touch.clientY);
  }

  function handleTouchMove(event) {
    if (dragState.pointerId !== 'touch' || isAnimating) return;

    const touch = event.touches[0];
    if (!touch) return;

    const status = moveHeroDrag(touch.clientX, touch.clientY);
    if (status === 'dragging') {
      event.preventDefault();
    }
  }

  function handleTouchEnd() {
    if (dragState.pointerId !== 'touch') return;
    endHeroDrag(false);
  }

  function handleTouchCancel() {
    if (dragState.pointerId !== 'touch') return;
    endHeroDrag(true);
  }

  function beginThumbSwipe(clientX, clientY) {
    thumbSwipeState.tracking = true;
    thumbSwipeState.dragging = false;
    thumbSwipeState.startX = clientX;
    thumbSwipeState.startY = clientY;
    thumbSwipeState.deltaX = 0;
  }

  function resetThumbSwipe() {
    thumbSwipeState.tracking = false;
    thumbSwipeState.dragging = false;
    thumbSwipeState.startX = 0;
    thumbSwipeState.startY = 0;
    thumbSwipeState.deltaX = 0;
  }

  function handleMobileThumbTouchStart(event) {
    if (!isMobileViewport() || isAnimating) return;
    if (!(event.target instanceof Element) || !event.target.closest('.lisboa-thumb--mobile')) return;

    const touch = event.touches[0];
    if (!touch) return;

    beginThumbSwipe(touch.clientX, touch.clientY);
  }

  function handleMobileThumbTouchMove(event) {
    if (!thumbSwipeState.tracking || !isMobileViewport()) return;

    const touch = event.touches[0];
    if (!touch) return;

    const deltaX = touch.clientX - thumbSwipeState.startX;
    const deltaY = touch.clientY - thumbSwipeState.startY;

    if (!thumbSwipeState.dragging) {
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
        resetThumbSwipe();
        return;
      }

      if (Math.abs(deltaX) < 8) {
        return;
      }

      thumbSwipeState.dragging = true;
    }

    thumbSwipeState.deltaX = deltaX;
    event.preventDefault();
  }

  function finishMobileThumbSwipe(cancelled = false) {
    if (!thumbSwipeState.tracking) return;

    const deltaX = thumbSwipeState.deltaX;
    const shouldStep = !cancelled && thumbSwipeState.dragging && Math.abs(deltaX) > 24;
    const direction = deltaX < 0 ? 1 : -1;

    if (shouldStep) {
      thumbSwipeState.suppressClickUntil = Date.now() + 320;
      step(direction);
    }

    resetThumbSwipe();
  }

  function handleThumbsWheel(event) {
    if (isMobileViewport()) return;

    let delta = 0;
    if (event.shiftKey) {
      delta = event.deltaY;
    } else if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      if (Math.abs(event.deltaX) < 8) return;
      delta = event.deltaX;
    } else {
      if (Math.abs(event.deltaY) < 8) return;
      delta = event.deltaY;
    }

    const maxLeft = Math.max(0, thumbs.scrollWidth - thumbs.clientWidth);
    const nextLeft = thumbs.scrollLeft + delta;
    const epsilon = 2;
    if (delta < 0 && thumbs.scrollLeft <= epsilon) {
      return;
    }
    if (delta > 0 && thumbs.scrollLeft >= maxLeft - epsilon) {
      return;
    }

    event.preventDefault();
    thumbs.scrollLeft = Math.min(maxLeft, Math.max(0, nextLeft));
  }

  function stopAutoplay() {
    if (!autoplayTimer) return;
    window.clearTimeout(autoplayTimer);
    autoplayTimer = null;
  }

  function shouldAutoplay() {
    return !prefersReducedMotion.matches && autoplayVisible && document.visibilityState === 'visible';
  }

  function queueAutoplayTick() {
    if (!shouldAutoplay()) {
      stopAutoplay();
      return;
    }

    stopAutoplay();
    autoplayTimer = window.setTimeout(() => {
      autoplayTimer = null;

      if (
        shouldAutoplay()
        && !isAnimating
        && !dragState.dragging
        && dragState.pointerId === null
        && !thumbSwipeState.tracking
        && !thumbSwipeState.dragging
      ) {
        performStep(1);
      }

      queueAutoplayTick();
    }, AUTOPLAY_INTERVAL);
  }

  function syncAutoplay() {
    if (shouldAutoplay()) {
      queueAutoplayTick();
      return;
    }

    stopAutoplay();
  }

  function observeCarouselVisibility() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        autoplayVisible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.35);
        syncAutoplay();
      }, {
        threshold: [0, 0.2, 0.35, 0.6]
      });

      observer.observe(shell);
      return;
    }

    autoplayVisible = true;
    syncAutoplay();
  }

  function handleKeydown(event) {
    const activeElement = document.activeElement;
    const isTextField = Boolean(
      activeElement
      && (activeElement.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(activeElement.tagName))
    );

    if (isTextField) return;
    if (!autoplayVisible && !shell.contains(activeElement)) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      step(-1);
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      step(1);
    }
  }

  function handleResize() {
    if (resizeFrame) {
      window.cancelAnimationFrame(resizeFrame);
    }

    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = 0;
      const nowMobile = isMobileViewport();
      if (nowMobile !== lastThumbLayoutMobile) {
        lastThumbLayoutMobile = nowMobile;
        renderThumbs();
      }
      updateView('right', true);
    });
  }

  function handleLanguageChange() {
    resetTransientState();
    render(true);
  }

  prevButton?.addEventListener('click', () => step(-1));
  nextButton?.addEventListener('click', () => step(1));
  gestureLayer?.addEventListener('pointerdown', handlePointerDown);
  gestureLayer?.addEventListener('pointermove', handlePointerMove);
  gestureLayer?.addEventListener('pointerup', (event) => finishPointer(event));
  gestureLayer?.addEventListener('pointercancel', (event) => finishPointer(event, true));
  gestureLayer?.addEventListener('touchstart', handleTouchStart, { passive: true });
  gestureLayer?.addEventListener('touchmove', handleTouchMove, { passive: false });
  gestureLayer?.addEventListener('touchend', handleTouchEnd, { passive: true });
  gestureLayer?.addEventListener('touchcancel', handleTouchCancel, { passive: true });
  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerup', (event) => finishPointer(event));
  window.addEventListener('pointercancel', (event) => finishPointer(event, true));
  window.addEventListener('touchend', handleTouchEnd, { passive: true });
  window.addEventListener('touchcancel', handleTouchCancel, { passive: true });
  shell.addEventListener('touchstart', handleMobileThumbTouchStart, { passive: true });
  shell.addEventListener('touchmove', handleMobileThumbTouchMove, { passive: false });
  shell.addEventListener('touchend', () => finishMobileThumbSwipe(false), { passive: true });
  shell.addEventListener('touchcancel', () => finishMobileThumbSwipe(true), { passive: true });
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('resize', handleResize);
  window.addEventListener('pagehide', stopAutoplay);
  thumbs.addEventListener('wheel', handleThumbsWheel, { passive: false });
  window.addEventListener('tk168:languagechange', handleLanguageChange);
  document.addEventListener('visibilitychange', syncAutoplay);
  prefersReducedMotion.addEventListener?.('change', syncAutoplay);

  preloadCarouselAssets();
  render(true);
  observeCarouselVisibility();
})();
