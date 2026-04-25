const {
  site,
  brands,
  vehicles,
  getBrandLabel,
  getNewsItems,
  getJournalDetailPageUrl,
  buildBrandUrl,
  buildDetailUrl,
  buildInventoryUrl,
  parseInventoryFilters
} = window.TK168_DATA;

window.TK168CommonLinks?.applyCommonLinks();
window.TK168PageChrome?.applyPageChrome({
  pageKey: 'landing',
  inventoryHref: 'brand.html'
});

const pendingHomeScrollRestore = window.TK168HomeScrollRestore?.consumePendingRestore?.() ?? null;

const loadingScreen = document.getElementById('loading-screen');
const introVideo = document.getElementById('intro-video');
const mainContent = document.getElementById('main');
const heroSection = document.getElementById('hero');
const heroVideoWrap = document.querySelector('.hero-video-wrap');
const heroVideo = document.getElementById('hero-video');
const runtimeConnection = window.navigator?.connection;
const prefersReducedHeroVideoMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
const coarsePointerViewport = window.matchMedia?.('(max-width: 820px) and (pointer: coarse)');
const shouldConserveData = Boolean(runtimeConnection?.saveData);
const effectiveNetworkType = String(runtimeConnection?.effectiveType || '').toLowerCase();
const reportedDeviceMemory = Number(window.navigator?.deviceMemory || 0);
const reportedHardwareConcurrency = Number(window.navigator?.hardwareConcurrency || 0);
const hasLowDeviceMemory = Number.isFinite(reportedDeviceMemory) && reportedDeviceMemory > 0 && reportedDeviceMemory <= 4;
const hasLowCpuBudget = Number.isFinite(reportedHardwareConcurrency) && reportedHardwareConcurrency > 0 && reportedHardwareConcurrency <= 4;
const hasSlowNetwork = /(?:^|[^a-z])(slow-2g|2g|3g)(?:$|[^a-z])/.test(effectiveNetworkType);
const shouldPreferLiteTouchExperience = Boolean(
  coarsePointerViewport?.matches && (hasLowDeviceMemory || hasLowCpuBudget || hasSlowNetwork || shouldConserveData)
);
const shouldUseLiteExperience = Boolean(
  false
);
window.TK168RuntimeProfile = Object.freeze({
  liteMode: false,
  heroVideoDisabled: false,
  shouldConserveData,
  hasSlowNetwork,
  hasLowDeviceMemory,
  hasLowCpuBudget
});
document.documentElement.classList.toggle('tk168-lite-mode', shouldUseLiteExperience);
const SKIP_INTRO_ONCE_KEY = 'tk168_skip_intro_once';
/** 同标签页会话内已播放过片头则不再播放（避免从子页返回首页反复观看） */
const INTRO_SEEN_SESSION_KEY = 'tk168_landing_intro_seen';
const HERO_VIDEO_DEFER_MS = 3600;
const INTRO_SKIP_UNLOCK_MS = 900;
const INTRO_ENABLED = true;
let heroVideoSourceReady = false;
let heroVideoInView = true;
let heroVideoDeferredTimer = 0;
let heroVideoDeferredArmed = false;
let introStartedAt = 0;
let introSafetyTimer = 0;

function hasExplicitHomeHashTarget() {
  if (!window.location.hash || window.location.hash === '#') return false;
  try {
    return Boolean(document.querySelector(window.location.hash));
  } catch {
    return true;
  }
}

function forceHomeScrollTop() {
  if (hasExplicitHomeHashTarget()) return;
  if (pendingHomeScrollRestore) return;
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function enforceHomeInitialScroll() {
  if (!hasExplicitHomeHashTarget() && !pendingHomeScrollRestore && 'scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
  forceHomeScrollTop();
  window.requestAnimationFrame(forceHomeScrollTop);
  window.setTimeout(forceHomeScrollTop, 0);
}

function scrollToHomeBrands({ behavior = 'smooth' } = {}) {
  const node = document.getElementById('brands');
  if (!node) return;
  const y = window.pageYOffset + node.getBoundingClientRect().top;
  const top = Math.max(0, Math.round(y));
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  const mode = reduced ? 'auto' : behavior;
  try {
    window.scrollTo({ top, left: 0, behavior: mode });
  } catch {
    window.scrollTo(0, top);
  }
}

function queueHomeBrandsHashScroll() {
  if (location.hash !== '#brands') return;
  const run = () => scrollToHomeBrands({ behavior: 'auto' });
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(run);
  });
  window.setTimeout(run, 120);
}

(function bindHomeBrandsInPageAnchor() {
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const a = event.target?.closest && event.target.closest('a[href="#brands"]');
    if (!a) return;
    event.preventDefault();
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', '#brands');
    } else {
      window.location.hash = 'brands';
    }
    scrollToHomeBrands({ behavior: 'smooth' });
  });
})();

function resolveWorkerMediaUrl(path, options = {}) {
  const preferApi = options.preferApi === true;
  const raw = String(path || '').trim();
  if (!raw) return '';
  if (/^(?:https?:)?\/\//.test(raw)) return raw.startsWith('//') ? `https:${raw}` : raw;
  const mediaBase = !preferApi && typeof window.TK168_MEDIA_BASE === 'string' && window.TK168_MEDIA_BASE.trim();
  if (mediaBase) {
    const norm = raw.replace(/^\/?api\/media\/?/i, '').replace(/^\/+/, '');
    if (norm && (raw.startsWith('/api/media/') || raw.toLowerCase().startsWith('api/media/'))) {
      return `${mediaBase.replace(/\/+$/, '')}/${norm}`;
    }
  }
  if (!raw.startsWith('/api/')) return raw;
  const apiBase = (typeof window.TK168_API_BASE === 'string' && window.TK168_API_BASE.trim())
    ? window.TK168_API_BASE
    : 'https://api.tk168.co.jp';
  const sameOrigin = typeof location !== 'undefined' && apiBase.startsWith(location.origin);
  return sameOrigin || !apiBase ? raw : `${apiBase.replace(/\/+$/, '')}${raw}`;
}

function hydrateIntroVideoSource(options = {}) {
  if (!introVideo) return;
  if (introVideo.currentSrc) return;
  const raw = introVideo.getAttribute('data-src') || introVideo.getAttribute('src');
  if (!raw) return;
  const source = resolveWorkerMediaUrl(raw, options);
  if (!source) return;
  introVideo.src = source;
  introVideo.load();
}

function hydrateHeroVideoSource() {
  if (!heroVideo || heroVideoSourceReady) return;
  const source = resolveWorkerMediaUrl(heroVideo.dataset.src);
  if (!source) return;
  heroVideo.src = source;
  heroVideo.load();
  heroVideoSourceReady = true;
}

function canRunHeroVideo() {
  if (!heroVideo || !isMainShown) return false;
  if (document.visibilityState === 'hidden') return false;
  if (!heroVideoInView) return false;
  return true;
}

function syncHeroVideoPlayback() {
  if (!heroVideo) return;
  if (!canRunHeroVideo()) {
    heroVideo.pause();
    return;
  }

  hydrateHeroVideoSource();
  heroVideo.play().catch(() => {});
}

function armDeferredHeroVideoLoad() {
  if (!heroVideo || heroVideoDeferredArmed || shouldConserveData || window.TK168RuntimeProfile?.heroVideoDisabled) return;
  heroVideoDeferredArmed = true;
  heroVideoDeferredTimer = window.setTimeout(() => {
    heroVideoDeferredTimer = 0;
    syncHeroVideoPlayback();
  }, HERO_VIDEO_DEFER_MS);
}

function triggerHeroVideoOnInteraction() {
  if (heroVideoDeferredTimer) {
    clearTimeout(heroVideoDeferredTimer);
    heroVideoDeferredTimer = 0;
  }
  syncHeroVideoPlayback();
}

function bindOneShotHeroVideoInteraction() {
  const events = ['pointerdown', 'touchstart', 'keydown'];
  const options = { once: true, passive: true };
  events.forEach((eventName) => {
    window.addEventListener(eventName, triggerHeroVideoOnInteraction, options);
  });
}

function shouldSkipIntroOnce() {
  try {
    const shouldSkip = window.sessionStorage.getItem(SKIP_INTRO_ONCE_KEY) === '1';
    if (shouldSkip) window.sessionStorage.removeItem(SKIP_INTRO_ONCE_KEY);
    return shouldSkip;
  } catch {
    return false;
  }
}

function hasIntroBeenSeenThisSession() {
  try {
    return window.sessionStorage.getItem(INTRO_SEEN_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function markIntroSeenThisSession() {
  try {
    window.sessionStorage.setItem(INTRO_SEEN_SESSION_KEY, '1');
  } catch {
    /* ignore quota / private mode */
  }
}

let isMainShown = false;
function showMain({ immediate = false } = {}) {
  if (isMainShown) return;
  isMainShown = true;
  if (introSafetyTimer) {
    window.clearTimeout(introSafetyTimer);
    introSafetyTimer = 0;
  }
  document.body.classList.remove('is-home-landing');
  forceHomeScrollTop();
  mainContent.classList.remove('hidden');
  forceHomeScrollTop();
  syncHeroVideoPlayback();
  queueHomeBrandsHashScroll();

  if (immediate) {
    loadingScreen.style.display = 'none';
    return;
  }

  loadingScreen.classList.add('fade-out');
  setTimeout(() => { loadingScreen.style.display = 'none'; }, 950);
}

function completeIntro() {
  markIntroSeenThisSession();
  showMain();
}

function canDismissIntro() {
  return (window.performance?.now?.() || Date.now()) - introStartedAt >= INTRO_SKIP_UNLOCK_MS;
}

function requestIntroDismiss() {
  if (!canDismissIntro()) return;
  completeIntro();
}

enforceHomeInitialScroll();

if (shouldSkipIntroOnce() || hasIntroBeenSeenThisSession()) {
  introVideo?.pause();
  showMain({ immediate: true });
} else if (!INTRO_ENABLED) {
  introVideo?.pause();
  showMain({ immediate: true });
} else {
  introStartedAt = window.performance?.now?.() || Date.now();
  introVideo?.addEventListener('loadeddata', () => {
    loadingScreen?.classList.add('is-intro-decoded');
  }, { once: true });
  hydrateIntroVideoSource();
  let introEndedBound = false;
  function bindIntroEnded() {
    if (introEndedBound) return;
    introEndedBound = true;
    introVideo?.addEventListener('ended', completeIntro, { once: true });
  }
  bindIntroEnded();
  let introLoadFallbackTried = false;
  introVideo?.addEventListener('error', function onIntroError() {
    if (!introLoadFallbackTried && window.TK168_MEDIA_BASE) {
      introLoadFallbackTried = true;
      introVideo.removeEventListener('error', onIntroError);
      introVideo.removeAttribute('src');
      hydrateIntroVideoSource({ preferApi: true });
      bindIntroEnded();
      introVideo.addEventListener('error', () => {
        markIntroSeenThisSession();
        showMain({ immediate: true });
      }, { once: true });
      introVideo.play().catch(() => {});
      return;
    }
    markIntroSeenThisSession();
    showMain({ immediate: true });
  });
  loadingScreen?.addEventListener('click', requestIntroDismiss);
  introSafetyTimer = window.setTimeout(() => {
    markIntroSeenThisSession();
    showMain({ immediate: true });
  }, 120000);
  introVideo?.play().catch(() => {
    if (!introVideo) return;
    if (introVideo.error) {
      markIntroSeenThisSession();
      showMain({ immediate: true });
      return;
    }
    window.setTimeout(() => {
      if (!introVideo) return;
      if (introVideo.error) {
        markIntroSeenThisSession();
        showMain({ immediate: true });
        return;
      }
      introVideo.play().catch(() => {
        if (introVideo?.error) {
          markIntroSeenThisSession();
          showMain({ immediate: true });
        }
      });
    }, 300);
  });
}

if (heroSection && heroVideo) {
  const heroVisibilityObserver = new IntersectionObserver((entries) => {
    heroVideoInView = Boolean(entries[0]?.isIntersecting);
    syncHeroVideoPlayback();
  }, {
    threshold: 0.12
  });

  heroVisibilityObserver.observe(heroSection);

  heroVideo.addEventListener('loadeddata', () => {
    heroVideoWrap?.classList.add('is-video-ready');
  }, { once: true });

  bindOneShotHeroVideoInteraction();
  document.addEventListener('visibilitychange', syncHeroVideoPlayback);
  prefersReducedHeroVideoMotion?.addEventListener?.('change', syncHeroVideoPlayback);
  window.addEventListener('beforeunload', () => {
    heroVideo.pause();
  });
} else {
  heroVideo?.pause();
}

window.addEventListener('pageshow', (event) => {
  if (!event.persisted) return;
  const ae = document.activeElement;
  if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA')) {
    const inHomeSearch = ae.closest?.('#static-search, #floating-bar');
    if (inHomeSearch) ae.blur();
  }
});

;(() => {
const homeDataApi = window.TK168_DATA || {};

const {
  vehicles = [],
  getNewsItems,
  buildDetailUrl,
  buildInventoryUrl,
  parseInventoryFilters,
  filterVehicles,
  serializeInventoryFilters
} = homeDataApi;

const HOME_VEHICLES_PER_PAGE = 6;

const homeVehicleGrid = document.getElementById('vehicleGrid');
const homeVehiclePagination = document.getElementById('homeVehiclePagination');
const homeVehicleDots = document.getElementById('homeVehicleDots');
const homeVehiclePrev = document.getElementById('homeVehiclePrev');
const homeVehicleNext = document.getElementById('homeVehicleNext');
const homeVehicleMobileViewport = window.matchMedia('(max-width: 760px)');
const homeVehicleTabletViewport = window.matchMedia('(max-width: 1180px)');

let homeActiveFilters =
  typeof parseInventoryFilters === 'function'
    ? parseInventoryFilters(window.location.search)
    : {};

let currentHomeVehiclePage = pendingHomeScrollRestore
  ? pendingHomeScrollRestore.page
  : 0;
let currentHomeVehicleColumns = getHomeVehicleColumns();
let homeVehicleResizeFrame = 0;
/** 与后台 `display_order` 一致（经 `/api/vehicles` 排序后的全量列表） */
const homeVehicles = Array.isArray(vehicles) ? vehicles : [];

function translate(key, params = {}) {
  return window.TK168I18N?.t(key, params) || key;
}

function getHomeVehiclesPerPage() {
  return HOME_VEHICLES_PER_PAGE;
}

function getHomeVehicleColumns() {
  if (homeVehicleMobileViewport.matches) return 1;
  if (homeVehicleTabletViewport.matches) return 2;
  return 3;
}

function chunkHomeVehicles(items, chunkSize) {
  if (!Array.isArray(items) || !items.length || chunkSize <= 0) return [];
  const pages = [];
  for (let index = 0; index < items.length; index += chunkSize) {
    pages.push(items.slice(index, index + chunkSize));
  }
  return pages;
}

function getHomeVehiclesDisplayed() {
  if (typeof filterVehicles !== 'function') return homeVehicles;
  return filterVehicles(homeVehicles, homeActiveFilters);
}

function getHomeVehicleTotalPages() {
  const list = getHomeVehiclesDisplayed();
  return Math.max(1, Math.ceil(list.length / getHomeVehiclesPerPage()));
}

function renderHomeVehiclePages() {
  if (!homeVehicleGrid) return;

  const displayed = getHomeVehiclesDisplayed();
  const pages = chunkHomeVehicles(displayed, getHomeVehiclesPerPage());
  const totalPages = Math.max(1, pages.length);
  currentHomeVehiclePage = Math.max(0, Math.min(totalPages - 1, currentHomeVehiclePage));
  currentHomeVehicleColumns = getHomeVehicleColumns();
  homeVehicleGrid.dataset.homeVehiclePage = String(currentHomeVehiclePage);
  homeVehicleGrid.innerHTML = '';
  homeVehicleGrid.style.setProperty('--home-vehicle-columns', String(currentHomeVehicleColumns));

  (pages[currentHomeVehiclePage] || []).forEach((vehicle, index) => {
    const card = document.createElement('div');
    card.className = 'v-card fade-up visible';
    card.style.transitionDelay = `${index * 0.05}s`;
    card.innerHTML = window.TK168Renderers.buildInventoryCardHTML(
      vehicle,
      buildDetailUrl(vehicle.id, homeActiveFilters)
    );
    card.querySelectorAll('img').forEach((image) => {
      image.loading = 'lazy';
      image.decoding = 'async';
      image.setAttribute('fetchpriority', 'low');
    });
    homeVehicleGrid.appendChild(card);
  });

  window.TK168CommonLinks?.enhanceClickableCards(homeVehicleGrid);
  window.TK168Renderers?.bindVehicleCardLikes?.(homeVehicleGrid);
  updateHomeVehiclePagination();
}

function updateHomeVehiclePagination() {
  if (!homeVehiclePagination || !homeVehicleDots || !homeVehiclePrev || !homeVehicleNext) return;

  const totalPages = getHomeVehicleTotalPages();
  homeVehiclePagination.style.display = totalPages > 1 ? '' : 'none';

  window.TK168Renderers?.renderPaginationDots?.(homeVehicleDots, {
    totalCount: totalPages,
    activeIndex: currentHomeVehiclePage,
    dataAttribute: 'data-home-page-dot',
    ariaLabelBuilder: (dotIndex) => `Page ${dotIndex + 1}`,
    onClick: (pageIndex) => goToHomeVehiclePage(pageIndex)
  });

  homeVehiclePrev.disabled = currentHomeVehiclePage === 0;
  homeVehicleNext.disabled = currentHomeVehiclePage >= totalPages - 1;
}

function goToHomeVehiclePage(pageIndex) {
  const totalPages = getHomeVehicleTotalPages();
  const normalizedPage = Math.max(0, Math.min(totalPages - 1, pageIndex));
  if (normalizedPage === currentHomeVehiclePage) return;
  currentHomeVehiclePage = normalizedPage;
  renderHomeVehiclePages();
}

function bindHomeVehiclePagination() {
  if (!homeVehiclePagination || homeVehiclePagination.dataset.bound === '1') return;
  homeVehiclePagination.dataset.bound = '1';

  homeVehiclePrev?.addEventListener('click', () => {
    goToHomeVehiclePage(currentHomeVehiclePage - 1);
  });

  homeVehicleNext?.addEventListener('click', () => {
    goToHomeVehiclePage(currentHomeVehiclePage + 1);
  });
}

function bindHomeVehicleResizeSync() {
  if (homeVehicleGrid?.dataset.resizeBound === '1') return;
  if (homeVehicleGrid) homeVehicleGrid.dataset.resizeBound = '1';

  const syncLayout = () => {
    const nextColumns = getHomeVehicleColumns();
    if (nextColumns === currentHomeVehicleColumns) return;
    renderHomeVehiclePages();
  };

  const scheduleSync = () => {
    if (homeVehicleResizeFrame) cancelAnimationFrame(homeVehicleResizeFrame);
    homeVehicleResizeFrame = requestAnimationFrame(() => {
      homeVehicleResizeFrame = 0;
      syncLayout();
    });
  };

  if (typeof homeVehicleMobileViewport.addEventListener === 'function') {
    homeVehicleMobileViewport.addEventListener('change', scheduleSync);
    homeVehicleTabletViewport.addEventListener('change', scheduleSync);
  } else if (typeof homeVehicleMobileViewport.addListener === 'function') {
    homeVehicleMobileViewport.addListener(scheduleSync);
    homeVehicleTabletViewport.addListener(scheduleSync);
  }

  window.addEventListener('resize', scheduleSync);
}

function buildNewsCardHTML(item, isLarge = false, index = 0) {
  const isInboundCategory = /(\u5165\u5eab|\u5230\u5e93|入庫|新車)/.test(item.category || '');
  const newsHref = typeof getJournalDetailPageUrl === 'function'
    ? getJournalDetailPageUrl({ id: item.id, index })
    : `news-detail.html?i=${encodeURIComponent(String(index))}`;
  const summary = item.summary ? `<p>${item.summary}</p>` : '';
  return `
    <div class="news-card ${isLarge ? 'news-large' : 'news-small'}">
      <div class="news-img"><img src="${item.image}" alt="${item.title}" loading="lazy" decoding="async" fetchpriority="low"></div>
      <div class="news-body">
        <span class="news-tag ${isLarge ? 'news-tag--teal' : (isInboundCategory ? 'news-tag--orange' : 'news-tag--green')}">${item.category}</span>
        <h3>${item.title}</h3>
        ${summary}
        <div class="news-meta">
          <span>${item.date}</span>
          <a href="${newsHref}" class="news-more">${translate('news.more')}</a>
        </div>
      </div>
    </div>
  `;
}

function renderHomeNews() {
  const newsGrid = document.querySelector('.news-grid');
  if (!newsGrid || typeof getNewsItems !== 'function') return;

  const items = getNewsItems();
  if (!items.length) {
    newsGrid.innerHTML = '';
    return;
  }
  const [first, second, ...rest] = items;
  const side = [second, ...rest].filter(Boolean);
  if (!first) {
    newsGrid.innerHTML = '';
    return;
  }
  const sideHtml = side.map((it, i) => buildNewsCardHTML(it, false, i + 1)).join('');

  newsGrid.innerHTML = `
    ${buildNewsCardHTML(first, true, 0)}
    ${side.length ? `<div class="news-side">${sideHtml}</div>` : ''}
  `;

  window.TK168CommonLinks?.enhanceClickableCards(newsGrid);
  newsGrid.querySelectorAll('.news-card').forEach((element) => {
    element.classList.add('fade-up', 'visible');
  });
}

function applyHomeInventoryFilters(filterState) {
  const qs =
    typeof serializeInventoryFilters === 'function'
      ? serializeInventoryFilters(filterState)
      : '';
  homeActiveFilters =
    typeof parseInventoryFilters === 'function'
      ? parseInventoryFilters(qs ? `?${qs}` : '')
      : { ...filterState };
  const url = new URL(window.location.href);
  url.search = qs;
  history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  currentHomeVehiclePage = 0;
  renderHomeVehiclePages();
}

function initHomeSearch() {
  window.TK168SearchUI.createInventorySearchUI({
    roots: [
      document.querySelector('#static-search .fb-desktop'),
      document.querySelector('#floating-bar .fb-desktop')
    ].filter(Boolean),
    mobileButtons: [
      document.querySelector('#floating-bar .fb-mobile .fb-cta')
    ].filter(Boolean),
    initialState: homeActiveFilters,
    onFiltersChange: applyHomeInventoryFilters,
    onSubmit: (filters) => {
      applyHomeInventoryFilters(filters);
      const section = document.getElementById('vehicles');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
}

function renderHomeContent() {
  renderHomeVehiclePages();
  renderHomeNews();
}

bindHomeVehiclePagination();
bindHomeVehicleResizeSync();
renderHomeContent();
initHomeSearch();

if (pendingHomeScrollRestore) {
  const y = pendingHomeScrollRestore.y;
  const applyY = () => {
    const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo(0, Math.min(Math.max(0, y), maxY));
  };
  requestAnimationFrame(() => {
    requestAnimationFrame(applyY);
  });
  window.setTimeout(applyY, 0);
}

window.addEventListener('tk168:languagechange', () => {
  renderHomeContent();
});

document.addEventListener('tk168:data-updated', (event) => {
  if (event.detail?.vehicles) {
    window.TK168_DATA?.refreshVehiclesFromApiHydrate?.();
  }
  if (event.detail?.journal) {
    window.TK168_DATA?.refreshJournalFromApiHydrate?.();
  }
  if (event.detail?.vehicles || event.detail?.journal) {
    renderHomeContent();
  }
});
})();

const staticSearch = document.getElementById('static-search');
const vehiclesSection = document.getElementById('vehicles');
const heroScrollTrigger = document.querySelector('[data-hero-scroll]');
const heroCta = document.querySelector('.hero-cta');
const heroCtaTrackPath = document.getElementById('hero-cta-track-path');
const heroCtaTrackLine = document.querySelector('.hero-cta-track-line');
const heroRuntimeSection = document.getElementById('hero');
const prefersReducedHeroMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
const shouldUseLiteHomepageMotion = false;
let heroCtaTrackLoopId = 0;
let heroCtaTrackSession = 0;
let heroCtaTrackInView = true;

function isAnimationRuntimeVisible() {
  return document.visibilityState !== 'hidden';
}

if (staticSearch && vehiclesSection) {
  const revealSearchObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      staticSearch.classList.toggle('search-active', entry.isIntersecting);
    });
  }, { threshold: 0.06 });

  revealSearchObserver.observe(vehiclesSection);
}

heroScrollTrigger?.addEventListener('click', (event) => {
  const targetSelector = heroScrollTrigger.getAttribute('href');
  const target = targetSelector ? document.querySelector(targetSelector) : null;
  if (!target) return;

  event.preventDefault();
  const top = target.getBoundingClientRect().top + window.scrollY - 28;
  window.scrollTo({
    top,
    behavior: 'smooth'
  });
});

function resetHeroCtaTrack() {
  if (!heroCta || !heroCtaTrackLine) return;
  heroCta.style.setProperty('--hero-cta-fill-opacity', '0');
  heroCtaTrackLine.style.opacity = '0';
  heroCtaTrackLine.style.strokeDasharray = '0 999';
  heroCtaTrackLine.style.strokeDashoffset = '0';
}

function shouldRunHeroCtaTrack() {
  if (!heroCta || !heroCtaTrackPath || !heroCtaTrackLine) return false;
  if (shouldUseLiteHomepageMotion) return false;
  if (prefersReducedHeroMotion?.matches) return false;
  if (!isAnimationRuntimeVisible()) return false;
  if (!heroCtaTrackInView) return false;
  return true;
}

function stopHeroCtaTrack() {
  heroCtaTrackSession += 1;
  if (heroCtaTrackLoopId) {
    cancelAnimationFrame(heroCtaTrackLoopId);
    heroCtaTrackLoopId = 0;
  }
  resetHeroCtaTrack();
}

function initHeroCtaTrack() {
  if (!heroCta || !heroCtaTrackPath || !heroCtaTrackLine) return;
  if (!shouldRunHeroCtaTrack()) {
    stopHeroCtaTrack();
    return;
  }

  heroCtaTrackSession += 1;
  if (heroCtaTrackLoopId) {
    cancelAnimationFrame(heroCtaTrackLoopId);
    heroCtaTrackLoopId = 0;
  }

  const sessionId = heroCtaTrackSession;
  const totalLength = heroCtaTrackPath.getTotalLength();
  const drawDuration = 2600;
  const holdDuration = 2000;
  const fadeDuration = 320;
  const cycleDuration = drawDuration + holdDuration + fadeDuration;
  let cycleStart = performance.now();

  function renderHeroCtaTrack(now) {
    if (sessionId !== heroCtaTrackSession) return;
    if (!shouldRunHeroCtaTrack()) {
      stopHeroCtaTrack();
      return;
    }

    const elapsed = (now - cycleStart) % cycleDuration;

    if (elapsed < drawDuration) {
      const progress = elapsed / drawDuration;
      const drawnLength = totalLength * progress;

      heroCta.style.setProperty('--hero-cta-fill-opacity', '0');
      heroCtaTrackLine.style.opacity = '1';
      heroCtaTrackLine.style.strokeDasharray = `${drawnLength} ${totalLength}`;
      heroCtaTrackLine.style.strokeDashoffset = '0';
    } else if (elapsed < drawDuration + holdDuration) {
      heroCta.style.setProperty('--hero-cta-fill-opacity', '1');
      heroCtaTrackLine.style.opacity = '1';
      heroCtaTrackLine.style.strokeDasharray = `${totalLength} ${totalLength}`;
      heroCtaTrackLine.style.strokeDashoffset = '0';
    } else {
      const fadeProgress = (elapsed - drawDuration - holdDuration) / fadeDuration;
      const fadeOpacity = Math.max(0, 1 - fadeProgress);

      heroCta.style.setProperty('--hero-cta-fill-opacity', fadeOpacity.toFixed(3));
      heroCtaTrackLine.style.opacity = fadeOpacity.toFixed(3);
      heroCtaTrackLine.style.strokeDasharray = `${totalLength} ${totalLength}`;
      heroCtaTrackLine.style.strokeDashoffset = '0';
    }

    heroCtaTrackLoopId = requestAnimationFrame(renderHeroCtaTrack);
  }

  heroCtaTrackLine.style.strokeDasharray = `0 ${totalLength}`;
  heroCtaTrackLoopId = requestAnimationFrame(renderHeroCtaTrack);
}

prefersReducedHeroMotion?.addEventListener?.('change', () => {
  if (prefersReducedHeroMotion.matches) {
    stopHeroCtaTrack();
    return;
  }
  initHeroCtaTrack();
});

if (heroRuntimeSection && heroCtaTrackPath && heroCtaTrackLine) {
  const heroCtaVisibilityObserver = new IntersectionObserver((entries) => {
    heroCtaTrackInView = Boolean(entries[0]?.isIntersecting);
    if (heroCtaTrackInView) {
      initHeroCtaTrack();
      return;
    }
    stopHeroCtaTrack();
  }, {
    threshold: 0.12
  });

  heroCtaVisibilityObserver.observe(heroRuntimeSection);
}

document.addEventListener('visibilitychange', () => {
  if (isAnimationRuntimeVisible()) {
    initHeroCtaTrack();
    return;
  }

  stopHeroCtaTrack();
});

initHeroCtaTrack();

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.10 });

document.querySelectorAll('.section-header').forEach((element) => {
  element.classList.add('fade-up');
  fadeObserver.observe(element);
});
document.querySelectorAll('.v-card').forEach((element) => fadeObserver.observe(element));
document.querySelectorAll('.news-card').forEach((element) => {
  element.classList.add('fade-up');
  fadeObserver.observe(element);
});
