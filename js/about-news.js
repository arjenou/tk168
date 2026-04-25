(() => {
  const featureRoot = document.querySelector('[data-about-news-feature]');
  const gridRoot = document.querySelector('[data-about-news-grid]');
  const newsSection = document.getElementById('about-news');

  if (!featureRoot || !gridRoot || !newsSection) return;

  function getLanguage() {
    return window.TK168I18N?.getLanguage?.() || 'ja';
  }

  function getNewsItems() {
    const fetcher = window.TK168_DATA?.getNewsItems;
    if (typeof fetcher !== 'function') return [];

    return (fetcher(getLanguage()) || []).map((item, index) => ({
      ...item,
      _index: index
    }));
  }

  function getDetailLabel() {
    return window.TK168I18N?.t?.('news.more') || (getLanguage() === 'en' ? 'Learn more' : '詳細を見る');
  }

  function buildNewsHref(index) {
    return `about.html?news=${encodeURIComponent(String(index))}#about-news`;
  }

  function getTagClass(category = '') {
    const value = String(category);
    if (/(入库|到库|入荷|入庫|新車)/i.test(value)) return 'news-tag--orange';
    if (/(活动|活動|会社|イベント|品牌|ブランド)/i.test(value)) return 'news-tag--green';
    return 'news-tag--teal';
  }

  function parseActiveIndex(items) {
    const raw = new URLSearchParams(window.location.search).get('news');
    if (raw == null || raw === '') return 0;

    const numeric = Number.parseInt(raw, 10);
    if (Number.isFinite(numeric)) {
      return Math.max(0, Math.min(items.length - 1, numeric));
    }

    const lookup = raw.toLowerCase();
    const matched = items.findIndex((item) => String(item.title || '').toLowerCase() === lookup);
    return matched >= 0 ? matched : 0;
  }

  function renderFeature(item) {
    if (!item) {
      featureRoot.innerHTML = '';
      return;
    }

    const summary = item.summary ? `<p>${item.summary}</p>` : '';
    featureRoot.innerHTML = `
      <div class="news-img">
        <img src="${item.image}" alt="${item.title}" loading="lazy" decoding="async" fetchpriority="low">
      </div>
      <div class="news-body">
        <span class="news-tag ${getTagClass(item.category)}">${item.category || ''}</span>
        <h3>${item.title || ''}</h3>
        ${summary}
        <div class="news-meta">
          <span>${item.date || ''}</span>
          <a href="${buildNewsHref(item._index)}" class="news-more">${getDetailLabel()}</a>
        </div>
      </div>
    `;
  }

  function renderGrid(items, activeIndex) {
    const detailLabel = getDetailLabel();
    gridRoot.innerHTML = items
      .map((item) => {
        const summary = item.summary ? `<p>${item.summary}</p>` : '';
        const activeClass = item._index === activeIndex ? ' is-active' : '';
        return `
          <article class="news-card news-small${activeClass}" data-news-index="${item._index}">
            <div class="news-img">
              <img src="${item.image}" alt="${item.title}" loading="lazy" decoding="async" fetchpriority="low">
            </div>
            <div class="news-body">
              <span class="news-tag ${getTagClass(item.category)}">${item.category || ''}</span>
              <h3>${item.title || ''}</h3>
              ${summary}
              <div class="news-meta">
                <span>${item.date || ''}</span>
                <a href="${buildNewsHref(item._index)}" class="news-more" data-news-index="${item._index}">${detailLabel}</a>
              </div>
            </div>
          </article>
        `;
      })
      .join('');

  }

  function updateUrl(activeIndex) {
    const url = new URL(window.location.href);
    url.searchParams.set('news', String(activeIndex));
    url.hash = 'about-news';
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }

  function hydrate(activeIndex, { syncUrl = false } = {}) {
    const items = getNewsItems();
    if (!items.length) {
      featureRoot.innerHTML = '';
      gridRoot.innerHTML = '';
      return;
    }

    const clamped = Math.max(0, Math.min(items.length - 1, activeIndex));
    renderFeature(items[clamped]);
    renderGrid(items, clamped);

    if (syncUrl) {
      updateUrl(clamped);
    }
  }

  function handleGridInteraction(event) {
    const trigger = event.target.closest('[data-news-index]');
    if (!trigger || !gridRoot.contains(trigger)) return;

    const nextIndex = Number.parseInt(trigger.getAttribute('data-news-index') || '', 10);
    if (!Number.isFinite(nextIndex)) return;

    event.preventDefault();
    event.stopPropagation();
    hydrate(nextIndex, { syncUrl: true });
    newsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  gridRoot.addEventListener('click', handleGridInteraction);

  const initialItems = getNewsItems();
  const initialIndex = parseActiveIndex(initialItems);
  hydrate(initialIndex, { syncUrl: false });

  window.addEventListener('tk168:languagechange', () => {
    const items = getNewsItems();
    const index = parseActiveIndex(items);
    hydrate(index, { syncUrl: false });
  });

  document.addEventListener('tk168:data-updated', (e) => {
    if (!e.detail?.journal) return;
    const items = getNewsItems();
    const index = Math.min(parseActiveIndex(items), Math.max(0, items.length - 1));
    hydrate(items.length ? index : 0, { syncUrl: false });
  });
})();
