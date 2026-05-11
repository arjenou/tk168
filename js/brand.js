const {
  brands,
  vehicles,
  getBrandLabel,
  buildDetailUrl
} = window.TK168_DATA;

window.TK168CommonLinks?.applyCommonLinks();
const brandNavNarrowViewport = window.matchMedia('(max-width: 480px)');
const brandNavTabletViewport = window.matchMedia('(max-width: 1100px)');
let brandNavCycleIndex = 0;
const fullBrandNavCatalog = Array.isArray(window.TK168BrandLogoInventory?.items) && window.TK168BrandLogoInventory.items.length
  ? [...window.TK168BrandLogoInventory.items]
  : (Array.isArray(brands) ? [...brands] : []);
const FULL_BRAND_NAV_ORDER = fullBrandNavCatalog.map((brand) => brand.key);
const BRAND_NAV_VISIBLE_DESKTOP = 6;
const BRAND_NAV_VISIBLE_TABLET = 5;
const BRAND_NAV_VISIBLE_MOBILE = 4;

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

const initialUrlParams = new URLSearchParams(window.location.search);
let focusBrandKey = resolveFocusBrandKey(initialUrlParams.get('focusBrand') || '');

const ITEMS_PER_PAGE = 6;
const inventoryContext = window.TK168InventoryContext.createInventoryContext(window.location.search, vehicles);
const currentBrand = inventoryContext.currentBrand;
if (!focusBrandKey && currentBrand?.key) {
  focusBrandKey = currentBrand.key;
}
let sourceVehicles = [];

let currentPage = 0;
let brandHeroPreviewKey = '';
let brandHeroTitleFxTimer = 0;
const brandVehicleGrid = document.getElementById('vehicleGrid');
const brandVehicleSliderViewport = window.matchMedia('(max-width: 760px)');
const BRAND_VEHICLE_SLIDER_SHELL_ID = 'brandVehicleSliderShell';
const BRAND_VEHICLE_SLIDER_NAV_ID = 'brandVehicleSliderNav';
let brandVehicleSliderScrollFrame = 0;
let brandVehicleSliderResizeFrame = 0;
let brandVehicleSliderInteractionTimer = 0;
let brandVehicleRenderMode = brandVehicleSliderViewport.matches ? 'mobile' : 'desktop';

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
  sourceVehicles = window.TK168_DATA.filterVehicles(vehicles, filters);
}

recomputeSourceVehicles();

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

function getBrandNavVisibleCount() {
  if (brandNavNarrowViewport.matches) return BRAND_NAV_VISIBLE_MOBILE;
  if (brandNavTabletViewport.matches) return BRAND_NAV_VISIBLE_TABLET;
  return BRAND_NAV_VISIBLE_DESKTOP;
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
  currentPage = 0;
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
  if (u.pathname !== window.location.pathname) return;
  window.history.pushState({}, '', `${u.pathname}${u.search}`);
  recomputeSourceVehicles();
  finishBrandNavClientUpdate();
}

function navigateClearBrandFilterWithoutReload() {
  const href = buildBrandNavHref('');
  const u = new URL(href, window.location.href);
  if (u.pathname !== window.location.pathname) return;
  window.history.pushState({}, '', `${u.pathname}${u.search}`);
  recomputeSourceVehicles();
  finishBrandNavClientUpdate();
}

function getOrderedBrandNavCatalog() {
  return fullBrandNavCatalog;
}

function getBrandNavLoopSlice(orderedCatalog) {
  const total = orderedCatalog.length;
  if (!total) return [];
  const visibleCount = Math.min(getBrandNavVisibleCount(), total);
  const normalizedStart = ((brandNavCycleIndex % total) + total) % total;
  return Array.from({ length: visibleCount }, (_, offset) => {
    const catalogIndex = (normalizedStart + offset) % total;
    return {
      brand: orderedCatalog[catalogIndex],
      slotIndex: offset,
      catalogIndex
    };
  });
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
    const brandKey = node.dataset.brandKey;
    if (!brandKey) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.button !== 0) return;

    const nextUrl = new URL(buildBrandLandingHref(brandKey), window.location.href);
    const currentUrl = new URL(window.location.href);
    if (nextUrl.pathname !== currentUrl.pathname) return;

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

function buildBrandNav() {
  const grid = document.getElementById('bnGrid');
  const prevButton = document.getElementById('bnPrev');
  const nextButton = document.getElementById('bnNext');
  if (!grid) return;

  const orderedCatalog = getOrderedBrandNavCatalog();
  const visibleBrands = getBrandNavLoopSlice(orderedCatalog);
  const visibleCount = visibleBrands.length;
  const canCycle = orderedCatalog.length > visibleCount;

  grid.style.setProperty('--bn-visible-count', String(Math.max(visibleCount, 1)));
  if (prevButton) {
    prevButton.hidden = !canCycle;
    prevButton.disabled = !canCycle;
  }
  if (nextButton) {
    nextButton.hidden = !canCycle;
    nextButton.disabled = !canCycle;
  }

  while (grid.children.length < visibleCount) {
    const thumb = document.createElement('a');
    bindBrandNavThumbInteractions(thumb);
    grid.appendChild(thumb);
  }

  while (grid.children.length > visibleCount) {
    grid.removeChild(grid.lastElementChild);
  }

  visibleBrands.forEach(({ brand, slotIndex }, visibleIndex) => {
    const thumb = grid.children[visibleIndex];
    updateBrandNavThumb(thumb, brand, slotIndex);
  });
}

function shiftBrandNav(step) {
  const orderedCatalog = getOrderedBrandNavCatalog();
  const total = orderedCatalog.length;
  const visibleCount = Math.min(getBrandNavVisibleCount(), total);
  if (total <= visibleCount) return;
  brandNavCycleIndex = ((brandNavCycleIndex + step) % total + total) % total;
  setBrandHeroPreview('');
  buildBrandNav();
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

function ensureBrandVehicleSliderShell() {
  if (!brandVehicleGrid) return null;

  const existingShell = document.getElementById(BRAND_VEHICLE_SLIDER_SHELL_ID);
  if (existingShell) return existingShell;

  const parent = brandVehicleGrid.parentElement;
  if (!parent) return null;

  const shell = document.createElement('div');
  shell.id = BRAND_VEHICLE_SLIDER_SHELL_ID;
  shell.className = 'vehicle-slider-shell';
  parent.insertBefore(shell, brandVehicleGrid);
  shell.appendChild(brandVehicleGrid);
  return shell;
}

function getBrandVehicleCards() {
  if (!brandVehicleGrid) return [];
  return Array.from(brandVehicleGrid.querySelectorAll('.v-card'));
}

function isBrandVehicleMobileView() {
  return brandVehicleSliderViewport.matches;
}

function getBrandVehicleLeadIndex() {
  return brandVehicleRenderMode === 'mobile'
    ? currentPage
    : currentPage * ITEMS_PER_PAGE;
}

function getBrandVehicleSliderNav() {
  return document.getElementById(BRAND_VEHICLE_SLIDER_NAV_ID);
}

function markBrandVehicleSliderInteraction() {
  const nav = getBrandVehicleSliderNav();
  if (!nav || !brandVehicleSliderViewport.matches) return;

  nav.classList.add('is-engaged');
  if (brandVehicleSliderInteractionTimer) {
    clearTimeout(brandVehicleSliderInteractionTimer);
  }
  brandVehicleSliderInteractionTimer = window.setTimeout(() => {
    nav.classList.remove('is-engaged');
    brandVehicleSliderInteractionTimer = 0;
  }, 1200);
}

function getClosestBrandVehicleCardIndex() {
  const cards = getBrandVehicleCards();
  if (!brandVehicleGrid || !cards.length) return 0;

  const viewportCenter = brandVehicleGrid.scrollLeft + (brandVehicleGrid.clientWidth / 2);
  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  cards.forEach((card, index) => {
    const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
    const distance = Math.abs(cardCenter - viewportCenter);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  return nearestIndex;
}

function scrollToBrandVehicleCard(index, behavior = 'smooth') {
  const cards = getBrandVehicleCards();
  if (!cards.length) return;

  const clampedIndex = Math.max(0, Math.min(cards.length - 1, index));
  cards[clampedIndex].scrollIntoView({
    behavior,
    block: 'nearest',
    inline: 'start'
  });
}

function updateBrandVehicleSliderNavState() {
  const nav = getBrandVehicleSliderNav();
  if (!nav) return;

  const prev = nav.querySelector('[data-brand-vehicle-nav="prev"]');
  const next = nav.querySelector('[data-brand-vehicle-nav="next"]');
  if (!prev || !next) return;

  const cards = getBrandVehicleCards();
  const canSlide = brandVehicleSliderViewport.matches && cards.length > 1;
  nav.classList.toggle('is-visible', canSlide);
  nav.setAttribute('aria-hidden', canSlide ? 'false' : 'true');

  const dotsWrap = nav.querySelector('.vehicle-slider-dots');
  if (!dotsWrap) return;

  if (!canSlide) {
    prev.disabled = true;
    next.disabled = true;
    return;
  }

  const index = getClosestBrandVehicleCardIndex();
  prev.disabled = index <= 0;
  next.disabled = index >= cards.length - 1;
  window.TK168Renderers?.renderPaginationDots?.(dotsWrap, {
    totalCount: cards.length,
    activeIndex: index,
    maxVisible: 3,
    isCompact: true,
    dataAttribute: 'data-brand-vehicle-dot',
    ariaLabelBuilder: (dotIndex) => `Vehicle ${dotIndex + 1}`
  });
}

function ensureBrandVehicleSliderNav() {
  if (!brandVehicleGrid) return null;

  let nav = getBrandVehicleSliderNav();
  if (nav) return nav;

  const shell = ensureBrandVehicleSliderShell();
  if (!shell) return null;

  nav = document.createElement('div');
  nav.id = BRAND_VEHICLE_SLIDER_NAV_ID;
  nav.className = 'vehicle-slider-nav';
  nav.setAttribute('aria-hidden', 'true');
  nav.innerHTML = `
    <button type="button" class="vehicle-slider-btn vehicle-slider-btn--prev" data-brand-vehicle-nav="prev" aria-label="前の車両">
      <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <path d="M12.5 4 7 10l5.5 6"></path>
      </svg>
    </button>
    <div class="vehicle-slider-dots" aria-label="ページ送り"></div>
    <button type="button" class="vehicle-slider-btn vehicle-slider-btn--next" data-brand-vehicle-nav="next" aria-label="次の車両">
      <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <path d="m7.5 4 5.5 6-5.5 6"></path>
      </svg>
    </button>
  `;

  nav.addEventListener('click', (event) => {
    const button = event.target.closest('[data-brand-vehicle-nav]');
    if (button && !button.disabled) {
      markBrandVehicleSliderInteraction();
      const direction = button.dataset.brandVehicleNav === 'prev' ? -1 : 1;
      const current = getClosestBrandVehicleCardIndex();
      scrollToBrandVehicleCard(current + direction);
      window.setTimeout(updateBrandVehicleSliderNavState, 220);
      return;
    }

    const dot = event.target.closest('[data-brand-vehicle-dot]');
    if (!dot) return;
    markBrandVehicleSliderInteraction();
    scrollToBrandVehicleCard(Number(dot.dataset.brandVehicleDot));
    window.setTimeout(updateBrandVehicleSliderNavState, 220);
  });

  shell.appendChild(nav);
  return nav;
}

function bindBrandVehicleSliderEvents() {
  if (!brandVehicleGrid) return;
  if (brandVehicleGrid.dataset.sliderBound === '1') return;
  brandVehicleGrid.dataset.sliderBound = '1';

  brandVehicleGrid.addEventListener('scroll', () => {
    if (!brandVehicleSliderViewport.matches) return;
    markBrandVehicleSliderInteraction();
    if (brandVehicleSliderScrollFrame) return;
    brandVehicleSliderScrollFrame = requestAnimationFrame(() => {
      brandVehicleSliderScrollFrame = 0;
      updateBrandVehicleSliderNavState();
    });
  }, { passive: true });

  brandVehicleGrid.addEventListener('pointerdown', () => {
    markBrandVehicleSliderInteraction();
  }, { passive: true });

  const syncOnViewportChange = () => {
    if (!brandVehicleSliderViewport.matches) {
      brandVehicleGrid.scrollLeft = 0;
      const nav = getBrandVehicleSliderNav();
      nav?.classList.remove('is-engaged');
    } else {
      scrollToBrandVehicleCard(getClosestBrandVehicleCardIndex(), 'auto');
      markBrandVehicleSliderInteraction();
    }
    updateBrandVehicleSliderNavState();
  };

  if (typeof brandVehicleSliderViewport.addEventListener === 'function') {
    brandVehicleSliderViewport.addEventListener('change', syncOnViewportChange);
  } else if (typeof brandVehicleSliderViewport.addListener === 'function') {
    brandVehicleSliderViewport.addListener(syncOnViewportChange);
  }

  window.addEventListener('resize', () => {
    if (brandVehicleSliderResizeFrame) cancelAnimationFrame(brandVehicleSliderResizeFrame);
    brandVehicleSliderResizeFrame = requestAnimationFrame(() => {
      brandVehicleSliderResizeFrame = 0;
      updateBrandVehicleSliderNavState();
    });
  });
}

function syncBrandVehicleSlider() {
  if (!brandVehicleGrid) return;
  ensureBrandVehicleSliderShell();
  ensureBrandVehicleSliderNav();
  bindBrandVehicleSliderEvents();
  updateBrandVehicleSliderNavState();
}

function bindBrandVehicleMobilePager() {
  if (!brandVehicleGrid || brandVehicleGrid.dataset.mobilePagerBound === '1') return;
  brandVehicleGrid.dataset.mobilePagerBound = '1';

  brandVehicleGrid.addEventListener('scroll', () => {
    if (!isBrandVehicleMobileView()) return;
    if (brandVehicleSliderScrollFrame) return;
    brandVehicleSliderScrollFrame = requestAnimationFrame(() => {
      brandVehicleSliderScrollFrame = 0;
      const nextPage = getClosestBrandVehicleCardIndex();
      if (nextPage === currentPage) return;
      currentPage = nextPage;
      updatePagination();
    });
  }, { passive: true });

  const scheduleSync = () => {
    if (brandVehicleSliderResizeFrame) cancelAnimationFrame(brandVehicleSliderResizeFrame);
    brandVehicleSliderResizeFrame = requestAnimationFrame(() => {
      brandVehicleSliderResizeFrame = 0;
      const nextMode = isBrandVehicleMobileView() ? 'mobile' : 'desktop';
      if (nextMode !== brandVehicleRenderMode) {
        renderPage();
        return;
      }
      if (nextMode === 'mobile') {
        currentPage = getClosestBrandVehicleCardIndex();
        updatePagination();
      }
    });
  };

  if (typeof brandVehicleSliderViewport.addEventListener === 'function') {
    brandVehicleSliderViewport.addEventListener('change', scheduleSync);
  } else if (typeof brandVehicleSliderViewport.addListener === 'function') {
    brandVehicleSliderViewport.addListener(scheduleSync);
  }

  window.addEventListener('resize', scheduleSync);
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

function getCompareTotalPages() {
  return Math.max(1, Math.ceil(sourceVehicles.length / ITEMS_PER_PAGE));
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
  const renderMode = isBrandVehicleMobileView() ? 'mobile' : 'desktop';
  const leadIndex = getBrandVehicleLeadIndex();

  // 数据尚未到达（既无缓存又无 API 回包）：直接渲染骨架卡，避免空白状态闪烁。
  const dataPoolEmpty = !Array.isArray(vehicles) || vehicles.length === 0;
  if (dataPoolEmpty && !Array.isArray(window.TK168_API_VEHICLES)) {
    delete grid.dataset.mobilePaged;
    const placeholder = renderMode === 'mobile' ? 4 : ITEMS_PER_PAGE;
    window.TK168Renderers?.renderVehicleSkeletons?.(grid, placeholder);
    brandVehicleRenderMode = renderMode;
    updatePagination();
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

      brandVehicleRenderMode = renderMode;
      updatePagination();
      return;
    }

    const totalDesktopPages = Math.max(1, Math.ceil(sourceVehicles.length / ITEMS_PER_PAGE));
    currentPage = renderMode === 'mobile'
      ? Math.max(0, Math.min(sourceVehicles.length - 1, leadIndex))
      : Math.max(0, Math.min(totalDesktopPages - 1, Math.floor(leadIndex / ITEMS_PER_PAGE)));

    const slice = renderMode === 'mobile'
      ? sourceVehicles
      : sourceVehicles.slice(currentPage * ITEMS_PER_PAGE, (currentPage * ITEMS_PER_PAGE) + ITEMS_PER_PAGE);

    if (renderMode === 'mobile') {
      grid.dataset.mobilePaged = 'true';
    } else {
      grid.scrollLeft = 0;
    }

    slice.forEach((v, i) => {
      const card = document.createElement('div');
      card.className = 'v-card';
      card.style.transitionDelay = `${i * 0.07}s`;
      card.innerHTML = buildCardHTML(v);
      card.querySelectorAll('img').forEach((image) => {
        image.loading = 'lazy';
        image.decoding = 'async';
        image.setAttribute('fetchpriority', 'low');
      });
      normalizeVehicleMetaSubtitle(card);
      applyMiniBrandIcon(card, v);
      grid.appendChild(card);

      requestAnimationFrame(() => {
        card.classList.add('visible');
      });
    });

    window.TK168CommonLinks?.enhanceClickableCards(grid);
    window.TK168Renderers?.bindVehicleCardLikes?.(grid);
    window.TK168Renderers?.bindVehicleCardCoverSkeletons?.(grid);
    brandVehicleRenderMode = renderMode;
    updatePagination();

    if (renderMode === 'mobile') {
      requestAnimationFrame(() => {
        scrollToBrandVehicleCard(currentPage, 'auto');
      });
    }
  }, existing.length ? 220 : 0);
}

function updatePagination() {
  const pagination = document.getElementById('vPagination');
  const dotsWrap = document.getElementById('vpnDots');
  const prevBtn  = document.getElementById('vpnPrev');
  const nextBtn  = document.getElementById('vpnNext');
  const mobilePaged = isBrandVehicleMobileView();
  const totalPages = Math.max(1, mobilePaged ? sourceVehicles.length : getCompareTotalPages());
  if (!pagination || !dotsWrap || !prevBtn || !nextBtn) return;
  const shouldHidePagination = (Boolean(getPinnedBrandKey()) && sourceVehicles.length === 0) || totalPages <= 1;
  pagination.style.display = shouldHidePagination ? 'none' : '';

  // Rebuild dots
  window.TK168Renderers?.renderPaginationDots?.(dotsWrap, {
    totalCount: totalPages,
    activeIndex: currentPage,
    maxVisible: 3,
    isCompact: true,
    dataAttribute: 'data-brand-page-dot',
    ariaLabelBuilder: (dotIndex) => `Page ${dotIndex + 1}`,
    onClick: (pageIndex) => goToPage(pageIndex)
  });

  prevBtn.disabled = totalPages <= 1 || (mobilePaged && currentPage <= 0);
  nextBtn.disabled = totalPages <= 1 || (mobilePaged && currentPage >= totalPages - 1);
}

function goToPage(page) {
  const mobilePaged = isBrandVehicleMobileView();
  const totalPages = Math.max(1, mobilePaged ? sourceVehicles.length : getCompareTotalPages());
  if (totalPages <= 0) return;

  if (mobilePaged) {
    const normalizedPage = Math.max(0, Math.min(totalPages - 1, page));
    if (normalizedPage === currentPage) return;
    currentPage = normalizedPage;
    scrollToBrandVehicleCard(currentPage);
    updatePagination();
    return;
  }

  const normalizedPage = ((page % totalPages) + totalPages) % totalPages;
  if (normalizedPage === currentPage) return;
  currentPage = normalizedPage;
  renderPage();
}

// Arrow click handlers
document.getElementById('vpnPrev').addEventListener('click', () => goToPage(currentPage - 1));
document.getElementById('vpnNext').addEventListener('click', () => goToPage(currentPage + 1));
function handleBrandNavViewportChange() {
  brandNavCycleIndex = 0;
  buildBrandNav();
}

document.getElementById('bnPrev')?.addEventListener('click', () => shiftBrandNav(-1));
document.getElementById('bnNext')?.addEventListener('click', () => shiftBrandNav(1));

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
bindBrandVehicleMobilePager();
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
