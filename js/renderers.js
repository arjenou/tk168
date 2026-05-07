window.TK168Renderers = (() => {
  const detailGalleryClasses = ['shot-main', 'shot-front', 'shot-rear', 'shot-wheel'];
  const BRAND_BADGE_VER = '20260411a';
  const FAVORITES_STORAGE_KEY = 'tk168_favorites';
  const FAVORITES_WINDOW_NAME_KEY = 'tk168_favorites=';
  function t(key, params = {}) {
    return window.TK168I18N?.t(key, params) || key;
  }

  function escapeHtmlText(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function getPriceLabel(key) {
    return `${t(key)} ${t('price.taxIncluded')}`.trim();
  }

  function formatCardPriceMarkup(displayPrice = '') {
    const trimmed = String(displayPrice || '').trim();
    const match = trimmed.match(/^([\d,.]+)\s*(万円|JPY|円|万元|元)$/);
    if (!match) return trimmed;
    const [, amount, unit] = match;
    return `<span class="card-price-amount">${amount}</span><span class="card-price-unit">${unit}</span>`;
  }

  function resolveVehicleMediaSource(path) {
    if (typeof window.TK168_DATA?.resolveVehicleMediaSource === 'function') {
      return window.TK168_DATA.resolveVehicleMediaSource(path);
    }
    const rawPath = String(path || '').trim();
    if (!rawPath) return '';
    return rawPath.startsWith('assets/') ? rawPath : `assets/images/${rawPath}`;
  }

  function getPaginationDotIndices(totalCount, activeIndex, maxVisible = 3, isCompact = true) {
    const safeTotal = Math.max(0, Number(totalCount) || 0);
    if (!safeTotal) return [];

    const safeActive = Math.max(0, Math.min(safeTotal - 1, Number(activeIndex) || 0));
    const visibleCount = Math.max(1, Math.min(safeTotal, isCompact ? maxVisible : safeTotal));
    let start = Math.max(0, safeActive - Math.floor(visibleCount / 2));
    let end = start + visibleCount;

    if (end > safeTotal) {
      end = safeTotal;
      start = Math.max(0, end - visibleCount);
    }

    return Array.from({ length: end - start }, (_, offset) => start + offset);
  }

  function renderPaginationDots(container, {
    totalCount = 0,
    activeIndex = 0,
    maxVisible = 3,
    isCompact = true,
    dataAttribute = 'data-page-dot',
    dotClass = 'vehicle-slider-dot',
    activeClass = 'is-active',
    ariaLabelBuilder = (index) => `Page ${index + 1}`,
    onClick
  } = {}) {
    if (!container) return;

    const fragment = document.createDocumentFragment();
    getPaginationDotIndices(totalCount, activeIndex, maxVisible, isCompact).forEach((index) => {
      const dot = document.createElement('button');
      const isActive = index === activeIndex;
      dot.type = 'button';
      dot.className = `${dotClass}${isActive ? ` ${activeClass}` : ''}`;
      dot.setAttribute(dataAttribute, String(index));
      dot.setAttribute('aria-label', ariaLabelBuilder(index));
      dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      if (typeof onClick === 'function') {
        dot.addEventListener('click', () => onClick(index));
      }
      fragment.appendChild(dot);
    });

    container.replaceChildren(fragment);
  }

  function readFavoriteIds() {
    try {
      const raw = window.localStorage?.getItem(FAVORITES_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed.map((value) => String(value));
    } catch {
      // fall through
    }
    const nameValue = String(window.name || '');
    if (nameValue.startsWith(FAVORITES_WINDOW_NAME_KEY)) {
      const payload = nameValue.slice(FAVORITES_WINDOW_NAME_KEY.length);
      try {
        const parsed = JSON.parse(payload);
        if (Array.isArray(parsed)) return parsed.map((value) => String(value));
      } catch {
        // ignore invalid payload
      }
    }
    return [];
  }

  function writeFavoriteIds(ids) {
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

  function bindVehicleCardLikes() {
    /* 列表卡片已移除收藏星，保留空实现供各页兼容调用 */
  }

  function getVehicleTotalPrice(vehicle) {
    return window.TK168_DATA.getVehicleTotalPriceDisplay(vehicle);
  }

  function getVehicleBasePrice(vehicle) {
    return window.TK168_DATA.getVehicleBasePriceDisplay(vehicle);
  }

  function getVehicleName(vehicle, language) {
    return window.TK168_DATA.getVehicleName(vehicle, language);
  }

  function getVehicleFieldLabel(field, value) {
    return window.TK168_DATA.getVehicleFieldLabel(field, value);
  }

  function getVehicleOverview(vehicle) {
    return window.TK168_DATA.getVehicleOverview(vehicle);
  }

  function getVehicleBenefits(vehicle) {
    return window.TK168_DATA.getVehicleBenefits(vehicle);
  }

  function getVehicleFeatures(vehicle) {
    return window.TK168_DATA.getVehicleFeatures(vehicle);
  }

  function getVehicleConditionField(vehicle, key) {
    return window.TK168_DATA.getVehicleConditionField(vehicle, key);
  }

  function getVehicleListingField(vehicle, key) {
    return window.TK168_DATA.getVehicleListingField(vehicle, key);
  }

  function getVehicleHighlightField(vehicle, key) {
    return window.TK168_DATA.getVehicleHighlightField(vehicle, key);
  }

  function formatRegistrationYear(year) {
    return window.TK168_DATA.formatRegistrationYear(year);
  }

  function resolveVehicleCardBrandIcon(vehicle) {
    const resolve = window.TK168_DATA?.resolveVehicleBrandGlyphUrl;
    if (typeof resolve === 'function') return resolve(vehicle);
    const brand = window.TK168_DATA.getBrandByKey(vehicle.brandKey);
    if (brand?.file) return `assets/images/brands/logos/${brand.file}`;
    return 'assets/images/logo_TK168.svg';
  }

  function resolveVehicleCardBrandBadge(vehicle) {
    return resolveVehicleCardBrandIcon(vehicle);
  }

  function buildVehicleCardMarkup(vehicle, detailUrl, variantKey) {
    const variants = {
      inventory: {
        wrapperTag: '',
        wrapperClass: '',
        header: 'v-card-header',
        brandWrap: 'v-brand-icon-wrap',
        brandIcon: 'v-brand-icon',
        titleWrap: 'v-header-info',
        title: 'v-card-name',
        subtitle: 'v-card-meta',
        cover: 'v-card-img',
        content: 'v-card-body',
        meta: 'v-specs',
        metaItem: 'v-spec',
        metaIcon: '',
        metaValue: '',
        priceWrap: 'v-price-wrap',
        priceRow: 'v-price-row',
        priceLabel: 'v-price-label',
        priceValue: 'v-price',
        priceSubLabel: 'v-price-sub-label',
        priceSubValue: 'v-price-sub',
        button: 'v-detail-btn'
      },
      featured: {
        wrapperTag: 'article',
        wrapperClass: 'featured-card',
        header: 'card-header',
        brandWrap: 'card-brand-icon',
        brandIcon: '',
        titleWrap: 'card-title-wrap',
        title: 'card-title',
        subtitle: 'card-subtitle',
        cover: 'featured-cover',
        content: 'card-content',
        meta: 'card-meta',
        metaItem: 'meta-item',
        metaIcon: 'meta-icon',
        metaValue: 'meta-value',
        priceWrap: 'card-price',
        priceRow: 'card-price-row',
        priceLabel: 'card-price-label',
        priceValue: 'card-price-value',
        priceSubLabel: 'card-price-sub-label',
        priceSubValue: 'card-price-sub',
        button: 'card-button'
      }
    };

    const variant = variants[variantKey] || variants.inventory;
    const totalPrice = getVehicleTotalPrice(vehicle);
    const basePrice = getVehicleBasePrice(vehicle);
    const language = window.TK168I18N?.getLanguage?.() || 'ja';
    const vehicleName = getVehicleName(vehicle, language);
    const vehicleBrandLine = window.TK168_DATA.getVehicleBrandTitle(vehicle, language);
    const gradeTrim = String(vehicle.grade || '').trim();
    const subtitleParts = [vehicle.year, getVehicleFieldLabel('bodyStyle', vehicle.bodyStyle)].filter(Boolean);
    const vehicleModelLine = window.TK168_DATA.getVehicleModelDisplayName(vehicle, language)
      || window.TK168_DATA.getVehicleModelName(vehicle)
      || vehicleName;
    const gradeInlineHtml = gradeTrim
      ? `<span class="v-card-grade">${escapeHtmlText(gradeTrim)}</span>`
      : '';
    const titleStackHtml = [
      vehicleBrandLine
        ? `<span class="v-card-brand-line">${vehicleBrandLine}</span>`
        : '',
      `<span class="v-card-model-row"><span class="v-card-model-line">${vehicleModelLine}</span>${gradeInlineHtml}</span>`,
    ].join('');
    const vehicleBrandIcon = (variant === variants.inventory)
      ? resolveVehicleCardBrandBadge(vehicle)
      : resolveVehicleCardBrandIcon(vehicle);
    const brandWrapClass = (variant === variants.inventory)
      ? `${variant.brandWrap} v-mini-brand-badge`
      : variant.brandWrap;
    const brandIconClass = (() => {
      const base = variant.brandIcon ? variant.brandIcon : '';
      if (variant === variants.inventory) {
        return base ? `${base} v-mini-brand-glyph` : 'v-mini-brand-glyph';
      }
      return base;
    })();
    const mileageDisplay =
      window.TK168_DATA?.formatVehicleMileageDisplay?.(vehicle.mileage, language)
      || '';
    const metaItems = [
      { key: 'mileage', icon: 'v1.svg', alt: 'Mileage', value: mileageDisplay || '-' },
      { key: 'engine', icon: 'v2.svg', alt: 'Engine', value: window.TK168_DATA?.formatVehicleEngineLine?.(vehicle) || vehicle.engine },
      { key: 'fuel', icon: 'v3.svg', alt: 'Fuel', value: getVehicleFieldLabel('fuel', vehicle.fuel) },
      { key: 'transmission', icon: 'v4.svg', alt: 'Transmission', value: getVehicleFieldLabel('trans', vehicle.trans) }
    ];

    const metaMarkup = metaItems.map((item) => {
      const iconClasses = [variant.metaIcon, 'vehicle-spec-icon', `vehicle-spec-icon--${item.key}`]
        .filter(Boolean)
        .join(' ');
      const iconClassAttr = ` class="${iconClasses}"`;
      const valueClassAttr = variant.metaValue ? ` class="${variant.metaValue}"` : '';
      return `
        <div class="${variant.metaItem}">
          <img${iconClassAttr} src="assets/images/${item.icon}" alt="${item.alt}">
          <span${valueClassAttr}>${item.value}</span>
        </div>
      `;
    }).join('');

    const brandUrl = window.TK168_DATA?.buildBrandUrl
      ? window.TK168_DATA.buildBrandUrl(vehicle.brandKey)
      : 'brand.html';
    const bodyMarkup = `
      <div class="${variant.header}">
        <div class="${brandWrapClass}">
          <a class="v-mini-brand-link" href="${brandUrl}">
            <img${brandIconClass ? ` class="${brandIconClass}"` : ''} src="${vehicleBrandIcon}" alt="${vehicleName}">
          </a>
        </div>
        <div class="${variant.titleWrap}">
          <h3 class="${variant.title}">${titleStackHtml}</h3>
          <p class="${variant.subtitle}">${subtitleParts.join(' · ')}</p>
        </div>
      </div>
      <div class="${variant.cover}">
        <img src="${resolveVehicleMediaSource(vehicle.photo)}" alt="${vehicleName}">
      </div>
      <div class="${variant.content}">
        <div class="${variant.meta}">
          ${metaMarkup}
        </div>
        <div class="${variant.priceWrap}">
          <div class="${variant.priceRow}">
            <span class="${variant.priceLabel}">${getPriceLabel('price.total')}</span>
            <span class="${variant.priceValue}">${formatCardPriceMarkup(totalPrice)}</span>
          </div>
          <div class="${variant.priceRow} is-sub">
            <span class="${variant.priceSubLabel}">${getPriceLabel('price.base')}</span>
            <span class="${variant.priceSubValue}">${formatCardPriceMarkup(basePrice)}</span>
          </div>
        </div>
        <a class="${variant.button}" href="${detailUrl}">${t('cta.viewDetail')}</a>
      </div>
    `;

    if (!variant.wrapperTag) return bodyMarkup;
    return `<${variant.wrapperTag} class="${variant.wrapperClass}">${bodyMarkup}</${variant.wrapperTag}>`;
  }

  function buildInventoryCardHTML(vehicle, detailUrl) {
    return buildVehicleCardMarkup(vehicle, detailUrl, 'inventory');
  }

  function buildFeaturedCardHTML(vehicle, detailUrl) {
    return buildVehicleCardMarkup(vehicle, detailUrl, 'featured');
  }

  function buildDetailGalleryHTML(vehicle) {
    const detailGalleryLabels = [
      t('gallery.main'),
      t('gallery.front'),
      t('gallery.rear'),
      t('gallery.wheel')
    ];
    const vehicleName = getVehicleName(vehicle);
    const language = window.TK168I18N?.getLanguage?.() || 'ja';
    const spinThumbLabel = language === 'en' ? '360° view' : (language === 'ja' ? '360° ビュー' : '360° 看车');
    const spinThumbHint = language === 'en' ? 'Reserved area' : (language === 'ja' ? '導入準備中' : '预留功能区');
    const spinThumbMarkup = `
      <button class="thumb thumb--spin" type="button" data-index="0" data-kind="spin" data-poster="${resolveVehicleMediaSource(vehicle.gallery?.[0] || vehicle.photo)}" data-alt="${vehicleName} ${spinThumbLabel}">
        <span class="thumb-shot thumb-shot--spin" aria-hidden="true">
          <span class="thumb-spin-mark">360°</span>
          <span class="thumb-spin-caption">${spinThumbHint}</span>
        </span>
      </button>
    `;
    const imageThumbMarkup = vehicle.gallery.map((image, index) => {
      const imageSrc = resolveVehicleMediaSource(image);
      return `
      <button class="thumb" type="button" data-index="${index + 1}" data-kind="image" data-image="${imageSrc}" data-alt="${vehicleName} ${detailGalleryLabels[index] || t('gallery.angle')}">
        <span class="thumb-shot ${detailGalleryClasses[index] || detailGalleryClasses[0]}" aria-hidden="true" style="background-image: url('${imageSrc}');"></span>
      </button>
    `;
    }).join('');
    return `${spinThumbMarkup}${imageThumbMarkup}`;
  }

  function buildDetailSpecsHTML(vehicle) {
    const language = window.TK168I18N?.getLanguage?.() || 'ja';
    const emptyValue = '-';
    const specLabels = language === 'en'
      ? {
          year: 'Year (first registration)',
          mileage: 'Mileage',
          repair: 'Repair history',
          inspection: 'Vehicle inspection',
          legalMaintenance: 'Legal maintenance',
          fuelGrade: 'Fuel grade',
          dealerWarranty: 'Dealer warranty',
          oneOwner: 'One owner'
        }
      : (language === 'ja'
        ? {
            year: '年式(初度登録年)',
            mileage: '走行距離',
            repair: '修復歴',
            inspection: '車検',
            legalMaintenance: '法定整備',
            fuelGrade: '油種',
            dealerWarranty: '販売店保証',
            oneOwner: 'ワンオーナー'
          }
        : {
            year: '首次上牌年份',
            mileage: '行驶里程',
            repair: '修复历史',
            inspection: '车检',
            legalMaintenance: '法定整备',
            fuelGrade: '油种',
            dealerWarranty: '店铺质保',
            oneOwner: '一手车主'
          });
    /* 两列交错排版（与现有 .spec-table 样式一致）；已下线：禁煙車、正規輸入車、エコカー減税、レンタカーアップ、定期点検記録簿 */
    const leftColumn = [
      [specLabels.year, formatRegistrationYear(vehicle.year) || `${vehicle.year}${language === 'en' ? '' : (language === 'ja' ? '年' : ' 年')}`],
      [specLabels.mileage, window.TK168_DATA?.formatVehicleMileageDisplay?.(vehicle.mileage, language) || emptyValue],
      [specLabels.repair, getVehicleListingField(vehicle, 'repairHistory') || emptyValue],
      [specLabels.inspection, getVehicleListingField(vehicle, 'vehicleInspection') || emptyValue],
      [specLabels.legalMaintenance, getVehicleListingField(vehicle, 'legalMaintenance') || emptyValue]
    ];
    const rightColumn = [
      [specLabels.dealerWarranty, getVehicleConditionField(vehicle, 'dealerWarranty') || emptyValue],
      [specLabels.oneOwner, getVehicleConditionField(vehicle, 'oneOwner') || emptyValue],
      [specLabels.fuelGrade, getVehicleListingField(vehicle, 'fuelGrade') || emptyValue]
    ];
    const specs = [];
    for (let i = 0; i < leftColumn.length; i++) {
      specs.push(leftColumn[i]);
      if (rightColumn[i]) specs.push(rightColumn[i]);
    }

    return specs.map(([label, value]) => `
      <div class="spec-row">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
    `).join('');
  }

  function buildDetailOverviewHTML(vehicle) {
    return getVehicleOverview(vehicle).map((paragraph) => `<p>${paragraph}</p>`).join('');
  }

  function buildDetailBenefitsHTML(vehicle) {
    const language = window.TK168I18N?.getLanguage?.() || 'ja';
    const dash = '-';
    const basicSpecs = [
      [language === 'en' ? 'Body type' : (language === 'ja' ? 'ボディタイプ' : '车身类型'), getVehicleFieldLabel('bodyStyle', vehicle.bodyStyle)],
      [language === 'en' ? 'Color' : (language === 'ja' ? '色' : '颜色'), getVehicleFieldLabel('bodyColor', vehicle.bodyColor)],
      [language === 'en' ? 'Fuel type' : '油種', getVehicleFieldLabel('fuel', vehicle.fuel)],
      [language === 'en' ? 'Transmission' : (language === 'ja' ? 'ミッション' : '变速箱'), getVehicleFieldLabel('trans', vehicle.trans)]
    ];
    const highlightSpecs = [
      [language === 'en' ? 'Displacement' : (language === 'ja' ? '排気量' : '排气量'), getVehicleHighlightField(vehicle, 'displacement')],
      [language === 'en' ? 'Cylinder layout' : (language === 'ja' ? 'シリンダー' : '发动机缸数'), getVehicleHighlightField(vehicle, 'cylinders')],
      [language === 'en' ? 'Drive' : (language === 'ja' ? '駆動方式' : '驱动方式'), getVehicleHighlightField(vehicle, 'drive')],
      [language === 'en' ? 'Steering' : (language === 'ja' ? 'ハンドル' : '方向盘'), getVehicleHighlightField(vehicle, 'steering')],
      [language === 'en' ? 'Seats' : (language === 'ja' ? '乗車定員' : '乘车定员'), getVehicleHighlightField(vehicle, 'seats')],
      [language === 'en' ? 'Doors' : (language === 'ja' ? 'ドア数' : '车门数'), getVehicleHighlightField(vehicle, 'doors')],
      [language === 'en' ? 'Chassis tail' : (language === 'ja' ? '車台末尾番号' : '车台末尾号'), getVehicleHighlightField(vehicle, 'chassisTail')]
    ];
    const specs = [...basicSpecs, ...highlightSpecs];

    return specs.map(([label, value]) => {
      const display = value == null || String(value).trim() === '' ? dash : value;
      return `
      <div class="benefit-bar benefit-bar--spec">
        <span class="benefit-spec-label">${label}</span>
        <span class="benefit-spec-value">${display}</span>
      </div>
    `;
    }).join('');
  }

  return {
    buildInventoryCardHTML,
    buildFeaturedCardHTML,
    buildDetailGalleryHTML,
    buildDetailSpecsHTML,
    buildDetailOverviewHTML,
    buildDetailBenefitsHTML,
    bindVehicleCardLikes,
    getFavoriteVehicleIds: readFavoriteIds,
    renderPaginationDots
  };
})();
