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
