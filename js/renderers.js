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
    let match = trimmed.match(/^JPY\s+([\d,.]+)$/i);
    if (match) {
      return `<span class="card-price-amount">${match[1]}</span><span class="card-price-unit">JPY</span>`;
    }
    match = trimmed.match(/^¥\s*([\d,.]+)$/);
    if (match) {
      return `<span class="card-price-amount">${match[1]}</span><span class="card-price-unit">JPY</span>`;
    }
    match = trimmed.match(/^([\d,.]+)\s*(万\s*JPY|万元|万円|日元|JPY|円|元)$/);
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
    const isRentalFleetCard = variantKey === 'rentalInventory';
    const language = window.TK168I18N?.getLanguage?.() || 'ja';
    const rentalProfile = isRentalFleetCard ? window.TK168_DATA.getVehicleRentalProfile(vehicle) : null;
    const totalPrice = isRentalFleetCard && rentalProfile
      ? (window.TK168_DATA.getRentalDailyDisplayPrice(rentalProfile.dailyRate, language) || '')
      : getVehicleTotalPrice(vehicle);
    const basePrice = isRentalFleetCard && rentalProfile
      ? (window.TK168_DATA.getRentalManJpyDisplayPrice(rentalProfile.deposit) || '')
      : getVehicleBasePrice(vehicle);
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
      window.TK168_DATA?.formatVehicleMileageDisplay?.(vehicle.mileage, language, vehicle.mileageUnit)
      || '';
    const engineMetaValue = isRentalFleetCard
      ? (window.TK168_DATA?.formatVehicleEngineAndForcedInductionLine?.(vehicle, language)
        || window.TK168_DATA?.formatVehicleEngineLine?.(vehicle)
        || vehicle.engine
        || '-')
      : (window.TK168_DATA?.formatVehicleEngineLine?.(vehicle) || vehicle.engine);
    const metaItems = [
      { key: 'mileage', icon: 'v1.svg', alt: 'Mileage', value: mileageDisplay || '-' },
      { key: 'engine', icon: 'v2.svg', alt: 'Engine', value: engineMetaValue || '-' },
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
    const coverPhotoSrc = resolveVehicleMediaSource(vehicle.photo);
    const coverPhotoAlt = escapeHtmlText(vehicleName).replace(/"/g, '&quot;');
    const coverMarkup = variant.cover === 'v-card-img'
      ? `<div class="${variant.cover} v-card-img--skeleton-load">
        <span class="v-card-img__skeleton v-skeleton-block" aria-hidden="true"></span>
        <img src="${coverPhotoSrc}" alt="${coverPhotoAlt}" loading="lazy" decoding="async">
      </div>`
      : `<div class="${variant.cover}">
        <img src="${coverPhotoSrc}" alt="${coverPhotoAlt}" loading="lazy" decoding="async">
      </div>`;
    const primaryPriceLabel = isRentalFleetCard ? t('rental.priceDaily') : getPriceLabel('price.total');
    const secondaryPriceLabel = isRentalFleetCard ? t('rental.priceDeposit') : getPriceLabel('price.base');
    const primaryPriceHtml = `
          <div class="${variant.priceRow}">
            <span class="${variant.priceLabel}">${primaryPriceLabel}</span>
            <span class="${variant.priceValue}">${formatCardPriceMarkup(totalPrice)}</span>
          </div>`;
    const secondaryPriceHtml = isRentalFleetCard
      ? `
          <div class="${variant.priceRow} is-sub">
            <span class="${variant.priceSubLabel}">${secondaryPriceLabel}</span>
            <span class="${variant.priceSubValue}">${formatCardPriceMarkup(basePrice)}</span>
          </div>`
      : '';
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
      ${coverMarkup}
      <div class="${variant.content}">
        <div class="${variant.meta}">
          ${metaMarkup}
        </div>
        <div class="${variant.priceWrap}">
          ${primaryPriceHtml}${secondaryPriceHtml}
        </div>
        <a class="${variant.button}" href="${detailUrl}">${t('cta.viewDetail')}</a>
      </div>
    `;

    if (!variant.wrapperTag) return bodyMarkup;
    return `<${variant.wrapperTag} class="${variant.wrapperClass}">${bodyMarkup}</${variant.wrapperTag}>`;
  }

  function buildInventoryCardHTML(vehicle, detailUrl, options = {}) {
    const variantKey = options.rentalFleet ? 'rentalInventory' : 'inventory';
    return buildVehicleCardMarkup(vehicle, detailUrl, variantKey);
  }

  /**
   * 构造骨架卡片内部 HTML（不含 .v-card 外壳）。
   * 调用方需自行创建容器 element 并加上 `v-card is-skeleton` class。
   * 结构与 buildVehicleCardMarkup('inventory') 对齐，保证占位高度一致。
   */
  function buildVehicleSkeletonCardHTML() {
    const metaItem = `
      <div class="v-skeleton-meta-item">
        <span class="v-skeleton-block v-skeleton-circle" style="width:22px;height:22px;"></span>
        <span class="v-skeleton-block" style="width:60%;height:10px;"></span>
      </div>
    `;
    return `
      <div class="v-skeleton-header">
        <span class="v-skeleton-block" style="width:44px;height:44px;border-radius:10px;"></span>
        <div class="v-skeleton-text-stack">
          <span class="v-skeleton-block" style="width:55%;height:11px;"></span>
          <span class="v-skeleton-block" style="width:80%;height:14px;"></span>
          <span class="v-skeleton-block" style="width:40%;height:10px;"></span>
        </div>
      </div>
      <div class="v-skeleton-cover v-skeleton-block"></div>
      <div class="v-skeleton-meta">
        ${metaItem}${metaItem}${metaItem}${metaItem}
      </div>
      <div class="v-skeleton-price">
        <div class="v-skeleton-price-row">
          <span class="v-skeleton-block" style="width:30%;height:11px;"></span>
          <span class="v-skeleton-block" style="width:42%;height:18px;justify-self:end;"></span>
        </div>
      </div>
      <span class="v-skeleton-block v-skeleton-button"></span>
    `;
  }

  /**
   * 在指定 grid 容器内填充 N 张骨架卡片。
   * - container: grid 容器（如 #vehicleGrid / #rentalVehicleGrid）
   * - count: 数量（默认按容器列数 × 2 行估算，最多 6）
   */
  function renderVehicleSkeletons(container, count) {
    if (!container) return;
    const total = Math.max(1, count || 6);
    const frag = document.createDocumentFragment();
    for (let i = 0; i < total; i += 1) {
      const card = document.createElement('div');
      card.className = 'v-card is-skeleton visible';
      card.setAttribute('aria-hidden', 'true');
      card.dataset.skeleton = '1';
      card.innerHTML = buildVehicleSkeletonCardHTML();
      frag.appendChild(card);
    }
    container.replaceChildren(frag);
  }

  /**
   * 在库卡片主图：与全卡骨架相同的 v-skeleton-block 流光；最短展示一段时间避免磁盘缓存「一闪而过」；
   * decode 完成后再揭盖，减少解码闪屏。
   */
  function bindVehicleCardCoverSkeletons(root) {
    if (!root || typeof root.querySelectorAll !== 'function') return;
    const prefersReduced =
      typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minMs = prefersReduced ? 0 : 380;

    root.querySelectorAll('.v-card-img--skeleton-load').forEach((wrap) => {
      if (wrap.dataset.coverSkeletonBound === '1') return;
      wrap.dataset.coverSkeletonBound = '1';
      const img = wrap.querySelector(':scope > img');
      if (!img || !(img instanceof HTMLImageElement)) return;

      const t0 = typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
      let revealScheduled = false;

      function armReveal() {
        if (revealScheduled) return;
        revealScheduled = true;
        const now = typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
        const delay = Math.max(0, minMs - (now - t0));
        window.setTimeout(() => {
          wrap.classList.add('is-cover-loaded');
        }, delay);
      }

      function afterNetworkReady() {
        if (img.naturalWidth > 0 && typeof img.decode === 'function') {
          img.decode().then(armReveal).catch(armReveal);
        } else {
          armReveal();
        }
      }

      if (img.complete) {
        afterNetworkReady();
        return;
      }

      img.addEventListener('load', afterNetworkReady, { once: true });
      img.addEventListener('error', armReveal, { once: true });
    });
  }

  function buildFeaturedCardHTML(vehicle, detailUrl) {
    return buildVehicleCardMarkup(vehicle, detailUrl, 'featured');
  }

  function resolveVehiclePanoramaSource(vehicle) {
    const raw = vehicle?.panorama || vehicle?.panorama360 || vehicle?.panoramaUrl;
    if (!raw) return '';
    return resolveVehicleMediaSource(raw);
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
    const panoramaSrc = resolveVehiclePanoramaSource(vehicle);
    const spinThumbLabel = language === 'en' ? '360° view' : (language === 'ja' ? '360° ビュー' : '360° 看车');
    const spinThumbHint = panoramaSrc
      ? (language === 'en' ? 'Drag to look around' : (language === 'ja' ? 'ドラッグで見渡す' : '拖动环顾'))
      : (language === 'en' ? 'Not uploaded' : (language === 'ja' ? '未アップロード' : '未上传'));
    const panoramaAttr = panoramaSrc ? ` data-panorama="${panoramaSrc}"` : '';
    const spinThumbMarkup = `
      <button class="thumb thumb--spin" type="button" data-index="0" data-kind="spin"${panoramaAttr} data-poster="${resolveVehicleMediaSource(vehicle.gallery?.[0] || vehicle.photo)}" data-alt="${vehicleName} ${spinThumbLabel}">
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

  function buildDetailSpecsHTML(vehicle, options = {}) {
    const rentalDetail = Boolean(options.rentalDetail);
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
    /* 租赁 inventory 无 listing repairHistory / API 字段 → detail.html + from=rental 時不展示修復歴 */
    const minDaysNum = Math.max(
      1,
      Number(vehicle.minDays) ||
        Number(window.TK168_DATA?.getVehicleRentalProfile?.(vehicle)?.minDays) ||
        1,
    );
    const minDaysDisplay =
      language === 'en'
        ? `${minDaysNum} day${minDaysNum === 1 ? '' : 's'}`
        : language === 'ja'
          ? `${minDaysNum}日`
          : `${minDaysNum} 天`;
    const leftColumn = [
      [specLabels.year, formatRegistrationYear(vehicle.year) || `${vehicle.year}${language === 'en' ? '' : (language === 'ja' ? '年' : ' 年')}`],
      [specLabels.mileage, window.TK168_DATA?.formatVehicleMileageDisplay?.(vehicle.mileage, language, vehicle.mileageUnit) || emptyValue],
      ...(rentalDetail ? [[t('rental.minDays'), minDaysDisplay]] : []),
      ...(rentalDetail
        ? []
        : [[specLabels.repair, getVehicleListingField(vehicle, 'repairHistory') || emptyValue]]),
      [specLabels.inspection, getVehicleListingField(vehicle, 'vehicleInspection') || emptyValue],
      [specLabels.legalMaintenance, getVehicleListingField(vehicle, 'legalMaintenance') || emptyValue]
    ];
    const fuelGradeSpecRow = rentalDetail
      ? [t('rental.fuelType'), getVehicleFieldLabel('fuel', vehicle.fuel) || emptyValue]
      : [specLabels.fuelGrade, getVehicleListingField(vehicle, 'fuelGrade') || emptyValue];
    const rightColumn = [
      [specLabels.dealerWarranty, getVehicleConditionField(vehicle, 'dealerWarranty') || emptyValue],
      [specLabels.oneOwner, getVehicleConditionField(vehicle, 'oneOwner') || emptyValue],
      fuelGradeSpecRow
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

  function buildDetailBenefitsHTML(vehicle, options = {}) {
    const rentalDetail = Boolean(options.rentalDetail);
    const language = window.TK168I18N?.getLanguage?.() || 'ja';
    const dash = '-';
    const fuelRowLabel = rentalDetail
      ? t('rental.fuelType')
      : (language === 'en' ? 'Fuel type' : '燃料');
    const oilRowLabel =
      language === 'en' ? 'Octane / fuel grade' : '油種';
    const basicSpecs = [
      [language === 'en' ? 'Body type' : (language === 'ja' ? 'ボディタイプ' : '车身类型'), getVehicleFieldLabel('bodyStyle', vehicle.bodyStyle)],
      [language === 'en' ? 'Color' : (language === 'ja' ? '色' : '颜色'), getVehicleFieldLabel('bodyColor', vehicle.bodyColor)],
      [fuelRowLabel, getVehicleFieldLabel('fuel', vehicle.fuel)],
      [oilRowLabel, getVehicleFieldLabel('fuelOilType', vehicle.fuelOilType)],
      [language === 'en' ? 'Transmission' : (language === 'ja' ? 'ミッション' : '变速箱'), getVehicleFieldLabel('trans', vehicle.trans)]
    ];
    const highlightSpecs = [
      [language === 'en' ? 'Displacement' : (language === 'ja' ? '排気量' : '排气量'), getVehicleHighlightField(vehicle, 'displacement')],
      [language === 'en' ? 'Cylinder layout' : (language === 'ja' ? 'シリンダー' : '发动机缸数'), getVehicleHighlightField(vehicle, 'cylinders')],
      [language === 'en' ? 'Forced induction' : (language === 'ja' ? '過給' : '增压系统'), getVehicleHighlightField(vehicle, 'forcedInduction')],
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
    buildVehicleSkeletonCardHTML,
    renderVehicleSkeletons,
    buildDetailGalleryHTML,
    buildDetailSpecsHTML,
    buildDetailOverviewHTML,
    buildDetailBenefitsHTML,
    bindVehicleCardLikes,
    bindVehicleCardCoverSkeletons,
    getFavoriteVehicleIds: readFavoriteIds,
    renderPaginationDots
  };
})();
