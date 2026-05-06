(function () {
  const {
    getVehicleById,
    getVehicleName,
    getBrandLabel,
    getVehicleFieldLabel,
    getVehicleRentalProfile,
    getRentableVehicles,
    getDisplayPrice,
    resolveVehicleMediaSource,
    buildBrandUrl
  } = window.TK168_DATA;

  const STEP_KEYS = ['appointment', 'plan', 'name', 'contact', 'confirm'];

  const COPY = {
    zh: {
      pageTitle: '租车咨询 — TK168 Premium Automotive',
      eyebrow: 'TK168 RENTAL CONSULT',
      title: '租车咨询单',
      subtitle: '按来店预约的 5 步结构整理租车需求，整理完成后继续与顾问确认。',
      progressAria: '租车咨询步骤',
      vehicleStatus: '当前可租',
      metrics: {
        rate: '日租金',
        deposit: '押金',
        minDays: '最短租期'
      },
      steps: {
        appointment: { tab: '用车时间', row: '希望用车时间', lead: '先确认希望用车日期、取车时间和预计租期。' },
        plan: { tab: '使用计划', row: '使用计划', lead: '说明主要用途和行程范围，顾问才能更快判断是否合适。' },
        name: { tab: '联系人', row: '联系人信息', lead: '填写联系人姓名和偏好语言。' },
        contact: { tab: '联系方式', row: '邮箱 / 电话', lead: '请留下方便回访的邮箱和电话。' },
        confirm: { tab: '确认', row: '内容确认', lead: '最后确认取车城市与条款同意，完成咨询内容整理。' }
      },
      required: '必填',
      edit: '修改',
      fields: {
        date: '日期',
        time: '取车时间',
        timePlaceholder: '请选择',
        days: '预计租期',
        usage: '主要用途',
        usagePlaceholder: '请选择',
        usageCity: '市区代步',
        usageBusiness: '商务接待',
        usageTrip: '近郊出行',
        usageCross: '跨地区行程',
        usageShoot: '拍摄 / 活动',
        usageOther: '还不确定，先咨询',
        route: '行程范围',
        routePlaceholder: '请选择',
        routeUrban: '市区内',
        routeSuburban: '近郊往返',
        routeCrossCity: '跨城市',
        routeUndecided: '还未确定',
        planNote: '补充说明（选填）',
        planNotePlaceholder: '例如：人数、行李、预计路线、是否需要当日往返',
        name: '姓名',
        namePlaceholder: '张三',
        language: '偏好语言',
        languagePlaceholder: '请选择',
        languageZh: '中文',
        languageJa: '日语',
        languageEn: '英语',
        email: '邮箱地址',
        phone: '电话号码',
        pickup: '取车城市 / 地区',
        pickupPlaceholder: '例如：东京 / 大阪 / 埼玉',
        consentNews: '接收档期更新与新车源通知',
        consentPolicy: '同意使用条款与隐私政策'
      },
      summary: {
        empty: '未填写',
        unconfirmed: '未确认',
        pendingPolicy: '地区 {pickup} / 待同意条款',
        readyToSend: '地区 {pickup} / 内容已确认'
      },
      actions: {
        prev: '上一步',
        next: '下一步',
        submit: '完成确认'
      },
      message: {
        appointmentRequired: '请填写日期、取车时间和预计租期。',
        planRequired: '请选择主要用途和行程范围。',
        nameRequired: '请输入联系人姓名。',
        contactRequired: '请填写邮箱和电话号码。',
        pickupRequired: '请输入取车城市 / 地区。',
        consentRequired: '请先同意使用条款与隐私政策。',
        submitSuccess: '租车咨询内容已整理完成，请按填写的联系方式继续与顾问沟通。'
      }
    },
    ja: {
      pageTitle: 'レンタル相談 — TK168 Premium Automotive',
      eyebrow: 'TK168 RENTAL CONSULT',
      title: 'レンタル相談フォーム',
      subtitle: '来店予約と同じ 5 ステップ構成で、車両・日程・用途を整理し、内容確認へ進めます。',
      progressAria: 'レンタル相談ステップ',
      vehicleStatus: '相談可能',
      metrics: {
        rate: '1日料金',
        deposit: '保証金',
        minDays: '最短日数'
      },
      steps: {
        appointment: { tab: '利用日時', row: '希望利用日時', lead: '希望利用日、受取時間、予定日数を入力してください。' },
        plan: { tab: '利用計画', row: '利用計画', lead: '用途と移動範囲を共有いただくと、条件確認が早く進みます。' },
        name: { tab: '担当者', row: '担当者情報', lead: 'お名前と希望言語を入力してください。' },
        contact: { tab: '連絡先', row: 'メール / 電話', lead: '折り返ししやすい連絡先を入力してください。' },
        confirm: { tab: '確認', row: '内容確認', lead: '受取地域と規約同意を確認してから内容整理を完了してください。' }
      },
      required: '必須',
      edit: '修正する',
      fields: {
        date: '日付',
        time: '受取時間',
        timePlaceholder: '選択してください',
        days: '予定日数',
        usage: '主な用途',
        usagePlaceholder: '選択してください',
        usageCity: '市内移動',
        usageBusiness: 'ビジネス利用',
        usageTrip: '近郊ドライブ',
        usageCross: '広域移動',
        usageShoot: '撮影 / イベント',
        usageOther: '未確定なので相談したい',
        route: '移動範囲',
        routePlaceholder: '選択してください',
        routeUrban: '市内のみ',
        routeSuburban: '近郊往復',
        routeCrossCity: '都市間移動',
        routeUndecided: '未定',
        planNote: '補足内容（任意）',
        planNotePlaceholder: '例：人数、荷物、予定ルート、当日往復の希望',
        name: '氏名',
        namePlaceholder: '山田 太郎',
        language: '希望言語',
        languagePlaceholder: '選択してください',
        languageZh: '中国語',
        languageJa: '日本語',
        languageEn: '英語',
        email: 'メールアドレス',
        phone: '電話番号',
        pickup: '受取都市 / 地域',
        pickupPlaceholder: '例：東京 / 大阪 / 埼玉',
        consentNews: '空き状況や新着車両情報を受け取る',
        consentPolicy: '利用規約とプライバシーポリシーに同意する'
      },
      summary: {
        empty: '未入力',
        unconfirmed: '未確認',
        pendingPolicy: '地域 {pickup} / 規約同意待ち',
        readyToSend: '地域 {pickup} / 内容確認済み'
      },
      actions: {
        prev: '戻る',
        next: '次へ',
        submit: '確認を完了'
      },
      message: {
        appointmentRequired: '利用日、受取時間、予定日数を入力してください。',
        planRequired: '用途と移動範囲を選択してください。',
        nameRequired: '氏名を入力してください。',
        contactRequired: 'メールアドレスと電話番号を入力してください。',
        pickupRequired: '受取都市 / 地域を入力してください。',
        consentRequired: '利用規約とプライバシーポリシーへの同意が必要です。',
        submitSuccess: 'レンタル相談内容の整理が完了しました。入力した連絡先をもとに担当窓口との確認を進めてください。'
      }
    },
    en: {
      pageTitle: 'Rental Inquiry — TK168 Premium Automotive',
      eyebrow: 'TK168 RENTAL CONSULT',
      title: 'Rental Inquiry Form',
      subtitle: 'Using the same 5-step structure as the visit booking flow, this form helps you organize rental details before continuing with your advisor.',
      progressAria: 'Rental inquiry steps',
      vehicleStatus: 'Available for inquiry',
      metrics: {
        rate: 'Daily rate',
        deposit: 'Deposit',
        minDays: 'Minimum rental'
      },
      steps: {
        appointment: { tab: 'Schedule', row: 'Preferred rental time', lead: 'Enter your preferred rental date, pickup time, and expected rental length.' },
        plan: { tab: 'Plan', row: 'Usage plan', lead: 'Sharing your intended use and travel range helps the advisor confirm availability faster.' },
        name: { tab: 'Contact person', row: 'Contact details', lead: 'Enter your name and preferred language.' },
        contact: { tab: 'Contact', row: 'Email / phone', lead: 'Leave an email and phone number that is easy to reply to.' },
        confirm: { tab: 'Confirm', row: 'Content review', lead: 'Confirm the pickup city and policy agreement before completing the inquiry summary.' }
      },
      required: 'Required',
      edit: 'Edit',
      fields: {
        date: 'Date',
        time: 'Pickup time',
        timePlaceholder: 'Select',
        days: 'Expected rental length',
        usage: 'Main use',
        usagePlaceholder: 'Select',
        usageCity: 'City driving',
        usageBusiness: 'Business use',
        usageTrip: 'Short trip',
        usageCross: 'Intercity travel',
        usageShoot: 'Photo shoot / event',
        usageOther: 'Not sure yet, inquire first',
        route: 'Travel range',
        routePlaceholder: 'Select',
        routeUrban: 'Within the city',
        routeSuburban: 'Suburban round trip',
        routeCrossCity: 'Between cities',
        routeUndecided: 'Not decided yet',
        planNote: 'Notes (optional)',
        planNotePlaceholder: 'For example: passenger count, luggage, route plan, or same-day return request',
        name: 'Full name',
        namePlaceholder: 'Taro Yamada',
        language: 'Preferred language',
        languagePlaceholder: 'Select',
        languageZh: 'Chinese',
        languageJa: 'Japanese',
        languageEn: 'English',
        email: 'Email address',
        phone: 'Phone number',
        pickup: 'Pickup city / region',
        pickupPlaceholder: 'For example: Tokyo / Osaka / Saitama',
        consentNews: 'Receive availability updates and new vehicle notifications',
        consentPolicy: 'I agree to the terms of use and privacy policy'
      },
      summary: {
        empty: 'Not provided',
        unconfirmed: 'Not confirmed',
        pendingPolicy: 'Region {pickup} / policy consent pending',
        readyToSend: 'Region {pickup} / details confirmed'
      },
      actions: {
        prev: 'Back',
        next: 'Next',
        submit: 'Complete review'
      },
      message: {
        appointmentRequired: 'Please enter the date, pickup time, and expected rental length.',
        planRequired: 'Please select the main use and travel range.',
        nameRequired: 'Please enter the contact person name.',
        contactRequired: 'Please enter the email address and phone number.',
        pickupRequired: 'Please enter the pickup city or region.',
        consentRequired: 'You must agree to the terms of use and privacy policy first.',
        submitSuccess: 'The rental inquiry details are organized. Please continue the confirmation using the contact details you entered.'
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

  function formatRate(value, language) {
    const display = getDisplayPrice(value, language) || '-';
    if (language === 'en') return `${display}/day`;
    return language === 'ja' ? `${display}/日` : `${display}/天`;
  }

  function formatMinDays(days, language) {
    if (language === 'en') return `${days} day${Number(days) === 1 ? '' : 's'}`;
    return language === 'ja' ? `${days}日` : `${days}天`;
  }

  function createVehicleContext() {
    const params = new URLSearchParams(window.location.search);
    const requestedVehicleId = params.get('id') || '';
    const currentVehicle = getVehicleById(requestedVehicleId) || getRentableVehicles()[0] || null;
    const inventoryHref = currentVehicle?.brandKey ? buildBrandUrl(currentVehicle.brandKey) : 'rental.html';
    return {
      currentVehicle,
      inventoryHref
    };
  }

  const vehicleContext = createVehicleContext();

  window.TK168CommonLinks?.applyCommonLinks();
  window.TK168PageChrome?.applyPageChrome({
    pageKey: 'rental',
    inventoryHref: vehicleContext.inventoryHref,
    serviceHref: 'service.html',
    rentalHref: 'rental.html',
    navMode: 'solid'
  });

  const state = {
    date: '',
    time: '',
    days: '',
    usage: '',
    route: '',
    planNote: '',
    name: '',
    language: '',
    email: '',
    phone: '',
    pickup: '',
    consentNews: false,
    consentPolicy: false
  };

  let currentStep = 0;

  const refs = {
    pageTitle: document.getElementById('riqPageTitle'),
    eyebrow: document.getElementById('riqEyebrow'),
    title: document.getElementById('riqTitle'),
    subtitle: document.getElementById('riqSubtitle'),
    lead: document.getElementById('riqLeadText'),
    message: document.getElementById('riqMessage'),
    counter: document.getElementById('riqCounter'),
    nextBtn: document.getElementById('riqNextBtn'),
    prevBtn: document.getElementById('riqPrevBtn'),
    progressRoot: document.getElementById('riqProgress'),
    progress: Array.from(document.querySelectorAll('#riqProgress li')),
    rows: Array.from(document.querySelectorAll('.inq-row')),
    jumpStepButtons: Array.from(document.querySelectorAll('[data-jump-step]')),
    jumpRowButtons: Array.from(document.querySelectorAll('[data-jump-row]')),
    requiredBadges: Array.from(document.querySelectorAll('.inq-required')),
    date: document.getElementById('riqDate'),
    time: document.getElementById('riqTime'),
    days: document.getElementById('riqDays'),
    usage: document.getElementById('riqUsage'),
    route: document.getElementById('riqRoute'),
    planNote: document.getElementById('riqPlanNote'),
    name: document.getElementById('riqName'),
    language: document.getElementById('riqLanguage'),
    email: document.getElementById('riqEmail'),
    phone: document.getElementById('riqPhone'),
    pickup: document.getElementById('riqPickup'),
    consentNews: document.getElementById('riqConsentNews'),
    consentPolicy: document.getElementById('riqConsentPolicy'),
    summaryAppointment: document.getElementById('riqSummaryAppointment'),
    summaryPlan: document.getElementById('riqSummaryPlan'),
    summaryName: document.getElementById('riqSummaryName'),
    summaryContact: document.getElementById('riqSummaryContact'),
    summaryConfirm: document.getElementById('riqSummaryConfirm'),
    vehicleThumb: document.getElementById('riqVehicleThumb'),
    vehicleBrand: document.getElementById('riqVehicleBrand'),
    vehicleName: document.getElementById('riqVehicleName'),
    vehicleMeta: document.getElementById('riqVehicleMeta'),
    rateLabel: document.getElementById('riqRateLabel'),
    rateValue: document.getElementById('riqRateValue'),
    depositLabel: document.getElementById('riqDepositLabel'),
    depositValue: document.getElementById('riqDepositValue'),
    minDaysLabel: document.getElementById('riqMinDaysLabel'),
    minDaysValue: document.getElementById('riqMinDaysValue'),
    stepLabels: {
      appointment: document.getElementById('riqStepAppointment'),
      plan: document.getElementById('riqStepPlan'),
      name: document.getElementById('riqStepName'),
      contact: document.getElementById('riqStepContact'),
      confirm: document.getElementById('riqStepConfirm')
    },
    rowLabels: {
      appointment: document.getElementById('riqRowAppointment'),
      plan: document.getElementById('riqRowPlan'),
      name: document.getElementById('riqRowName'),
      contact: document.getElementById('riqRowContact'),
      confirm: document.getElementById('riqRowConfirm')
    },
    editLabels: {
      appointment: document.getElementById('riqEditAppointment'),
      plan: document.getElementById('riqEditPlan'),
      name: document.getElementById('riqEditName'),
      contact: document.getElementById('riqEditContact'),
      confirm: document.getElementById('riqEditConfirm')
    },
    fieldLabels: {
      date: document.getElementById('riqDateLabel'),
      time: document.getElementById('riqTimeLabel'),
      days: document.getElementById('riqDaysLabel'),
      usage: document.getElementById('riqUsageLabel'),
      route: document.getElementById('riqRouteLabel'),
      planNote: document.getElementById('riqPlanNoteLabel'),
      name: document.getElementById('riqNameLabel'),
      language: document.getElementById('riqLanguageLabel'),
      email: document.getElementById('riqEmailLabel'),
      phone: document.getElementById('riqPhoneLabel'),
      pickup: document.getElementById('riqPickupLabel'),
      consentNews: document.getElementById('riqConsentNewsLabel'),
      consentPolicy: document.getElementById('riqConsentPolicyLabel')
    },
    optionLabels: {
      timePlaceholder: document.getElementById('riqTimePlaceholder'),
      usagePlaceholder: document.getElementById('riqUsagePlaceholder'),
      usageCity: document.getElementById('riqUsageCity'),
      usageBusiness: document.getElementById('riqUsageBusiness'),
      usageTrip: document.getElementById('riqUsageTrip'),
      usageCross: document.getElementById('riqUsageCross'),
      usageShoot: document.getElementById('riqUsageShoot'),
      usageOther: document.getElementById('riqUsageOther'),
      routePlaceholder: document.getElementById('riqRoutePlaceholder'),
      routeUrban: document.getElementById('riqRouteUrban'),
      routeSuburban: document.getElementById('riqRouteSuburban'),
      routeCrossCity: document.getElementById('riqRouteCrossCity'),
      routeUndecided: document.getElementById('riqRouteUndecided'),
      languagePlaceholder: document.getElementById('riqLanguagePlaceholder'),
      languageZh: document.getElementById('riqLanguageZh'),
      languageJa: document.getElementById('riqLanguageJa'),
      languageEn: document.getElementById('riqLanguageEn')
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
    setText(refs.rateLabel, copy.metrics.rate);
    setText(refs.depositLabel, copy.metrics.deposit);
    setText(refs.minDaysLabel, copy.metrics.minDays);

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
    setText(refs.fieldLabels.days, copy.fields.days);
    setText(refs.fieldLabels.usage, copy.fields.usage);
    setText(refs.fieldLabels.route, copy.fields.route);
    setText(refs.fieldLabels.planNote, copy.fields.planNote);
    setText(refs.fieldLabels.name, copy.fields.name);
    setText(refs.fieldLabels.language, copy.fields.language);
    setText(refs.fieldLabels.email, copy.fields.email);
    setText(refs.fieldLabels.phone, copy.fields.phone);
    setText(refs.fieldLabels.pickup, copy.fields.pickup);
    setText(refs.fieldLabels.consentNews, copy.fields.consentNews);
    setText(refs.fieldLabels.consentPolicy, copy.fields.consentPolicy);

    setText(refs.optionLabels.timePlaceholder, copy.fields.timePlaceholder);
    setText(refs.optionLabels.usagePlaceholder, copy.fields.usagePlaceholder);
    setText(refs.optionLabels.usageCity, copy.fields.usageCity);
    setText(refs.optionLabels.usageBusiness, copy.fields.usageBusiness);
    setText(refs.optionLabels.usageTrip, copy.fields.usageTrip);
    setText(refs.optionLabels.usageCross, copy.fields.usageCross);
    setText(refs.optionLabels.usageShoot, copy.fields.usageShoot);
    setText(refs.optionLabels.usageOther, copy.fields.usageOther);
    setText(refs.optionLabels.routePlaceholder, copy.fields.routePlaceholder);
    setText(refs.optionLabels.routeUrban, copy.fields.routeUrban);
    setText(refs.optionLabels.routeSuburban, copy.fields.routeSuburban);
    setText(refs.optionLabels.routeCrossCity, copy.fields.routeCrossCity);
    setText(refs.optionLabels.routeUndecided, copy.fields.routeUndecided);
    setText(refs.optionLabels.languagePlaceholder, copy.fields.languagePlaceholder);
    setText(refs.optionLabels.languageZh, copy.fields.languageZh);
    setText(refs.optionLabels.languageJa, copy.fields.languageJa);
    setText(refs.optionLabels.languageEn, copy.fields.languageEn);

    setPlaceholder(refs.planNote, copy.fields.planNotePlaceholder);
    setPlaceholder(refs.name, copy.fields.namePlaceholder);
    setPlaceholder(refs.pickup, copy.fields.pickupPlaceholder);

    setText(refs.prevBtn, copy.actions.prev);
    renderVehicleCard();
  }

  function renderVehicleCard() {
    const vehicle = vehicleContext.currentVehicle;
    if (!vehicle) return;
    const language = currentLanguage();
    const copy = currentCopy();
    const profile = getVehicleRentalProfile(vehicle);
    const image = resolveVehicleMediaSource(vehicle.photo || vehicle.gallery?.[0] || '011.jpg');
    const type = sanitize(getVehicleFieldLabel('bodyStyle', vehicle.bodyStyle, language) || '');
    const fuel = sanitize(getVehicleFieldLabel('fuel', vehicle.fuel, language));
    const mileageDisplay =
      window.TK168_DATA?.formatVehicleMileageDisplay?.(vehicle.mileage, language) || '';

    refs.vehicleThumb.src = image;
    refs.vehicleThumb.alt = getVehicleName(vehicle, language);
    refs.vehicleBrand.textContent = getBrandLabel(vehicle.brandKey, language).toUpperCase();
    refs.vehicleName.textContent = getVehicleName(vehicle, language);
    refs.vehicleMeta.textContent = [vehicle.year, type, fuel, mileageDisplay, copy.vehicleStatus]
      .filter(Boolean)
      .join(' / ');

    refs.rateValue.textContent = formatRate(profile.dailyRate, language);
    refs.depositValue.textContent = getDisplayPrice(profile.deposit, language) || '-';
    refs.minDaysValue.textContent = formatMinDays(profile.minDays, language);

    if (refs.days) {
      refs.days.min = String(Math.max(1, profile.minDays));
      if (!refs.days.value || Number(refs.days.value) < profile.minDays) {
        refs.days.value = String(profile.minDays);
      }
    }
  }

  function buildAppointmentSummary() {
    const date = sanitize(state.date);
    const time = sanitize(state.time);
    const days = sanitize(state.days);
    if (!date || !time || !days) return currentCopy().summary.empty;
    return `${date} ${time} / ${formatMinDays(days, currentLanguage())}`;
  }

  function buildPlanSummary() {
    const usage = getSelectedText(refs.usage);
    const route = getSelectedText(refs.route);
    if (!usage && !route) return currentCopy().summary.empty;
    if (!usage) return route;
    if (!route) return usage;
    return `${usage} / ${route}`;
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
    const pickup = sanitize(state.pickup);
    const copy = currentCopy();
    if (!pickup) return copy.summary.unconfirmed;
    if (!state.consentPolicy) return formatTemplate(copy.summary.pendingPolicy, { pickup });
    return formatTemplate(copy.summary.readyToSend, { pickup });
  }

  function syncStateFromInputs() {
    state.date = refs.date.value;
    state.time = refs.time.value;
    state.days = refs.days.value;
    state.usage = refs.usage.value;
    state.route = refs.route.value;
    state.planNote = refs.planNote.value;
    state.name = refs.name.value;
    state.language = refs.language.value;
    state.email = refs.email.value;
    state.phone = refs.phone.value;
    state.pickup = refs.pickup.value;
    state.consentNews = refs.consentNews.checked;
    state.consentPolicy = refs.consentPolicy.checked;
  }

  function renderSummaries() {
    refs.summaryAppointment.textContent = buildAppointmentSummary();
    refs.summaryPlan.textContent = buildPlanSummary();
    refs.summaryName.textContent = buildNameSummary();
    refs.summaryContact.textContent = buildContactSummary();
    refs.summaryConfirm.textContent = buildConfirmSummary();
  }

  function renderProgress() {
    refs.progress.forEach((item, index) => {
      item.classList.toggle('is-active', index === currentStep);
      item.classList.toggle('is-done', index < currentStep);
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
      if (!sanitize(state.date) || !sanitize(state.time) || !sanitize(state.days)) return msg.appointmentRequired;
      return '';
    }
    if (stepKey === 'plan') {
      if (!sanitize(state.usage) || !sanitize(state.route)) return msg.planRequired;
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
      if (!sanitize(state.pickup)) return msg.pickupRequired;
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
      'days',
      'usage',
      'route',
      'planNote',
      'name',
      'language',
      'email',
      'phone',
      'pickup',
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
        moveStep(Number(button.dataset.jumpStep || 0));
      });
    });

    refs.jumpRowButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const target = STEP_KEYS.indexOf(button.dataset.jumpRow || '');
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
    syncStateFromInputs();
    render();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
