(function () {
  const {
    vehicles,
    getVehicleById,
    getInventoryVehicleById,
    getVehicleName,
    getBrandLabel,
    getVehicleFieldLabel,
    buildBrandUrl
  } = window.TK168_DATA;

  const FLOW_KEYS = ['edit', 'review'];
  const SECTION_KEYS = ['appointment', 'name', 'kana', 'contact'];

  const COPY = {
    zh: {
      pageTitle: '来店预约 — TK168 Premium Automotive',
      eyebrow: 'TK168 CONTACT FLOW',
      title: '来店预约信息填写',
      subtitle: '先在一页填完信息，再在确认页核对后提交。',
      flow: {
        reviewLead: '请核对下列摘要，确认无误后提交。'
      },
      steps: {
        appointment: { tab: '来店时间', row: '来店希望时间', lead: '请选择希望到店时间。' },
        name: { tab: '姓名', row: '姓名', lead: '请输入你的姓名。' },
        kana: { tab: '读音', row: '姓名读音', lead: '请输入姓名读音（片假名）。' },
        contact: { tab: '联系方式', row: '邮箱 / 电话', lead: '请输入可联系到你的邮箱和电话。' }
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
        consentNews: '接收新到库存和活动资讯'
      },
      summary: {
        empty: '未填写',
        policyPending: '待同意条款',
        policyConfirmed: '条款已同意'
      },
      actions: {
        toReview: '确认',
        submit: '确认提交'
      },
      message: {
        appointmentRequired: '请填写来店希望日期和时间。',
        nameRequired: '请输入姓名。',
        kanaRequired: '请输入姓名读音。',
        contactRequired: '请填写邮箱和电话号码。',
        consentRequired: '请先同意使用条款与隐私政策。',
        submitSuccess: '预约内容已整理完成，请按填写的联系方式继续与顾问沟通。'
      },
      footnoteLine1: '若您希望的来店时间无法安排，我们可能会通过电话与您另行协调。',
      footnoteLine2: '您提供的个人信息将用于车辆收购、销售等本公司服务的介绍（电话、邮件等）及相关服务提供。'
    },
    ja: {
      pageTitle: '来店予約 — TK168 Premium Automotive',
      eyebrow: 'TK168 CONTACT FLOW',
      title: '来店予約内容の入力',
      subtitle: '必要事項を1ページにまとめて入力し、確認ページで内容を確認してから送信します。',
      flow: {
        reviewLead: '入力内容をご確認のうえ、問題なければ送信してください。'
      },
      steps: {
        appointment: { tab: '来店希望', row: '来店希望日時', lead: '来店希望日時を選択してください。' },
        name: { tab: '氏名', row: '氏名', lead: 'お名前を入力してください。' },
        kana: { tab: 'フリガナ', row: 'フリガナ', lead: 'フリガナを入力してください。' },
        contact: { tab: '連絡先', row: 'メール / 電話', lead: 'ご連絡先を入力してください。' }
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
        consentNews: '新着在庫やキャンペーン情報を受け取る'
      },
      summary: {
        empty: '未入力',
        policyPending: '規約同意待ち',
        policyConfirmed: '規約同意済み'
      },
      actions: {
        toReview: '確認',
        submit: 'この内容で送信'
      },
      message: {
        appointmentRequired: '来店希望日時を入力してください。',
        nameRequired: '氏名を入力してください。',
        kanaRequired: 'フリガナを入力してください。',
        contactRequired: 'メールアドレスと電話番号を入力してください。',
        consentRequired: '利用規約とプライバシーポリシーへの同意が必要です。',
        submitSuccess: '予約内容の整理が完了しました。入力した連絡先をもとに担当窓口との確認を進めてください。'
      },
      footnoteLine1: 'ご希望の日時で承れない場合は、お電話にてご調整させていただく場合がございます。',
      footnoteLine2: 'お客様からご提供頂いた個人情報は、お車の買取、販売など当社サービスのご案内（電話・メール等）及びご提供のために利用いたします。'
    },
    en: {
      pageTitle: 'Visit Booking — TK168 Premium Automotive',
      eyebrow: 'TK168 CONTACT FLOW',
      title: 'Complete Your Visit Booking',
      subtitle: 'Fill everything on one page, review the summary, then submit.',
      flow: {
        reviewLead: 'Review your answers below, then submit if everything looks correct.'
      },
      steps: {
        appointment: { tab: 'Visit time', row: 'Preferred visit time', lead: 'Select your preferred visit date and time.' },
        name: { tab: 'Name', row: 'Full name', lead: 'Enter your name.' },
        kana: { tab: 'Name reading', row: 'Name reading', lead: 'Enter the phonetic reading of your name.' },
        contact: { tab: 'Contact', row: 'Email / phone', lead: 'Enter the contact details we can use to reach you.' }
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
        consentNews: 'Receive stock updates and event news'
      },
      summary: {
        empty: 'Not provided',
        policyPending: 'Terms consent pending',
        policyConfirmed: 'Terms agreed'
      },
      actions: {
        toReview: 'Confirm',
        submit: 'Submit booking'
      },
      message: {
        appointmentRequired: 'Please enter your preferred visit date and time.',
        nameRequired: 'Please enter your name.',
        kanaRequired: 'Please enter the phonetic reading of your name.',
        contactRequired: 'Please enter your email address and phone number.',
        consentRequired: 'You must agree to the terms of use and privacy policy first.',
        submitSuccess: 'The booking details are organized. Please continue the confirmation using the contact details you entered.'
      },
      footnoteLine1: 'If your preferred visit time cannot be accommodated, we may contact you by phone to arrange an alternative.',
      footnoteLine2: 'Personal information you provide will be used to introduce and deliver our services, including vehicle purchase and sales (by phone, email, and other means).'
    }
  };

  function currentLanguage() {
    return window.TK168I18N?.getLanguage?.() || 'ja';
  }

  function currentCopy() {
    return COPY[currentLanguage()] || COPY.ja || COPY.zh;
  }

  const INQUIRY_VEHICLE_ID_KEY = 'tk168:inquiryVehicleId';

  function getRequestedInquiryVehicleId() {
    const params = new URLSearchParams(window.location.search);
    let id = (params.get('id') || '').trim();
    if (!id) {
      try {
        id = (sessionStorage.getItem(INQUIRY_VEHICLE_ID_KEY) || '').trim();
      } catch (_) {
        id = '';
      }
      if (id) {
        try {
          sessionStorage.removeItem(INQUIRY_VEHICLE_ID_KEY);
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

  function createVehicleContext() {
    const requestedVehicleId = getRequestedInquiryVehicleId();
    const currentVehicle = requestedVehicleId
      ? (getInventoryVehicleById(requestedVehicleId) || null)
      : (vehicles[0] || null);
    const inventoryHref = currentVehicle?.brandKey ? buildBrandUrl(currentVehicle.brandKey) : 'brand.html';
    return {
      requestedVehicleId,
      currentVehicle,
      inventoryHref
    };
  }

  const inquiryVehicleContext = createVehicleContext();

  function currentInquiryVehicleId() {
    return String(inquiryVehicleContext.currentVehicle?.id || getRequestedInquiryVehicleId() || '').trim();
  }

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
    footnoteLine1: document.getElementById('inqFootnoteLine1'),
    footnoteLine2: document.getElementById('inqFootnoteLine2'),
    message: document.getElementById('inqMessage'),
    nextBtn: document.getElementById('inqNextBtn'),
    board: document.getElementById('inqBoard'),
    rows: Array.from(document.querySelectorAll('.inq-row')),
    requiredBadges: Array.from(document.querySelectorAll('.inq-required')),
    date: document.getElementById('inqDate'),
    time: document.getElementById('inqTime'),
    note: document.getElementById('inqNote'),
    name: document.getElementById('inqName'),
    kana: document.getElementById('inqKana'),
    email: document.getElementById('inqEmail'),
    phone: document.getElementById('inqPhone'),
    consentNews: document.getElementById('inqConsentNews'),
    consentPolicy: document.getElementById('inqConsentPolicy'),
    summaryAppointment: document.getElementById('inqSummaryAppointment'),
    summaryName: document.getElementById('inqSummaryName'),
    summaryKana: document.getElementById('inqSummaryKana'),
    summaryContact: document.getElementById('inqSummaryContact'),
    vehicleThumb: document.getElementById('inqVehicleThumb'),
    vehicleBrand: document.getElementById('inqVehicleBrand'),
    vehicleName: document.getElementById('inqVehicleName'),
    vehicleMeta: document.getElementById('inqVehicleMeta'),
    rowLabels: {
      appointment: document.getElementById('inqRowAppointment'),
      name: document.getElementById('inqRowName'),
      kana: document.getElementById('inqRowKana'),
      contact: document.getElementById('inqRowContact')
    },
    editLabels: {
      appointment: document.getElementById('inqEditAppointment'),
      name: document.getElementById('inqEditName'),
      kana: document.getElementById('inqEditKana'),
      contact: document.getElementById('inqEditContact')
    },
    fieldLabels: {
      date: document.getElementById('inqDateLabel'),
      time: document.getElementById('inqTimeLabel'),
      note: document.getElementById('inqNoteLabel'),
      name: document.getElementById('inqNameLabel'),
      kana: document.getElementById('inqKanaLabel'),
      email: document.getElementById('inqEmailLabel'),
      phone: document.getElementById('inqPhoneLabel'),
      consentNews: document.getElementById('inqConsentNewsLabel')
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
    setText(refs.footnoteLine1, copy.footnoteLine1);
    setText(refs.footnoteLine2, copy.footnoteLine2);

    SECTION_KEYS.forEach((key) => {
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
    setText(refs.fieldLabels.consentNews, copy.fields.consentNews);

    window.TK168LegalConsentLabel?.init?.(document, currentLanguage());

    setText(refs.timePlaceholder, copy.fields.timePlaceholder);
    setPlaceholder(refs.note, copy.fields.notePlaceholder);
    setPlaceholder(refs.name, copy.fields.namePlaceholder);
    setPlaceholder(refs.kana, copy.fields.kanaPlaceholder);
  }

  function renderVehicleCard() {
    const vehicle = inquiryVehicleContext.currentVehicle;
    if (!vehicle) return;

    const language = currentLanguage();
    const image = window.TK168_DATA.resolveVehicleMediaSource(vehicle.photo || vehicle.gallery?.[0] || '001.png');
    const year = sanitize(vehicle.year);
    const typeLabel = sanitize(getVehicleFieldLabel('bodyStyle', vehicle.bodyStyle, language) || '');
    const engineLine = window.TK168_DATA?.formatVehicleEngineLine?.(vehicle) || sanitize(vehicle.engine);
    const mileageDisplay =
      window.TK168_DATA?.formatVehicleMileageDisplay?.(vehicle.mileage, language, vehicle.mileageUnit) || '';

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
      refs.vehicleMeta.textContent = [year, typeLabel, engineLine, mileageDisplay]
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
    const copy = currentCopy();
    const contactParts = [];
    if (email && phone) contactParts.push(`${email} / ${phone}`);
    else if (email) contactParts.push(email);
    else if (phone) contactParts.push(phone);

    if (!contactParts.length) return copy.summary.empty;

    const policyLabel = state.consentPolicy ? copy.summary.policyConfirmed : copy.summary.policyPending;
    return `${contactParts.join('')} / ${policyLabel}`;
  }

  function syncStateFromInputs() {
    state.date = refs.date.value;
    state.time = refs.time.value;
    state.note = refs.note.value;
    state.name = refs.name.value;
    state.kana = refs.kana.value;
    state.email = refs.email.value;
    state.phone = refs.phone.value;
    state.consentNews = refs.consentNews.checked;
    state.consentPolicy = refs.consentPolicy.checked;
  }

  function renderSummaries() {
    const copy = currentCopy();
    refs.summaryAppointment.textContent = buildAppointmentSummary();
    refs.summaryName.textContent = sanitize(state.name) || copy.summary.empty;
    refs.summaryKana.textContent = sanitize(state.kana) || copy.summary.empty;
    refs.summaryContact.textContent = buildContactSummary();
  }

  function applyBoardStep() {
    if (!refs.board) return;
    refs.board.classList.toggle('is-step-edit', currentStep === 0);
    refs.board.classList.toggle('is-step-review', currentStep === 1);
    refs.rows.forEach((row) => row.classList.remove('is-active'));
  }

  function renderRows() {
    applyBoardStep();
  }

  function renderActions() {
    const copy = currentCopy();
    refs.nextBtn.textContent = currentStep === 0 ? copy.actions.toReview : copy.actions.submit;
  }

  function renderHead() {
    const copy = currentCopy();
    const raw = currentStep === 0 ? copy.flow.editLead : copy.flow.reviewLead;
    const trimmed = String(raw || '').trim();
    if (!refs.lead) return;
    refs.lead.textContent = trimmed;
    refs.lead.hidden = !trimmed;
  }

  function clearMessage() {
    refs.message.textContent = '';
  }

  function setMessage(text, ok) {
    refs.message.textContent = text || '';
    refs.message.style.color = ok ? '#1f8f5f' : '#c6472f';
  }

  function validateSection(sectionKey) {
    const msg = currentCopy().message;

    if (sectionKey === 'appointment') {
      if (!sanitize(state.date) || !sanitize(state.time)) return msg.appointmentRequired;
      return '';
    }
    if (sectionKey === 'name') {
      if (!sanitize(state.name)) return msg.nameRequired;
      return '';
    }
    if (sectionKey === 'kana') {
      if (!sanitize(state.kana)) return msg.kanaRequired;
      return '';
    }
    if (sectionKey === 'contact') {
      if (!sanitize(state.email) || !sanitize(state.phone)) return msg.contactRequired;
      if (!state.consentPolicy) {
        return window.TK168LegalConsentLabel?.getConsentRequiredMessage?.(currentLanguage()) || msg.consentRequired;
      }
      return '';
    }
    return '';
  }

  function validateAllSections() {
    for (let i = 0; i < SECTION_KEYS.length; i += 1) {
      const err = validateSection(SECTION_KEYS[i]);
      if (err) return err;
    }
    return '';
  }

  function render() {
    renderHead();
    renderRows();
    renderSummaries();
    renderActions();
  }

  function moveStep(nextStep) {
    const clamped = Math.max(0, Math.min(FLOW_KEYS.length - 1, nextStep));
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

  function buildSubmitPayload() {
    syncStateFromInputs();
    return {
      appointment: {
        date: state.date,
        time: state.time,
        note: state.note
      },
      name: state.name,
      kana: state.kana,
      email: state.email,
      phone: state.phone,
      consentNews: state.consentNews,
      consentPolicy: state.consentPolicy
    };
  }

  function buildSubmitMeta() {
    const vehicle = inquiryVehicleContext.currentVehicle;
    const language = currentLanguage();
    return {
      vehicleId: vehicle?.id || currentInquiryVehicleId(),
      vehicleName: vehicle ? getVehicleName(vehicle, language) : '',
      vehicleBrand: vehicle ? getBrandLabel(vehicle.brandKey, language) : ''
    };
  }

  function bindStepEvents() {
    refs.nextBtn.addEventListener('click', async () => {
      syncStateFromInputs();
      if (currentStep === 0) {
        const error = validateAllSections();
        if (error) {
          setMessage(error, false);
          return;
        }
        moveStep(1);
        return;
      }

      const error = validateAllSections();
      if (error) {
        setMessage(error, false);
        return;
      }

      refs.nextBtn.disabled = true;
      try {
        await window.TK168FormSubmit.send({
          form: 'inquiry',
          data: buildSubmitPayload(),
          meta: buildSubmitMeta()
        });
        setMessage(currentCopy().message.submitSuccess, true);
      } catch (submitError) {
        console.error('[inquiry] submit failed', submitError);
        setMessage(window.TK168FormSubmit.networkErrorMessage(), false);
        refs.nextBtn.disabled = false;
      }
    });
  }

  function initDefaultDate() {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    refs.date.value = `${yyyy}-${mm}-${dd}`;
    setValue(refs.time, window.TK168FormTimeSlots?.DEFAULT_TIME || '13:00');
    syncStateFromInputs();
  }

  function navigateInquiryBack() {
    if (currentStep === 1) {
      moveStep(0);
      return;
    }
    try {
      const ref = document.referrer || '';
      if (ref.startsWith(window.location.origin)) {
        const path = new URL(ref).pathname.toLowerCase();
        if (path.indexOf('inquiry.html') === -1) {
          window.location.assign(ref);
          return;
        }
      }
    } catch {
      /* ignore */
    }
    const id = currentInquiryVehicleId();
    if (id && typeof window.TK168_DATA?.buildDetailUrl === 'function') {
      window.location.assign(window.TK168_DATA.buildDetailUrl(id));
      return;
    }
    window.location.assign(inquiryVehicleContext.inventoryHref || 'brand.html');
  }

  function init() {
    applyLanguageCopy();
    renderVehicleCard();
    initDefaultDate();
    bindInputEvents();
    bindStepEvents();
    document.getElementById('inqBackNavBtn')?.addEventListener('click', navigateInquiryBack);
    render();
  }

  window.addEventListener('tk168:languagechange', () => {
    applyLanguageCopy();
    renderVehicleCard();
    render();
  });

  function refreshVehicleFromHydrate() {
    const id = inquiryVehicleContext.requestedVehicleId || getRequestedInquiryVehicleId();
    const next = id ? getInventoryVehicleById(id) : null;
    if (!next) return;
    const prev = inquiryVehicleContext.currentVehicle;
    if (prev && next.id === prev.id && prev.name === next.name) return;
    inquiryVehicleContext.currentVehicle = next;
    inquiryVehicleContext.inventoryHref = next.brandKey ? buildBrandUrl(next.brandKey) : 'brand.html';
    renderVehicleCard();
    render();
  }

  document.addEventListener('tk168:data-updated', (event) => {
    if (!event?.detail?.vehicles) return;
    refreshVehicleFromHydrate();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
