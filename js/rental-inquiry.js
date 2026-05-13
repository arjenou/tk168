(function () {
  const {
    getVehicleById,
    getRentalVehicleDetailById,
    getVehicleName,
    getBrandLabel,
    getVehicleFieldLabel,
    getVehicleRentalProfile,
    getRentableVehicles,
    getRentalDailyDisplayPrice,
    getRentalManJpyDisplayPrice,
    resolveVehicleMediaSource,
    buildBrandUrl
  } = window.TK168_DATA;

  const RENTAL_INQUIRY_DRAFT_KEY = 'tk168:rentalInquiryDraft';

  const STEP_KEYS = ['appointment', 'name', 'contact', 'confirm'];

  const COPY = {
    zh: {
      pageTitle: '租车咨询 — TK168 Premium Automotive',
      eyebrow: 'TK168 RENTAL CONSULT',
      title: '租车咨询单',
      subtitle: '在本页填写全部项目，点「确认」后在下一页核对并提交。',
      vehicleStatus: '当前可租',
      flow: {
        fillLead: '请在本页填写下列全部项目。'
      },
      metrics: {
        rate: '日租金',
        deposit: '押金',
        minDays: '最短租期'
      },
      steps: {
        appointment: { tab: '用车时间', row: '希望用车时间', lead: '先确认希望用车日期、取车时间和预计租期。' },
        name: { tab: '联系人', row: '联系人信息', lead: '填写联系人姓名和偏好语言。' },
        contact: { tab: '联系方式', row: '邮箱 / 电话', lead: '请留下方便回访的邮箱和电话。' },
        confirm: { tab: '交车', row: '车辆交付方式', lead: '选择来店或送车，填写门店或送车地址，并同意条款后完成确认。' }
      },
      required: '必填',
      edit: '修改',
      fields: {
        date: '日期',
        time: '取车时间',
        timePlaceholder: '请选择',
        days: '预计租期',
        name: '姓名',
        namePlaceholder: '张三',
        language: '偏好语言',
        languagePlaceholder: '请选择',
        languageZh: '中文',
        languageJa: '日语',
        languageEn: '英语',
        email: '邮箱地址',
        phone: '电话号码',
        deliveryMethodLabel: '车辆交付方式',
        deliveryVisit: '来店',
        deliveryShip: '送车',
        storeLabel: '选择门店',
        storePlaceholder: '请选择',
        storeTokyo: 'TK168 东京展厅',
        storeYokohama: 'TK168 横滨服务中心',
        storeOsaka: 'TK168 大阪展厅',
        deliveryAddressLabel: '送车地址',
        deliveryAddressPlaceholder: '请填写详细地址（都道府县、市区町村、番地、建筑名等）',
        consentNews: '接收档期更新与新车源通知',
        consentPolicy: '同意使用条款与隐私政策'
      },
      summary: {
        empty: '未填写',
        unconfirmed: '未确认',
        pendingPolicy: '{detail} / 待同意条款',
        readyToSend: '{detail} / 内容已确认'
      },
      actions: {
        confirm: '确认'
      },
      gallery: {
        prev: '上一张',
        next: '下一张'
      },
      message: {
        appointmentRequired: '请填写日期、取车时间和预计租期。',
        nameRequired: '请输入联系人姓名。',
        contactRequired: '请填写邮箱和电话号码。',
        deliveryMethodRequired: '请选择车辆交付方式。',
        storeRequired: '请选择门店。',
        addressRequired: '请填写送车地址。',
        consentRequired: '请先同意使用条款与隐私政策。',
        submitSuccess: '租车咨询内容已整理完成，请按填写的联系方式继续与顾问沟通。',
        storageError: '无法暂存表单，请检查浏览器是否禁用本地存储后重试。'
      }
    },
    ja: {
      pageTitle: 'レンタル相談 — TK168 Premium Automotive',
      eyebrow: 'TK168 RENTAL CONSULT',
      title: 'レンタル相談フォーム',
      subtitle: 'このページですべて入力し、「確認」で次のページに進み、内容を確認して送信します。',
      vehicleStatus: '相談可能',
      flow: {
        fillLead: '以下の項目をこのページですべて入力してください。'
      },
      metrics: {
        rate: '1日料金',
        deposit: '保証金',
        minDays: '最短日数'
      },
      steps: {
        appointment: { tab: '利用日時', row: '希望利用日時', lead: '希望利用日、受取時間、予定日数を入力してください。' },
        name: { tab: '運転者', row: '運転者氏名', lead: '運転者の氏名と希望言語を入力してください。' },
        contact: { tab: '連絡先', row: 'メール / 電話', lead: '折り返ししやすい連絡先を入力してください。' },
        confirm: { tab: '貸渡', row: '貸渡方法', lead: '来店または配達を選び、店舗またはお届け先を入力のうえ、規約に同意してください。' }
      },
      required: '必須',
      edit: '修正する',
      fields: {
        date: '日付',
        time: '受取時間',
        timePlaceholder: '選択してください',
        days: '予定日数',
        name: '氏名',
        namePlaceholder: '山田 太郎',
        language: '希望言語',
        languagePlaceholder: '選択してください',
        languageZh: '中国語',
        languageJa: '日本語',
        languageEn: '英語',
        email: 'メールアドレス',
        phone: '電話番号',
        deliveryMethodLabel: '貸渡方法',
        deliveryVisit: '来店',
        deliveryShip: '配達',
        storeLabel: '店舗を選択',
        storePlaceholder: '選択してください',
        storeTokyo: 'TK168 東京ショールーム',
        storeYokohama: 'TK168 横浜サービスセンター',
        storeOsaka: 'TK168 大阪ショールーム',
        deliveryAddressLabel: '配達先住所',
        deliveryAddressPlaceholder: '郵便番号、住所、建物名・部屋番号までご記入ください',
        consentNews: '空き状況や新着車両情報を受け取る',
        consentPolicy: '利用規約とプライバシーポリシーに同意する'
      },
      summary: {
        empty: '未入力',
        unconfirmed: '未確認',
        pendingPolicy: '{detail} / 規約同意待ち',
        readyToSend: '{detail} / 内容確認済み'
      },
      actions: {
        confirm: '確認'
      },
      gallery: {
        prev: '前の画像',
        next: '次の画像'
      },
      message: {
        appointmentRequired: '利用日、受取時間、予定日数を入力してください。',
        nameRequired: '運転者の氏名を入力してください。',
        contactRequired: 'メールアドレスと電話番号を入力してください。',
        deliveryMethodRequired: '貸渡方法を選択してください。',
        storeRequired: '店舗を選択してください。',
        addressRequired: '配達先住所を入力してください。',
        consentRequired: '利用規約とプライバシーポリシーへの同意が必要です。',
        submitSuccess: 'レンタル相談内容の整理が完了しました。入力した連絡先をもとに担当窓口との確認を進めてください。',
        storageError: '入力内容を一時保存できませんでした。ブラウザの設定をご確認のうえ、再度お試しください。'
      }
    },
    en: {
      pageTitle: 'Rental Inquiry — TK168 Premium Automotive',
      eyebrow: 'TK168 RENTAL CONSULT',
      title: 'Rental Inquiry Form',
      subtitle: 'Fill in everything on this page, tap Confirm to review on the next page, then submit.',
      vehicleStatus: 'Available for inquiry',
      flow: {
        fillLead: 'Enter all required information on this page.'
      },
      metrics: {
        rate: 'Daily rate',
        deposit: 'Deposit',
        minDays: 'Minimum rental'
      },
      steps: {
        appointment: { tab: 'Schedule', row: 'Preferred rental time', lead: 'Enter your preferred rental date, pickup time, and expected rental length.' },
        name: { tab: 'Contact person', row: 'Contact details', lead: 'Enter your name and preferred language.' },
        contact: { tab: 'Contact', row: 'Email / phone', lead: 'Leave an email and phone number that is easy to reply to.' },
        confirm: { tab: 'Handover', row: 'Vehicle delivery method', lead: 'Choose visit or delivery, enter the store or address, then agree to the policies.' }
      },
      required: 'Required',
      edit: 'Edit',
      fields: {
        date: 'Date',
        time: 'Pickup time',
        timePlaceholder: 'Select',
        days: 'Expected rental length',
        name: 'Full name',
        namePlaceholder: 'Taro Yamada',
        language: 'Preferred language',
        languagePlaceholder: 'Select',
        languageZh: 'Chinese',
        languageJa: 'Japanese',
        languageEn: 'English',
        email: 'Email address',
        phone: 'Phone number',
        deliveryMethodLabel: 'Vehicle delivery method',
        deliveryVisit: 'Visit showroom',
        deliveryShip: 'Delivery to you',
        storeLabel: 'Select a store',
        storePlaceholder: 'Select',
        storeTokyo: 'TK168 Tokyo showroom',
        storeYokohama: 'TK168 Yokohama service center',
        storeOsaka: 'TK168 Osaka showroom',
        deliveryAddressLabel: 'Delivery address',
        deliveryAddressPlaceholder: 'Include prefecture, city, street, building name, and room if applicable',
        consentNews: 'Receive availability updates and new vehicle notifications',
        consentPolicy: 'I agree to the terms of use and privacy policy'
      },
      summary: {
        empty: 'Not provided',
        unconfirmed: 'Not confirmed',
        pendingPolicy: '{detail} / policy consent pending',
        readyToSend: '{detail} / details confirmed'
      },
      actions: {
        confirm: 'Confirm'
      },
      gallery: {
        prev: 'Previous image',
        next: 'Next image'
      },
      message: {
        appointmentRequired: 'Please enter the date, pickup time, and expected rental length.',
        nameRequired: 'Please enter the contact person name.',
        contactRequired: 'Please enter the email address and phone number.',
        deliveryMethodRequired: 'Please choose a vehicle delivery method.',
        storeRequired: 'Please select a store.',
        addressRequired: 'Please enter the delivery address.',
        consentRequired: 'You must agree to the terms of use and privacy policy first.',
        submitSuccess: 'The rental inquiry details are organized. Please continue the confirmation using the contact details you entered.',
        storageError: 'Could not save your answers locally. Please check browser storage settings and try again.'
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
    const display = getRentalDailyDisplayPrice(value, language) || '-';
    if (language === 'en') return `${display}/day`;
    return language === 'ja' ? `${display}/日` : `${display}/天`;
  }

  function formatMinDays(days, language) {
    if (language === 'en') return `${days} day${Number(days) === 1 ? '' : 's'}`;
    return language === 'ja' ? `${days}日` : `${days}天`;
  }

  function resolveInquiryVehicle(requestedVehicleId) {
    const id = String(requestedVehicleId || '').trim();
    if (!id) return null;

    const fleet = getRentableVehicles();
    const fromFleet = fleet.find((v) => v && v.id === id);
    if (fromFleet) return fromFleet;

    const fromRentalApi = getRentalVehicleDetailById(id);
    if (fromRentalApi) return fromRentalApi;

    const fromInventory = getVehicleById(id);
    if (fromInventory) return fromInventory;

    return null;
  }

  const RIQ_STASH_KEY = 'tk168:rentalInquiryVehicleId';

  function getRequestedVehicleId() {
    const params = new URLSearchParams(window.location.search);
    let id = (params.get('id') || '').trim();
    if (!id) {
      try {
        id = (sessionStorage.getItem(RIQ_STASH_KEY) || '').trim();
      } catch (_) {
        id = '';
      }
      if (id) {
        try {
          sessionStorage.removeItem(RIQ_STASH_KEY);
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
    const requestedVehicleId = getRequestedVehicleId();
    const currentVehicle = requestedVehicleId ? resolveInquiryVehicle(requestedVehicleId) : null;
    const inventoryHref = currentVehicle?.brandKey ? buildBrandUrl(currentVehicle.brandKey) : 'rental.html';
    return {
      requestedVehicleId,
      currentVehicle,
      inventoryHref
    };
  }

  const vehicleContext = createVehicleContext();

  function currentRentalInquiryVehicleId() {
    return String(vehicleContext.currentVehicle?.id || getRequestedVehicleId() || '').trim();
  }

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
    name: '',
    language: '',
    email: '',
    phone: '',
    deliveryMethod: '',
    store: '',
    deliveryAddress: '',
    consentNews: false,
    consentPolicy: false
  };

  const refs = {
    pageTitle: document.getElementById('riqPageTitle'),
    eyebrow: document.getElementById('riqEyebrow'),
    title: document.getElementById('riqTitle'),
    subtitle: document.getElementById('riqSubtitle'),
    board: document.getElementById('riqBoard'),
    lead: document.getElementById('riqLeadText'),
    message: document.getElementById('riqMessage'),
    confirmBtn: document.getElementById('riqConfirmBtn'),
    rows: Array.from(document.querySelectorAll('.inq-row')),
    requiredBadges: Array.from(document.querySelectorAll('.inq-required')),
    date: document.getElementById('riqDate'),
    time: document.getElementById('riqTime'),
    days: document.getElementById('riqDays'),
    name: document.getElementById('riqName'),
    language: document.getElementById('riqLanguage'),
    email: document.getElementById('riqEmail'),
    phone: document.getElementById('riqPhone'),
    deliveryVisit: document.getElementById('riqDeliveryVisit'),
    deliveryShip: document.getElementById('riqDeliveryShip'),
    deliveryMethodLabel: document.getElementById('riqDeliveryMethodLabel'),
    deliveryVisitLabel: document.getElementById('riqDeliveryVisitLabel'),
    deliveryShipLabel: document.getElementById('riqDeliveryShipLabel'),
    storeWrap: document.getElementById('riqStoreWrap'),
    addressWrap: document.getElementById('riqAddressWrap'),
    store: document.getElementById('riqStore'),
    deliveryAddress: document.getElementById('riqDeliveryAddress'),
    consentNews: document.getElementById('riqConsentNews'),
    consentPolicy: document.getElementById('riqConsentPolicy'),
    summaryAppointment: document.getElementById('riqSummaryAppointment'),
    summaryName: document.getElementById('riqSummaryName'),
    summaryContact: document.getElementById('riqSummaryContact'),
    summaryConfirm: document.getElementById('riqSummaryConfirm'),
    galleryViewport: document.getElementById('riqGalleryViewport'),
    galleryTrack: document.getElementById('riqGalleryTrack'),
    galleryPrev: document.getElementById('riqGalleryPrev'),
    galleryNext: document.getElementById('riqGalleryNext'),
    vehicleBrand: document.getElementById('riqVehicleBrand'),
    vehicleName: document.getElementById('riqVehicleName'),
    vehicleMeta: document.getElementById('riqVehicleMeta'),
    rateLabel: document.getElementById('riqRateLabel'),
    rateValue: document.getElementById('riqRateValue'),
    depositLabel: document.getElementById('riqDepositLabel'),
    depositValue: document.getElementById('riqDepositValue'),
    minDaysLabel: document.getElementById('riqMinDaysLabel'),
    minDaysValue: document.getElementById('riqMinDaysValue'),
    rowLabels: {
      appointment: document.getElementById('riqRowAppointment'),
      name: document.getElementById('riqRowName'),
      contact: document.getElementById('riqRowContact'),
      confirm: document.getElementById('riqRowConfirm')
    },
    editLabels: {
      appointment: document.getElementById('riqEditAppointment'),
      name: document.getElementById('riqEditName'),
      contact: document.getElementById('riqEditContact'),
      confirm: document.getElementById('riqEditConfirm')
    },
    fieldLabels: {
      date: document.getElementById('riqDateLabel'),
      time: document.getElementById('riqTimeLabel'),
      days: document.getElementById('riqDaysLabel'),
      name: document.getElementById('riqNameLabel'),
      language: document.getElementById('riqLanguageLabel'),
      email: document.getElementById('riqEmailLabel'),
      phone: document.getElementById('riqPhoneLabel'),
      store: document.getElementById('riqStoreLabel'),
      deliveryAddress: document.getElementById('riqDeliveryAddressLabel'),
      consentNews: document.getElementById('riqConsentNewsLabel'),
      consentPolicy: document.getElementById('riqConsentPolicyLabel')
    },
    optionLabels: {
      timePlaceholder: document.getElementById('riqTimePlaceholder'),
      storePlaceholder: document.getElementById('riqStorePlaceholder'),
      storeTokyo: document.getElementById('riqStoreTokyo'),
      storeYokohama: document.getElementById('riqStoreYokohama'),
      storeOsaka: document.getElementById('riqStoreOsaka'),
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
    setText(refs.lead, copy.flow.fillLead);
    setText(refs.rateLabel, copy.metrics.rate);
    setText(refs.depositLabel, copy.metrics.deposit);
    setText(refs.minDaysLabel, copy.metrics.minDays);

    STEP_KEYS.forEach((key) => {
      setText(refs.rowLabels[key], copy.steps[key].row);
      setText(refs.editLabels[key], copy.edit);
    });

    refs.requiredBadges.forEach((badge) => {
      badge.textContent = copy.required;
    });

    setText(refs.fieldLabels.date, copy.fields.date);
    setText(refs.fieldLabels.time, copy.fields.time);
    setText(refs.fieldLabels.days, copy.fields.days);
    setText(refs.fieldLabels.name, copy.fields.name);
    setText(refs.fieldLabels.language, copy.fields.language);
    setText(refs.fieldLabels.email, copy.fields.email);
    setText(refs.fieldLabels.phone, copy.fields.phone);
    setText(refs.fieldLabels.store, copy.fields.storeLabel);
    setText(refs.fieldLabels.deliveryAddress, copy.fields.deliveryAddressLabel);
    setText(refs.fieldLabels.consentNews, copy.fields.consentNews);
    setText(refs.fieldLabels.consentPolicy, copy.fields.consentPolicy);

    setText(refs.deliveryMethodLabel, copy.fields.deliveryMethodLabel);
    setText(refs.deliveryVisitLabel, copy.fields.deliveryVisit);
    setText(refs.deliveryShipLabel, copy.fields.deliveryShip);

    setText(refs.optionLabels.timePlaceholder, copy.fields.timePlaceholder);
    setText(refs.optionLabels.storePlaceholder, copy.fields.storePlaceholder);
    setText(refs.optionLabels.storeTokyo, copy.fields.storeTokyo);
    setText(refs.optionLabels.storeYokohama, copy.fields.storeYokohama);
    setText(refs.optionLabels.storeOsaka, copy.fields.storeOsaka);
    setText(refs.optionLabels.languagePlaceholder, copy.fields.languagePlaceholder);
    setText(refs.optionLabels.languageZh, copy.fields.languageZh);
    setText(refs.optionLabels.languageJa, copy.fields.languageJa);
    setText(refs.optionLabels.languageEn, copy.fields.languageEn);

    setPlaceholder(refs.name, copy.fields.namePlaceholder);
    setPlaceholder(refs.deliveryAddress, copy.fields.deliveryAddressPlaceholder);

    setText(refs.confirmBtn, copy.actions.confirm);
    if (refs.galleryPrev) refs.galleryPrev.setAttribute('aria-label', copy.gallery.prev);
    if (refs.galleryNext) refs.galleryNext.setAttribute('aria-label', copy.gallery.next);
    renderVehicleCard();
  }

  function collectVehicleGallerySources(vehicle) {
    const seen = new Set();
    const out = [];
    const add = (key) => {
      if (key === undefined || key === null || String(key).trim() === '') return;
      const url = resolveVehicleMediaSource(key);
      if (seen.has(url)) return;
      seen.add(url);
      out.push(url);
    };
    if (vehicle && Array.isArray(vehicle.gallery) && vehicle.gallery.length) {
      vehicle.gallery.forEach(add);
    } else if (vehicle) {
      add(vehicle.photo || vehicle.gallery?.[0] || '011.jpg');
    }
    if (!out.length) add('011.jpg');
    return out;
  }

  let vehicleGalleryScrollRaf = 0;
  let vehicleGalleryEventsBound = false;

  function getVehicleGalleryScrollStep() {
    const vp = refs.galleryViewport;
    if (!vp) return 200;
    const slide = vp.querySelector('.riq-gallery-slide');
    const w = slide ? slide.getBoundingClientRect().width : 148;
    const trackStyles = window.getComputedStyle(refs.galleryTrack || vp);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || '8') || 8;
    return Math.max(120, Math.round(w + gap));
  }

  function scrollVehicleGallery(dir) {
    const vp = refs.galleryViewport;
    if (!vp) return;
    vp.scrollBy({ left: dir * getVehicleGalleryScrollStep(), behavior: 'smooth' });
  }

  function updateVehicleGalleryNavState() {
    const vp = refs.galleryViewport;
    const prev = refs.galleryPrev;
    const next = refs.galleryNext;
    if (!vp || !prev || !next) return;
    const maxScroll = Math.max(0, vp.scrollWidth - vp.clientWidth);
    const canScroll = maxScroll > 4;
    const left = vp.scrollLeft;
    prev.disabled = left <= 2;
    next.disabled = left >= maxScroll - 2;
    const showNav = canScroll;
    prev.style.visibility = showNav ? 'visible' : 'hidden';
    next.style.visibility = showNav ? 'visible' : 'hidden';
    prev.style.pointerEvents = showNav ? 'auto' : 'none';
    next.style.pointerEvents = showNav ? 'auto' : 'none';
    prev.setAttribute('aria-hidden', showNav ? 'false' : 'true');
    next.setAttribute('aria-hidden', showNav ? 'false' : 'true');
  }

  function paintVehicleGalleryTrack(vehicle, language) {
    const track = refs.galleryTrack;
    const vp = refs.galleryViewport;
    if (!track || !vp) return;
    const urls = collectVehicleGallerySources(vehicle);
    const name = vehicle ? getVehicleName(vehicle, language) : '';
    track.textContent = '';
    urls.forEach((src, index) => {
      const slide = document.createElement('div');
      slide.className = 'riq-gallery-slide';
      slide.setAttribute('role', 'listitem');
      const img = document.createElement('img');
      img.className = 'riq-gallery-img';
      img.src = src;
      img.alt = name;
      img.loading = index ? 'lazy' : 'eager';
      img.decoding = 'async';
      slide.appendChild(img);
      track.appendChild(slide);
    });
    vp.scrollLeft = 0;
    if (vehicleGalleryScrollRaf) cancelAnimationFrame(vehicleGalleryScrollRaf);
    vehicleGalleryScrollRaf = requestAnimationFrame(() => updateVehicleGalleryNavState());
  }

  function ensureVehicleGalleryEvents() {
    if (vehicleGalleryEventsBound) return;
    const vp = refs.galleryViewport;
    if (!vp || !refs.galleryPrev || !refs.galleryNext) return;
    vehicleGalleryEventsBound = true;
    refs.galleryPrev.addEventListener('click', () => scrollVehicleGallery(-1));
    refs.galleryNext.addEventListener('click', () => scrollVehicleGallery(1));
    vp.addEventListener(
      'scroll',
      () => {
        if (vehicleGalleryScrollRaf) cancelAnimationFrame(vehicleGalleryScrollRaf);
        vehicleGalleryScrollRaf = requestAnimationFrame(() => updateVehicleGalleryNavState());
      },
      { passive: true }
    );
    window.addEventListener('resize', () => updateVehicleGalleryNavState());
  }

  function renderVehicleCard() {
    const vehicle = vehicleContext.currentVehicle;
    if (!vehicle) return;
    const language = currentLanguage();
    const copy = currentCopy();
    const profile = getVehicleRentalProfile(vehicle);
    const type = sanitize(getVehicleFieldLabel('bodyStyle', vehicle.bodyStyle, language) || '');
    const fuel = sanitize(getVehicleFieldLabel('fuel', vehicle.fuel, language));
    const mileageDisplay =
      window.TK168_DATA?.formatVehicleMileageDisplay?.(vehicle.mileage, language, vehicle.mileageUnit) || '';

    ensureVehicleGalleryEvents();
    paintVehicleGalleryTrack(vehicle, language);
    refs.vehicleBrand.textContent = getBrandLabel(vehicle.brandKey, language).toUpperCase();
    refs.vehicleName.textContent = getVehicleName(vehicle, language);
    refs.vehicleMeta.textContent = [vehicle.year, type, fuel, mileageDisplay, copy.vehicleStatus]
      .filter(Boolean)
      .join(' / ');

    refs.rateValue.textContent = formatRate(profile.dailyRate, language);
    refs.depositValue.textContent = getRentalManJpyDisplayPrice(profile.deposit) || '-';
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

  function buildDeliveryDetailSummary() {
    const copy = currentCopy();
    const method = state.deliveryMethod;
    if (!method) return '';
    if (method === 'visit') {
      const storeText = getSelectedText(refs.store);
      return storeText ? `${copy.fields.deliveryVisit} · ${storeText}` : '';
    }
    const addr = sanitize(state.deliveryAddress);
    if (!addr) return '';
    const maxLen = currentLanguage() === 'en' ? 44 : 32;
    const short = addr.length > maxLen ? `${addr.slice(0, maxLen)}…` : addr;
    return `${copy.fields.deliveryShip} · ${short}`;
  }

  function buildConfirmSummary() {
    const copy = currentCopy();
    const detail = buildDeliveryDetailSummary();
    if (!detail) return copy.summary.unconfirmed;
    if (!state.consentPolicy) return formatTemplate(copy.summary.pendingPolicy, { detail });
    return formatTemplate(copy.summary.readyToSend, { detail });
  }

  function updateDeliveryConditionalVisibility() {
    const visit = refs.deliveryVisit?.checked;
    const ship = refs.deliveryShip?.checked;
    if (refs.storeWrap) refs.storeWrap.hidden = !visit;
    if (refs.addressWrap) refs.addressWrap.hidden = !ship;
  }

  function syncStateFromInputs() {
    state.date = refs.date.value;
    state.time = refs.time.value;
    state.days = refs.days.value;
    state.name = refs.name.value;
    state.language = refs.language.value;
    state.email = refs.email.value;
    state.phone = refs.phone.value;
    if (refs.deliveryVisit?.checked) state.deliveryMethod = 'visit';
    else if (refs.deliveryShip?.checked) state.deliveryMethod = 'delivery';
    else state.deliveryMethod = '';
    state.store = refs.store?.value || '';
    state.deliveryAddress = refs.deliveryAddress?.value || '';
    state.consentNews = refs.consentNews.checked;
    state.consentPolicy = refs.consentPolicy.checked;
  }

  function renderSummaries() {
    refs.summaryAppointment.textContent = buildAppointmentSummary();
    refs.summaryName.textContent = buildNameSummary();
    refs.summaryContact.textContent = buildContactSummary();
    refs.summaryConfirm.textContent = buildConfirmSummary();
  }

  function ensureFillBoard() {
    if (refs.board) {
      refs.board.classList.add('is-step-edit');
      refs.board.classList.remove('is-step-review');
    }
    refs.rows.forEach((row) => row.classList.remove('is-active'));
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
    if (stepKey === 'name') {
      if (!sanitize(state.name)) return msg.nameRequired;
      return '';
    }
    if (stepKey === 'contact') {
      if (!sanitize(state.email) || !sanitize(state.phone)) return msg.contactRequired;
      return '';
    }
    if (stepKey === 'confirm') {
      if (!state.deliveryMethod) return msg.deliveryMethodRequired;
      if (state.deliveryMethod === 'visit') {
        if (!sanitize(state.store)) return msg.storeRequired;
      } else if (!sanitize(state.deliveryAddress)) return msg.addressRequired;
      if (!state.consentPolicy) return msg.consentRequired;
      return '';
    }
    return '';
  }

  function validateAllSections() {
    for (let i = 0; i < STEP_KEYS.length; i += 1) {
      const err = validateStep(STEP_KEYS[i]);
      if (err) return err;
    }
    return '';
  }

  function goToConfirmPage() {
    syncStateFromInputs();
    const error = validateAllSections();
    if (error) {
      setMessage(error, false);
      return;
    }
    const draft = {
      v: 1,
      lang: currentLanguage(),
      vehicleId: vehicleContext.currentVehicle?.id || vehicleContext.requestedVehicleId || '',
      date: state.date,
      time: state.time,
      days: state.days,
      name: state.name,
      language: state.language,
      email: state.email,
      phone: state.phone,
      deliveryMethod: state.deliveryMethod,
      store: state.store,
      deliveryAddress: state.deliveryAddress,
      consentNews: state.consentNews,
      consentPolicy: state.consentPolicy
    };
    try {
      sessionStorage.setItem(RENTAL_INQUIRY_DRAFT_KEY, JSON.stringify(draft));
    } catch {
      setMessage(currentCopy().message.storageError, false);
      return;
    }
    const id = sanitize(draft.vehicleId);
    const target = id
      ? `rental-inquiry-confirm.html?id=${encodeURIComponent(id)}`
      : 'rental-inquiry-confirm.html';
    window.location.assign(target);
  }

  function render() {
    ensureFillBoard();
    renderSummaries();
    updateDeliveryConditionalVisibility();
  }

  function bindInputEvents() {
    const inputKeys = ['date', 'time', 'days', 'name', 'language', 'email', 'phone', 'store', 'deliveryAddress', 'consentNews', 'consentPolicy'];

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

    ['deliveryVisit', 'deliveryShip'].forEach((key) => {
      const el = refs[key];
      if (!el) return;
      el.addEventListener('change', () => {
        syncStateFromInputs();
        updateDeliveryConditionalVisibility();
        renderSummaries();
        clearMessage();
      });
    });
  }

  function bindStepEvents() {
    refs.confirmBtn?.addEventListener('click', goToConfirmPage);
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

  function navigateRentalInquiryBack() {
    try {
      const ref = document.referrer || '';
      if (ref.startsWith(window.location.origin)) {
        const path = new URL(ref).pathname.toLowerCase();
        if (path.indexOf('rental-inquiry-confirm') === -1 && path.indexOf('rental-inquiry.html') === -1) {
          window.location.assign(ref);
          return;
        }
      }
    } catch {
      /* ignore */
    }
    const id = currentRentalInquiryVehicleId();
    if (id && typeof window.TK168_DATA?.buildDetailUrl === 'function') {
      window.location.assign(window.TK168_DATA.buildDetailUrl(id, { from: 'rental' }));
      return;
    }
    window.location.assign(vehicleContext.inventoryHref || 'rental.html');
  }

  function init() {
    ensureVehicleGalleryEvents();
    applyLanguageCopy();
    initDefaultDate();
    bindInputEvents();
    bindStepEvents();
    document.getElementById('riqBackNavBtn')?.addEventListener('click', navigateRentalInquiryBack);
    render();
  }

  window.addEventListener('tk168:languagechange', () => {
    applyLanguageCopy();
    syncStateFromInputs();
    render();
  });

  function refreshVehicleFromHydrate() {
    const id = vehicleContext.requestedVehicleId || getRequestedVehicleId();
    const next = resolveInquiryVehicle(id);
    if (!next) return;
    const prev = vehicleContext.currentVehicle;
    if (prev && next.id === prev.id && prev.name === next.name) return;
    vehicleContext.currentVehicle = next;
    vehicleContext.inventoryHref = next.brandKey ? buildBrandUrl(next.brandKey) : 'rental.html';
    renderVehicleCard();
    render();
  }

  document.addEventListener('tk168:data-updated', (event) => {
    const detail = event?.detail || {};
    if (!detail.rentals && !detail.vehicles) return;
    refreshVehicleFromHydrate();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
