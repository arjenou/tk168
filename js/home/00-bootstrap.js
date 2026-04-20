const {
  site,
  brands,
  vehicles,
  getBrandLabel,
  getNewsItems,
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
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function enforceHomeInitialScroll() {
  if (!hasExplicitHomeHashTarget() && 'scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
  forceHomeScrollTop();
  window.requestAnimationFrame(forceHomeScrollTop);
  window.setTimeout(forceHomeScrollTop, 0);
}

function resolveWorkerMediaUrl(path) {
  const raw = String(path || '').trim();
  if (!raw) return '';
  if (/^(?:https?:)?\/\//.test(raw)) return raw.startsWith('//') ? `https:${raw}` : raw;
  if (!raw.startsWith('/api/')) return raw;
  const apiBase = (typeof window.TK168_API_BASE === 'string' && window.TK168_API_BASE.trim())
    ? window.TK168_API_BASE
    : 'https://api.tk168.co.jp';
  const sameOrigin = typeof location !== 'undefined' && apiBase.startsWith(location.origin);
  return sameOrigin || !apiBase ? raw : `${apiBase.replace(/\/+$/, '')}${raw}`;
}

function hydrateIntroVideoSource() {
  if (!introVideo) return;
  if (introVideo.currentSrc || introVideo.getAttribute('src')) return;
  const source = resolveWorkerMediaUrl(introVideo.dataset.src);
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
  forceHomeScrollTop();
  mainContent.classList.remove('hidden');
  forceHomeScrollTop();
  syncHeroVideoPlayback();

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
  hydrateIntroVideoSource();
  introVideo?.addEventListener('ended', completeIntro);
  loadingScreen?.addEventListener('click', requestIntroDismiss);
  setTimeout(completeIntro, 4000);
  introVideo?.play().catch(() => {
    markIntroSeenThisSession();
    showMain({ immediate: true });
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
  enforceHomeInitialScroll();
});
