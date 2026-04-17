const {
  vehicles = [],
  buildDetailUrl = (id) => `detail.html?id=${encodeURIComponent(id)}`
} = window.TK168_DATA || {};

const ITEMS_PER_PAGE = 6;
const grid = document.getElementById('favoriteVehicleGrid');
const pagination = document.getElementById('favoritePagination');
const dotsWrap = document.getElementById('favDots');
const prevBtn = document.getElementById('favPrev');
const nextBtn = document.getElementById('favNext');
const clearBtn = document.getElementById('favoriteClear');
const favoriteMobileViewport = window.matchMedia('(max-width: 760px)');
const FAVORITES_STORAGE_KEY = 'tk168_favorites';
const FAVORITES_WINDOW_NAME_KEY = 'tk168_favorites=';

window.TK168CommonLinks?.applyCommonLinks();
window.TK168PageChrome?.applyPageChrome({
  pageKey: 'favorite',
  inventoryHref: 'brand.html',
  favoriteHref: 'favorites.html'
});

const urlParams = new URLSearchParams(window.location.search);
const urlFavs = urlParams.get('fav');
if (urlFavs) {
  const ids = urlFavs.split(',').map((id) => id.trim()).filter(Boolean);
  try {
    window.localStorage?.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore storage failures
  }
  try {
    window.name = `${FAVORITES_WINDOW_NAME_KEY}${JSON.stringify(ids)}`;
  } catch {
    // ignore window.name failures
  }
}

let currentPage = 0;
let filteredFavorites = [];
let favoriteRenderMode = favoriteMobileViewport.matches ? 'mobile' : 'desktop';
let favoriteScrollFrame = 0;
let favoriteResizeFrame = 0;

function isFavoriteMobileView() {
  return favoriteMobileViewport.matches;
}

function getFavoriteLeadIndex() {
  return favoriteRenderMode === 'mobile'
    ? currentPage
    : currentPage * ITEMS_PER_PAGE;
}

function getFavoriteCards() {
  return Array.from(grid?.querySelectorAll('.v-card') || []);
}

function getClosestFavoriteCardIndex() {
  const cards = getFavoriteCards();
  if (!grid || !cards.length) return 0;

  const viewportCenter = grid.scrollLeft + (grid.clientWidth / 2);
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

function scrollToFavoriteCard(index, behavior = 'smooth') {
  const cards = getFavoriteCards();
  if (!cards.length) return;

  const clampedIndex = Math.max(0, Math.min(cards.length - 1, index));
  cards[clampedIndex].scrollIntoView({
    behavior,
    block: 'nearest',
    inline: 'start'
  });
}

function getFavoriteVehicles() {
  const ids = window.TK168Renderers?.getFavoriteVehicleIds?.() || [];
  const idSet = new Set(ids.map((id) => String(id)));
  return vehicles.filter((vehicle) => idSet.has(String(vehicle.id)));
}

function renderEmptyState() {
  if (!grid) return;
  delete grid.dataset.mobilePaged;
  grid.innerHTML = '';
  const emptyState = document.createElement('div');
  emptyState.className = 'bn-empty';
  emptyState.appendChild(document.createTextNode(
    window.TK168I18N?.t('favorite.empty') || '暂无收藏车辆，去选几台喜欢的吧。'
  ));
  grid.replaceChildren(emptyState);
}

function updatePagination() {
  if (!pagination || !dotsWrap || !prevBtn || !nextBtn) return;
  const mobilePaged = isFavoriteMobileView();
  const totalPages = Math.max(1, mobilePaged ? filteredFavorites.length : Math.ceil(filteredFavorites.length / ITEMS_PER_PAGE));
  const shouldShow = filteredFavorites.length > (mobilePaged ? 1 : ITEMS_PER_PAGE);
  pagination.style.display = shouldShow ? '' : 'none';

  window.TK168Renderers?.renderPaginationDots?.(dotsWrap, {
    totalCount: totalPages,
    activeIndex: currentPage,
    dataAttribute: 'data-favorite-page-dot',
    ariaLabelBuilder: (dotIndex) => `Page ${dotIndex + 1}`,
    onClick: (pageIndex) => goToPage(pageIndex)
  });

  prevBtn.disabled = totalPages <= 1 || currentPage <= 0;
  nextBtn.disabled = totalPages <= 1 || currentPage >= totalPages - 1;
}

function goToPage(page) {
  const totalPages = Math.max(1, isFavoriteMobileView() ? filteredFavorites.length : Math.ceil(filteredFavorites.length / ITEMS_PER_PAGE));
  currentPage = Math.max(0, Math.min(totalPages - 1, page));
  if (isFavoriteMobileView()) {
    scrollToFavoriteCard(currentPage);
    updatePagination();
    return;
  }
  renderPage();
}

function renderPage() {
  if (!grid) return;
  const renderMode = isFavoriteMobileView() ? 'mobile' : 'desktop';
  const leadIndex = getFavoriteLeadIndex();

  if (!filteredFavorites.length) {
    renderEmptyState();
    favoriteRenderMode = renderMode;
    updatePagination();
    return;
  }

  const totalDesktopPages = Math.max(1, Math.ceil(filteredFavorites.length / ITEMS_PER_PAGE));
  currentPage = renderMode === 'mobile'
    ? Math.max(0, Math.min(filteredFavorites.length - 1, leadIndex))
    : Math.max(0, Math.min(totalDesktopPages - 1, Math.floor(leadIndex / ITEMS_PER_PAGE)));

  const slice = renderMode === 'mobile'
    ? filteredFavorites
    : filteredFavorites.slice(currentPage * ITEMS_PER_PAGE, (currentPage * ITEMS_PER_PAGE) + ITEMS_PER_PAGE);

  if (renderMode === 'mobile') {
    grid.dataset.mobilePaged = 'true';
  } else {
    delete grid.dataset.mobilePaged;
    grid.scrollLeft = 0;
  }
  grid.innerHTML = '';
  slice.forEach((vehicle, index) => {
    const card = document.createElement('div');
    card.className = 'v-card';
    card.style.transitionDelay = `${index * 0.07}s`;
    card.innerHTML = window.TK168Renderers.buildInventoryCardHTML(
      vehicle,
      buildDetailUrl(vehicle.id, {})
    );
    card.querySelectorAll('img').forEach((image) => {
      image.loading = 'lazy';
      image.decoding = 'async';
      image.setAttribute('fetchpriority', 'low');
    });
    grid.appendChild(card);
    requestAnimationFrame(() => {
      card.classList.add('visible');
    });
  });

  grid.querySelectorAll('.v-card-like').forEach((btn) => {
    btn.classList.add('is-active');
    btn.setAttribute('aria-pressed', 'true');
  });
  window.TK168CommonLinks?.enhanceClickableCards(grid);
  favoriteRenderMode = renderMode;
  updatePagination();

  if (renderMode === 'mobile') {
    requestAnimationFrame(() => {
      scrollToFavoriteCard(currentPage, 'auto');
    });
  }
}

function refreshFavorites() {
  filteredFavorites = getFavoriteVehicles();
  const totalPages = Math.max(1, isFavoriteMobileView() ? filteredFavorites.length : Math.ceil(filteredFavorites.length / ITEMS_PER_PAGE));
  if (currentPage >= totalPages) currentPage = Math.max(0, totalPages - 1);
  renderPage();
}

function bindFavoriteMobileSlider() {
  if (!grid || grid.dataset.mobileSliderBound === '1') return;
  grid.dataset.mobileSliderBound = '1';

  grid.addEventListener('scroll', () => {
    if (!isFavoriteMobileView()) return;
    if (favoriteScrollFrame) return;
    favoriteScrollFrame = requestAnimationFrame(() => {
      favoriteScrollFrame = 0;
      const nextPage = getClosestFavoriteCardIndex();
      if (nextPage === currentPage) return;
      currentPage = nextPage;
      updatePagination();
    });
  }, { passive: true });

  const scheduleSync = () => {
    if (favoriteResizeFrame) cancelAnimationFrame(favoriteResizeFrame);
    favoriteResizeFrame = requestAnimationFrame(() => {
      favoriteResizeFrame = 0;
      const nextMode = isFavoriteMobileView() ? 'mobile' : 'desktop';
      if (nextMode !== favoriteRenderMode) {
        renderPage();
        return;
      }

      if (nextMode === 'mobile') {
        currentPage = getClosestFavoriteCardIndex();
        updatePagination();
      }
    });
  };

  if (typeof favoriteMobileViewport.addEventListener === 'function') {
    favoriteMobileViewport.addEventListener('change', scheduleSync);
  } else if (typeof favoriteMobileViewport.addListener === 'function') {
    favoriteMobileViewport.addListener(scheduleSync);
  }

  window.addEventListener('resize', scheduleSync);
}

prevBtn?.addEventListener('click', () => goToPage(currentPage - 1));
nextBtn?.addEventListener('click', () => goToPage(currentPage + 1));

clearBtn?.addEventListener('click', () => {
  const confirmMessage = window.TK168I18N?.t('favorite.clearConfirm') || '确定要清空收藏吗？';
  if (!window.confirm(confirmMessage)) return;
  try {
    window.localStorage?.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([]));
  } catch {
    // ignore storage failures
  }
  try {
    window.name = `${FAVORITES_WINDOW_NAME_KEY}[]`;
  } catch {
    // ignore window.name failures
  }
  window.dispatchEvent(new CustomEvent('favorites:changed', { detail: { ids: [] } }));
  refreshFavorites();
});

window.addEventListener('favorites:changed', () => {
  refreshFavorites();
});

bindFavoriteMobileSlider();
refreshFavorites();
