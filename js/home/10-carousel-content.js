;(() => {
const homeDataApi = window.TK168_DATA || {};

const {
  vehicles = [],
  getNewsItems,
  buildDetailUrl,
  buildInventoryUrl,
  parseInventoryFilters
} = homeDataApi;

const HOME_VEHICLE_POOL_SIZE = 18;
const HOME_VEHICLES_PER_PAGE = 6;

const homeVehicleGrid = document.getElementById('vehicleGrid');
const homeVehiclePagination = document.getElementById('homeVehiclePagination');
const homeVehicleDots = document.getElementById('homeVehicleDots');
const homeVehiclePrev = document.getElementById('homeVehiclePrev');
const homeVehicleNext = document.getElementById('homeVehicleNext');
const homeVehicleMobileViewport = window.matchMedia('(max-width: 760px)');
const homeVehicleTabletViewport = window.matchMedia('(max-width: 1180px)');

const homeSearchState = typeof parseInventoryFilters === 'function'
  ? parseInventoryFilters(window.location.search)
  : {};

let currentHomeVehiclePage = 0;
let currentHomeVehicleColumns = getHomeVehicleColumns();
let homeVehicleResizeFrame = 0;
const randomizedHomeVehicles = createRandomVehiclePool(vehicles, HOME_VEHICLE_POOL_SIZE);

function translate(key, params = {}) {
  return window.TK168I18N?.t(key, params) || key;
}

function shuffleItems(items) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function createRandomVehiclePool(source, limit) {
  if (!Array.isArray(source) || source.length === 0) return [];
  return shuffleItems(source).slice(0, Math.min(limit, source.length));
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

function getHomeVehicleTotalPages() {
  return Math.max(1, Math.ceil(randomizedHomeVehicles.length / getHomeVehiclesPerPage()));
}

function renderHomeVehiclePages() {
  if (!homeVehicleGrid) return;

  const pages = chunkHomeVehicles(randomizedHomeVehicles, getHomeVehiclesPerPage());
  const totalPages = Math.max(1, pages.length);
  currentHomeVehiclePage = Math.max(0, Math.min(totalPages - 1, currentHomeVehiclePage));
  currentHomeVehicleColumns = getHomeVehicleColumns();
  homeVehicleGrid.innerHTML = '';
  homeVehicleGrid.style.setProperty('--home-vehicle-columns', String(currentHomeVehicleColumns));

  (pages[currentHomeVehiclePage] || []).forEach((vehicle, index) => {
    const card = document.createElement('div');
    card.className = 'v-card fade-up visible';
    card.style.transitionDelay = `${index * 0.05}s`;
    card.innerHTML = window.TK168Renderers.buildInventoryCardHTML(
      vehicle,
      buildDetailUrl(vehicle.id, homeSearchState)
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
  const isInboundCategory = /(\u5165\u5eab|\u5230\u5e93)/.test(item.category || '');
  const newsHref = `about.html?news=${encodeURIComponent(String(index))}#about-news`;
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
  const [first, second, third] = items;
  if (!first || !second || !third) return;

  newsGrid.innerHTML = `
    ${buildNewsCardHTML(first, true, 0)}
    <div class="news-side">
      ${buildNewsCardHTML(second, false, 1)}
      ${buildNewsCardHTML(third, false, 2)}
    </div>
  `;

  window.TK168CommonLinks?.enhanceClickableCards(newsGrid);
  newsGrid.querySelectorAll('.news-card').forEach((element) => {
    element.classList.add('fade-up', 'visible');
  });
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
    initialState: homeSearchState,
    onSubmit: (filters) => {
      const target = buildInventoryUrl(filters);
      if (window.TK168LayoutShell?.navigate) {
        window.TK168LayoutShell.navigate(target);
      } else {
        window.location.href = target;
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

window.addEventListener('tk168:languagechange', () => {
  renderHomeContent();
});
})();
