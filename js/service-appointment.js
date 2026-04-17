(function () {
  const STEP_KEYS = ['appointment', 'service', 'name', 'contact', 'confirm'];

  const COPY = {
    zh: {
      pageTitle: '增值服务预约 — TK168 Premium Automotive',
      eyebrow: 'VALUE-ADDED SERVICE DESK',
      title: '增值服务预约单',
      subtitle: '通过 5 个步骤提交服务需求，顾问会按车辆阶段、服务类型和预约方式帮你安排。',
      cardLabel: 'Service Coordination',
      cardTitle: 'TK168 增值服务协同台',
      cardMeta: '购前评估 / 手续资料 / 交付协同 / 维修保养 / 年检续保',
      cardTags: ['购前评估', '保险说明', '手续资料', '交付前检查', '整备维修', '年检续保'],
      progressAria: '增值服务预约步骤',
      steps: {
        appointment: { tab: '预约方式', row: '希望联系时间', lead: '先确认希望联系日期、时间和沟通方式。' },
        service: { tab: '服务内容', row: '咨询服务', lead: '请选择当前最想先处理的服务事项和车辆阶段。' },
        name: { tab: '联系人', row: '联系人信息', lead: '请填写联系人姓名和偏好语言。' },
        contact: { tab: '联系方式', row: '邮箱 / 电话', lead: '请填写便于顾问回访的联系方式。' },
        confirm: { tab: '确认', row: '内容确认', lead: '补充所在城市或地区并确认条款后，完成内容确认。' }
      },
      required: '必填',
      edit: '修改',
      fields: {
        date: '日期',
        time: '时间',
        timePlaceholder: '请选择',
        mode: '沟通方式',
        modePlaceholder: '请选择',
        modeVisit: '到店面谈',
        modeRemote: '电话 / 微信',
        modeVideo: '视频沟通',
        note: '补充说明（选填）',
        notePlaceholder: '例如：预计交付时间、异常现象、希望先解决的问题',
        category: '服务类别',
        categoryPlaceholder: '请选择',
        categoryAppraisal: '购前评估',
        categoryInsurance: '保险说明与协助',
        categoryDocuments: '手续资料协同',
        categoryInspection: '交付前检查',
        categoryMaintenance: '交车整备与维修',
        categoryRenewal: '年检、续保与后续维护',
        categoryUnsure: '还不确定，想先沟通',
        stage: '当前阶段',
        stagePlaceholder: '请选择',
        stageBrowsing: '还在看车比较',
        stageDeal: '已经决定成交',
        stageDelivery: '交付准备中',
        stageOwned: '已经提车使用中',
        vehicle: '车辆信息 / 当前问题（选填）',
        vehiclePlaceholder: '例如：车型、车牌、里程、异响、剐蹭、预计交付日期',
        name: '联系人姓名',
        namePlaceholder: '例如：张三',
        language: '偏好语言',
        languagePlaceholder: '请选择',
        languageZh: '中文',
        languageJa: '日语',
        languageEn: '英语',
        email: '邮箱地址',
        phone: '电话号码',
        region: '所在城市 / 地区',
        regionPlaceholder: '例如：东京 / 大阪 / 香港',
        consentNews: '接收服务进度与新到库存资讯',
        consentPolicy: '同意使用条款与隐私政策'
      },
      summary: {
        empty: '未填写',
        unconfirmed: '未确认',
        pendingPolicy: '地区 {region} / 待确认条款',
        readyToSend: '地区 {region} / 信息已确认'
      },
      actions: {
        prev: '上一步',
        next: '下一步',
        submit: '完成确认'
      },
      message: {
        appointmentRequired: '请填写希望联系日期、时间和沟通方式。',
        serviceRequired: '请选择服务类别和当前阶段。',
        nameRequired: '请输入联系人姓名。',
        contactRequired: '请填写邮箱和电话号码。',
        regionRequired: '请输入所在城市 / 地区。',
        consentRequired: '请先同意使用条款与隐私政策。',
        submitSuccess: '预约内容已整理完成，请按填写的联系方式继续与顾问沟通。'
      }
    },
    ja: {
      pageTitle: '付加サービス予約 — TK168 Premium Automotive',
      eyebrow: 'VALUE-ADDED SERVICE DESK',
      title: '付加サービス予約フォーム',
      subtitle: '5ステップで要件を入力すると、車両状況と希望手段に合わせて担当アドバイザーが調整します。',
      cardLabel: 'Service Coordination',
      cardTitle: 'TK168 付加サービス窓口',
      cardMeta: '購入前評価 / 書類連携 / 納車調整 / 整備メンテナンス / 車検更新',
      cardTags: ['購入前評価', '保険説明', '書類連携', '納車前点検', '整備修理', '車検更新'],
      progressAria: '付加サービス予約ステップ',
      steps: {
        appointment: { tab: '予約方法', row: '希望連絡日時', lead: 'まずは希望する連絡日時と相談方法を選択してください。' },
        service: { tab: '相談内容', row: '希望サービス', lead: '今優先して相談したい内容と現在の段階を選択してください。' },
        name: { tab: '担当者', row: '担当者情報', lead: 'お名前と希望言語を入力してください。' },
        contact: { tab: '連絡先', row: 'メール / 電話', lead: '折り返ししやすい連絡先を入力してください。' },
        confirm: { tab: '確認', row: '内容確認', lead: '地域情報と規約同意を確認のうえ、内容確認を完了してください。' }
      },
      required: '必須',
      edit: '修正する',
      fields: {
        date: '日付',
        time: '時間',
        timePlaceholder: '選択してください',
        mode: '相談方法',
        modePlaceholder: '選択してください',
        modeVisit: '来店相談',
        modeRemote: '電話 / WeChat',
        modeVideo: 'オンライン相談',
        note: '補足内容（任意）',
        notePlaceholder: '例：納車予定日、異音やキズ、優先して確認したい点',
        category: 'サービス区分',
        categoryPlaceholder: '選択してください',
        categoryAppraisal: '購入前評価',
        categoryInsurance: '保険説明と補助',
        categoryDocuments: '書類・手続き連携',
        categoryInspection: '納車前点検',
        categoryMaintenance: '納車整備と修理',
        categoryRenewal: '車検・更新・保有後対応',
        categoryUnsure: 'まだ未確定なので相談したい',
        stage: '現在の段階',
        stagePlaceholder: '選択してください',
        stageBrowsing: '比較検討中',
        stageDeal: '成約決定後',
        stageDelivery: '納車準備中',
        stageOwned: '納車後の保有段階',
        vehicle: '車両情報 / 現在の症状（任意）',
        vehiclePlaceholder: '例：車種、ナンバー、走行距離、異音、キズ、納車予定日',
        name: '担当者名',
        namePlaceholder: '例：山田 太郎',
        language: '希望言語',
        languagePlaceholder: '選択してください',
        languageZh: '中国語',
        languageJa: '日本語',
        languageEn: '英語',
        email: 'メールアドレス',
        phone: '電話番号',
        region: '所在都市 / 地域',
        regionPlaceholder: '例：東京 / 大阪 / 香港',
        consentNews: '進行案内や新着在庫情報を受け取る',
        consentPolicy: '利用規約とプライバシーポリシーに同意する'
      },
      summary: {
        empty: '未入力',
        unconfirmed: '未確認',
        pendingPolicy: '地域 {region} / 規約確認待ち',
        readyToSend: '地域 {region} / 内容確認済み'
      },
      actions: {
        prev: '戻る',
        next: '次へ',
        submit: '確認を完了'
      },
      message: {
        appointmentRequired: '希望する連絡日時と相談方法を入力してください。',
        serviceRequired: 'サービス区分と現在の段階を選択してください。',
        nameRequired: '担当者名を入力してください。',
        contactRequired: 'メールアドレスと電話番号を入力してください。',
        regionRequired: '所在都市 / 地域を入力してください。',
        consentRequired: '利用規約とプライバシーポリシーへの同意が必要です。',
        submitSuccess: '予約内容の確認が完了しました。入力内容をもとに、担当窓口との相談を進めてください。'
      }
    },
    en: {
      pageTitle: 'Service Booking — TK168 Premium Automotive',
      eyebrow: 'VALUE-ADDED SERVICE DESK',
      title: 'Value-added Service Booking',
      subtitle: 'Submit your service request in 5 steps and your advisor will arrange the next action based on vehicle stage, request type, and preferred contact method.',
      cardLabel: 'Service Coordination',
      cardTitle: 'TK168 Service Coordination Desk',
      cardMeta: 'Pre-purchase review / documents / delivery coordination / maintenance / inspection renewal',
      cardTags: ['Pre-purchase review', 'Insurance support', 'Documents', 'Pre-delivery check', 'Maintenance', 'Inspection renewal'],
      progressAria: 'Service booking steps',
      steps: {
        appointment: { tab: 'Contact method', row: 'Preferred contact time', lead: 'Choose your preferred contact date, time, and consultation method first.' },
        service: { tab: 'Service request', row: 'Requested service', lead: 'Select the service item you want to handle first and the current vehicle stage.' },
        name: { tab: 'Contact person', row: 'Contact details', lead: 'Enter the contact person name and preferred language.' },
        contact: { tab: 'Contact', row: 'Email / phone', lead: 'Enter the email and phone number your advisor can easily use to reply.' },
        confirm: { tab: 'Confirm', row: 'Final confirmation', lead: 'Add your city or region and confirm the policy to complete the request.' }
      },
      required: 'Required',
      edit: 'Edit',
      fields: {
        date: 'Date',
        time: 'Time',
        timePlaceholder: 'Select',
        mode: 'Consultation method',
        modePlaceholder: 'Select',
        modeVisit: 'Visit in person',
        modeRemote: 'Phone / WeChat',
        modeVideo: 'Video call',
        note: 'Notes (optional)',
        notePlaceholder: 'For example: planned delivery date, warning signs, unusual noise, or the item you want checked first',
        category: 'Service category',
        categoryPlaceholder: 'Select',
        categoryAppraisal: 'Pre-purchase review',
        categoryInsurance: 'Insurance guidance and support',
        categoryDocuments: 'Document coordination',
        categoryInspection: 'Pre-delivery inspection',
        categoryMaintenance: 'Delivery preparation and repair',
        categoryRenewal: 'Inspection, renewal, and aftercare',
        categoryUnsure: 'Not sure yet, I want to discuss first',
        stage: 'Current stage',
        stagePlaceholder: 'Select',
        stageBrowsing: 'Still comparing vehicles',
        stageDeal: 'Deal already decided',
        stageDelivery: 'Preparing for delivery',
        stageOwned: 'Already using the vehicle',
        vehicle: 'Vehicle details / current issue (optional)',
        vehiclePlaceholder: 'For example: model, plate number, mileage, unusual noise, scratches, expected delivery date',
        name: 'Contact person name',
        namePlaceholder: 'For example: Taro Yamada',
        language: 'Preferred language',
        languagePlaceholder: 'Select',
        languageZh: 'Chinese',
        languageJa: 'Japanese',
        languageEn: 'English',
        email: 'Email address',
        phone: 'Phone number',
        region: 'City / region',
        regionPlaceholder: 'For example: Tokyo / Osaka / Hong Kong',
        consentNews: 'Receive service progress updates and new stock notifications',
        consentPolicy: 'I agree to the terms of use and privacy policy'
      },
      summary: {
        empty: 'Not provided',
        unconfirmed: 'Not confirmed',
        pendingPolicy: 'Region {region} / policy consent pending',
        readyToSend: 'Region {region} / information confirmed'
      },
      actions: {
        prev: 'Back',
        next: 'Next',
        submit: 'Complete confirmation'
      },
      message: {
        appointmentRequired: 'Please enter the preferred contact date, time, and consultation method.',
        serviceRequired: 'Please select a service category and the current vehicle stage.',
        nameRequired: 'Please enter the contact person name.',
        contactRequired: 'Please enter the email address and phone number.',
        regionRequired: 'Please enter your city or region.',
        consentRequired: 'You must agree to the terms of use and privacy policy first.',
        submitSuccess: 'The booking details are organized. Please continue the consultation using the contact details you entered.'
      }
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

  window.TK168CommonLinks?.applyCommonLinks();
  window.TK168PageChrome?.applyPageChrome({
    pageKey: 'service',
    inventoryHref: 'brand.html',
    serviceHref: 'service.html',
    navMode: 'solid'
  });

  const state = {
    date: '',
    time: '',
    mode: '',
    note: '',
    category: '',
    stage: '',
    vehicle: '',
    name: '',
    language: '',
    email: '',
    phone: '',
    region: '',
    consentNews: false,
    consentPolicy: false
  };

  let currentStep = 0;

  const refs = {
    pageTitle: document.getElementById('svcPageTitle'),
    eyebrow: document.getElementById('svcEyebrow'),
    title: document.getElementById('svcTitle'),
    subtitle: document.getElementById('svcSubtitle'),
    cardLabel: document.getElementById('svcCardLabel'),
    cardTitle: document.getElementById('svcCardTitle'),
    cardMeta: document.getElementById('svcCardMeta'),
    cardTags: Array.from(document.querySelectorAll('[data-svc-tag]')),
    lead: document.getElementById('svcLeadText'),
    message: document.getElementById('svcMessage'),
    counter: document.getElementById('svcCounter'),
    nextBtn: document.getElementById('svcNextBtn'),
    prevBtn: document.getElementById('svcPrevBtn'),
    progressRoot: document.getElementById('svcProgress'),
    progress: Array.from(document.querySelectorAll('#svcProgress li')),
    rows: Array.from(document.querySelectorAll('.inq-row')),
    jumpStepButtons: Array.from(document.querySelectorAll('[data-jump-step]')),
    jumpRowButtons: Array.from(document.querySelectorAll('[data-jump-row]')),
    requiredBadges: Array.from(document.querySelectorAll('.inq-required')),
    date: document.getElementById('svcDate'),
    time: document.getElementById('svcTime'),
    mode: document.getElementById('svcMode'),
    note: document.getElementById('svcNote'),
    category: document.getElementById('svcCategory'),
    stage: document.getElementById('svcStage'),
    vehicle: document.getElementById('svcVehicle'),
    name: document.getElementById('svcName'),
    language: document.getElementById('svcLanguage'),
    email: document.getElementById('svcEmail'),
    phone: document.getElementById('svcPhone'),
    region: document.getElementById('svcRegion'),
    consentNews: document.getElementById('svcConsentNews'),
    consentPolicy: document.getElementById('svcConsentPolicy'),
    summaryAppointment: document.getElementById('svcSummaryAppointment'),
    summaryService: document.getElementById('svcSummaryService'),
    summaryName: document.getElementById('svcSummaryName'),
    summaryContact: document.getElementById('svcSummaryContact'),
    summaryConfirm: document.getElementById('svcSummaryConfirm'),
    stepLabels: {
      appointment: document.getElementById('svcStepAppointment'),
      service: document.getElementById('svcStepService'),
      name: document.getElementById('svcStepName'),
      contact: document.getElementById('svcStepContact'),
      confirm: document.getElementById('svcStepConfirm')
    },
    rowLabels: {
      appointment: document.getElementById('svcRowAppointment'),
      service: document.getElementById('svcRowService'),
      name: document.getElementById('svcRowName'),
      contact: document.getElementById('svcRowContact'),
      confirm: document.getElementById('svcRowConfirm')
    },
    editLabels: {
      appointment: document.getElementById('svcEditAppointment'),
      service: document.getElementById('svcEditService'),
      name: document.getElementById('svcEditName'),
      contact: document.getElementById('svcEditContact'),
      confirm: document.getElementById('svcEditConfirm')
    },
    fieldLabels: {
      date: document.getElementById('svcDateLabel'),
      time: document.getElementById('svcTimeLabel'),
      mode: document.getElementById('svcModeLabel'),
      note: document.getElementById('svcNoteLabel'),
      category: document.getElementById('svcCategoryLabel'),
      stage: document.getElementById('svcStageLabel'),
      vehicle: document.getElementById('svcVehicleLabel'),
      name: document.getElementById('svcNameLabel'),
      language: document.getElementById('svcLanguageLabel'),
      email: document.getElementById('svcEmailLabel'),
      phone: document.getElementById('svcPhoneLabel'),
      region: document.getElementById('svcRegionLabel'),
      consentNews: document.getElementById('svcConsentNewsLabel'),
      consentPolicy: document.getElementById('svcConsentPolicyLabel')
    },
    optionLabels: {
      timePlaceholder: document.getElementById('svcTimePlaceholder'),
      modePlaceholder: document.getElementById('svcModePlaceholder'),
      modeVisit: document.getElementById('svcModeVisit'),
      modeRemote: document.getElementById('svcModeRemote'),
      modeVideo: document.getElementById('svcModeVideo'),
      categoryPlaceholder: document.getElementById('svcCategoryPlaceholder'),
      categoryAppraisal: document.getElementById('svcCategoryAppraisal'),
      categoryInsurance: document.getElementById('svcCategoryInsurance'),
      categoryDocuments: document.getElementById('svcCategoryDocuments'),
      categoryInspection: document.getElementById('svcCategoryInspection'),
      categoryMaintenance: document.getElementById('svcCategoryMaintenance'),
      categoryRenewal: document.getElementById('svcCategoryRenewal'),
      categoryUnsure: document.getElementById('svcCategoryUnsure'),
      stagePlaceholder: document.getElementById('svcStagePlaceholder'),
      stageBrowsing: document.getElementById('svcStageBrowsing'),
      stageDeal: document.getElementById('svcStageDeal'),
      stageDelivery: document.getElementById('svcStageDelivery'),
      stageOwned: document.getElementById('svcStageOwned'),
      languagePlaceholder: document.getElementById('svcLanguagePlaceholder'),
      languageZh: document.getElementById('svcLanguageZh'),
      languageJa: document.getElementById('svcLanguageJa'),
      languageEn: document.getElementById('svcLanguageEn')
    }
  };

  function sanitize(value) {
    return String(value || '').trim();
  }

  function setText(el, value) {
    if (el) el.textContent = value;
  }

  function setPlaceholder(el, value) {
    if (el) el.placeholder = value;
  }

  function getSelectedText(select) {
    const option = select?.selectedOptions?.[0];
    if (!option || !option.value) return '';
    return option.textContent.trim();
  }

  function applyLanguageCopy() {
    const copy = currentCopy();

    setText(refs.pageTitle, copy.pageTitle);
    document.title = copy.pageTitle;
    setText(refs.eyebrow, copy.eyebrow);
    setText(refs.title, copy.title);
    setText(refs.subtitle, copy.subtitle);
    setText(refs.cardLabel, copy.cardLabel);
    setText(refs.cardTitle, copy.cardTitle);
    setText(refs.cardMeta, copy.cardMeta);

    refs.cardTags.forEach((tag, index) => {
      tag.textContent = copy.cardTags[index] || '';
    });

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
    setText(refs.fieldLabels.mode, copy.fields.mode);
    setText(refs.fieldLabels.note, copy.fields.note);
    setText(refs.fieldLabels.category, copy.fields.category);
    setText(refs.fieldLabels.stage, copy.fields.stage);
    setText(refs.fieldLabels.vehicle, copy.fields.vehicle);
    setText(refs.fieldLabels.name, copy.fields.name);
    setText(refs.fieldLabels.language, copy.fields.language);
    setText(refs.fieldLabels.email, copy.fields.email);
    setText(refs.fieldLabels.phone, copy.fields.phone);
    setText(refs.fieldLabels.region, copy.fields.region);
    setText(refs.fieldLabels.consentNews, copy.fields.consentNews);
    setText(refs.fieldLabels.consentPolicy, copy.fields.consentPolicy);

    setText(refs.optionLabels.timePlaceholder, copy.fields.timePlaceholder);
    setText(refs.optionLabels.modePlaceholder, copy.fields.modePlaceholder);
    setText(refs.optionLabels.modeVisit, copy.fields.modeVisit);
    setText(refs.optionLabels.modeRemote, copy.fields.modeRemote);
    setText(refs.optionLabels.modeVideo, copy.fields.modeVideo);
    setText(refs.optionLabels.categoryPlaceholder, copy.fields.categoryPlaceholder);
    setText(refs.optionLabels.categoryAppraisal, copy.fields.categoryAppraisal);
    setText(refs.optionLabels.categoryInsurance, copy.fields.categoryInsurance);
    setText(refs.optionLabels.categoryDocuments, copy.fields.categoryDocuments);
    setText(refs.optionLabels.categoryInspection, copy.fields.categoryInspection);
    setText(refs.optionLabels.categoryMaintenance, copy.fields.categoryMaintenance);
    setText(refs.optionLabels.categoryRenewal, copy.fields.categoryRenewal);
    setText(refs.optionLabels.categoryUnsure, copy.fields.categoryUnsure);
    setText(refs.optionLabels.stagePlaceholder, copy.fields.stagePlaceholder);
    setText(refs.optionLabels.stageBrowsing, copy.fields.stageBrowsing);
    setText(refs.optionLabels.stageDeal, copy.fields.stageDeal);
    setText(refs.optionLabels.stageDelivery, copy.fields.stageDelivery);
    setText(refs.optionLabels.stageOwned, copy.fields.stageOwned);
    setText(refs.optionLabels.languagePlaceholder, copy.fields.languagePlaceholder);
    setText(refs.optionLabels.languageZh, copy.fields.languageZh);
    setText(refs.optionLabels.languageJa, copy.fields.languageJa);
    setText(refs.optionLabels.languageEn, copy.fields.languageEn);

    setPlaceholder(refs.note, copy.fields.notePlaceholder);
    setPlaceholder(refs.vehicle, copy.fields.vehiclePlaceholder);
    setPlaceholder(refs.name, copy.fields.namePlaceholder);
    setPlaceholder(refs.region, copy.fields.regionPlaceholder);

    setText(refs.prevBtn, copy.actions.prev);
  }

  function buildAppointmentSummary() {
    const date = sanitize(state.date);
    const time = sanitize(state.time);
    const mode = getSelectedText(refs.mode);
    if (!date || !time || !mode) return currentCopy().summary.empty;
    return `${date} ${time} / ${mode}`;
  }

  function buildServiceSummary() {
    const category = getSelectedText(refs.category);
    const stage = getSelectedText(refs.stage);
    if (!category && !stage) return currentCopy().summary.empty;
    if (!category) return stage;
    if (!stage) return category;
    return `${category} / ${stage}`;
  }

  function buildNameSummary() {
    const name = sanitize(state.name);
    const language = getSelectedText(refs.language);
    if (!name && !language) return currentCopy().summary.empty;
    if (!language) return name;
    if (!name) return language;
    return `${name} / ${language}`;
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
    const region = sanitize(state.region);
    const copy = currentCopy();
    if (!region) return copy.summary.unconfirmed;
    if (!state.consentPolicy) {
      return formatTemplate(copy.summary.pendingPolicy, { region });
    }
    return formatTemplate(copy.summary.readyToSend, { region });
  }

  function syncStateFromInputs() {
    state.date = refs.date.value;
    state.time = refs.time.value;
    state.mode = refs.mode.value;
    state.note = refs.note.value;
    state.category = refs.category.value;
    state.stage = refs.stage.value;
    state.vehicle = refs.vehicle.value;
    state.name = refs.name.value;
    state.language = refs.language.value;
    state.email = refs.email.value;
    state.phone = refs.phone.value;
    state.region = refs.region.value;
    state.consentNews = refs.consentNews.checked;
    state.consentPolicy = refs.consentPolicy.checked;
  }

  function renderSummaries() {
    const copy = currentCopy();
    refs.summaryAppointment.textContent = buildAppointmentSummary();
    refs.summaryService.textContent = buildServiceSummary();
    refs.summaryName.textContent = buildNameSummary() || copy.summary.empty;
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
      if (!sanitize(state.date) || !sanitize(state.time) || !sanitize(state.mode)) return msg.appointmentRequired;
      return '';
    }
    if (stepKey === 'service') {
      if (!sanitize(state.category) || !sanitize(state.stage)) return msg.serviceRequired;
      return '';
    }
    if (stepKey === 'name') {
      if (!sanitize(state.name)) return msg.nameRequired;
      return '';
    }
    if (stepKey === 'contact') {
      if (!sanitize(state.email) || !sanitize(state.phone)) return msg.contactRequired;
      return '';
    }
    if (stepKey === 'confirm') {
      if (!sanitize(state.region)) return msg.regionRequired;
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
    currentStep = Math.max(0, Math.min(STEP_KEYS.length - 1, nextStep));
    clearMessage();
    render();
  }

  function bindInputEvents() {
    const inputKeys = [
      'date',
      'time',
      'mode',
      'note',
      'category',
      'stage',
      'vehicle',
      'name',
      'language',
      'email',
      'phone',
      'region',
      'consentNews',
      'consentPolicy'
    ];

    inputKeys.forEach((key) => {
      const el = refs[key];
      if (!el) return;
      const eventName = el.type === 'checkbox' || el.tagName === 'SELECT' ? 'change' : 'input';
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
    refs.time.value = '13:00';
    syncStateFromInputs();
  }

  function init() {
    applyLanguageCopy();
    initDefaultDate();
    bindInputEvents();
    bindStepEvents();
    render();
  }

  window.addEventListener('tk168:languagechange', () => {
    applyLanguageCopy();
    render();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
