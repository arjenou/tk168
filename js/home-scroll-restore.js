/**
 * 从车辆详情返回首页时恢复纵向滚动与首页车辆列表已展开数量（sessionStorage）。
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
    let visible = 0;
    if (grid) {
      visible = grid.querySelectorAll('.v-card').length;
      if (!visible && grid.dataset.homeVehicleVisible) {
        visible = Math.max(0, parseInt(grid.dataset.homeVehicleVisible, 10) || 0);
      }
      if (!visible && grid.dataset.homeVehiclePage != null) {
        const page = Math.max(0, parseInt(grid.dataset.homeVehiclePage, 10) || 0);
        visible = (page + 1) * 6;
      }
    }
    const y = Math.max(0, window.scrollY || window.pageYOffset || 0);
    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ y, visible, t: Date.now() })
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
      let visible = 0;
      if (typeof data.visible === 'number' && data.visible > 0) {
        visible = data.visible;
      } else if (typeof data.page === 'number' && data.page >= 0) {
        visible = (data.page + 1) * 6;
      }
      return { y: data.y, visible };
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
