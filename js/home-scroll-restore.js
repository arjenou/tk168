/**
 * 从车辆详情返回首页时恢复纵向滚动与首页车辆分页（sessionStorage）。
 */
(function () {
  const STORAGE_KEY = 'tk168_home_detail_return';
  const MAX_AGE_MS = 30 * 60 * 1000;

  function isDetailHref(href) {
    if (!href) return false;
    const s = String(href);
    if (/detail\.html/i.test(s)) return true;
    try {
      const u = new URL(s, window.location.href);
      return u.pathname.toLowerCase().indexOf('detail') !== -1;
    } catch {
      return false;
    }
  }

  function persistState(section) {
    const grid = section.querySelector('#vehicleGrid');
    let page = 0;
    if (grid && grid.dataset.homeVehiclePage != null) {
      page = Math.max(0, parseInt(grid.dataset.homeVehiclePage, 10) || 0);
    }
    const y = Math.max(0, window.scrollY || window.pageYOffset || 0);
    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ y, page, t: Date.now() })
      );
    } catch {
      /* ignore */
    }
  }

  function notifyHomeDetailNavigationFromCard(card, href) {
    if (!card || !isDetailHref(href)) return;
    const section = card.closest('#vehicles[data-home-grid="paged"]');
    if (!section) return;
    persistState(section);
  }

  function consumePendingRestore() {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      window.sessionStorage.removeItem(STORAGE_KEY);
      const data = JSON.parse(raw);
      if (!data || typeof data.y !== 'number' || typeof data.t !== 'number') return null;
      if (Date.now() - data.t > MAX_AGE_MS) return null;
      const page = typeof data.page === 'number' && data.page >= 0 ? data.page : 0;
      return { y: data.y, page };
    } catch {
      return null;
    }
  }

  function bindCaptureOnVehicleSection() {
    const section = document.querySelector('#vehicles[data-home-grid="paged"]');
    if (!section || section.dataset.tk168DetailScrollCapture === '1') return;
    section.dataset.tk168DetailScrollCapture = '1';
    section.addEventListener(
      'click',
      (event) => {
        const anchor = event.target.closest('a[href]');
        if (!anchor || !section.contains(anchor)) return;
        if (!isDetailHref(anchor.getAttribute('href'))) return;
        persistState(section);
      },
      true
    );
  }

  bindCaptureOnVehicleSection();

  window.TK168HomeScrollRestore = {
    notifyHomeDetailNavigationFromCard,
    consumePendingRestore
  };
})();
