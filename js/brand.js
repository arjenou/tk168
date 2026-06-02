const {
  brands,
  vehicles,
  getBrandLabel,
  buildDetailUrl
} = window.TK168_DATA;

window.TK168CommonLinks?.applyCommonLinks();
const brandNavNarrowViewport = window.matchMedia('(max-width: 480px)');
const brandNavTabletViewport = window.matchMedia('(max-width: 1100px)');
let brandNavSuppressClickUntil = 0;
const fullBrandNavCatalog = Array.isArray(window.TK168BrandLogoInventory?.items) && window.TK168BrandLogoInventory.items.length
  ? [...window.TK168BrandLogoInventory.items]
  : (Array.isArray(brands) ? [...brands] : []);
const FULL_BRAND_NAV_ORDER = fullBrandNavCatalog.map((brand) => brand.key);

const normalizeBrandToken = (value = '') => String(value || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
const BRAND_FOCUS_ALIAS_MAP = Object.freeze({
  rollsroyce: 'rolls-royce',
  mercedesbenz: 'mercedes'
});
const BRAND_NAV_THEME_MAP = Object.freeze({
  'rolls-royce': Object.freeze({ bgStart: '#d8d7d2', bgMid: '#ebe9e4', bgEnd: '#d8d5cf' }),
  bentley: Object.freeze({ bgStart: '#d7e3dc', bgMid: '#eef4f0', bgEnd: '#d7e4de' }),
  mercedes: Object.freeze({ bgStart: '#dce5f5', bgMid: '#eff4fb', bgEnd: '#d8e1f2' }),
  bmw: Object.freeze({ bgStart: '#d8e2f1', bgMid: '#eef3fb', bgEnd: '#d7e3f5' }),
  porsche: Object.freeze({ bgStart: '#eadfce', bgMid: '#f6ede4', bgEnd: '#e6d8c6' }),
  ferrari: Object.freeze({ bgStart: '#f2ddd6', bgMid: '#faf0eb', bgEnd: '#efd4cc' }),
  lamborghini: Object.freeze({ bgStart: '#ece6cd', bgMid: '#f7f3e1', bgEnd: '#e6dfc0' }),
  audi: Object.freeze({ bgStart: '#e1e4e8', bgMid: '#f5f6f8', bgEnd: '#dde2e8' }),
  lexus: Object.freeze({ bgStart: '#ede5dc', bgMid: '#f7f2ed', bgEnd: '#e7ddd4' }),
  landrover: Object.freeze({ bgStart: '#dde8dd', bgMid: '#eef5ee', bgEnd: '#d8e5d7' }),
  maserati: Object.freeze({ bgStart: '#f1e0d7', bgMid: '#fbf0ea', bgEnd: '#edd7cc' }),
  mclaren: Object.freeze({ bgStart: '#e2e6e7', bgMid: '#f3f6f6', bgEnd: '#dde1e3' }),
  astonmartin: Object.freeze({ bgStart: '#dde7e2', bgMid: '#eff5f1', bgEnd: '#d7e3dc' }),
  jaguar: Object.freeze({ bgStart: '#e8dde1', bgMid: '#f7eff2', bgEnd: '#e4d7dc' }),
  cadillac: Object.freeze({ bgStart: '#dce4f2', bgMid: '#eef4fb', bgEnd: '#d7e0ef' })
});
const fullBrandKeyByToken = new Map(
  FULL_BRAND_NAV_ORDER.map((key) => [normalizeBrandToken(key), key])
);

function hexToRgba(hex, alpha) {
  const value = String(hex || '').replace('#', '');
  const normalized = value.length === 3
    ? value.split('').map((char) => char + char).join('')
    : value;
  const number = Number.parseInt(normalized, 16);
  const r = (number >> 16) & 255;
  const g = (number >> 8) & 255;
  const b = number & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function applyBrandNavTheme(node, brandKey) {
  const theme = BRAND_NAV_THEME_MAP[brandKey];
  if (!node) return;
  const accentVars = [
    '--bn-chip-accent-start',
    '--bn-chip-accent-mid',
    '--bn-chip-accent-end',
    '--bn-chip-accent-core'
  ];
  if (!theme) {
    accentVars.forEach((token) => node.style.removeProperty(token));
    return;
  }
  node.style.setProperty('--bn-chip-accent-start', hexToRgba(theme.bgStart, 0.58));
  node.style.setProperty('--bn-chip-accent-mid', hexToRgba(theme.bgMid, 0.4));
  node.style.setProperty('--bn-chip-accent-end', hexToRgba(theme.bgEnd, 0.5));
  node.style.setProperty('--bn-chip-accent-core', hexToRgba(theme.bgMid, 0.28));
}

function resolveFocusBrandKey(rawFocusBrand = '') {
  const token = normalizeBrandToken(rawFocusBrand);
  if (!token) return '';
  const aliased = BRAND_FOCUS_ALIAS_MAP[token] || token;
  return fullBrandKeyByToken.get(normalizeBrandToken(aliased)) || '';
}

function normalizeInventoryPageKey(pathname = '') {
  const leaf = String(pathname || '').split('/').pop() || '';
  return leaf.replace(/\.html$/i, '').toLowerCase();
}

function inventoryPagesMatch(pathA, pathB) {
  return normalizeInventoryPageKey(pathA) === normalizeInventoryPageKey(pathB);
}

const initialUrlParams = new URLSearchParams(window.location.search);
let focusBrandKey = resolveFocusBrandKey(initialUrlParams.get('focusBrand') || '');

const BRAND_VEHICLE_BATCH = 30;
let visibleVehicleLimit = 0;

function resetBrandVehicleVisibleLimit() {
  visibleVehicleLimit = Math.min(BRAND_VEHICLE_BATCH, sourceVehicles.length);
}
const inventoryContext = window.TK168InventoryContext.createInventoryContext(window.location.search, vehicles);
const currentBrand = inventoryContext.currentBrand;
if (!focusBrandKey && currentBrand?.key) {
  focusBrandKey = currentBrand.key;
}
let sourceVehicles = [];

let brandHeroPreviewKey = '';
let brandHeroTitleFxTimer = 0;
const brandVehicleGrid = document.getElementById('vehicleGrid');

const canonicalInventoryUrl = inventoryContext.canonicalInventoryUrl;
const canonicalInventoryTarget = new URL(canonicalInventoryUrl, window.location.href);
if (focusBrandKey) {
  canonicalInventoryTarget.searchParams.set('focusBrand', focusBrandKey);
} else {
  canonicalInventoryTarget.searchParams.delete('focusBrand');
}
const canonicalInventoryPathAndQuery = `${canonicalInventoryTarget.pathname.split('/').pop()}${canonicalInventoryTarget.search}`;
if (`${window.location.pathname.split('/').pop()}${window.location.search}` !== canonicalInventoryPathAndQuery) {
  window.history.replaceState({}, '', canonicalInventoryPathAndQuery);
}

function recomputeSourceVehicles() {
  const filters = window.TK168_DATA.parseInventoryFilters(window.location.search);
  const params = new URLSearchParams(window.location.search);
  const fb = resolveFocusBrandKey(params.get('focusBrand') || '');
  const b = filters.brand ? resolveFocusBrandKey(filters.brand) : '';
  focusBrandKey = fb || b || '';
  const effectiveFilters = { ...filters };
  if (focusBrandKey && !effectiveFilters.brand) {
    effectiveFilters.brand = focusBrandKey;
  }
  sourceVehicles = window.TK168_DATA.filterVehicles(vehicles, effectiveFilters);
}

recomputeSourceVehicles();
resetBrandVehicleVisibleLimit();

const inventoryHrefForChrome = `${window.location.pathname.split('/').pop()}${window.location.search}`;
window.TK168PageChrome?.applyPageChrome({
  pageKey: 'inventory',
  inventoryHref: inventoryHrefForChrome
});

function getBrandHeroDefaultTitle() {
  return window.TK168I18N?.t('brand.defaultTitle') || '厳選ブランド';
}

function getBrandNavItemByKey(key) {
  if (!key) return null;
  return fullBrandNavCatalog.find((brand) => brand.key === key) || null;
}

function getPinnedBrandKey() {
  const filters = window.TK168_DATA.parseInventoryFilters(window.location.search);
  const params = new URLSearchParams(window.location.search);
  const fb = resolveFocusBrandKey(params.get('focusBrand') || '');
  const b = filters.brand ? resolveFocusBrandKey(filters.brand) : '';
  return fb || b || '';
}

function finishBrandNavClientUpdate() {
  const inventoryPathAndQuery = `${window.location.pathname.split('/').pop()}${window.location.search}`;
  window.TK168PageChrome?.applyPageChrome({
    pageKey: 'inventory',
    inventoryHref: inventoryPathAndQuery
  });
  resetBrandVehicleVisibleLimit();
  setBrandHeroPreview('');
  syncBrandHeader();
  buildBrandNav();
  renderPage();
}

function navigateBrandWithoutReload(brandKey) {
  const resolved = resolveFocusBrandKey(brandKey);
  if (!resolved) return;
  const href = buildBrandNavHref(brandKey);
  const u = new URL(href, window.location.href);
  if (!inventoryPagesMatch(u.pathname, window.location.pathname)) return;
  window.history.pushState({}, '', `${u.pathname}${u.search}`);
  recomputeSourceVehicles();
  finishBrandNavClientUpdate();
}

function navigateClearBrandFilterWithoutReload() {
  const href = buildBrandNavHref('');
  const u = new URL(href, window.location.href);
  if (!inventoryPagesMatch(u.pathname, window.location.pathname)) return;
  window.history.pushState({}, '', `${u.pathname}${u.search}`);
  recomputeSourceVehicles();
  finishBrandNavClientUpdate();
}

function getOrderedBrandNavCatalog() {
  return fullBrandNavCatalog;
}

function getBrandNavDisplayLabel(brand) {
  return brand?.labelEn || getBrandLabel(brand);
}

function getBrandNavLabelSizeClass(brand) {
  const label = getBrandNavDisplayLabel(brand);
  if (label.length >= 14) return ' is-tighter';
  if (label.length >= 11) return ' is-tight';
  return '';
}

function buildBrandNavHref(brandKey) {
  const cur = window.TK168_DATA.parseInventoryFilters(window.location.search);
  const raw = String(brandKey ?? '').trim();
  const resolved = raw ? resolveFocusBrandKey(brandKey) : '';
  const next = { ...cur, brand: resolved || '' };
  const pathAndQuery = window.TK168_DATA.buildInventoryUrl(next);
  const u = new URL(pathAndQuery, window.location.href);
  if (resolved) {
    u.searchParams.set('focusBrand', resolved);
  } else {
    u.searchParams.delete('focusBrand');
  }
  return `${u.pathname.split('/').pop()}${u.search}`;
}

function buildBrandLandingHref(brandKey) {
  return buildBrandNavHref(brandKey);
}

function bindBrandNavThumbInteractions(node) {
  if (!node || node.dataset.bound === '1') return;
  node.dataset.bound = '1';

  node.addEventListener('pointerenter', () => {
    if (node.dataset.brandKey) setBrandHeroPreview(node.dataset.brandKey);
  });

  node.addEventListener('pointerleave', () => {
    setBrandHeroPreview('');
  });

  node.addEventListener('focus', () => {
    if (node.dataset.brandKey) setBrandHeroPreview(node.dataset.brandKey);
  });

  node.addEventListener('blur', () => {
    setBrandHeroPreview('');
  });

  node.addEventListener('click', (event) => {
    if (Date.now() < brandNavSuppressClickUntil) {
      event.preventDefault();
      return;
    }
    const brandKey = node.dataset.brandKey;
    if (!brandKey) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.button !== 0) return;

    const nextUrl = new URL(buildBrandLandingHref(brandKey), window.location.href);
    const currentUrl = new URL(window.location.href);
    if (!inventoryPagesMatch(nextUrl.pathname, currentUrl.pathname)) return;

    const resolved = resolveFocusBrandKey(brandKey);
    const pinned = getPinnedBrandKey();
    if (resolved && pinned === resolved) {
      event.preventDefault();
      navigateClearBrandFilterWithoutReload();
      return;
    }

    event.preventDefault();
    navigateBrandWithoutReload(brandKey);
  });
}

function updateBrandNavThumb(node, brand, slotIndex) {
  if (!node || !brand) return;

  const pinnedKey = getPinnedBrandKey();
  const isCurrentOrFocused = Boolean(pinnedKey && brand.key === pinnedKey);

  node.className = `bn-thumb${isCurrentOrFocused ? ' is-active' : ''}`;
  node.href = buildBrandLandingHref(brand.key);
  node.dataset.brandKey = brand.key;
  node.setAttribute('aria-label', getBrandLabel(brand));
  node.title = getBrandLabel(brand);
  node.style.setProperty('--bn-i', String(slotIndex + 1));
  if (isCurrentOrFocused) {
    node.setAttribute('aria-current', 'true');
  } else {
    node.removeAttribute('aria-current');
  }

  node.innerHTML = `
    <span class="bn-thumb__logo-wrap" aria-hidden="true">
      <img class="bn-thumb__logo" src="assets/images/brands/logos/${brand.file}" alt="">
    </span>
    <span class="bn-thumb__label${getBrandNavLabelSizeClass(brand)}">${getBrandNavDisplayLabel(brand)}</span>
  `;

  applyBrandNavTheme(node, brand.key);
  bindBrandNavThumbInteractions(node);
}

function pulseBrandHeroTitle() {
  const title = document.getElementById('brandHeroTitle');
  if (!title) return;
  title.classList.remove('is-name-swap');
  // Trigger a tiny reflow so the class animation can replay for each brand switch.
  void title.offsetWidth;
  title.classList.add('is-name-swap');
  if (brandHeroTitleFxTimer) clearTimeout(brandHeroTitleFxTimer);
  brandHeroTitleFxTimer = window.setTimeout(() => {
    title.classList.remove('is-name-swap');
    brandHeroTitleFxTimer = 0;
  }, 340);
}

function setBrandHeroPreview(previewKey = '') {
  const nextPreviewKey = String(previewKey || '');
  if (brandHeroPreviewKey === nextPreviewKey) return;
  brandHeroPreviewKey = nextPreviewKey;
  syncBrandHeader();
  pulseBrandHeroTitle();
}

function updateBrandNavLayout() {
  const track = document.getElementById('bnGrid');
  if (!track) return;
  const styles = getComputedStyle(track);
  const gap = parseFloat(styles.columnGap || styles.gap) || 12;
  const minCard = parseFloat(styles.getPropertyValue('--bn-card-min')) || 128;
  const width = track.clientWidth;
  if (width <= 0) return;
  const count = Math.max(2, Math.floor((width + gap) / (minCard + gap)));
  track.style.setProperty('--bn-visible-count', String(count));
}

function scrollActiveBrandNavIntoView({ smooth = true } = {}) {
  const grid = document.getElementById('bnGrid');
  if (!grid) return;
  const active = grid.querySelector('.bn-thumb.is-active');
  if (!active) return;
  active.scrollIntoView({
    behavior: smooth ? 'smooth' : 'auto',
    inline: 'start',
    block: 'nearest'
  });
}

function bindBrandNavTrackGestures() {
  const track = document.getElementById('bnGrid');
  if (!track || track.dataset.swipeBound === '1') return;
  track.dataset.swipeBound = '1';

  let pointerId = null;
  let startX = 0;
  let startScrollLeft = 0;
  let dragging = false;
  let didScroll = false;

  track.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startScrollLeft = track.scrollLeft;
    dragging = false;
    didScroll = false;
  });

  track.addEventListener('pointermove', (event) => {
    if (event.pointerId !== pointerId) return;
    const deltaX = event.clientX - startX;
    if (!dragging && Math.abs(deltaX) > 10) {
      dragging = true;
      didScroll = true;
      track.classList.add('is-dragging');
      track.setPointerCapture?.(event.pointerId);
    }
    if (!dragging) return;
    event.preventDefault();
    track.scrollLeft = startScrollLeft - deltaX;
  });

  const finishPointer = (event) => {
    if (event.pointerId !== pointerId) return;
    if (didScroll) {
      brandNavSuppressClickUntil = Date.now() + 280;
    }
    pointerId = null;
    dragging = false;
    didScroll = false;
    track.classList.remove('is-dragging');
    if (track.hasPointerCapture?.(event.pointerId)) {
      track.releasePointerCapture?.(event.pointerId);
    }
  };

  track.addEventListener('pointerup', finishPointer);
  track.addEventListener('pointercancel', finishPointer);
}

function buildBrandNav() {
  const grid = document.getElementById('bnGrid');
  const prevButton = document.getElementById('bnPrev');
  const nextButton = document.getElementById('bnNext');
  if (!grid) return;

  const orderedCatalog = getOrderedBrandNavCatalog();
  const total = orderedCatalog.length;

  if (prevButton) prevButton.hidden = true;
  if (nextButton) nextButton.hidden = true;

  while (grid.children.length < total) {
    const thumb = document.createElement('a');
    bindBrandNavThumbInteractions(thumb);
    grid.appendChild(thumb);
  }

  while (grid.children.length > total) {
    grid.removeChild(grid.lastElementChild);
  }

  orderedCatalog.forEach((brand, index) => {
    updateBrandNavThumb(grid.children[index], brand, index);
  });

  updateBrandNavLayout();
  scrollActiveBrandNavIntoView({ smooth: false });
}

function syncBrandHeader() {
  const title = document.getElementById('brandHeroTitle');
  const pinnedKey = getPinnedBrandKey();
  const selectedBrand = pinnedKey ? getBrandNavItemByKey(pinnedKey) : null;
  const currentBrandLabel = selectedBrand
    ? getBrandLabel(selectedBrand)
    : getBrandHeroDefaultTitle();

  const previewBrand = getBrandNavItemByKey(brandHeroPreviewKey);
  const heroDisplayBrand = previewBrand || selectedBrand || null;
  const heroDisplayLabel = heroDisplayBrand ? getBrandLabel(heroDisplayBrand) : getBrandHeroDefaultTitle();
  const language = getCompareLanguage();
  const countLabel = language === 'en'
    ? `${sourceVehicles.length} vehicles`
    : (language === 'zh' ? `${sourceVehicles.length} 辆` : `${sourceVehicles.length}台`);

  document.title = `${currentBrandLabel} · ${countLabel} — TK168 Premium Automotive`;
  if (title) {
    title.textContent = heroDisplayLabel;
    if (heroDisplayBrand) {
      title.style.setProperty('view-transition-name', `brand-label-${heroDisplayBrand.key}`);
    } else {
      title.style.removeProperty('view-transition-name');
    }
  }
}

function buildCardHTML(v) {
  return window.TK168Renderers.buildInventoryCardHTML(
    v,
    buildDetailUrl(v.id, window.TK168_DATA.parseInventoryFilters(window.location.search))
  );
}

function createBrandVehicleCardElement(v, staggerIndex) {
  const card = document.createElement('div');
  card.className = 'v-card';
  card.style.transitionDelay = `${(staggerIndex % BRAND_VEHICLE_BATCH) * 0.07}s`;
  card.innerHTML = buildCardHTML(v);
  card.querySelectorAll('img').forEach((image) => {
    image.loading = 'lazy';
    image.decoding = 'async';
    image.setAttribute('fetchpriority', 'low');
  });
  normalizeVehicleMetaSubtitle(card);
  applyMiniBrandIcon(card, v);
  return card;
}

function appendBrandVehicleCards(fromIdx, toIdx) {
  const grid = brandVehicleGrid;
  if (!grid) return;
  const slice = sourceVehicles.slice(fromIdx, toIdx);
  slice.forEach((v, i) => {
    const card = createBrandVehicleCardElement(v, fromIdx + i);
    grid.appendChild(card);
    requestAnimationFrame(() => card.classList.add('visible'));
  });
  window.TK168CommonLinks?.enhanceClickableCards(grid);
  window.TK168Renderers?.bindVehicleCardLikes?.(grid);
  window.TK168Renderers?.bindVehicleCardCoverSkeletons?.(grid);
}

function getBrandLoadMoreLabel() {
  return window.TK168I18N?.t('brand.loadMore')
    || (getCompareLanguage() === 'zh'
      ? '加载更多'
      : (getCompareLanguage() === 'en' ? 'Load more' : 'もっと見る'));
}

function updateBrandLoadMoreUi() {
  const wrap = document.getElementById('brandVehicleLoadMoreWrap');
  const btn = document.getElementById('brandVehicleLoadMore');
  if (!wrap || !btn) return;
  const pinnedEmpty = Boolean(getPinnedBrandKey()) && sourceVehicles.length === 0;
  const canLoadMore = sourceVehicles.length > visibleVehicleLimit;
  wrap.hidden = pinnedEmpty || !sourceVehicles.length || !canLoadMore;
  const label = getBrandLoadMoreLabel();
  btn.textContent = label;
  btn.setAttribute('aria-label', label);
}

function normalizeVehicleMetaSubtitle(card) {
  const subtitle = card.querySelector('.v-card-meta');
  if (!subtitle) return;
  const rawText = String(subtitle.textContent || '').trim();
  if (!rawText) return;

  const parts = rawText
    .split(/[·•|丨路]/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 3) {
    subtitle.textContent = `${parts[0]} · ${parts[1]}`;
    return;
  }

  subtitle.textContent = rawText
    .replace(/\s*(在庫あり|现车|在庫|available)\s*$/i, '')
    .replace(/[·•|丨路]\s*$/, '')
    .trim();
}

function applyMiniBrandIcon(card, vehicle) {
  const wrap = card.querySelector('.v-brand-icon-wrap');
  const img = wrap?.querySelector('img.v-brand-icon');
  if (!wrap || !img) return;

  wrap.classList.add('v-mini-brand-badge');
  img.classList.add('v-mini-brand-glyph');
}

function getCompareLanguage() {
  const language = window.TK168I18N?.getLanguage?.();
  if (language === 'zh' || language === 'ja' || language === 'en') return language;
  const docLang = document.documentElement.lang?.toLowerCase() || '';
  if (docLang.startsWith('en')) return 'en';
  if (docLang.startsWith('zh')) return 'zh';
  return 'ja';
}

function renderPage() {
  const grid = brandVehicleGrid;
  if (!grid) return;

  if (visibleVehicleLimit > sourceVehicles.length) {
    visibleVehicleLimit = sourceVehicles.length;
  }
  if (sourceVehicles.length > 0 && sourceVehicles.length <= BRAND_VEHICLE_BATCH) {
    visibleVehicleLimit = sourceVehicles.length;
  }

  // 数据尚未到达（既无缓存又无 API 回包）：直接渲染骨架卡，避免空白状态闪烁。
  const dataPoolEmpty = !Array.isArray(vehicles) || vehicles.length === 0;
  if (dataPoolEmpty && !Array.isArray(window.TK168_API_VEHICLES)) {
    delete grid.dataset.mobilePaged;
    const placeholder = 8;
    window.TK168Renderers?.renderVehicleSkeletons?.(grid, placeholder);
    updateBrandLoadMoreUi();
    return;
  }

  // Fade out existing cards
  const existing = grid.querySelectorAll('.v-card');
  existing.forEach(c => { c.style.opacity = '0'; c.style.transform = 'translateY(16px)'; });

  setTimeout(() => {
    grid.innerHTML = '';
    delete grid.dataset.mobilePaged;

    if (!sourceVehicles.length) {
      const emptyState = document.createElement('div');
      emptyState.className = 'bn-empty';

      const icon = document.createElement('span');
      icon.textContent = '🔍';
      emptyState.appendChild(icon);

      const urlFilterCount = window.TK168_DATA.countActiveFilters(
        window.TK168_DATA.parseInventoryFilters(window.location.search)
      );

      const emptyMessage = urlFilterCount > 0
        ? (window.TK168I18N?.t('inventory.emptyAfterFilter')
          || (getCompareLanguage() === 'en'
            ? 'No vehicles match your current filters. Try widening them or reset.'
            : (getCompareLanguage() === 'ja'
              ? '現在の絞り込み条件に一致する在庫車がありません。条件を変更するかリセットしてください。'
              : '当前筛选条件下暂无在库车辆，可尝试放宽或重置条件。')))
        : ((Boolean(getPinnedBrandKey()) && sourceVehicles.length === 0)
          ? (window.TK168I18N?.t('brand.noStockMessage')
            || (getCompareLanguage() === 'ja'
              ? '現在このブランドの在庫車両はありません。先に上のフォトライブラリをご覧ください。'
              : '当前品牌暂无在库车辆，可先浏览上方车型照片。'))
          : (window.TK168I18N?.t('inventory.emptyDefault') || '暂无符合条件的在库车辆，敬请期待'));

      // Use text node to avoid rendering any untrusted URL parameter as HTML.
      emptyState.appendChild(document.createTextNode(emptyMessage));
      grid.replaceChildren(emptyState);

      updateBrandLoadMoreUi();
      return;
    }

    grid.scrollLeft = 0;

    const slice = sourceVehicles.slice(0, visibleVehicleLimit);
    slice.forEach((v, i) => {
      const card = createBrandVehicleCardElement(v, i);
      grid.appendChild(card);

      requestAnimationFrame(() => {
        card.classList.add('visible');
      });
    });

    window.TK168CommonLinks?.enhanceClickableCards(grid);
    window.TK168Renderers?.bindVehicleCardLikes?.(grid);
    window.TK168Renderers?.bindVehicleCardCoverSkeletons?.(grid);
    updateBrandLoadMoreUi();
  }, existing.length ? 220 : 0);
}

function handleBrandNavViewportChange() {
  updateBrandNavLayout();
  buildBrandNav();
}

function bindBrandNavLayoutObserver() {
  const track = document.getElementById('bnGrid');
  if (!track || track.dataset.layoutObserved === '1') return;
  track.dataset.layoutObserved = '1';
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(() => {
      updateBrandNavLayout();
    });
    observer.observe(track);
  }
  window.addEventListener('resize', updateBrandNavLayout, { passive: true });
}

bindBrandNavTrackGestures();
bindBrandNavLayoutObserver();
updateBrandNavLayout();

if (typeof brandNavNarrowViewport.addEventListener === 'function') {
  brandNavNarrowViewport.addEventListener('change', handleBrandNavViewportChange);
  brandNavTabletViewport.addEventListener('change', handleBrandNavViewportChange);
} else if (typeof brandNavNarrowViewport.addListener === 'function') {
  // Safari fallback
  brandNavNarrowViewport.addListener(handleBrandNavViewportChange);
  brandNavTabletViewport.addListener(handleBrandNavViewportChange);
}

syncBrandHeader();
buildBrandNav();
(function bindBrandVehicleLoadMore() {
  const btn = document.getElementById('brandVehicleLoadMore');
  if (!btn || btn.dataset.bound === '1') return;
  btn.dataset.bound = '1';
  btn.addEventListener('click', () => {
    const prev = visibleVehicleLimit;
    visibleVehicleLimit = Math.min(sourceVehicles.length, visibleVehicleLimit + BRAND_VEHICLE_BATCH);
    if (visibleVehicleLimit <= prev) return;
    appendBrandVehicleCards(prev, visibleVehicleLimit);
    updateBrandLoadMoreUi();
  });
})();
renderPage();

window.addEventListener('tk168:languagechange', () => {
  setBrandHeroPreview('');
  syncBrandHeader();
  buildBrandNav();
  renderPage();
});

window.addEventListener('popstate', () => {
  recomputeSourceVehicles();
  finishBrandNavClientUpdate();
});

// 当首次进入页面时缓存为空（展示了骨架卡），等到 API 把车辆数据回灌后重新加载
// 一次以让模块作用域内的 inventoryContext / sourceVehicles 重新构建。仅在确实需要时
// （没有缓存导致页面初始为空）触发，避免有缓存的访客被打扰。
(() => {
  const cameInEmpty = !Array.isArray(vehicles) || vehicles.length === 0;
  if (!cameInEmpty) return;
  let consumed = false;
  document.addEventListener('tk168:data-updated', (event) => {
    if (consumed) return;
    if (!event?.detail?.vehicles) return;
    consumed = true;
    window.location.reload();
  });
})();
