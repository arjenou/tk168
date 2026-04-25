window.TK168SearchUI = (() => {
  const arrowSvg = `
    <svg viewBox="0 0 10 6" fill="none">
      <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </svg>
  `;

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => {
      if (char === '&') return '&amp;';
      if (char === '<') return '&lt;';
      if (char === '>') return '&gt;';
      if (char === '"') return '&quot;';
      return '&#39;';
    });
  }

  function cloneState(state) {
    return {
      brand: state.brand || '',
      type: state.type || '',
      price: state.price || '',
      priceMetric: state.priceMetric === 'base' ? 'base' : 'total',
      year: state.year || '',
      mileage: state.mileage || '',
      keyword: state.keyword || ''
    };
  }

  function createEmptyState() {
    return cloneState({});
  }

  function createInventorySearchUI({
    roots = [],
    mobileButtons = [],
    initialState = {},
    onSubmit,
    onFiltersChange
  }) {
    const state = cloneState(initialState);
    const desktopRoots = roots.filter(Boolean);
    const mobileCtas = mobileButtons.filter(Boolean);
    let openMenuState = null;
    let suppressFiltersNotify = true;

    function notifyFiltersChange() {
      if (suppressFiltersNotify || typeof onFiltersChange !== 'function') return;
      onFiltersChange(cloneState(state));
    }

    function getFieldOptions(field) {
      return [
        { value: '', label: window.TK168I18N?.t('search.all') || '不限' },
        ...window.TK168_DATA.getSearchFilterOptions(field)
      ];
    }

    function getMakerModelLabel() {
      if (state.brand) {
        const brand = window.TK168_DATA.getBrandByKey(state.brand);
        return brand ? window.TK168_DATA.getBrandLabel(brand) : (window.TK168I18N?.t('search.makeModel') || '品牌车型');
      }
      if (state.keyword) return state.keyword;
      return window.TK168I18N?.t('search.makeModel') || '品牌车型';
    }

    function getPriceLabel() {
      const defaultLabel = window.TK168I18N?.t('search.price') || '价格';
      if (!state.price) return defaultLabel;
      const optionLabel = window.TK168_DATA.getSearchFilterLabel('price', state.price);
      if (state.priceMetric !== 'base') return optionLabel;
      const basePrefix = window.TK168I18N?.getLanguage?.() === 'ja'
        ? '本体 '
        : '本体 ';
      return `${basePrefix}${optionLabel}`;
    }

    function closeMenu() {
      if (!openMenuState) return;
      const { button, menu } = openMenuState;
      openMenuState = null;
      try {
        if (button?.isConnected) {
          button.classList.remove('is-open');
          button.setAttribute('aria-expanded', 'false');
        }
        if (menu?.isConnected) menu.remove();
      } catch {
        /* ignore DOM edge cases */
      }
    }

    function handleViewportScroll(event) {
      if (!openMenuState) return;
      if (!openMenuState.menu?.isConnected) {
        closeMenu();
        return;
      }
      if (event.target instanceof Element && openMenuState.menu.contains(event.target)) return;
      closeMenu();
    }

    function getMenuPosition(root, button, minWidth = button.getBoundingClientRect().width) {
      const rootRect = root.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const width = Math.min(Math.max(buttonRect.width, minWidth), Math.max(rootRect.width - 12, buttonRect.width));
      const preferredLeft = buttonRect.left - rootRect.left;
      const maxLeft = Math.max(rootRect.width - width, 0);

      return {
        left: Math.min(Math.max(preferredLeft, 0), maxLeft),
        top: buttonRect.bottom - rootRect.top + 10,
        width
      };
    }

    function createDropdownMenu(root, button, className = '', minWidth = button.getBoundingClientRect().width) {
      const menu = document.createElement('div');
      const position = getMenuPosition(root, button, minWidth);
      menu.className = ['fb-filter-menu', className].filter(Boolean).join(' ');
      menu.style.left = `${position.left}px`;
      menu.style.top = `${position.top}px`;
      menu.style.width = `${position.width}px`;
      return menu;
    }

    function buildFilterOption({
      value,
      label,
      selected = false,
      iconSrc = '',
      iconAlt = '',
      note = '',
      mediaClass = ''
    }) {
      return `
        <button
          type="button"
          class="fb-filter-option${selected ? ' is-selected' : ''}"
          data-value="${escapeHtml(value)}"
        >
          <span class="fb-filter-option-main">
            ${iconSrc ? `
              <span class="fb-filter-option-media ${mediaClass}">
                <img src="${escapeHtml(iconSrc)}" alt="${escapeHtml(iconAlt)}" class="fb-filter-option-image">
              </span>
            ` : ''}
            <span class="fb-filter-option-copy">
              <span class="fb-filter-option-label">${escapeHtml(label)}</span>
              ${note ? `<span class="fb-filter-option-note">${escapeHtml(note)}</span>` : ''}
            </span>
          </span>
        </button>
      `;
    }

    function buildMenu(root, button, field) {
      const menu = createDropdownMenu(root, button, '', 220);
      const options = getFieldOptions(field);
      const selectedValue = state[field] || '';

      menu.innerHTML = `
        <div class="fb-filter-menu-body">
          ${options.map((option) => buildFilterOption({
            value: option.value,
            label: option.label,
            selected: option.value === selectedValue
          })).join('')}
        </div>
      `;

      menu.addEventListener('click', (event) => {
        const option = event.target.closest('.fb-filter-option');
        if (!option) return;
        state[field] = option.dataset.value || '';
        updateAll();
        closeMenu();
        notifyFiltersChange();
      });

      return menu;
    }

    function buildMakerModelMenu(root, button) {
      const menu = createDropdownMenu(root, button, 'fb-filter-menu--brand', 280);
      const brands = window.TK168_DATA.brands;
      const allLabel = window.TK168I18N?.t('search.all') || '不限';
      const allNote = window.TK168I18N?.getLanguage?.() === 'ja' ? 'すべてのブランド' : '全部品牌';

      menu.innerHTML = `
        <div class="fb-filter-menu-body">
          ${buildFilterOption({
            value: '',
            label: allLabel,
            selected: !state.brand,
            note: allNote
          })}
          ${brands.map((brand) => {
            const label = window.TK168_DATA.getBrandLabel(brand);
            return buildFilterOption({
              value: brand.key,
              label,
              selected: brand.key === state.brand
            });
          }).join('')}
        </div>
      `;

      menu.addEventListener('click', (event) => {
        const option = event.target.closest('.fb-filter-option');
        if (!option) return;
        state.brand = option.dataset.value || '';
        updateAll();
        closeMenu();
        notifyFiltersChange();
      });

      return menu;
    }

    function getPriceMetricTabs() {
      return [
        { value: 'total', label: window.TK168I18N?.t('price.total') || '总价' },
        { value: 'base', label: window.TK168I18N?.t('price.baseLong') || '车辆价格' }
      ];
    }

    function buildPriceMenu(root, button) {
      const menu = createDropdownMenu(root, button, 'fb-filter-menu--price', 280);
      const metricTabs = getPriceMetricTabs();
      const options = getFieldOptions('price');
      const baseNote = window.TK168I18N?.getLanguage?.() === 'ja' ? '本体価格で絞り込み' : '按车辆价格';

      menu.innerHTML = `
        <div class="fb-filter-menu-head">
          ${metricTabs.map((tab) => `
            <button
              type="button"
              class="fb-filter-toggle${state.priceMetric === tab.value ? ' is-active' : ''}"
              data-price-metric="${tab.value}"
            >${escapeHtml(tab.label)}</button>
          `).join('')}
        </div>
        <div class="fb-filter-menu-body">
          ${options.map((option) => buildFilterOption({
            value: option.value,
            label: option.label,
            selected: option.value === state.price,
            note: option.value && state.priceMetric === 'base' ? baseNote : ''
          })).join('')}
        </div>
      `;

      menu.addEventListener('click', (event) => {
        const metricButton = event.target.closest('[data-price-metric]');
        if (metricButton) {
          state.priceMetric = metricButton.dataset.priceMetric === 'base' ? 'base' : 'total';
          const nextMenu = buildPriceMenu(root, button);
          menu.replaceWith(nextMenu);
          if (openMenuState?.menu === menu) openMenuState.menu = nextMenu;
          notifyFiltersChange();
          return;
        }

        const option = event.target.closest('.fb-filter-option');
        if (!option) return;
        state.price = option.dataset.value || '';
        updateAll();
        closeMenu();
        notifyFiltersChange();
      });

      return menu;
    }

    function buildTypeMenu(root, button) {
      const menu = createDropdownMenu(root, button, 'fb-filter-menu--type', 260);
      const options = getFieldOptions('type');

      menu.innerHTML = `
        <div class="fb-filter-menu-body">
          ${options.map((option) => buildFilterOption({
            value: option.value,
            label: option.label,
            selected: option.value === state.type
          })).join('')}
        </div>
      `;

      menu.addEventListener('click', (event) => {
        const option = event.target.closest('.fb-filter-option');
        if (!option) return;
        state.type = option.dataset.value || '';
        updateAll();
        closeMenu();
        notifyFiltersChange();
      });

      return menu;
    }

    function openMenu(root, button, field) {
      closeMenu();
      let menu;
      if (field === 'makerModel') menu = buildMakerModelMenu(root, button);
      else if (field === 'price') menu = buildPriceMenu(root, button);
      else if (field === 'type') menu = buildTypeMenu(root, button);
      else menu = buildMenu(root, button, field);
      root.appendChild(menu);
      button.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
      openMenuState = { root, button, field, menu };
    }

    function updateButtons(root) {
      const buttons = [...root.querySelectorAll('.fb-filter')];

      buttons.forEach((button) => {
        const field = button.dataset.uiField;
        if (!field) return;

        const label = field === 'makerModel'
          ? getMakerModelLabel()
          : field === 'price'
            ? getPriceLabel()
            : window.TK168_DATA.getSearchFilterLabel(field, state[field]);

        button.dataset.filterField = field;
        button.innerHTML = `${escapeHtml(label)} ${arrowSvg}`;
        button.title = label;
        button.setAttribute('aria-haspopup', 'listbox');
        button.setAttribute('aria-expanded', openMenuState?.button === button ? 'true' : 'false');
        button.classList.toggle('is-active', field === 'makerModel'
          ? Boolean(state.brand || state.keyword)
          : field === 'price'
            ? Boolean(state.price)
            : Boolean(state[field]));
      });
    }

    function updateInputs() {
      desktopRoots.forEach((root) => {
        const input = root.querySelector('.fb-input');
        if (input) {
          if (input.value !== state.keyword) input.value = state.keyword;
          input.placeholder = window.TK168I18N?.t('search.placeholder') || '搜索品牌、车型或关键词';
        }

        const cta = root.querySelector('.fb-cta');
        if (cta) cta.textContent = window.TK168I18N?.t('search.cta') || '搜索车源';
      });

      mobileCtas.forEach((button) => {
        button.textContent = window.TK168I18N?.t('search.cta') || '搜索车源';
      });
    }

    function updateAll() {
      desktopRoots.forEach(updateButtons);
      updateInputs();
    }

    function submit() {
      closeMenu();
      if (typeof onSubmit === 'function') onSubmit(cloneState(state));
    }

    function reset(shouldSubmit = false) {
      closeMenu();
      Object.assign(state, createEmptyState());
      updateAll();
      if (shouldSubmit) submit();
    }

    desktopRoots.forEach((root) => {
      const buttons = [...root.querySelectorAll('.fb-filter')];
      buttons.forEach((button) => {
        const field = button.dataset.uiField;
        if (!field) return;

        button.addEventListener('click', (event) => {
          event.preventDefault();
          if (openMenuState && openMenuState.button === button) {
            closeMenu();
            return;
          }
          openMenu(root, button, field);
        });
      });

      const input = root.querySelector('.fb-input');
      if (input) {
        input.addEventListener('input', (event) => {
          state.keyword = event.target.value;
          updateInputs();
        });

        input.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') submit();
          if (event.key === 'Escape') {
            if (openMenuState) {
              closeMenu();
              return;
            }
            if (state.keyword) {
              state.keyword = '';
              updateAll();
            } else {
              reset(false);
            }
          }
        });
      }

      const logo = root.querySelector('.fb-logo');
      if (logo) {
        logo.style.cursor = 'pointer';
        logo.title = window.TK168I18N?.t('search.resetTitle') || '返回全部在库';
        logo.addEventListener('click', () => reset(true));
      }

      const cta = root.querySelector('.fb-cta');
      cta?.addEventListener('click', submit);
    });

    mobileCtas.forEach((button) => button.addEventListener('click', submit));

    document.addEventListener('click', (event) => {
      if (!openMenuState) return;
      const target = event.target;
      if (!(target instanceof Element)) return;

      const { root, button, menu } = openMenuState;
      if (!menu?.isConnected) {
        closeMenu();
        return;
      }

      if (menu.contains(target)) return;

      if (root.contains(target)) {
        const clickedButton = target.closest('.fb-filter');
        const clickedMenu = target.closest('.fb-filter-menu');
        if (clickedButton === button || (clickedMenu && clickedMenu === menu)) return;
      }

      closeMenu();
    });

    window.addEventListener('resize', closeMenu);
    window.addEventListener('scroll', handleViewportScroll, true);
    window.addEventListener('pagehide', closeMenu);
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) closeMenu();
    });
    window.addEventListener('tk168:languagechange', () => {
      closeMenu();
      desktopRoots.forEach((root) => {
        const logo = root.querySelector('.fb-logo');
        if (logo) logo.title = window.TK168I18N?.t('search.resetTitle') || '返回全部在库';
      });
      updateAll();
    });

    updateAll();
    queueMicrotask(() => {
      suppressFiltersNotify = false;
    });

    return {
      getState: () => cloneState(state),
      setState(nextState = {}) {
        Object.assign(state, cloneState(nextState));
        updateAll();
      },
      reset,
      submit
    };
  }

  return {
    createInventorySearchUI
  };
})();
