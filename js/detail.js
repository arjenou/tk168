const {
  site,
  vehicles,
  getVehiclesByBrand,
  getVehicleName,
  buildDetailUrl
} = window.TK168_DATA;

window.TK168CommonLinks?.applyCommonLinks();

const detailContext = window.TK168InventoryContext.createDetailContext(window.location.search);
const requestedVehicleId = detailContext.requestedVehicleId;
let currentVehicle = detailContext.currentVehicle;
const isRentalDetail = detailContext.isRentalDetail;
const currentBrand = detailContext.currentBrand;
const currentFilters = detailContext.filters;
const hasActiveFilters = detailContext.hasActiveFilters;
const activeFilterCount = detailContext.activeFilterCount;
const inventoryHref = detailContext.inventoryHref;

window.TK168PageChrome?.applyPageChrome({
  pageKey: 'detail',
  inventoryHref
});

const detailShell = document.querySelector('.detail-shell');
detailShell?.classList.add('detail-shell--hydrating');

const thumbGrid = document.getElementById('thumbGrid');
const detailMainImage = document.getElementById('detailMainImage');
const spinViewerModal = document.getElementById('spinViewerModal');
const spinViewerClose = document.getElementById('spinViewerClose');
const spinViewerPoster = document.getElementById('spinViewerPoster');
const spinViewerBadge = document.getElementById('spinViewerBadge');
const spinViewerTitle = document.getElementById('spinViewerTitle');
const spinViewerText = document.getElementById('spinViewerText');
const featuredGrid = document.getElementById('featuredGrid');
const featuredSliderViewport = window.matchMedia('(max-width: 760px)');
const detailTitle = document.getElementById('detailTitle');
const detailFavoriteBtn = document.getElementById('detailFavoriteBtn');
const detailTotalPriceValue = document.getElementById('detailTotalPriceValue');
const detailBasePriceValue = document.getElementById('detailBasePriceValue');
const specTable = document.getElementById('specTable');
const detailOverview = document.getElementById('detailOverview');
const benefitBars = document.getElementById('benefitBars');
const featureGrid = document.getElementById('featureGrid');
const detailBackToBrand = document.getElementById('detailBackToBrand');
const detailPhoneLink = document.getElementById('detailPhoneLink');
const detailEmailLink = document.getElementById('detailEmailLink');
const detailStoreVisitLink = document.getElementById('detailStoreVisitLink');
const detailAdvisorPanel = document.getElementById('detailAdvisorPanel');
const detailAdvisorHours = document.getElementById('detailAdvisorHours');
const detailAdvisorCallNow = document.getElementById('detailAdvisorCallNow');
const detailAdvisorCallNowText = document.getElementById('detailAdvisorCallNowText');
const detailAdvisorCopyBtn = document.getElementById('detailAdvisorCopyBtn');
const detailAdvisorWhatsapp = document.getElementById('detailAdvisorWhatsapp');
const detailAdvisorBookLink = document.getElementById('detailAdvisorBookLink');
const detailAdvisorFeedback = document.getElementById('detailAdvisorFeedback');
const detailPriceHelpButtons = [...document.querySelectorAll('.detail-price-help')];
const priceHelpModal = document.getElementById('priceHelpModal');
const priceHelpModalTitle = document.getElementById('priceHelpModalTitle');
const priceHelpModalBody = document.getElementById('priceHelpModalBody');
const priceHelpModalClose = document.getElementById('priceHelpModalClose');
const galleryMainTrigger = document.getElementById('galleryMainTrigger');
const galleryLightbox = document.getElementById('galleryLightbox');
const galleryLightboxImage = document.getElementById('galleryLightboxImage');
const galleryLightboxTitle = document.getElementById('galleryLightboxTitle');
const galleryLightboxCounter = document.getElementById('galleryLightboxCounter');
const galleryLightboxClose = document.getElementById('galleryLightboxClose');
const galleryLightboxPrev = document.getElementById('galleryLightboxPrev');
const galleryLightboxNext = document.getElementById('galleryLightboxNext');
const galleryMainPrev = document.getElementById('galleryMainPrev');
const galleryMainNext = document.getElementById('galleryMainNext');
const thumbPrev = document.getElementById('thumbPrev');
const thumbNext = document.getElementById('thumbNext');
const FEATURED_SLIDER_SHELL_ID = 'detailFeaturedSliderShell';
const FEATURED_SLIDER_NAV_ID = 'detailFeaturedSliderNav';
const FAVORITES_STORAGE_KEY = 'tk168_favorites';
const FAVORITES_WINDOW_NAME_KEY = 'tk168_favorites=';

const detailStaffPhoto = document.getElementById('detailStaffPhoto');
const detailStaffPhotoImg = document.getElementById('detailStaffPhotoImg');
const detailStaffPortrait = document.getElementById('detailStaffPortrait');
const detailStaffBio = document.getElementById('detailStaffBio');
const detailStaffPhone = document.getElementById('detailStaffPhone');
const detailStaffPhoneLink = document.getElementById('detailStaffPhoneLink');

let currentGalleryIndex = 0;
let currentThumbOffset = 0;
let activePriceHelp = '';
let featuredSliderScrollFrame = 0;
let featuredSliderResizeFrame = 0;
let featuredSliderInteractionTimer = 0;
let lastSpinViewerTrigger = null;
const advisorPanelMobileMedia = window.matchMedia('(max-width: 760px)');

const GALLERY_SPIN_COPY = {
  zh: {
    badge: '360 LOOK',
    title: '360° 看车功能区',
    text: '这里先预留给环拍序列。后续接入素材后，可在主图区域左右拖动查看整车。',
    aria: '查看 360 看车功能区'
  },
  ja: {
    badge: '360 LOOK',
    title: '360° ビューエリア',
    text: 'ここは 360° 環拍素材の差し込み枠です。素材接続後は、メインエリアを左右にドラッグして車両全体を確認できます。',
    aria: '360 ビューエリアを表示'
  },
  en: {
    badge: '360 LOOK',
    title: '360° View Area',
    text: 'This area is reserved for a future 360° image sequence. Once the asset is connected, you will be able to drag left and right to inspect the entire vehicle.',
    aria: 'Open the 360 view area'
  }
};

function readFavoriteIds() {
  try {
    const raw = window.localStorage?.getItem(FAVORITES_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) return parsed.map((value) => String(value));
  } catch {
    // fall through
  }

  const nameValue = String(window.name || '');
  if (nameValue.startsWith(FAVORITES_WINDOW_NAME_KEY)) {
    try {
      const parsed = JSON.parse(nameValue.slice(FAVORITES_WINDOW_NAME_KEY.length));
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

function isCurrentVehicleFavorite() {
  return readFavoriteIds().includes(String(currentVehicle?.id || ''));
}

function syncDetailFavoriteButton() {
  if (!detailFavoriteBtn || !currentVehicle?.id) return;
  const isFavorite = isCurrentVehicleFavorite();
  detailFavoriteBtn.classList.toggle('is-active', isFavorite);
  detailFavoriteBtn.setAttribute('aria-pressed', isFavorite ? 'true' : 'false');
  detailFavoriteBtn.setAttribute('aria-label', 'Favorite vehicle');
}

function toggleCurrentVehicleFavorite() {
  if (!currentVehicle?.id) return;
  const favorites = new Set(readFavoriteIds());
  const vehicleId = String(currentVehicle.id);
  if (favorites.has(vehicleId)) favorites.delete(vehicleId);
  else favorites.add(vehicleId);
  const nextIds = Array.from(favorites);
  writeFavoriteIds(nextIds);
  window.dispatchEvent(new CustomEvent('favorites:changed', { detail: { ids: nextIds } }));
  syncDetailFavoriteButton();
}

const ADVISOR_PANEL_COPY = {
  zh: {
    hours: '营业时间 10:00-19:00（日本时间）',
    callNow: '立即拨打',
    copy: '复制号码',
    whatsapp: 'WhatsApp',
    book: '回电预约',
    copied: '号码已复制',
    copyFailed: '复制失败，请手动复制号码'
  },
  ja: {
    hours: '営業時間 10:00-19:00（日本時間）',
    callNow: '今すぐ電話',
    copy: '番号をコピー',
    whatsapp: 'WhatsApp',
    book: '折り返し予約',
    copied: '番号をコピーしました',
    copyFailed: 'コピーに失敗しました。手動で番号をコピーしてください'
  },
  en: {
    hours: 'Business hours 10:00-19:00 (Japan time)',
    callNow: 'Call now',
    copy: 'Copy number',
    whatsapp: 'WhatsApp',
    book: 'Request a callback',
    copied: 'Phone number copied',
    copyFailed: 'Copy failed. Please copy the number manually.'
  }
};

const PRICE_HELP_CONTENT = {
  zh: {
    total: {
      title: '总价说明',
      summary: '总价（含税）是以当前展示车源为基础，按通常成交流程估算的整体预算参考金额，用来帮助你快速判断购入区间。',
      included: [
        '车辆价格与消费税',
        '登记、名义变更等基础代办费用',
        '车检、整备、纳车准备等通常销售流程中会发生的必要项目',
        '店铺交付前的基础点检与文件办理费用'
      ],
      excluded: [
        '任意选择的延长保修、精品装饰或个性化改装',
        '特殊地区运输、港口转运或跨境物流等额外费用',
        '保险、金融分期方案及客户单独要求的附加服务'
      ],
      note: '最终金额会根据交付地区、登记方式、整备内容和追加服务而调整，正式成交前将由顾问提供明细报价。'
    },
    base: {
      title: '车辆价格说明',
      summary: '车辆价格（含税）指该车源本身的销售价格，是比较车型价值与车况等级的核心参考口径。',
      included: [
        '车辆本身售价与消费税',
        '与车源展示状态直接相关的基础在库成本',
        '用于完成正常销售所需的车辆原始商品化处理'
      ],
      excluded: [
        '登记、上牌、名义变更等行政代办费用',
        '车检、整备、运输、保险及延长保修等后续服务费用',
        '客户另行指定的升级项目与个别交付要求'
      ],
      note: '如页面同时标注总价，请以总价作为整体购入预算参考，车辆价格主要用于车型间横向比较。'
    }
  },
  ja: {
    total: {
      title: '支払総額について',
      summary: '支払総額（税込）は、現在掲載中の車両を前提に、通常の購入手続きで想定される総額の目安としてご案内する参考価格です。',
      included: [
        '車両本体価格および消費税',
        '登録・名義変更などの基本手続き費用',
        '車検、納車整備、納車準備など通常販売で必要となる基本項目',
        'ご納車前の基礎点検および書類手配に関する費用'
      ],
      excluded: [
        '延長保証、オプション装着、カスタムなど任意追加サービス',
        '遠方陸送、港湾輸送、輸出入手配など特別な物流費用',
        '保険、ローン手数料、お客様個別要望による追加対応費用'
      ],
      note: '実際のお支払い総額は、登録地域、整備内容、輸送条件、追加オプションの有無により変動します。正式なお見積りは担当スタッフよりご案内します。'
    },
    base: {
      title: '車両本体価格について',
      summary: '車両本体価格（税込）は、掲載車両そのものの販売価格を示すもので、車両価値やコンディション比較の基準となる価格です。',
      included: [
        '車両本体の販売価格および消費税',
        '掲載状態で販売するための基本的な商品化コスト',
        '通常販売に必要な車両側の基本準備'
      ],
      excluded: [
        '登録、名義変更、納車手続きなどの事務費用',
        '車検、整備、陸送、保険、保証延長などの付帯費用',
        'お客様ご指定のオプション装着や個別対応費用'
      ],
      note: '支払総額の表示がある場合は、ご購入予算の目安として支払総額をご確認ください。車両本体価格は車両同士を比較する際の参考としてご覧いただけます。'
    }
  },
  en: {
    total: {
      title: 'About the total purchase price',
      summary: 'The total purchase price includes the current vehicle and the standard costs that usually arise during a normal retail handover. It is shown as a practical budget reference.',
      included: [
        'Vehicle price and consumption tax',
        'Basic registration and ownership-transfer handling fees',
        'Standard inspection, delivery preparation, and handover work',
        'Basic pre-delivery checks and document handling costs'
      ],
      excluded: [
        'Extended warranty, optional accessories, or custom upgrades',
        'Special logistics such as long-distance transport or export handling',
        'Insurance, finance-related fees, and individually requested add-on services'
      ],
      note: 'The final amount may change depending on registration area, inspection scope, logistics, and any added options. Your advisor will provide a detailed quotation before closing.'
    },
    base: {
      title: 'About the vehicle base price',
      summary: 'The vehicle base price refers to the price of the car itself. It is the main reference used when comparing the value and condition level of different vehicles.',
      included: [
        'Vehicle selling price and consumption tax',
        'Basic merchandising cost tied to the displayed vehicle condition',
        'The minimum preparation needed to offer the vehicle for normal retail sale'
      ],
      excluded: [
        'Registration, ownership-transfer, and delivery administration fees',
        'Inspection, maintenance, transport, insurance, and warranty extension costs',
        'Optional upgrades and individually requested delivery arrangements'
      ],
      note: 'If the page also shows a total purchase price, use that figure as the main budget reference. The base price is mainly for comparing vehicles side by side.'
    }
  }
};

function applyDetailStaffCard() {
  if (!detailStaffPhoto || !detailStaffBio) return;
  const phoneRaw = String(currentVehicle?.staffPhone || '').trim();
  const customBio = String(currentVehicle?.staffMessage || '').trim();
  const staffPhoto = currentVehicle?.staffPhoto;
  const photoSrc = staffPhoto
    ? window.TK168_DATA.resolveVehicleMediaSource(staffPhoto)
    : '';

  if (photoSrc) {
    detailStaffPhoto.classList.add('staff-photo--custom');
    if (detailStaffPhotoImg) {
      detailStaffPhotoImg.hidden = false;
      detailStaffPhotoImg.src = photoSrc;
      detailStaffPhotoImg.alt = '';
    }
    if (detailStaffPortrait) detailStaffPortrait.hidden = true;
  } else {
    detailStaffPhoto.classList.remove('staff-photo--custom');
    if (detailStaffPhotoImg) {
      detailStaffPhotoImg.hidden = true;
      detailStaffPhotoImg.removeAttribute('src');
    }
    if (detailStaffPortrait) detailStaffPortrait.hidden = false;
  }

  if (customBio) {
    detailStaffBio.textContent = customBio;
    detailStaffBio.removeAttribute('data-i18n');
  } else {
    detailStaffBio.setAttribute('data-i18n', 'detail.staffBio');
    const translated = window.TK168I18N?.t('detail.staffBio');
    if (translated) detailStaffBio.textContent = translated;
  }

  if (phoneRaw && detailStaffPhone && detailStaffPhoneLink) {
    detailStaffPhone.hidden = false;
    detailStaffPhoneLink.href = `tel:${phoneRaw.replace(/\s+/g, '')}`;
    detailStaffPhoneLink.textContent = phoneRaw;
  } else if (detailStaffPhone) {
    detailStaffPhone.hidden = true;
  }
}

function formatPriceMarkup(displayPrice = '') {
  const trimmed = String(displayPrice || '').trim();
  const match = trimmed.match(/^([\d,.]+)(万円|円|万元|元)$/);
  if (!match) return trimmed;
  const [, amount, unit] = match;
  return `<span class="detail-price-amount">${amount}</span><span class="detail-price-unit">${unit}</span>`;
}

function getDetailLanguage() {
  const language = window.TK168I18N?.getLanguage?.();
  if (language === 'zh' || language === 'ja' || language === 'en') return language;
  const docLang = document.documentElement.lang?.toLowerCase() || '';
  if (docLang.startsWith('en')) return 'en';
  if (docLang.startsWith('zh')) return 'zh';
  return 'ja';
}

function getAdvisorPanelCopy() {
  const language = getDetailLanguage();
  return ADVISOR_PANEL_COPY[language] || ADVISOR_PANEL_COPY.ja || ADVISOR_PANEL_COPY.zh;
}

function buildWhatsappHref(phone = '') {
  const compact = String(phone).replace(/[^\d+]/g, '').replace(/^\+/, '');
  return `https://wa.me/${compact}`;
}

function setAdvisorFeedback(text = '', isError = false) {
  if (!detailAdvisorFeedback) return;
  detailAdvisorFeedback.textContent = text;
  detailAdvisorFeedback.style.color = isError ? '#b8482f' : 'rgba(23, 23, 23, 0.62)';
}

function closeAdvisorPanel() {
  if (!detailAdvisorPanel || detailAdvisorPanel.hidden) return;
  detailAdvisorPanel.hidden = true;
  detailPhoneLink?.setAttribute('aria-expanded', 'false');
  detailPhoneLink?.classList.remove('is-open');
  setAdvisorFeedback('');
}

function openAdvisorPanel() {
  if (!detailAdvisorPanel) return;
  detailAdvisorPanel.hidden = false;
  detailPhoneLink?.setAttribute('aria-expanded', 'true');
  detailPhoneLink?.classList.add('is-open');
  setAdvisorFeedback('');
}

function syncAdvisorPanelCopy() {
  const copy = getAdvisorPanelCopy();
  if (detailAdvisorHours) detailAdvisorHours.textContent = copy.hours;
  if (detailAdvisorCallNowText) detailAdvisorCallNowText.textContent = copy.callNow;
  if (detailAdvisorCopyBtn) detailAdvisorCopyBtn.textContent = copy.copy;
  if (detailAdvisorWhatsapp) detailAdvisorWhatsapp.textContent = copy.whatsapp;
  if (detailAdvisorBookLink) detailAdvisorBookLink.textContent = copy.book;
}

function copyPhoneFallback(text) {
  const input = document.createElement('textarea');
  input.value = text;
  input.setAttribute('readonly', 'true');
  input.style.position = 'fixed';
  input.style.left = '-9999px';
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand('copy');
  document.body.removeChild(input);
  return copied;
}

async function copyAdvisorPhone() {
  const copy = getAdvisorPanelCopy();
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(site.phone);
      setAdvisorFeedback(copy.copied, false);
      return;
    }

    const copied = copyPhoneFallback(site.phone);
    setAdvisorFeedback(copied ? copy.copied : copy.copyFailed, !copied);
  } catch {
    const copied = copyPhoneFallback(site.phone);
    setAdvisorFeedback(copied ? copy.copied : copy.copyFailed, !copied);
  }
}

function getGalleryItems() {
  return [...thumbGrid.querySelectorAll('.thumb')].map((thumb, index) => ({
    index,
    kind: thumb.dataset.kind || 'image',
    src: thumb.dataset.image,
    poster: thumb.dataset.poster || '',
    alt: thumb.dataset.alt || `${getVehicleName(currentVehicle)} ${(window.TK168I18N?.t('gallery.angle') || '视角')} ${index + 1}`
  }));
}

function clampGalleryIndex(index) {
  const items = getGalleryItems();
  if (items.length === 0) return 0;
  return (index + items.length) % items.length;
}

function getThumbVisibleCount() {
  if (window.innerWidth <= 640) return 3;
  return 4;
}

function getThumbMaxOffset() {
  return Math.max(0, getGalleryItems().length - getThumbVisibleCount());
}

function updateThumbRail() {
  const items = getGalleryItems();
  const visibleCount = getThumbVisibleCount();
  const maxOffset = getThumbMaxOffset();
  currentThumbOffset = Math.min(currentThumbOffset, maxOffset);

  thumbGrid?.style.setProperty('--thumb-visible-count', visibleCount);
  thumbGrid?.style.setProperty('--thumb-offset', String(currentThumbOffset));

  const hasMultipleImages = getImageGalleryItems(items).length > 1;
  if (thumbPrev) thumbPrev.disabled = !hasMultipleImages;
  if (thumbNext) thumbNext.disabled = !hasMultipleImages;
}

function revealThumb(index) {
  const visibleCount = getThumbVisibleCount();
  const maxOffset = getThumbMaxOffset();

  if (index < currentThumbOffset) currentThumbOffset = index;
  if (index >= currentThumbOffset + visibleCount) currentThumbOffset = index - visibleCount + 1;

  currentThumbOffset = Math.max(0, Math.min(currentThumbOffset, maxOffset));
  updateThumbRail();
}

function getSpinCopy() {
  const language = getDetailLanguage();
  return GALLERY_SPIN_COPY[language] || GALLERY_SPIN_COPY.ja || GALLERY_SPIN_COPY.zh;
}

function getDefaultGalleryIndex() {
  const items = getGalleryItems();
  if (!items.length) return 0;
  const firstImageIndex = items.findIndex((item) => item.kind === 'image');
  return firstImageIndex >= 0 ? firstImageIndex : 0;
}

function getImageGalleryItems(items = getGalleryItems()) {
  return items.filter((item) => item.kind === 'image');
}

function getImageGalleryPosition(index, items = getGalleryItems()) {
  const imageItems = getImageGalleryItems(items);
  const imagePosition = imageItems.findIndex((item) => item.index === index);
  return imagePosition >= 0 ? imagePosition : 0;
}

function renderVehicleHeader() {
  const vehicleName = getVehicleName(currentVehicle);
  const primaryImage = window.TK168_DATA.resolveVehicleMediaSource(currentVehicle.gallery?.[0] || currentVehicle.photo);
  document.title = `${vehicleName} — TK168 Premium Automotive`;
  detailTitle.textContent = vehicleName;
  detailTotalPriceValue.innerHTML = formatPriceMarkup(window.TK168_DATA.getVehicleTotalPriceDisplay(currentVehicle));
  detailBasePriceValue.innerHTML = formatPriceMarkup(window.TK168_DATA.getVehicleBasePriceDisplay(currentVehicle));
  setMainGalleryImage(primaryImage, `${vehicleName} ${window.TK168I18N?.t('gallery.main') || '主图'}`);
  if (detailBackToBrand && activeFilterCount > 0) {
    detailBackToBrand.textContent = window.TK168I18N?.t('detail.backToResults') || '返回筛选结果';
  }
  syncDetailFavoriteButton();
}

function setMainGalleryImage(imageSrc, imageAlt) {
  galleryMainTrigger?.setAttribute('aria-label', window.TK168I18N?.t('gallery.open') || '查看车辆大图');
  detailMainImage.src = imageSrc;
  detailMainImage.alt = imageAlt;
}

function openSpinViewer(item = getGalleryItems().find((galleryItem) => galleryItem.kind === 'spin')) {
  if (!spinViewerModal) return;
  const copy = getSpinCopy();
  const posterSrc = item?.poster || window.TK168_DATA.resolveVehicleMediaSource(currentVehicle.gallery?.[0] || currentVehicle.photo);
  const posterAlt = item?.alt || `${getVehicleName(currentVehicle)} 360°`;
  if (spinViewerPoster) {
    spinViewerPoster.src = posterSrc;
    spinViewerPoster.alt = posterAlt;
  }
  if (spinViewerBadge) spinViewerBadge.textContent = copy.badge;
  if (spinViewerTitle) spinViewerTitle.textContent = copy.title;
  if (spinViewerText) spinViewerText.textContent = copy.text;

  lastSpinViewerTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  spinViewerModal.classList.add('is-open');
  spinViewerModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('spin-viewer-open');
  spinViewerClose?.focus();
}

function closeSpinViewer() {
  if (!spinViewerModal) return;
  spinViewerModal.classList.remove('is-open');
  spinViewerModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('spin-viewer-open');
  if (lastSpinViewerTrigger && typeof lastSpinViewerTrigger.focus === 'function') {
    lastSpinViewerTrigger.focus();
  }
  lastSpinViewerTrigger = null;
}

function setActiveThumb(thumb) {
  thumbGrid.querySelectorAll('.thumb').forEach((item) => item.classList.remove('is-active'));
  thumb.classList.add('is-active');
}

function syncGallery(index, direction = index >= currentGalleryIndex ? 1 : -1) {
  const items = getGalleryItems();
  if (items.length === 0) return;

  currentGalleryIndex = findNextImageIndex(index, direction);
  const currentItem = items[currentGalleryIndex];
  const activeThumb = thumbGrid.querySelector(`.thumb[data-index="${currentGalleryIndex}"]`);

  if (activeThumb) setActiveThumb(activeThumb);
  setMainGalleryImage(currentItem.src, currentItem.alt);
  revealThumb(currentGalleryIndex);
}

function findNextImageIndex(index, direction = 1) {
  const items = getGalleryItems();
  if (!items.length) return 0;
  let candidate = clampGalleryIndex(index);
  for (let step = 0; step < items.length; step += 1) {
    if (items[candidate]?.kind !== 'spin') return candidate;
    candidate = clampGalleryIndex(candidate + direction);
  }
  return clampGalleryIndex(index);
}

function updateLightbox(index) {
  const items = getGalleryItems();
  if (items.length === 0) return;
  const imageItems = getImageGalleryItems(items);

  const direction = index >= currentGalleryIndex ? 1 : -1;
  currentGalleryIndex = findNextImageIndex(index, direction);
  const currentItem = items[currentGalleryIndex];

  galleryLightboxImage.src = currentItem.src;
  galleryLightboxImage.alt = currentItem.alt;
  galleryLightboxTitle.textContent = currentItem.alt;
  galleryLightboxCounter.textContent = `${getImageGalleryPosition(currentGalleryIndex, items) + 1} / ${imageItems.length}`;

  syncGallery(currentGalleryIndex, direction);
}

function openLightbox(index = currentGalleryIndex) {
  if (!galleryLightbox) return;
  const item = getGalleryItems()[clampGalleryIndex(index)];
  if (item?.kind === 'spin') return;
  updateLightbox(index);
  galleryLightbox.classList.add('is-open');
  galleryLightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-open');
  galleryLightboxClose?.focus();
}

function closeLightbox() {
  if (!galleryLightbox) return;
  galleryLightbox.classList.remove('is-open');
  galleryLightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
}

function stepLightbox(direction) {
  updateLightbox(currentGalleryIndex + direction);
}

function renderGallery() {
  thumbGrid.innerHTML = window.TK168Renderers.buildDetailGalleryHTML(currentVehicle);
  currentThumbOffset = 0;
  updateThumbRail();
  syncGallery(getDefaultGalleryIndex());
}

function renderSpecs() {
  specTable.innerHTML = window.TK168Renderers.buildDetailSpecsHTML(currentVehicle);
}

function renderOverview() {
  detailOverview.innerHTML = window.TK168Renderers.buildDetailOverviewHTML(currentVehicle);
}

function renderBenefits() {
  benefitBars.innerHTML = window.TK168Renderers.buildDetailBenefitsHTML(currentVehicle);
}

function renderFeatures() {
  featureGrid.innerHTML = window.TK168Renderers.buildDetailFeaturesHTML(currentVehicle);
}

function syncLinks() {
  const params = new URLSearchParams();
  params.set('id', currentVehicle.id);
  const telHref = `tel:${site.phone.replace(/\s+/g, '')}`;
  detailBackToBrand.href = inventoryHref;
  detailPhoneLink.href = telHref;
  detailEmailLink.href = `stock-confirm.html?${params.toString()}`;
  if (detailStoreVisitLink) {
    detailStoreVisitLink.href = `inquiry.html?${params.toString()}`;
  }
  if (detailAdvisorCallNow) {
    detailAdvisorCallNow.href = telHref;
  }
  if (detailAdvisorWhatsapp) {
    detailAdvisorWhatsapp.href = buildWhatsappHref(site.phone);
  }
  if (detailAdvisorBookLink) {
    detailAdvisorBookLink.href = `inquiry.html?${params.toString()}`;
  }
  syncAdvisorPanelCopy();
  if (detailPhoneLink) {
    detailPhoneLink.setAttribute('aria-haspopup', 'dialog');
    if (!detailPhoneLink.hasAttribute('aria-expanded')) {
      detailPhoneLink.setAttribute('aria-expanded', 'false');
    }
  }
}

function buildPriceHelpModalHTML(kind) {
  const language = getDetailLanguage();
  const content =
    PRICE_HELP_CONTENT[language]?.[kind]
    || PRICE_HELP_CONTENT.en?.[kind]
    || PRICE_HELP_CONTENT.ja?.[kind]
    || PRICE_HELP_CONTENT.zh?.[kind]
    || PRICE_HELP_CONTENT.en?.total
    || PRICE_HELP_CONTENT.ja?.total
    || PRICE_HELP_CONTENT.zh?.total;
  const sectionLabels = language === 'en'
    ? { included: 'Usually included', excluded: 'Usually excluded', note: 'Note' }
    : (language === 'ja'
      ? { included: '通常含まれる内容', excluded: '通常含まれない内容', note: 'ご案内' }
      : { included: '通常包含项目', excluded: '通常不含项目', note: '补充说明' });

  return {
    title: content.title,
    body: `
      <div class="price-help-section">
        <div class="price-help-section-title">${content.title}</div>
        <p class="price-help-section-text">${content.summary}</p>
      </div>
      <div class="price-help-section">
        <div class="price-help-section-title">${sectionLabels.included}</div>
        <ul class="price-help-list">
          ${content.included.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      <div class="price-help-section">
        <div class="price-help-section-title">${sectionLabels.excluded}</div>
        <ul class="price-help-list">
          ${content.excluded.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      <div class="price-help-section is-note">
        <div class="price-help-section-title">${sectionLabels.note}</div>
        <p class="price-help-section-text">${content.note}</p>
      </div>
    `
  };
}

function closePriceHelp() {
  if (!priceHelpModal) return;
  activePriceHelp = '';
  priceHelpModal.classList.remove('is-open');
  priceHelpModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('price-help-open');

  detailPriceHelpButtons.forEach((button) => {
    button.classList.remove('is-active');
  });
}

function togglePriceHelp(kind, forceOpen = false) {
  if (!priceHelpModal || !priceHelpModalTitle || !priceHelpModalBody) return;
  const nextKind = !forceOpen && activePriceHelp === kind ? '' : kind;
  if (!nextKind) {
    closePriceHelp();
    return;
  }

  activePriceHelp = nextKind;
  const modalContent = buildPriceHelpModalHTML(nextKind);
  priceHelpModalTitle.textContent = modalContent.title;
  priceHelpModalBody.innerHTML = modalContent.body;
  priceHelpModal.classList.add('is-open');
  priceHelpModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('price-help-open');

  detailPriceHelpButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.priceHelp === nextKind);
  });
}

thumbGrid?.addEventListener('click', event => {
  const thumb = event.target.closest('.thumb');
  if (!thumb) return;
  const targetIndex = Number(thumb.dataset.index || 0);
  if (thumb.dataset.kind === 'spin') {
    openSpinViewer(getGalleryItems().find((item) => item.index === targetIndex));
    return;
  }
  syncGallery(targetIndex, targetIndex >= currentGalleryIndex ? 1 : -1);
  openLightbox(targetIndex);
});

galleryMainTrigger?.addEventListener('click', () => {
  const currentItem = getGalleryItems()[currentGalleryIndex];
  if (currentItem?.kind === 'spin') return;
  openLightbox(currentGalleryIndex);
});
galleryMainTrigger?.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  const currentItem = getGalleryItems()[currentGalleryIndex];
  if (currentItem?.kind === 'spin') return;
  openLightbox(currentGalleryIndex);
});

galleryMainPrev?.addEventListener('click', (event) => {
  event.stopPropagation();
  syncGallery(currentGalleryIndex - 1, -1);
});

galleryMainNext?.addEventListener('click', (event) => {
  event.stopPropagation();
  syncGallery(currentGalleryIndex + 1, 1);
});

galleryLightbox?.addEventListener('click', (event) => {
  if (event.target.closest('[data-lightbox-close], .gallery-lightbox-close')) {
    closeLightbox();
  }
});

galleryLightboxPrev?.addEventListener('click', () => stepLightbox(-1));
galleryLightboxNext?.addEventListener('click', () => stepLightbox(1));
galleryLightboxClose?.addEventListener('click', closeLightbox);
spinViewerModal?.addEventListener('click', (event) => {
  if (event.target.closest('[data-spin-viewer-close], .spin-viewer-close')) {
    closeSpinViewer();
  }
});
spinViewerClose?.addEventListener('click', closeSpinViewer);
thumbPrev?.addEventListener('click', () => {
  syncGallery(currentGalleryIndex - 1, -1);
});
thumbNext?.addEventListener('click', () => {
  syncGallery(currentGalleryIndex + 1, 1);
});

detailPriceHelpButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    togglePriceHelp(button.dataset.priceHelp || 'total');
  });
});

priceHelpModal?.addEventListener('click', (event) => {
  if (event.target.closest('[data-price-help-close], .price-help-modal-close')) {
    closePriceHelp();
  }
});

priceHelpModalClose?.addEventListener('click', closePriceHelp);

detailPhoneLink?.addEventListener('click', (event) => {
  if (advisorPanelMobileMedia.matches) {
    return;
  }
  event.preventDefault();
  if (!detailAdvisorPanel || detailAdvisorPanel.hidden) {
    openAdvisorPanel();
  } else {
    closeAdvisorPanel();
  }
});

detailAdvisorCopyBtn?.addEventListener('click', () => {
  copyAdvisorPhone();
});

detailFavoriteBtn?.addEventListener('click', (event) => {
  event.preventDefault();
  toggleCurrentVehicleFavorite();
});

document.addEventListener('click', (event) => {
  if (!detailAdvisorPanel || detailAdvisorPanel.hidden) return;
  if (detailAdvisorPanel.contains(event.target)) return;
  if (detailPhoneLink?.contains(event.target)) return;
  closeAdvisorPanel();
});

if (typeof advisorPanelMobileMedia.addEventListener === 'function') {
  advisorPanelMobileMedia.addEventListener('change', () => {
    if (advisorPanelMobileMedia.matches) closeAdvisorPanel();
  });
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && spinViewerModal?.classList.contains('is-open')) {
    closeSpinViewer();
    return;
  }
  if (event.key === 'Escape' && activePriceHelp) {
    closePriceHelp();
  }
  if (event.key === 'Escape') {
    closeAdvisorPanel();
  }
  if (!galleryLightbox?.classList.contains('is-open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') stepLightbox(-1);
  if (event.key === 'ArrowRight') stepLightbox(1);
});

window.addEventListener('resize', updateThumbRail);
window.addEventListener('favorites:changed', syncDetailFavoriteButton);

function renderFeaturedCars() {
  if (!featuredGrid) return;

  const featuredCars = getVehiclesByBrand(currentVehicle.brandKey)
    .filter((vehicle) => vehicle.id !== currentVehicle.id)
    .slice(0, 3);

  const fallbackCars = vehicles
    .filter((vehicle) => vehicle.id !== currentVehicle.id)
    .slice(0, Math.max(0, 3 - featuredCars.length));

  const cards = [...featuredCars, ...fallbackCars].slice(0, 3);

  featuredGrid.innerHTML = cards.map((car) => window.TK168Renderers.buildFeaturedCardHTML(
    car,
    buildDetailUrl(car.id, hasActiveFilters ? currentFilters : { brand: currentBrand.key })
  )).join('');

  window.TK168CommonLinks?.enhanceClickableCards(featuredGrid);
  syncFeaturedSlider();
}

function ensureFeaturedSliderShell() {
  if (!featuredGrid) return null;

  const existingShell = document.getElementById(FEATURED_SLIDER_SHELL_ID);
  if (existingShell) return existingShell;

  const parent = featuredGrid.parentElement;
  if (!parent) return null;

  const shell = document.createElement('div');
  shell.id = FEATURED_SLIDER_SHELL_ID;
  shell.className = 'featured-slider-shell';
  parent.insertBefore(shell, featuredGrid);
  shell.appendChild(featuredGrid);
  return shell;
}

function getFeaturedCards() {
  if (!featuredGrid) return [];
  return Array.from(featuredGrid.querySelectorAll('.featured-card'));
}

function getFeaturedSliderNav() {
  return document.getElementById(FEATURED_SLIDER_NAV_ID);
}

function getClosestFeaturedCardIndex() {
  const cards = getFeaturedCards();
  if (!featuredGrid || !cards.length) return 0;

  const viewportCenter = featuredGrid.scrollLeft + (featuredGrid.clientWidth / 2);
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

function scrollToFeaturedCard(index, behavior = 'smooth') {
  const cards = getFeaturedCards();
  if (!cards.length) return;

  const clampedIndex = Math.max(0, Math.min(cards.length - 1, index));
  cards[clampedIndex].scrollIntoView({
    behavior,
    block: 'nearest',
    inline: 'start'
  });
}

function markFeaturedSliderInteraction() {
  const nav = getFeaturedSliderNav();
  if (!nav || !featuredSliderViewport.matches) return;

  nav.classList.add('is-engaged');
  if (featuredSliderInteractionTimer) {
    clearTimeout(featuredSliderInteractionTimer);
  }
  featuredSliderInteractionTimer = window.setTimeout(() => {
    nav.classList.remove('is-engaged');
    featuredSliderInteractionTimer = 0;
  }, 1200);
}

function updateFeaturedSliderNavState() {
  const nav = getFeaturedSliderNav();
  if (!nav) return;

  const prev = nav.querySelector('[data-featured-nav="prev"]');
  const next = nav.querySelector('[data-featured-nav="next"]');
  if (!prev || !next) return;

  const cards = getFeaturedCards();
  const canSlide = featuredSliderViewport.matches && cards.length > 1;
  nav.classList.toggle('is-visible', canSlide);
  nav.setAttribute('aria-hidden', canSlide ? 'false' : 'true');

  const dotsWrap = nav.querySelector('.featured-slider-dots');
  if (!dotsWrap) return;

  if (!canSlide) {
    prev.disabled = true;
    next.disabled = true;
    return;
  }

  const index = getClosestFeaturedCardIndex();
  prev.disabled = index <= 0;
  next.disabled = index >= cards.length - 1;
  window.TK168Renderers?.renderPaginationDots?.(dotsWrap, {
    totalCount: cards.length,
    activeIndex: index,
    maxVisible: 3,
    isCompact: true,
    dataAttribute: 'data-featured-dot',
    dotClass: 'featured-slider-dot',
    ariaLabelBuilder: (dotIndex) => `Vehicle ${dotIndex + 1}`
  });
}

function ensureFeaturedSliderNav() {
  if (!featuredGrid) return null;

  let nav = getFeaturedSliderNav();
  if (nav) return nav;

  const shell = ensureFeaturedSliderShell();
  if (!shell) return null;

  nav = document.createElement('div');
  nav.id = FEATURED_SLIDER_NAV_ID;
  nav.className = 'featured-slider-nav';
  nav.setAttribute('aria-hidden', 'true');
  nav.innerHTML = `
    <button type="button" class="featured-slider-btn featured-slider-btn--prev" data-featured-nav="prev" aria-label="前の車両">
      <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <path d="M12.5 4 7 10l5.5 6"></path>
      </svg>
    </button>
    <div class="featured-slider-dots" aria-label="ページ送り"></div>
    <button type="button" class="featured-slider-btn featured-slider-btn--next" data-featured-nav="next" aria-label="次の車両">
      <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <path d="m7.5 4 5.5 6-5.5 6"></path>
      </svg>
    </button>
  `;

  nav.addEventListener('click', (event) => {
    const button = event.target.closest('[data-featured-nav]');
    if (button && !button.disabled) {
      markFeaturedSliderInteraction();
      const direction = button.dataset.featuredNav === 'prev' ? -1 : 1;
      const current = getClosestFeaturedCardIndex();
      scrollToFeaturedCard(current + direction);
      window.setTimeout(updateFeaturedSliderNavState, 220);
      return;
    }

    const dot = event.target.closest('[data-featured-dot]');
    if (!dot) return;
    markFeaturedSliderInteraction();
    scrollToFeaturedCard(Number(dot.dataset.featuredDot));
    window.setTimeout(updateFeaturedSliderNavState, 220);
  });

  shell.appendChild(nav);
  return nav;
}

function bindFeaturedSliderEvents() {
  if (!featuredGrid) return;
  if (featuredGrid.dataset.sliderBound === '1') return;
  featuredGrid.dataset.sliderBound = '1';

  featuredGrid.addEventListener('scroll', () => {
    if (!featuredSliderViewport.matches) return;
    markFeaturedSliderInteraction();
    if (featuredSliderScrollFrame) return;
    featuredSliderScrollFrame = requestAnimationFrame(() => {
      featuredSliderScrollFrame = 0;
      updateFeaturedSliderNavState();
    });
  }, { passive: true });

  featuredGrid.addEventListener('pointerdown', () => {
    markFeaturedSliderInteraction();
  }, { passive: true });

  const syncOnViewportChange = () => {
    if (!featuredSliderViewport.matches) {
      featuredGrid.scrollLeft = 0;
      const nav = getFeaturedSliderNav();
      nav?.classList.remove('is-engaged');
    } else {
      scrollToFeaturedCard(getClosestFeaturedCardIndex(), 'auto');
      markFeaturedSliderInteraction();
    }
    updateFeaturedSliderNavState();
  };

  if (typeof featuredSliderViewport.addEventListener === 'function') {
    featuredSliderViewport.addEventListener('change', syncOnViewportChange);
  } else if (typeof featuredSliderViewport.addListener === 'function') {
    featuredSliderViewport.addListener(syncOnViewportChange);
  }

  window.addEventListener('resize', () => {
    if (featuredSliderResizeFrame) cancelAnimationFrame(featuredSliderResizeFrame);
    featuredSliderResizeFrame = requestAnimationFrame(() => {
      featuredSliderResizeFrame = 0;
      updateFeaturedSliderNavState();
    });
  });
}

function syncFeaturedSlider() {
  if (!featuredGrid) return;
  ensureFeaturedSliderShell();
  ensureFeaturedSliderNav();
  bindFeaturedSliderEvents();
  updateFeaturedSliderNavState();
}

async function bootstrapDetailPage() {
  const tryLive =
    /^https?:$/.test(location.protocol) &&
    requestedVehicleId &&
    !String(requestedVehicleId).endsWith('-catalog');

  const hasLocalMatch =
    Boolean(requestedVehicleId) && currentVehicle?.id === requestedVehicleId;

  function applyCanonicalUrl() {
    if (!currentVehicle) return;
    if (requestedVehicleId && currentVehicle.id !== requestedVehicleId) {
      const urlFilters = isRentalDetail ? { ...currentFilters, from: 'rental' } : currentFilters;
      window.history.replaceState(
        {},
        '',
        window.TK168_DATA.buildDetailUrl(currentVehicle.id, urlFilters)
      );
    }
  }

  function renderAll() {
    if (!currentVehicle) return;
    try {
      applyCanonicalUrl();
      renderVehicleHeader();
      renderGallery();
      renderSpecs();
      renderOverview();
      renderBenefits();
      renderFeatures();
      applyDetailStaffCard();
      syncLinks();
      renderFeaturedCars();
    } finally {
      detailShell?.classList.remove('detail-shell--hydrating');
    }
  }

  if (isRentalDetail) {
    if (tryLive) {
      const flat = await window.TK168ApiHydrate?.fetchPublishedRentalById?.(requestedVehicleId);
      const merged = flat && window.TK168_DATA.mergeApiRentalWithBase?.(flat);
      if (merged) {
        currentVehicle = merged;
        renderAll();
        return;
      }
    }
    if (hasLocalMatch) {
      renderAll();
    } else {
      detailShell?.classList.remove('detail-shell--hydrating');
    }
    return;
  }

  if (hasLocalMatch) {
    renderAll();
  }

  if (tryLive) {
    const flat = await window.TK168ApiHydrate?.fetchPublishedVehicleById?.(requestedVehicleId);
    const merged = flat && window.TK168_DATA.mergeApiVehicleWithBase?.(flat);
    if (merged) {
      currentVehicle = merged;
      renderAll();
    } else if (!hasLocalMatch) {
      renderAll();
    }
  } else if (!hasLocalMatch) {
    renderAll();
  }
}

bootstrapDetailPage().catch(() => {
  detailShell?.classList.remove('detail-shell--hydrating');
});

window.addEventListener('tk168:languagechange', () => {
  renderVehicleHeader();
  renderGallery();
  renderSpecs();
  renderOverview();
  renderBenefits();
  renderFeatures();
  applyDetailStaffCard();
  syncLinks();
  renderFeaturedCars();
  if (activePriceHelp) {
    togglePriceHelp(activePriceHelp, true);
  }
});
