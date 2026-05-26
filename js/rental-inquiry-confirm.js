(function () {
  const RENTAL_INQUIRY_DRAFT_KEY = 'tk168:rentalInquiryDraft';

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

  const COPY = {
    zh: {
      pageTitle: '租车咨询确认 — TK168 Premium Automotive',
      eyebrow: 'TK168 RENTAL CONSULT',
      title: '请确认咨询内容',
      lead: '核对无误后点击下方提交。',
      rows: {
        appointment: '希望用车时间',
        name: '联系人信息',
        contact: '联系方式（四选二）',
        confirm: '车辆交付与条款'
      },
      actions: {
        submit: '提交'
      },
      gallery: {
        prev: '上一张',
        next: '下一张'
      },
      consentYes: '是',
      consentNo: '否',
      metrics: {
        rate: '日租金',
        deposit: '押金',
        minDays: '最短租期'
      },
      vehicleStatus: '当前可租',
      fields: {
        deliveryVisit: '来店',
        deliveryShip: '送车',
        storeTokyo: 'TK168 东京展厅',
        storeYokohama: 'TK168 横滨服务中心',
        storeOsaka: 'TK168 大阪展厅',
        languageZh: '中文',
        languageJa: '日语',
        languageEn: '英语',
        phone: '电话',
        email: '邮箱',
        wechat: '微信',
        whatsapp: 'WhatsApp',
        consentNews: '接收档期更新与新车源通知',
        consentPolicy: '同意使用条款与隐私政策'
      },
      message: {
        missingDraft: '未找到填写内容，请返回表单重新填写。',
        submitSuccess: '租车咨询内容已整理完成，请按填写的联系方式继续与顾问沟通。'
      }
    },
    ja: {
      pageTitle: 'レンタル相談の確認 — TK168 Premium Automotive',
      eyebrow: 'TK168 RENTAL CONSULT',
      title: '入力内容の確認',
      lead: '内容に問題がなければ「送信」を押してください。',
      rows: {
        appointment: '希望利用日時',
        name: '運転者情報',
        contact: '連絡先（4つから2つ）',
        confirm: '貸渡方法・規約'
      },
      actions: {
        submit: '送信'
      },
      gallery: {
        prev: '前の画像',
        next: '次の画像'
      },
      consentYes: 'はい',
      consentNo: 'いいえ',
      metrics: {
        rate: '1日料金',
        deposit: '保証金',
        minDays: '最短日数'
      },
      vehicleStatus: '相談可能',
      fields: {
        deliveryVisit: '来店',
        deliveryShip: '配達',
        storeTokyo: 'TK168 東京ショールーム',
        storeYokohama: 'TK168 横浜サービスセンター',
        storeOsaka: 'TK168 大阪ショールーム',
        languageZh: '中国語',
        languageJa: '日本語',
        languageEn: '英語',
        phone: '電話',
        email: 'メール',
        wechat: 'WeChat',
        whatsapp: 'WhatsApp',
        consentNews: '空き状況や新着車両情報を受け取る',
        consentPolicy: '利用規約とプライバシーポリシーに同意する'
      },
      message: {
        missingDraft: '入力内容が見つかりません。フォームから再度お進みください。',
        submitSuccess: 'レンタル相談内容の整理が完了しました。入力した連絡先をもとに担当窓口との確認を進めてください。'
      }
    },
    en: {
      pageTitle: 'Confirm Rental Inquiry — TK168 Premium Automotive',
      eyebrow: 'TK168 RENTAL CONSULT',
      title: 'Review your inquiry',
      lead: 'Check the details below, then press Submit.',
      rows: {
        appointment: 'Preferred rental time',
        name: 'Contact details',
        contact: 'Contact (pick two)',
        confirm: 'Delivery & policies'
      },
      actions: {
        submit: 'Submit'
      },
      gallery: {
        prev: 'Previous image',
        next: 'Next image'
      },
      consentYes: 'Yes',
      consentNo: 'No',
      metrics: {
        rate: 'Daily rate',
        deposit: 'Deposit',
        minDays: 'Minimum rental'
      },
      vehicleStatus: 'Available for inquiry',
      fields: {
        deliveryVisit: 'Visit showroom',
        deliveryShip: 'Delivery to you',
        storeTokyo: 'TK168 Tokyo showroom',
        storeYokohama: 'TK168 Yokohama service center',
        storeOsaka: 'TK168 Osaka showroom',
        languageZh: 'Chinese',
        languageJa: 'Japanese',
        languageEn: 'English',
        phone: 'Phone',
        email: 'Email',
        wechat: 'WeChat',
        whatsapp: 'WhatsApp',
        consentNews: 'Receive availability updates and new vehicle notifications',
        consentPolicy: 'I agree to the terms of use and privacy policy'
      },
      message: {
        missingDraft: 'We could not find your saved answers. Please return to the form and try again.',
        submitSuccess: 'The rental inquiry details are organized. Please continue the confirmation using the contact details you entered.'
      }
    }
  };

  function draftLanguage(draft) {
    const lang = draft?.lang;
    if (lang === 'zh' || lang === 'en' || lang === 'ja') return lang;
    return window.TK168I18N?.getLanguage?.() || 'ja';
  }

  function currentCopyForDraft(draft) {
    const lang = draftLanguage(draft);
    return COPY[lang] || COPY.ja;
  }

  function sanitize(value) {
    return String(value || '').trim();
  }

  function escapeHtml(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatRate(value, language) {
    const display = getRentalDailyDisplayPrice(value, language) || '-';
    if (language === 'en') return `${display}/day`;
    return language === 'ja' ? `${display}/日` : `${display}/天`;
  }

  function formatMinDays(days, language) {
    const n = String(days || '').trim() || '0';
    if (language === 'en') return `${n} day${Number(n) === 1 ? '' : 's'}`;
    return language === 'ja' ? `${n}日` : `${n}天`;
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

  function storeLabel(draft, copy) {
    const map = {
      tokyo: copy.fields.storeTokyo,
      yokohama: copy.fields.storeYokohama,
      osaka: copy.fields.storeOsaka
    };
    return map[draft.store] || draft.store || '';
  }

  function languageLabel(draft, copy) {
    const key = draft.language;
    if (key === 'zh') return copy.fields.languageZh;
    if (key === 'en') return copy.fields.languageEn;
    if (key === 'ja') return copy.fields.languageJa;
    return '';
  }

  function buildDeliveryBlock(draft, copy) {
    const lang = draftLanguage(draft);
    if (draft.deliveryMethod === 'visit') {
      const store = storeLabel(draft, copy);
      return `${copy.fields.deliveryVisit} · ${store}`;
    }
    if (draft.deliveryMethod === 'delivery') {
      return `${copy.fields.deliveryShip}\n${sanitize(draft.deliveryAddress)}`;
    }
    return '';
  }

  function formatContactDraftLines(draft, copy) {
    const lines = [];
    const add = (field, labelKey) => {
      const v = sanitize(draft[field]);
      if (!v) return;
      lines.push(`${copy.fields[labelKey]}: ${v}`);
    };
    if (Number(draft.v) === 1) {
      add('phone', 'phone');
      add('email', 'email');
      return lines.join('\n');
    }
    add('phone', 'phone');
    add('email', 'email');
    add('wechat', 'wechat');
    add('whatsapp', 'whatsapp');
    return lines.join('\n');
  }

  function buildSummaryHtml(draft) {
    const copy = currentCopyForDraft(draft);
    const lang = draftLanguage(draft);
    const appointment = `${sanitize(draft.date)} ${sanitize(draft.time)} / ${formatMinDays(draft.days, lang)}`;
    const nameBlock = `${sanitize(draft.name)}\n${languageLabel(draft, copy)}`;
    const contactBlock = formatContactDraftLines(draft, copy);
    const delivery = buildDeliveryBlock(draft, copy);
    const news = draft.consentNews ? copy.consentYes : copy.consentNo;
    const policy = draft.consentPolicy ? copy.consentYes : copy.consentNo;
    const policyLine = `${copy.fields.consentNews}: ${news}\n${copy.fields.consentPolicy}: ${policy}`;

    const row = (label, value) => `
      <div class="riqc-summary-row">
        <div class="riqc-summary-label">${escapeHtml(label)}</div>
        <div class="riqc-summary-value">${escapeHtml(value)}</div>
      </div>`;

    return (
      row(copy.rows.appointment, appointment)
      + row(copy.rows.name, nameBlock)
      + row(copy.rows.contact, contactBlock)
      + row(copy.rows.confirm, `${delivery}\n\n${policyLine}`)
    );
  }

  function readDraft() {
    try {
      const raw = sessionStorage.getItem(RENTAL_INQUIRY_DRAFT_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || (data.v !== 1 && data.v !== 2)) return null;
      return data;
    } catch {
      return null;
    }
  }

  window.TK168CommonLinks?.applyCommonLinks();

  const refs = {
    pageTitle: document.getElementById('riqcPageTitle'),
    eyebrow: document.getElementById('riqcEyebrow'),
    title: document.getElementById('riqcTitle'),
    lead: document.getElementById('riqcLeadText'),
    summary: document.getElementById('riqcSummary'),
    message: document.getElementById('riqcMessage'),
    backNavBtn: document.getElementById('riqcBackNavBtn'),
    submitBtn: document.getElementById('riqcSubmitBtn'),
    galleryViewport: document.getElementById('riqcGalleryViewport'),
    galleryTrack: document.getElementById('riqcGalleryTrack'),
    galleryPrev: document.getElementById('riqcGalleryPrev'),
    galleryNext: document.getElementById('riqcGalleryNext'),
    vehicleBrand: document.getElementById('riqcVehicleBrand'),
    vehicleName: document.getElementById('riqcVehicleName'),
    vehicleMeta: document.getElementById('riqcVehicleMeta'),
    rateLabel: document.getElementById('riqcRateLabel'),
    rateValue: document.getElementById('riqcRateValue'),
    depositLabel: document.getElementById('riqcDepositLabel'),
    depositValue: document.getElementById('riqcDepositValue'),
    minDaysLabel: document.getElementById('riqcMinDaysLabel'),
    minDaysValue: document.getElementById('riqcMinDaysValue')
  };

  function setText(el, value) {
    if (el) el.textContent = value;
  }

  function setMessage(text, ok) {
    if (!refs.message) return;
    refs.message.textContent = text || '';
    refs.message.style.color = ok ? '#1f8f5f' : '#c6472f';
  }

  function setGalleryAria(lang) {
    const copy = COPY[lang] || COPY.ja;
    if (refs.galleryPrev) refs.galleryPrev.setAttribute('aria-label', copy.gallery.prev);
    if (refs.galleryNext) refs.galleryNext.setAttribute('aria-label', copy.gallery.next);
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

  function paintVehicleGalleryTrack(vehicle, lang) {
    const track = refs.galleryTrack;
    const vp = refs.galleryViewport;
    if (!track || !vp) return;
    const urls = collectVehicleGallerySources(vehicle);
    const name = vehicle ? getVehicleName(vehicle, lang) : '';
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

  function renderVehicleCard(vehicle, lang) {
    if (!vehicle) return;
    const copy = currentCopyForDraft({ lang });
    const profile = getVehicleRentalProfile(vehicle);
    const type = sanitize(getVehicleFieldLabel('bodyStyle', vehicle.bodyStyle, lang) || '');
    const fuel = sanitize(getVehicleFieldLabel('fuel', vehicle.fuel, lang));
    const mileageDisplay =
      window.TK168_DATA?.formatVehicleMileageDisplay?.(vehicle.mileage, lang, vehicle.mileageUnit) || '';

    ensureVehicleGalleryEvents();
    setGalleryAria(lang);
    paintVehicleGalleryTrack(vehicle, lang);
    if (refs.vehicleBrand) refs.vehicleBrand.textContent = getBrandLabel(vehicle.brandKey, lang).toUpperCase();
    if (refs.vehicleName) refs.vehicleName.textContent = getVehicleName(vehicle, lang);
    if (refs.vehicleMeta) {
      refs.vehicleMeta.textContent = [vehicle.year, type, fuel, mileageDisplay, copy.vehicleStatus]
        .filter(Boolean)
        .join(' / ');
    }
    if (refs.rateLabel) refs.rateLabel.textContent = copy.metrics.rate;
    if (refs.depositLabel) refs.depositLabel.textContent = copy.metrics.deposit;
    if (refs.minDaysLabel) refs.minDaysLabel.textContent = copy.metrics.minDays;
    if (refs.rateValue) refs.rateValue.textContent = formatRate(profile.dailyRate, lang);
    if (refs.depositValue) refs.depositValue.textContent = getRentalManJpyDisplayPrice(profile.deposit) || '-';
    if (refs.minDaysValue) refs.minDaysValue.textContent = formatMinDays(profile.minDays, lang);
  }

  function applyChromeForVehicle(vehicle) {
    const inventoryHref = vehicle?.brandKey ? buildBrandUrl(vehicle.brandKey) : 'rental.html';
    window.TK168PageChrome?.applyPageChrome({
      pageKey: 'rental',
      inventoryHref,
      serviceHref: 'service.html',
      rentalHref: 'rental.html',
      navMode: 'solid'
    });
  }

  function backToFormHref(draft) {
    const id = sanitize(draft?.vehicleId);
    return id ? `rental-inquiry.html?id=${encodeURIComponent(id)}` : 'rental-inquiry.html';
  }

  function bindHeaderBack(draft) {
    if (!refs.backNavBtn) return;
    refs.backNavBtn.addEventListener('click', () => {
      if (draft) {
        window.location.assign(backToFormHref(draft));
        return;
      }
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
      window.location.assign('rental-inquiry.html');
    });
  }

  function init() {
    ensureVehicleGalleryEvents();
    const draft = readDraft();
    const lang = draftLanguage(draft);
    if (window.TK168I18N?.setLanguage && draft?.lang) {
      window.TK168I18N.setLanguage(draft.lang);
    }

    if (!draft) {
      const copy = COPY[window.TK168I18N?.getLanguage?.() || 'ja'] || COPY.ja;
      document.title = copy.pageTitle;
      setText(refs.pageTitle, copy.pageTitle);
      setText(refs.eyebrow, copy.eyebrow);
      setText(refs.title, copy.title);
      setText(refs.lead, '');
      if (refs.summary) refs.summary.innerHTML = '';
      setMessage(copy.message.missingDraft, false);
      if (refs.submitBtn) refs.submitBtn.disabled = true;
      window.TK168PageChrome?.applyPageChrome({
        pageKey: 'rental',
        inventoryHref: 'rental.html',
        serviceHref: 'service.html',
        rentalHref: 'rental.html',
        navMode: 'solid'
      });
      bindHeaderBack(null);
      return;
    }

    const copy = currentCopyForDraft(draft);
    document.title = copy.pageTitle;
    setText(refs.pageTitle, copy.pageTitle);
    setText(refs.eyebrow, copy.eyebrow);
    setText(refs.title, copy.title);
    setText(refs.lead, copy.lead);
    if (refs.summary) refs.summary.innerHTML = buildSummaryHtml(draft);

    const vehicle = resolveInquiryVehicle(draft.vehicleId);
    applyChromeForVehicle(vehicle);
    if (vehicle) renderVehicleCard(vehicle, lang);

    setText(refs.submitBtn, copy.actions.submit);

    refs.submitBtn?.addEventListener('click', () => {
      try {
        sessionStorage.removeItem(RENTAL_INQUIRY_DRAFT_KEY);
      } catch {
        /* ignore */
      }
      setMessage(copy.message.submitSuccess, true);
      if (refs.submitBtn) refs.submitBtn.disabled = true;
    });

    bindHeaderBack(draft);
  }

  window.addEventListener('tk168:languagechange', () => {
    const draft = readDraft();
    if (!draft || !refs.summary) return;
    const copy = currentCopyForDraft(draft);
    document.title = copy.pageTitle;
    setText(refs.pageTitle, copy.pageTitle);
    setText(refs.title, copy.title);
    setText(refs.lead, copy.lead);
    refs.summary.innerHTML = buildSummaryHtml(draft);
    setText(refs.submitBtn, copy.actions.submit);
    const vehicle = resolveInquiryVehicle(draft.vehicleId);
    if (vehicle) renderVehicleCard(vehicle, draftLanguage(draft));
    if (refs.rateLabel) refs.rateLabel.textContent = copy.metrics.rate;
    if (refs.depositLabel) refs.depositLabel.textContent = copy.metrics.deposit;
    if (refs.minDaysLabel) refs.minDaysLabel.textContent = copy.metrics.minDays;
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
