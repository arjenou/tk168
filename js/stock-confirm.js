(function () {
  const {
    vehicles,
    getVehicleById,
    getVehicleName,
    getBrandLabel,
    getVehicleFieldLabel,
    buildBrandUrl
  } = window.TK168_DATA;

  const COPY = {
    zh: {
      title: '在库确认内容填写',
      subtitle: '通过 5 步快速提交在库确认需求，我们会尽快反馈库存与报价。',
      stepButtons: ['确认内容', '姓名', '片假名', '联系方式', '确认'],
      steps: [
        { key: 'request', lead: '请选择你要确认的内容。' },
        { key: 'name', lead: '请输入姓名。' },
        { key: 'kana', lead: '请输入片假名。' },
        { key: 'contact', lead: '请填写联系方式。' },
        { key: 'confirm', lead: '请确认后完成内容整理。' }
      ],
      labels: {
        request: '确认内容',
        requestType: '确认类型',
        requestNote: '确认备注（可选）',
        name: '姓名',
        kana: '片假名',
        contact: '邮箱/电话',
        email: '邮箱',
        phone: '电话',
        confirm: '内容确认',
        required: '必填'
      },
      placeholders: {
        requestType: '请选择',
        requestNote: '请填写希望确认的要点、预算、配置偏好等',
        name: '张 三',
        kana: 'チョウ サン',
        email: 'name@example.com',
        phone: '09012345678'
      },
      options: {
        stock: '确认在库状态',
        quote: '确认总价估算',
        spec: '确认配置与参数'
      },
      buttons: {
        edit: '修改',
        prev: '返回',
        next: '下一步',
        submit: '完成确认'
      },
      summary: {
        empty: '未填写',
        unconfirmed: '未确认',
        confirmReady: '已同意并完成确认',
        confirmPending: '待确认条款'
      },
      messages: {
        request: '请选择确认类型。',
        name: '请输入姓名。',
        kana: '请输入片假名。',
        contact: '邮箱和电话至少填写一项。',
        policy: '请先同意利用条款与隐私政策。',
        success: '确认内容已整理完成，请按填写的联系方式继续确认库存与报价。'
      },
      consentNews: '接收新车源与活动通知',
      consentPolicy: '同意利用条款和隐私政策'
    },
    ja: {
      title: '在庫確認内容の入力',
      subtitle: '5ステップで必要な情報を入力し、在庫状況と見積りを確認します。',
      stepButtons: ['確認内容', '氏名', 'フリガナ', '連絡先', '確認'],
      steps: [
        { key: 'request', lead: '在庫確認の内容を選択してください。' },
        { key: 'name', lead: 'お名前を入力してください。' },
        { key: 'kana', lead: 'フリガナを入力してください。' },
        { key: 'contact', lead: '連絡先を入力してください。' },
        { key: 'confirm', lead: '最終確認のうえ内容確認を完了してください。' }
      ],
      labels: {
        request: '確認内容',
        requestType: '確認種別',
        requestNote: '確認メモ（任意）',
        name: '氏名',
        kana: 'フリガナ',
        contact: 'メール・電話',
        email: 'メールアドレス',
        phone: '電話番号',
        confirm: '内容確認',
        required: '必須'
      },
      placeholders: {
        requestType: '選択してください',
        requestNote: '希望条件や確認したいポイントを入力してください',
        name: '山田 太郎',
        kana: 'ヤマダ タロウ',
        email: 'name@example.com',
        phone: '09012345678'
      },
      options: {
        stock: '在庫状況を確認したい',
        quote: '支払総額の見積りを確認したい',
        spec: '装備・仕様を確認したい'
      },
      buttons: {
        edit: '修正する',
        prev: '戻る',
        next: '次へ',
        submit: '確認を完了'
      },
      summary: {
        empty: '未入力',
        unconfirmed: '未確認',
        confirmReady: '同意済み（確認完了）',
        confirmPending: '規約確認待ち'
      },
      messages: {
        request: '確認種別を選択してください。',
        name: '氏名を入力してください。',
        kana: 'フリガナを入力してください。',
        contact: 'メールまたは電話番号を入力してください。',
        policy: '利用規約とプライバシーポリシーへの同意が必要です。',
        success: '確認内容の整理が完了しました。入力した連絡先をもとに、在庫と見積りの確認を進めてください。'
      },
      consentNews: '新着在庫・キャンペーン情報を受け取る',
      consentPolicy: '利用規約とプライバシーポリシーに同意する'
    },
    en: {
      title: 'Complete Your Stock Check Request',
      subtitle: 'Submit your stock inquiry in 5 quick steps and we will confirm availability and pricing as soon as possible.',
      stepButtons: ['Request', 'Name', 'Name reading', 'Contact', 'Confirm'],
      steps: [
        { key: 'request', lead: 'Select what you want to confirm.' },
        { key: 'name', lead: 'Enter your name.' },
        { key: 'kana', lead: 'Enter the phonetic reading of your name.' },
        { key: 'contact', lead: 'Enter your contact details.' },
        { key: 'confirm', lead: 'Review everything and complete the request.' }
      ],
      labels: {
        request: 'Request',
        requestType: 'Request type',
        requestNote: 'Request note (optional)',
        name: 'Full name',
        kana: 'Name reading',
        contact: 'Email / phone',
        email: 'Email address',
        phone: 'Phone number',
        confirm: 'Confirmation',
        required: 'Required'
      },
      placeholders: {
        requestType: 'Select',
        requestNote: 'Enter the points you want confirmed, budget range, or spec preferences',
        name: 'Taro Yamada',
        kana: 'Taro Yamada',
        email: 'name@example.com',
        phone: '09012345678'
      },
      options: {
        stock: 'Check stock availability',
        quote: 'Check total price estimate',
        spec: 'Check equipment and specifications'
      },
      buttons: {
        edit: 'Edit',
        prev: 'Back',
        next: 'Next',
        submit: 'Complete confirmation'
      },
      summary: {
        empty: 'Not provided',
        unconfirmed: 'Not confirmed',
        confirmReady: 'Agreed and confirmed',
        confirmPending: 'Policy consent pending'
      },
      messages: {
        request: 'Please select a request type.',
        name: 'Please enter your name.',
        kana: 'Please enter the phonetic reading of your name.',
        contact: 'Enter at least one of email or phone number.',
        policy: 'You must agree to the terms of use and privacy policy first.',
        success: 'The request details are organized. Please continue the stock and quotation check using the contact details you entered.'
      },
      consentNews: 'Receive new stock and event notifications',
      consentPolicy: 'I agree to the terms of use and privacy policy'
    }
  };

  function getLanguage() {
    const language = window.TK168I18N?.getLanguage?.();
    return language === 'zh' || language === 'en' || language === 'ja' ? language : 'ja';
  }

  function getText() {
    return COPY[getLanguage()] || COPY.ja;
  }

  function sanitize(value) {
    return String(value || '').trim();
  }

  function createVehicleContext() {
    const params = new URLSearchParams(window.location.search);
    const requestedVehicleId = params.get('id') || vehicles[0]?.id || '';
    const currentVehicle = getVehicleById(requestedVehicleId) || vehicles[0];
    const inventoryHref = currentVehicle?.brandKey ? buildBrandUrl(currentVehicle.brandKey) : 'brand.html';
    return {
      currentVehicle,
      inventoryHref
    };
  }

  const vehicleContext = createVehicleContext();

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

  let currentStep = 0;

  const refs = {
    pageTitle: document.getElementById('scPageTitle'),
    pageSubtitle: document.getElementById('scPageSubtitle'),
    lead: document.getElementById('scLeadText'),
    message: document.getElementById('scMessage'),
    counter: document.getElementById('scCounter'),
    nextBtn: document.getElementById('scNextBtn'),
    prevBtn: document.getElementById('scPrevBtn'),
    progress: Array.from(document.querySelectorAll('#scProgress li')),
    rows: Array.from(document.querySelectorAll('.inq-row')),
    jumpStepButtons: Array.from(document.querySelectorAll('[data-jump-step]')),
    jumpRowButtons: Array.from(document.querySelectorAll('[data-jump-row]')),
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
    stepBtn0: document.getElementById('scStepBtn0'),
    stepBtn1: document.getElementById('scStepBtn1'),
    stepBtn2: document.getElementById('scStepBtn2'),
    stepBtn3: document.getElementById('scStepBtn3'),
    stepBtn4: document.getElementById('scStepBtn4'),
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
    consentNewsText: document.getElementById('scConsentNewsText'),
    consentPolicyText: document.getElementById('scConsentPolicyText')
  };

  function getSteps() {
    return getText().steps;
  }

  function buildRequestSummary() {
    const text = getText();
    const type = sanitize(state.requestType);
    const note = sanitize(state.requestNote);
    if (!type) return text.summary.empty;
    if (!note) return type;
    const compactNote = note.length > 22 ? `${note.slice(0, 22)}...` : note;
    return `${type} / ${compactNote}`;
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
    const image = window.TK168_DATA.resolveVehicleMediaSource(vehicle.photo || vehicle.gallery?.[0] || '002.png');
    const lang = getLanguage();
    const yearLabel = sanitize(vehicle.year);
    const typeLabel = getVehicleFieldLabel('bodyStyle', vehicle.bodyStyle, lang) || '';
    const distance = `${vehicle.mileage || '0'}km`;
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

    [refs.stepBtn0, refs.stepBtn1, refs.stepBtn2, refs.stepBtn3, refs.stepBtn4].forEach((button, idx) => {
      if (!button) return;
      button.textContent = text.stepButtons[idx] || '';
    });

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

    refs.prevBtn.textContent = text.buttons.prev;
    refs.consentNewsText.textContent = text.consentNews;
    refs.consentPolicyText.textContent = text.consentPolicy;

    refs.requestType.innerHTML = `
      <option value="">${text.placeholders.requestType}</option>
      <option value="${options.stock}">${options.stock}</option>
      <option value="${options.quote}">${options.quote}</option>
      <option value="${options.spec}">${options.spec}</option>
    `;
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

  function renderProgress() {
    refs.progress.forEach((item, idx) => {
      item.classList.toggle('is-active', idx === currentStep);
      item.classList.toggle('is-done', idx < currentStep);
    });
  }

  function renderRows() {
    const steps = getSteps();
    const activeKey = steps[currentStep].key;
    refs.rows.forEach((row) => {
      row.classList.toggle('is-active', row.dataset.row === activeKey);
    });
  }

  function renderActions() {
    const text = getText();
    refs.prevBtn.disabled = currentStep === 0;
    refs.nextBtn.textContent = currentStep === getSteps().length - 1 ? text.buttons.submit : text.buttons.next;
    refs.counter.textContent = `${currentStep + 1} / ${getSteps().length}`;
  }

  function renderHead() {
    refs.lead.textContent = getSteps()[currentStep].lead;
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
      if (!state.consentPolicy) return text.messages.policy;
      return '';
    }
    return '';
  }

  function render() {
    renderHead();
    renderProgress();
    renderRows();
    renderSummaries();
    renderActions();
  }

  function moveStep(nextStep) {
    const clamped = Math.max(0, Math.min(getSteps().length - 1, nextStep));
    currentStep = clamped;
    clearMessage();
    render();
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

  function bindStepEvents() {
    refs.prevBtn.addEventListener('click', () => {
      moveStep(currentStep - 1);
    });

    refs.nextBtn.addEventListener('click', () => {
      syncStateFromInputs();
      const error = validateStep(getSteps()[currentStep].key);
      if (error) {
        setMessage(error, false);
        return;
      }
      if (currentStep === getSteps().length - 1) {
        setMessage(getText().messages.success, true);
        return;
      }
      moveStep(currentStep + 1);
    });

    refs.jumpStepButtons.forEach((button) => {
      button.addEventListener('click', () => {
        moveStep(Number(button.dataset.jumpStep || 0));
      });
    });

    refs.jumpRowButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const rowKey = button.dataset.jumpRow || '';
        const target = getSteps().findIndex((step) => step.key === rowKey);
        if (target >= 0) moveStep(target);
      });
    });
  }

  function init() {
    applyLanguageCopy();
    renderVehicle();
    bindInputEvents();
    bindStepEvents();
    render();
  }

  window.addEventListener('tk168:languagechange', () => {
    applyLanguageCopy();
    renderVehicle();
    render();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
