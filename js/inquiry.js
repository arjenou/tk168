(function () {
  const {
    vehicles,
    getVehicleById,
    getVehicleName,
    getBrandLabel,
    getVehicleFieldLabel,
    buildBrandUrl
  } = window.TK168_DATA;

  const STEP_KEYS = ['appointment', 'name', 'kana', 'contact', 'confirm'];

  const COPY = {
    zh: {
      pageTitle: '来店预约 — TK168 Premium Automotive',
      eyebrow: 'TK168 CONTACT FLOW',
      title: '来店预约信息填写',
      subtitle: '通过 5 个步骤填写关键信息，整理完成后继续与顾问确认。',
      progressAria: '预约填写步骤',
      steps: {
        appointment: { tab: '来店时间', row: '来店希望时间', lead: '请选择希望到店时间。' },
        name: { tab: '姓名', row: '姓名', lead: '请输入你的姓名。' },
        kana: { tab: '读音', row: '姓名读音', lead: '请输入姓名读音（片假名）。' },
        contact: { tab: '联系方式', row: '邮箱 / 电话', lead: '请输入可联系到你的邮箱和电话。' },
        confirm: { tab: '确认', row: '内容确认', lead: '确认信息无误后完成预约内容整理。' }
      },
      required: '必填',
      edit: '修改',
      fields: {
        date: '日期',
        time: '时间',
        timePlaceholder: '请选择',
        note: '备注（选填）',
        notePlaceholder: '如有看车偏好、预算范围或其他说明，请在这里填写。',
        name: '姓名',
        namePlaceholder: '张三',
        kana: '姓名读音',
        kanaPlaceholder: 'チョウ サン',
        email: '邮箱地址',
        phone: '电话号码',
        postal: '邮编',
        consentNews: '接收新到库存和活动资讯',
        consentPolicy: '同意使用条款与隐私政策'
      },
      summary: {
        empty: '未填写',
        unconfirmed: '未确认',
        pendingPolicy: '邮编 {postal} / 待同意条款',
        readyToSend: '邮编 {postal} / 内容已确认'
      },
      actions: {
        prev: '上一步',
        next: '下一步',
        submit: '完成确认'
      },
      message: {
        appointmentRequired: '请填写来店希望日期和时间。',
        nameRequired: '请输入姓名。',
        kanaRequired: '请输入姓名读音。',
        contactRequired: '请填写邮箱和电话号码。',
        postalRequired: '请输入邮编。',
        consentRequired: '请先同意使用条款与隐私政策。',
        submitSuccess: '预约内容已整理完成，请按填写的联系方式继续与顾问沟通。'
      },
      vehicleStatus: '现车'
    },
    ja: {
      pageTitle: '来店予約 — TK168 Premium Automotive',
      eyebrow: 'TK168 CONTACT FLOW',
      title: '来店予約内容の入力',
      subtitle: '5ステップで必要情報を入力し、内容整理後に担当アドバイザーとの確認へ進みます。',
      progressAria: '入力ステップ',
      steps: {
        appointment: { tab: '来店希望', row: '来店希望日時', lead: '来店希望日時を選択してください。' },
        name: { tab: '氏名', row: '氏名', lead: 'お名前を入力してください。' },
        kana: { tab: 'フリガナ', row: 'フリガナ', lead: 'フリガナを入力してください。' },
        contact: { tab: '連絡先', row: 'メール / 電話', lead: 'ご連絡先を入力してください。' },
        confirm: { tab: '確認', row: '内容確認', lead: '最終確認のうえ内容整理を完了してください。' }
      },
      required: '必須',
      edit: '修正する',
      fields: {
        date: '日付',
        time: '時間',
        timePlaceholder: '選択してください',
        note: '備考（任意）',
        notePlaceholder: '希望条件・相談目的などがあればご記入ください。',
        name: '氏名',
        namePlaceholder: '山田 太郎',
        kana: 'フリガナ',
        kanaPlaceholder: 'ヤマダ タロウ',
        email: 'メールアドレス',
        phone: '電話番号',
        postal: '郵便番号',
        consentNews: '新着在庫やキャンペーン情報を受け取る',
        consentPolicy: '利用規約とプライバシーポリシーに同意する'
      },
      summary: {
        empty: '未入力',
        unconfirmed: '未確認',
        pendingPolicy: '〒{postal} / 規約同意待ち',
        readyToSend: '〒{postal} / 内容確認済み'
      },
      actions: {
        prev: '戻る',
        next: '次へ',
        submit: '確認を完了'
      },
      message: {
        appointmentRequired: '来店希望日時を入力してください。',
        nameRequired: '氏名を入力してください。',
        kanaRequired: 'フリガナを入力してください。',
        contactRequired: 'メールアドレスと電話番号を入力してください。',
        postalRequired: '郵便番号を入力してください。',
        consentRequired: '利用規約とプライバシーポリシーへの同意が必要です。',
        submitSuccess: '予約内容の整理が完了しました。入力した連絡先をもとに担当窓口との確認を進めてください。'
      },
      vehicleStatus: '在庫あり'
    },
    en: {
      pageTitle: 'Visit Booking — TK168 Premium Automotive',
      eyebrow: 'TK168 CONTACT FLOW',
      title: 'Complete Your Visit Booking',
      subtitle: 'Enter the required details in 5 steps and finish organizing them before continuing with your advisor.',
      progressAria: 'Booking steps',
      steps: {
        appointment: { tab: 'Visit time', row: 'Preferred visit time', lead: 'Select your preferred visit date and time.' },
        name: { tab: 'Name', row: 'Full name', lead: 'Enter your name.' },
        kana: { tab: 'Name reading', row: 'Name reading', lead: 'Enter the phonetic reading of your name.' },
        contact: { tab: 'Contact', row: 'Email / phone', lead: 'Enter the contact details we can use to reach you.' },
        confirm: { tab: 'Confirm', row: 'Content review', lead: 'Review everything and complete the booking summary.' }
      },
      required: 'Required',
      edit: 'Edit',
      fields: {
        date: 'Date',
        time: 'Time',
        timePlaceholder: 'Select',
        note: 'Notes (optional)',
        notePlaceholder: 'Add any showroom preferences, budget range, or other notes here.',
        name: 'Full name',
        namePlaceholder: 'Taro Yamada',
        kana: 'Name reading',
        kanaPlaceholder: 'Taro Yamada',
        email: 'Email address',
        phone: 'Phone number',
        postal: 'Postal code',
        consentNews: 'Receive stock updates and event news',
        consentPolicy: 'I agree to the terms of use and privacy policy'
      },
      summary: {
        empty: 'Not provided',
        unconfirmed: 'Not confirmed',
        pendingPolicy: 'Postal code {postal} / policy consent pending',
        readyToSend: 'Postal code {postal} / details confirmed'
      },
      actions: {
        prev: 'Back',
        next: 'Next',
        submit: 'Complete review'
      },
      message: {
        appointmentRequired: 'Please enter your preferred visit date and time.',
        nameRequired: 'Please enter your name.',
        kanaRequired: 'Please enter the phonetic reading of your name.',
        contactRequired: 'Please enter your email address and phone number.',
        postalRequired: 'Please enter your postal code.',
        consentRequired: 'You must agree to the terms of use and privacy policy first.',
        submitSuccess: 'The booking details are organized. Please continue the confirmation using the contact details you entered.'
      },
      vehicleStatus: 'In stock'
    }
  };

  function currentLanguage() {
    return window.TK168I18N?.getLanguage?.() || 'ja';
  }

  function currentCopy() {
    return COPY[currentLanguage()] || COPY.ja || COPY.zh;
  }

  function formatTemplate(template, params) {
    return String(template || '').replace(/\{(\w+)\}/g, (_, key) => params?.[key] ?? '');
  }

  function createVehicleContext() {
    const params = new URLSearchParams(window.location.search);
    const requestedVehicleId = params.get('id') || vehicles[0]?.id || '';
    const currentVehicle = getVehicleById(requestedVehicleId) || vehicles[0] || null;
    const inventoryHref = currentVehicle?.brandKey ? buildBrandUrl(currentVehicle.brandKey) : 'brand.html';
    return {
      currentVehicle,
      inventoryHref
    };
  }

  const inquiryVehicleContext = createVehicleContext();

  window.TK168CommonLinks?.applyCommonLinks();
  window.TK168PageChrome?.applyPageChrome({
    pageKey: 'inquiry',
    inventoryHref: inquiryVehicleContext.inventoryHref,
    navMode: 'solid'
  });

  const state = {
    date: '',
    time: '',
    note: '',
    name: '',
    kana: '',
    email: '',
    phone: '',
    postal: '',
    consentNews: false,
    consentPolicy: false
  };

  let currentStep = 0;

  const refs = {
    pageTitle: document.getElementById('inqPageTitle'),
    eyebrow: document.getElementById('inqEyebrow'),
    title: document.getElementById('inqTitle'),
    subtitle: document.getElementById('inqSubtitle'),
    lead: document.getElementById('inqLeadText'),
    message: document.getElementById('inqMessage'),
    counter: document.getElementById('inqCounter'),
    nextBtn: document.getElementById('inqNextBtn'),
    prevBtn: document.getElementById('inqPrevBtn'),
    progressRoot: document.getElementById('inqProgress'),
    progress: Array.from(document.querySelectorAll('#inqProgress li')),
    rows: Array.from(document.querySelectorAll('.inq-row')),
    jumpStepButtons: Array.from(document.querySelectorAll('[data-jump-step]')),
    jumpRowButtons: Array.from(document.querySelectorAll('[data-jump-row]')),
    requiredBadges: Array.from(document.querySelectorAll('.inq-required')),
    date: document.getElementById('inqDate'),
    time: document.getElementById('inqTime'),
    note: document.getElementById('inqNote'),
    name: document.getElementById('inqName'),
    kana: document.getElementById('inqKana'),
    email: document.getElementById('inqEmail'),
    phone: document.getElementById('inqPhone'),
    postal: document.getElementById('inqPostal'),
    consentNews: document.getElementById('inqConsentNews'),
    consentPolicy: document.getElementById('inqConsentPolicy'),
    summaryAppointment: document.getElementById('inqSummaryAppointment'),
    summaryName: document.getElementById('inqSummaryName'),
    summaryKana: document.getElementById('inqSummaryKana'),
    summaryContact: document.getElementById('inqSummaryContact'),
    summaryConfirm: document.getElementById('inqSummaryConfirm'),
    vehicleThumb: document.getElementById('inqVehicleThumb'),
    vehicleBrand: document.getElementById('inqVehicleBrand'),
    vehicleName: document.getElementById('inqVehicleName'),
    vehicleMeta: document.getElementById('inqVehicleMeta'),
    stepLabels: {
      appointment: document.getElementById('inqStepAppointment'),
      name: document.getElementById('inqStepName'),
      kana: document.getElementById('inqStepKana'),
      contact: document.getElementById('inqStepContact'),
      confirm: document.getElementById('inqStepConfirm')
    },
    rowLabels: {
      appointment: document.getElementById('inqRowAppointment'),
      name: document.getElementById('inqRowName'),
      kana: document.getElementById('inqRowKana'),
      contact: document.getElementById('inqRowContact'),
      confirm: document.getElementById('inqRowConfirm')
    },
    editLabels: {
      appointment: document.getElementById('inqEditAppointment'),
      name: document.getElementById('inqEditName'),
      kana: document.getElementById('inqEditKana'),
      contact: document.getElementById('inqEditContact'),
      confirm: document.getElementById('inqEditConfirm')
    },
    fieldLabels: {
      date: document.getElementById('inqDateLabel'),
      time: document.getElementById('inqTimeLabel'),
      note: document.getElementById('inqNoteLabel'),
      name: document.getElementById('inqNameLabel'),
      kana: document.getElementById('inqKanaLabel'),
      email: document.getElementById('inqEmailLabel'),
      phone: document.getElementById('inqPhoneLabel'),
      postal: document.getElementById('inqPostalLabel'),
      consentNews: document.getElementById('inqConsentNewsLabel'),
      consentPolicy: document.getElementById('inqConsentPolicyLabel')
    },
    timePlaceholder: document.getElementById('inqTimePlaceholder')
  };

  function sanitize(value) {
    return String(value || '').trim();
  }

  function setText(el, value) {
    if (el) el.textContent = value;
  }

  function setValue(el, value) {
    if (el) el.value = value;
  }

  function setPlaceholder(el, value) {
    if (el) el.placeholder = value;
  }

  function applyLanguageCopy() {
    const copy = currentCopy();

    setText(refs.pageTitle, copy.pageTitle);
    document.title = copy.pageTitle;
    setText(refs.eyebrow, copy.eyebrow);
    setText(refs.title, copy.title);
    setText(refs.subtitle, copy.subtitle);

    if (refs.progressRoot) refs.progressRoot.setAttribute('aria-label', copy.progressAria);

    STEP_KEYS.forEach((key) => {
      setText(refs.stepLabels[key], copy.steps[key].tab);
      setText(refs.rowLabels[key], copy.steps[key].row);
      setText(refs.editLabels[key], copy.edit);
    });

    refs.requiredBadges.forEach((badge) => {
      badge.textContent = copy.required;
    });

    setText(refs.fieldLabels.date, copy.fields.date);
    setText(refs.fieldLabels.time, copy.fields.time);
    setText(refs.fieldLabels.note, copy.fields.note);
    setText(refs.fieldLabels.name, copy.fields.name);
    setText(refs.fieldLabels.kana, copy.fields.kana);
    setText(refs.fieldLabels.email, copy.fields.email);
    setText(refs.fieldLabels.phone, copy.fields.phone);
    setText(refs.fieldLabels.postal, copy.fields.postal);
    setText(refs.fieldLabels.consentNews, copy.fields.consentNews);
    setText(refs.fieldLabels.consentPolicy, copy.fields.consentPolicy);

    setText(refs.timePlaceholder, copy.fields.timePlaceholder);
    setPlaceholder(refs.note, copy.fields.notePlaceholder);
    setPlaceholder(refs.name, copy.fields.namePlaceholder);
    setPlaceholder(refs.kana, copy.fields.kanaPlaceholder);

    setText(refs.prevBtn, copy.actions.prev);
  }

  function renderVehicleCard() {
    const vehicle = inquiryVehicleContext.currentVehicle;
    if (!vehicle) return;

    const language = currentLanguage();
    const image = window.TK168_DATA.resolveVehicleMediaSource(vehicle.photo || vehicle.gallery?.[0] || '001.png');
    const year = sanitize(vehicle.year);
    const typeLabel = sanitize(getVehicleFieldLabel('bodyStyle', vehicle.bodyStyle, language) || '');
    const engineLine = window.TK168_DATA?.formatVehicleEngineLine?.(vehicle) || sanitize(vehicle.engine);
    const mileage = sanitize(vehicle.mileage);
    const statusText = currentCopy().vehicleStatus;

    if (refs.vehicleThumb) {
      refs.vehicleThumb.src = image;
      refs.vehicleThumb.alt = getVehicleName(vehicle, language);
    }
    if (refs.vehicleBrand) {
      refs.vehicleBrand.textContent = getBrandLabel(vehicle.brandKey, language).toUpperCase();
    }
    if (refs.vehicleName) {
      refs.vehicleName.textContent = getVehicleName(vehicle, language);
    }
    if (refs.vehicleMeta) {
      refs.vehicleMeta.textContent = [year, typeLabel, engineLine, mileage ? `${mileage}km` : '', statusText]
        .filter(Boolean)
        .join(' / ');
    }
  }

  function buildAppointmentSummary() {
    const date = sanitize(state.date);
    const time = sanitize(state.time);
    if (!date || !time) return currentCopy().summary.empty;
    return `${date} ${time}`;
  }

  function buildContactSummary() {
    const email = sanitize(state.email);
    const phone = sanitize(state.phone);
    if (!email && !phone) return currentCopy().summary.empty;
    if (!email) return phone;
    if (!phone) return email;
    return `${email} / ${phone}`;
  }

  function buildConfirmSummary() {
    const postal = sanitize(state.postal);
    const copy = currentCopy();
    if (!postal) return copy.summary.unconfirmed;
    if (!state.consentPolicy) {
      return formatTemplate(copy.summary.pendingPolicy, { postal });
    }
    return formatTemplate(copy.summary.readyToSend, { postal });
  }

  function syncStateFromInputs() {
    state.date = refs.date.value;
    state.time = refs.time.value;
    state.note = refs.note.value;
    state.name = refs.name.value;
    state.kana = refs.kana.value;
    state.email = refs.email.value;
    state.phone = refs.phone.value;
    state.postal = refs.postal.value;
    state.consentNews = refs.consentNews.checked;
    state.consentPolicy = refs.consentPolicy.checked;
  }

  function renderSummaries() {
    const copy = currentCopy();
    refs.summaryAppointment.textContent = buildAppointmentSummary();
    refs.summaryName.textContent = sanitize(state.name) || copy.summary.empty;
    refs.summaryKana.textContent = sanitize(state.kana) || copy.summary.empty;
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
    const activeKey = STEP_KEYS[currentStep];
    refs.rows.forEach((row) => {
      row.classList.toggle('is-active', row.dataset.row === activeKey);
    });
  }

  function renderActions() {
    const copy = currentCopy();
    refs.prevBtn.disabled = currentStep === 0;
    refs.nextBtn.textContent = currentStep === STEP_KEYS.length - 1 ? copy.actions.submit : copy.actions.next;
    refs.counter.textContent = `${currentStep + 1} / ${STEP_KEYS.length}`;
  }

  function renderHead() {
    const key = STEP_KEYS[currentStep];
    refs.lead.textContent = currentCopy().steps[key].lead;
  }

  function clearMessage() {
    refs.message.textContent = '';
  }

  function setMessage(text, ok) {
    refs.message.textContent = text || '';
    refs.message.style.color = ok ? '#1f8f5f' : '#c6472f';
  }

  function validateStep(stepKey) {
    const msg = currentCopy().message;

    if (stepKey === 'appointment') {
      if (!sanitize(state.date) || !sanitize(state.time)) return msg.appointmentRequired;
      return '';
    }
    if (stepKey === 'name') {
      if (!sanitize(state.name)) return msg.nameRequired;
      return '';
    }
    if (stepKey === 'kana') {
      if (!sanitize(state.kana)) return msg.kanaRequired;
      return '';
    }
    if (stepKey === 'contact') {
      if (!sanitize(state.email) || !sanitize(state.phone)) return msg.contactRequired;
      return '';
    }
    if (stepKey === 'confirm') {
      if (!sanitize(state.postal)) return msg.postalRequired;
      if (!state.consentPolicy) return msg.consentRequired;
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
    const clamped = Math.max(0, Math.min(STEP_KEYS.length - 1, nextStep));
    currentStep = clamped;
    clearMessage();
    render();
  }

  function bindInputEvents() {
    const inputKeys = [
      'date',
      'time',
      'note',
      'name',
      'kana',
      'email',
      'phone',
      'postal',
      'consentNews',
      'consentPolicy'
    ];

    inputKeys.forEach((key) => {
      const el = refs[key];
      if (!el) return;
      const eventName = el.type === 'checkbox' ? 'change' : 'input';
      el.addEventListener(eventName, () => {
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
      const currentKey = STEP_KEYS[currentStep];
      const error = validateStep(currentKey);
      if (error) {
        setMessage(error, false);
        return;
      }

      if (currentStep === STEP_KEYS.length - 1) {
        setMessage(currentCopy().message.submitSuccess, true);
        return;
      }

      moveStep(currentStep + 1);
    });

    refs.jumpStepButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const value = Number(button.dataset.jumpStep || 0);
        moveStep(value);
      });
    });

    refs.jumpRowButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const rowKey = button.dataset.jumpRow || '';
        const target = STEP_KEYS.indexOf(rowKey);
        if (target >= 0) moveStep(target);
      });
    });
  }

  function initDefaultDate() {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    refs.date.value = `${yyyy}-${mm}-${dd}`;
    setValue(refs.time, '13:00');
    syncStateFromInputs();
  }

  function init() {
    applyLanguageCopy();
    renderVehicleCard();
    initDefaultDate();
    bindInputEvents();
    bindStepEvents();
    render();
  }

  window.addEventListener('tk168:languagechange', () => {
    applyLanguageCopy();
    renderVehicleCard();
    render();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
