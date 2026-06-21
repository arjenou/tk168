(function () {
  const {
    vehicles,
    getVehicleById,
    getInventoryVehicleById,
    getRentalVehicleDetailById,
    getRentableVehicles,
    getVehicleName,
    getBrandLabel,
    getVehicleFieldLabel,
    buildBrandUrl
  } = window.TK168_DATA;

  const { getText, getLanguage } = window.TK168StockConfirmI18n;

  const STOCK_CONFIRM_ID_KEY = 'tk168:stockConfirmVehicleId';
  const STOCK_CONFIRM_DRAFT_KEY = 'tk168:stockConfirmDraft';

  function sanitize(value) {
    return String(value || '').trim();
  }

  function resolveStockVehicle(requestedVehicleId, isRentalFlow) {
    const id = String(requestedVehicleId || '').trim();
    if (isRentalFlow) {
      const fleet = getRentableVehicles();
      if (!id) return fleet[0] || vehicles[0] || null;
      const fromFleet = fleet.find((v) => v && v.id === id);
      if (fromFleet) return fromFleet;
      const fromRentalApi = getRentalVehicleDetailById(id);
      if (fromRentalApi) return fromRentalApi;
      const fromInventory = getVehicleById(id);
      if (fromInventory) return fromInventory;
      return getInventoryVehicleById(id);
    }
    if (!id) return vehicles[0] || null;
    return getInventoryVehicleById(id) || null;
  }

  function getRequestedStockVehicleId() {
    const params = new URLSearchParams(window.location.search);
    let id = (params.get('id') || '').trim();
    if (!id) {
      try {
        id = (sessionStorage.getItem(STOCK_CONFIRM_ID_KEY) || '').trim();
      } catch (_) {
        id = '';
      }
      if (id) {
        try {
          sessionStorage.removeItem(STOCK_CONFIRM_ID_KEY);
        } catch (_) {
          /* ignore */
        }
        try {
          const u = new URL(window.location.href);
          if (!u.searchParams.get('id')) {
            u.searchParams.set('id', id);
            history.replaceState({}, '', u);
          }
        } catch (_) {
          /* ignore */
        }
      }
    }
    return id;
  }

  function readUrlContext() {
    return {
      requestedVehicleId: getRequestedStockVehicleId(),
      isRentalDetail: new URLSearchParams(window.location.search).get('from') === 'rental'
    };
  }

  function createVehicleContext() {
    const { requestedVehicleId, isRentalDetail } = readUrlContext();
    const currentVehicle = resolveStockVehicle(requestedVehicleId, isRentalDetail);
    let inventoryHref = 'brand.html';
    if (currentVehicle?.brandKey) inventoryHref = buildBrandUrl(currentVehicle.brandKey);
    else if (isRentalDetail) inventoryHref = 'rental.html';
    return {
      requestedVehicleId,
      currentVehicle,
      inventoryHref,
      isRentalDetail
    };
  }

  const vehicleContext = createVehicleContext();

  function editPageHref() {
    const q = window.location.search || '';
    return `stock-confirm.html${q}`;
  }

  function redirectToEdit() {
    window.location.replace(editPageHref());
  }

  function readDraft() {
    try {
      const raw = sessionStorage.getItem(STOCK_CONFIRM_DRAFT_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return null;
      return data;
    } catch (_) {
      return null;
    }
  }

  function draftLooksComplete(draft) {
    if (!draft.consentPolicy) return false;
    if (!['stock', 'quote', 'spec'].includes(String(draft.requestType || '').trim())) return false;
    if (!sanitize(draft.name)) return false;
    if (!sanitize(draft.kana)) return false;
    if (!sanitize(draft.email) && !sanitize(draft.phone)) return false;
    return true;
  }

  const draft = readDraft();
  if (!draft || !draftLooksComplete(draft)) {
    redirectToEdit();
    return;
  }
  if (Boolean(draft.isRentalDetail) !== vehicleContext.isRentalDetail) {
    redirectToEdit();
    return;
  }

  const urlId = String(getRequestedStockVehicleId() || '').trim();
  const draftId = String(draft.vehicleId || '').trim();
  if (urlId && draftId && urlId !== draftId) {
    redirectToEdit();
    return;
  }
  if (vehicleContext.currentVehicle && draftId && String(vehicleContext.currentVehicle.id) !== draftId) {
    redirectToEdit();
    return;
  }

  if (!vehicleContext.currentVehicle) {
    const id = draftId || urlId;
    if (id) {
      vehicleContext.currentVehicle = resolveStockVehicle(id, draft.isRentalDetail);
    }
  }
  if (!vehicleContext.currentVehicle) {
    redirectToEdit();
    return;
  }
  if (vehicleContext.currentVehicle.brandKey) {
    vehicleContext.inventoryHref = buildBrandUrl(vehicleContext.currentVehicle.brandKey);
  } else if (vehicleContext.isRentalDetail) {
    vehicleContext.inventoryHref = 'rental.html';
  }

  window.TK168CommonLinks?.applyCommonLinks();
  window.TK168PageChrome?.applyPageChrome({
    pageKey: 'inventory',
    inventoryHref: vehicleContext.inventoryHref,
    navMode: 'solid'
  });

  const refs = {
    pageTitle: document.getElementById('scrPageTitle'),
    pageSubtitle: document.getElementById('scrPageSubtitle'),
    lead: document.getElementById('scrLeadText'),
    message: document.getElementById('scrMessage'),
    submitBtn: document.getElementById('scrSubmitBtn'),
    vehicleThumb: document.getElementById('scrVehicleThumb'),
    vehicleBrand: document.getElementById('scrVehicleBrand'),
    vehicleName: document.getElementById('scrVehicleName'),
    vehicleMeta: document.getElementById('scrVehicleMeta'),
    labelRequest: document.getElementById('scrLabelRequest'),
    labelName: document.getElementById('scrLabelName'),
    labelKana: document.getElementById('scrLabelKana'),
    labelContact: document.getElementById('scrLabelContact'),
    labelConsent: document.getElementById('scrLabelConsent'),
    valueRequest: document.getElementById('scrValueRequest'),
    valueName: document.getElementById('scrValueName'),
    valueKana: document.getElementById('scrValueKana'),
    valueContact: document.getElementById('scrValueContact'),
    valueConsent: document.getElementById('scrValueConsent')
  };

  function requestTypeLabel(value) {
    const text = getText();
    const key = String(value || '').trim();
    if (key === 'stock' || key === 'quote' || key === 'spec') return text.options[key];
    return key;
  }

  function renderVehicle() {
    const vehicle = vehicleContext.currentVehicle;
    if (!vehicle) return;
    const image = window.TK168_DATA.resolveVehicleMediaSource(vehicle.photo || vehicle.gallery?.[0] || 'placeholder.svg');
    const lang = getLanguage();
    const yearLabel = sanitize(vehicle.year);
    const typeLabel = getVehicleFieldLabel('bodyStyle', vehicle.bodyStyle, lang) || '';
    const distance =
      window.TK168_DATA?.formatVehicleMileageDisplay?.(vehicle.mileage, lang, vehicle.mileageUnit) || '';
    refs.vehicleThumb.src = image;
    refs.vehicleThumb.alt = getVehicleName(vehicle, lang);
    refs.vehicleBrand.textContent = getBrandLabel(vehicle.brandKey, lang).toUpperCase();
    refs.vehicleName.textContent = getVehicleName(vehicle, lang);
    refs.vehicleMeta.textContent = [yearLabel, typeLabel, distance].filter(Boolean).join(' / ');
  }

  function fillReviewFromDraft() {
    const text = getText();
    const typeLine = requestTypeLabel(draft.requestType);
    const note = sanitize(draft.requestNote);
    refs.valueRequest.textContent = note ? `${typeLine}\n${note}` : typeLine;
    refs.valueName.textContent = sanitize(draft.name) || text.summary.empty;
    refs.valueKana.textContent = sanitize(draft.kana) || text.summary.empty;
    const email = sanitize(draft.email);
    const phone = sanitize(draft.phone);
    if (!email && !phone) refs.valueContact.textContent = text.summary.empty;
    else if (!email) refs.valueContact.textContent = `${text.labels.phone}: ${phone}`;
    else if (!phone) refs.valueContact.textContent = `${text.labels.email}: ${email}`;
    else refs.valueContact.textContent = `${text.labels.email}: ${email}\n${text.labels.phone}: ${phone}`;

    const newsLine = `${text.consentNews}: ${draft.consentNews ? text.summary.newsOn : text.summary.newsOff}`;
    const policyLine = `${text.consentPolicy}: ${draft.consentPolicy ? text.summary.confirmReady : text.summary.confirmPending}`;
    refs.valueConsent.textContent = `${newsLine}\n${policyLine}`;
  }

  function applyLanguageCopy() {
    const text = getText();
    const rv = text.review;
    document.title = `${rv.title} — TK168 Premium Automotive`;
    refs.pageTitle.textContent = rv.title;
    refs.pageSubtitle.textContent = rv.subtitle;
    refs.lead.textContent = rv.lead;
    refs.labelRequest.textContent = text.labels.request;
    refs.labelName.textContent = text.labels.name;
    refs.labelKana.textContent = text.labels.kana;
    refs.labelContact.textContent = text.labels.contact;
    refs.labelConsent.textContent = text.labels.consentAggregate;
    refs.submitBtn.textContent = window.TK168FormSubmit?.submitLabel?.() || text.buttons.submit;
  }

  function setMessage(message, ok) {
    refs.message.textContent = message || '';
    refs.message.classList.toggle('is-success', Boolean(ok));
  }

  function clearDraft() {
    try {
      sessionStorage.removeItem(STOCK_CONFIRM_DRAFT_KEY);
    } catch (_) {
      /* ignore */
    }
  }

  function bindActions() {
    document.getElementById('scrBackNavBtn')?.addEventListener('click', () => {
      window.location.assign(editPageHref());
    });
    refs.submitBtn.addEventListener('click', async () => {
      window.TK168FormSubmit.beginSubmit(refs.submitBtn);
      try {
        await window.TK168FormSubmit.send({
          form: 'stock-confirm',
          data: { ...draft },
          meta: {
            vehicleId: draft.vehicleId || '',
            vehicleName: refs.vehicleName?.textContent || '',
            vehicleBrand: refs.vehicleBrand?.textContent || '',
            isRentalDetail: Boolean(draft.isRentalDetail)
          }
        });
        window.TK168FormSubmit.markSubmitSuccess(refs.submitBtn);
        clearDraft();
      } catch (submitError) {
        console.error('[stock-confirm-review] submit failed', submitError);
        setMessage(window.TK168FormSubmit.networkErrorMessage(), false);
        window.TK168FormSubmit.resetSubmitButton(refs.submitBtn);
      }
    });
  }

  function init() {
    applyLanguageCopy();
    fillReviewFromDraft();
    renderVehicle();
    bindActions();
  }

  window.addEventListener('tk168:languagechange', () => {
    applyLanguageCopy();
    fillReviewFromDraft();
    renderVehicle();
  });

  function refreshVehicleFromHydrate() {
    const id = vehicleContext.requestedVehicleId || getRequestedStockVehicleId();
    const next = resolveStockVehicle(id, vehicleContext.isRentalDetail);
    if (!next) return;
    const prev = vehicleContext.currentVehicle;
    if (prev && next.id === prev.id && prev.name === next.name) return;
    vehicleContext.currentVehicle = next;
    if (next.brandKey) vehicleContext.inventoryHref = buildBrandUrl(next.brandKey);
    renderVehicle();
  }

  document.addEventListener('tk168:data-updated', (event) => {
    const detail = event?.detail || {};
    if (vehicleContext.isRentalDetail) {
      if (!detail.rentals && !detail.vehicles) return;
    } else {
      if (!detail.vehicles) return;
    }
    refreshVehicleFromHydrate();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
