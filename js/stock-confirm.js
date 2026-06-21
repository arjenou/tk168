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

  const STEP_KEYS = ['request', 'name', 'kana', 'contact', 'confirm'];

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

  function currentPersistedVehicleId() {
    return String(vehicleContext.currentVehicle?.id || getRequestedStockVehicleId() || '').trim();
  }

  function navigateStockConfirmBack() {
    try {
      const ref = document.referrer || '';
      if (ref.startsWith(window.location.origin)) {
        const path = new URL(ref).pathname.toLowerCase();
        if (path.indexOf('stock-confirm-review') === -1) {
          window.location.assign(ref);
          return;
        }
      }
    } catch (_) {
      /* ignore */
    }
    const id = currentPersistedVehicleId();
    if (id && typeof window.TK168_DATA?.buildDetailUrl === 'function') {
      const filters = vehicleContext.isRentalDetail ? { from: 'rental' } : {};
      window.location.assign(window.TK168_DATA.buildDetailUrl(id, filters));
      return;
    }
    window.location.assign(
      vehicleContext.isRentalDetail ? 'rental.html' : (vehicleContext.inventoryHref || 'brand.html'),
    );
  }

  window.TK168CommonLinks?.applyCommonLinks();
  window.TK168PageChrome?.applyPageChrome({
    pageKey: 'inventory',
    inventoryHref: vehicleContext.inventoryHref,
    navMode: 'solid'
  });

  const state = {
    requestType: '',
    requestNote: '',
    name: '',
    kana: '',
    email: '',
    phone: '',
    consentNews: false,
    consentPolicy: false
  };

  const refs = {
    pageTitle: document.getElementById('scPageTitle'),
    pageSubtitle: document.getElementById('scPageSubtitle'),
    message: document.getElementById('scMessage'),
    confirmBtn: document.getElementById('scConfirmBtn'),
    backBtn: document.getElementById('scBackBtn'),
    rows: Array.from(document.querySelectorAll('.inq-row')),
    vehicleThumb: document.getElementById('scVehicleThumb'),
    vehicleBrand: document.getElementById('scVehicleBrand'),
    vehicleName: document.getElementById('scVehicleName'),
    vehicleMeta: document.getElementById('scVehicleMeta'),
    requestType: document.getElementById('scRequestType'),
    requestNote: document.getElementById('scRequestNote'),
    name: document.getElementById('scName'),
    kana: document.getElementById('scKana'),
    email: document.getElementById('scEmail'),
    phone: document.getElementById('scPhone'),
    consentNews: document.getElementById('scConsentNews'),
    consentPolicy: document.getElementById('scConsentPolicy'),
    summaryRequest: document.getElementById('scSummaryRequest'),
    summaryName: document.getElementById('scSummaryName'),
    summaryKana: document.getElementById('scSummaryKana'),
    summaryContact: document.getElementById('scSummaryContact'),
    summaryConfirm: document.getElementById('scSummaryConfirm'),
    labelRequest: document.getElementById('scLabelRequest'),
    labelName: document.getElementById('scLabelName'),
    labelKana: document.getElementById('scLabelKana'),
    labelContact: document.getElementById('scLabelContact'),
    labelConfirm: document.getElementById('scLabelConfirm'),
    fieldRequestType: document.getElementById('scFieldRequestType'),
    fieldRequestNote: document.getElementById('scFieldRequestNote'),
    fieldName: document.getElementById('scFieldName'),
    fieldKana: document.getElementById('scFieldKana'),
    fieldEmail: document.getElementById('scFieldEmail'),
    fieldPhone: document.getElementById('scFieldPhone'),
    requiredTags: Array.from(document.querySelectorAll('[id^="scRequiredText"]')),
    editButtons: [
      document.getElementById('scEditRequest'),
      document.getElementById('scEditName'),
      document.getElementById('scEditKana'),
      document.getElementById('scEditContact'),
      document.getElementById('scEditConfirm')
    ],
    consentNewsText: document.getElementById('scConsentNewsText')
  };

  function requestTypeLabel(value) {
    const text = getText();
    const key = String(value || '').trim();
    if (key === 'stock' || key === 'quote' || key === 'spec') return text.options[key];
    return key;
  }

  function buildRequestSummary() {
    const text = getText();
    const typeLabel = requestTypeLabel(state.requestType);
    const note = sanitize(state.requestNote);
    if (!sanitize(state.requestType)) return text.summary.empty;
    if (!note) return typeLabel;
    const compactNote = note.length > 22 ? `${note.slice(0, 22)}...` : note;
    return `${typeLabel} / ${compactNote}`;
  }

  function buildContactSummary() {
    const text = getText();
    const email = sanitize(state.email);
    const phone = sanitize(state.phone);
    if (!email && !phone) return text.summary.empty;
    if (!email) return phone;
    if (!phone) return email;
    return `${email} / ${phone}`;
  }

  function buildConfirmSummary() {
    const text = getText();
    if (!state.consentPolicy) return text.summary.confirmPending;
    return text.summary.confirmReady;
  }

  function syncStateFromInputs() {
    state.requestType = refs.requestType.value;
    state.requestNote = refs.requestNote.value;
    state.name = refs.name.value;
    state.kana = refs.kana.value;
    state.email = refs.email.value;
    state.phone = refs.phone.value;
    state.consentNews = refs.consentNews.checked;
    state.consentPolicy = refs.consentPolicy.checked;
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

  function applyLanguageCopy() {
    const text = getText();
    const options = text.options;

    document.title = `${text.title} — TK168 Premium Automotive`;
    refs.pageTitle.textContent = text.title;
    refs.pageSubtitle.textContent = text.subtitle;

    refs.labelRequest.textContent = text.labels.request;
    refs.labelName.textContent = text.labels.name;
    refs.labelKana.textContent = text.labels.kana;
    refs.labelContact.textContent = text.labels.contact;
    refs.labelConfirm.textContent = text.labels.confirm;

    refs.fieldRequestType.textContent = text.labels.requestType;
    refs.fieldRequestNote.textContent = text.labels.requestNote;
    refs.fieldName.textContent = text.labels.name;
    refs.fieldKana.textContent = text.labels.kana;
    refs.fieldEmail.textContent = text.labels.email;
    refs.fieldPhone.textContent = text.labels.phone;

    refs.requiredTags.forEach((tag) => {
      tag.textContent = text.labels.required;
    });

    refs.editButtons.forEach((button) => {
      if (!button) return;
      button.textContent = text.buttons.edit;
    });

    refs.backBtn.textContent = text.buttons.prev;
    refs.confirmBtn.textContent = window.TK168FormSubmit?.submitLabel?.() || text.buttons.submit;
    refs.consentNewsText.textContent = text.consentNews;
    window.TK168LegalConsentLabel?.init?.(document, getLanguage());

    const prevType = state.requestType;
    refs.requestType.innerHTML = `
      <option value="">${text.placeholders.requestType}</option>
      <option value="stock">${options.stock}</option>
      <option value="quote">${options.quote}</option>
      <option value="spec">${options.spec}</option>
    `;
    const allowed = new Set(['', 'stock', 'quote', 'spec']);
    state.requestType = allowed.has(prevType) ? prevType : '';
    refs.requestType.value = state.requestType;

    refs.requestNote.placeholder = text.placeholders.requestNote;
    refs.name.placeholder = text.placeholders.name;
    refs.kana.placeholder = text.placeholders.kana;
    refs.email.placeholder = text.placeholders.email;
    refs.phone.placeholder = text.placeholders.phone;
  }

  function renderSummaries() {
    const text = getText();
    refs.summaryRequest.textContent = buildRequestSummary();
    refs.summaryName.textContent = sanitize(state.name) || text.summary.empty;
    refs.summaryKana.textContent = sanitize(state.kana) || text.summary.empty;
    refs.summaryContact.textContent = buildContactSummary();
    refs.summaryConfirm.textContent = buildConfirmSummary();
  }

  function clearMessage() {
    refs.message.textContent = '';
  }

  function setMessage(message, ok) {
    refs.message.textContent = message || '';
    refs.message.style.color = ok ? '#1f8f5f' : '#c6472f';
  }

  function validateStep(stepKey) {
    const text = getText();
    if (stepKey === 'request') {
      if (!sanitize(state.requestType)) return text.messages.request;
      return '';
    }
    if (stepKey === 'name') {
      if (!sanitize(state.name)) return text.messages.name;
      return '';
    }
    if (stepKey === 'kana') {
      if (!sanitize(state.kana)) return text.messages.kana;
      return '';
    }
    if (stepKey === 'contact') {
      if (!sanitize(state.email) && !sanitize(state.phone)) return text.messages.contact;
      return '';
    }
    if (stepKey === 'confirm') {
      if (!state.consentPolicy) {
        return window.TK168LegalConsentLabel?.getConsentRequiredMessage?.(getLanguage()) || text.messages.policy;
      }
      return '';
    }
    return '';
  }

  function validateAll() {
    for (let i = 0; i < STEP_KEYS.length; i += 1) {
      const err = validateStep(STEP_KEYS[i]);
      if (err) return err;
    }
    return '';
  }

  function persistDraft() {
    const payload = {
      requestType: state.requestType,
      requestNote: state.requestNote,
      name: state.name,
      kana: state.kana,
      email: state.email,
      phone: state.phone,
      consentNews: state.consentNews,
      consentPolicy: state.consentPolicy,
      vehicleId: currentPersistedVehicleId(),
      isRentalDetail: vehicleContext.isRentalDetail
    };
    try {
      sessionStorage.setItem(STOCK_CONFIRM_DRAFT_KEY, JSON.stringify(payload));
    } catch (_) {
      /* ignore */
    }
  }

  function tryRestoreDraft() {
    try {
      const raw = sessionStorage.getItem(STOCK_CONFIRM_DRAFT_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return;
      if (String(data.vehicleId || '') !== currentPersistedVehicleId()) return;
      const allowed = new Set(['', 'stock', 'quote', 'spec']);
      state.requestType = allowed.has(data.requestType) ? data.requestType : '';
      state.requestNote = String(data.requestNote || '');
      state.name = String(data.name || '');
      state.kana = String(data.kana || '');
      state.email = String(data.email || '');
      state.phone = String(data.phone || '');
      state.consentNews = Boolean(data.consentNews);
      state.consentPolicy = Boolean(data.consentPolicy);
      refs.requestType.value = state.requestType;
      refs.requestNote.value = state.requestNote;
      refs.name.value = state.name;
      refs.kana.value = state.kana;
      refs.email.value = state.email;
      refs.phone.value = state.phone;
      refs.consentNews.checked = state.consentNews;
      refs.consentPolicy.checked = state.consentPolicy;
    } catch (_) {
      /* ignore */
    }
  }

  function clearDraft() {
    try {
      sessionStorage.removeItem(STOCK_CONFIRM_DRAFT_KEY);
    } catch (_) {
      /* ignore */
    }
  }

  function buildSubmitPayload() {
    syncStateFromInputs();
    return {
      requestType: state.requestType,
      requestNote: state.requestNote,
      name: state.name,
      kana: state.kana,
      email: state.email,
      phone: state.phone,
      consentNews: state.consentNews,
      consentPolicy: state.consentPolicy,
      vehicleId: currentPersistedVehicleId(),
      isRentalDetail: vehicleContext.isRentalDetail
    };
  }

  function buildSubmitMeta() {
    const language = getLanguage();
    const vehicle = vehicleContext.currentVehicle;
    return {
      vehicleId: currentPersistedVehicleId(),
      vehicleName: vehicle ? getVehicleName(vehicle, language) : (refs.vehicleName?.textContent || ''),
      vehicleBrand: vehicle ? getBrandLabel(vehicle.brandKey, language) : (refs.vehicleBrand?.textContent || ''),
      isRentalDetail: Boolean(vehicleContext.isRentalDetail)
    };
  }

  async function submitStockConfirm() {
    syncStateFromInputs();
    const error = validateAll();
    if (error) {
      setMessage(error, false);
      return;
    }

    window.TK168FormSubmit.beginSubmit(refs.confirmBtn);
    try {
      await window.TK168FormSubmit.send({
        form: 'stock-confirm',
        data: buildSubmitPayload(),
        meta: buildSubmitMeta()
      });
      window.TK168FormSubmit.markSubmitSuccess(refs.confirmBtn);
      setMessage(getText().messages.success, true);
      clearDraft();
    } catch (submitError) {
      console.error('[stock-confirm] submit failed', submitError);
      setMessage(window.TK168FormSubmit.networkErrorMessage(), false);
      window.TK168FormSubmit.resetSubmitButton(refs.confirmBtn);
    }
  }

  function bindInputEvents() {
    const inputKeys = ['requestType', 'requestNote', 'name', 'kana', 'email', 'phone', 'consentNews', 'consentPolicy'];
    inputKeys.forEach((key) => {
      const element = refs[key];
      if (!element) return;
      const eventName = element.type === 'checkbox' || element.tagName === 'SELECT' ? 'change' : 'input';
      element.addEventListener(eventName, () => {
        syncStateFromInputs();
        renderSummaries();
        clearMessage();
      });
    });
  }

  function bindActions() {
    refs.backBtn.addEventListener('click', navigateStockConfirmBack);

    refs.confirmBtn.addEventListener('click', submitStockConfirm);
  }

  function init() {
    applyLanguageCopy();
    tryRestoreDraft();
    renderVehicle();
    bindInputEvents();
    bindActions();
    document.getElementById('scBackNavBtn')?.addEventListener('click', navigateStockConfirmBack);
    renderSummaries();
  }

  window.addEventListener('tk168:languagechange', () => {
    syncStateFromInputs();
    applyLanguageCopy();
    renderVehicle();
    renderSummaries();
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
