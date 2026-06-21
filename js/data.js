window.TK168_DATA = (() => {
  const site = {
    phone: '+81 09012220168',
    email: 'AUTO@tk168.co.jp',
    address: '339-0035埼玉県さいたま市岩槻区笹久保新田'
  };

  const activeBrandKeys = Array.isArray(window.TK168ActiveBrandKeys) && window.TK168ActiveBrandKeys.length
    ? [...window.TK168ActiveBrandKeys]
    : [
      'rolls-royce',
      'bentley',
      'mercedes',
      'bmw',
      'porsche',
      'ferrari',
      'lamborghini',
      'audi',
      'lexus',
      'landrover',
      'maserati',
      'astonmartin',
      'mclaren',
      'jaguar',
      'cadillac'
    ];
  const activeBrandKeySet = new Set(activeBrandKeys);
  const brandLogoInventoryApi = window.TK168BrandLogoInventory || { items: [] };
  const brandLogoInventoryItems = Array.isArray(brandLogoInventoryApi.items)
    ? brandLogoInventoryApi.items.filter((item) => activeBrandKeySet.has(item.key))
    : [];
  const brands = brandLogoInventoryItems
    .filter((item) => activeBrandKeySet.has(item.key))
    .map((item) => ({
      key: item.key,
      labelZh: item.labelZh,
      labelJa: item.labelJa,
      labelEn: item.labelEn,
      file: item.file
    }));

  const brandKeyAliasMap = {
    rollsroyce: 'rolls-royce',
    mercedesbenz: 'mercedes',
    landrover: 'landrover'
  };

  const brandAccentMap = {
    porsche: '#B58A4A',
    ferrari: '#D1001F',
    lamborghini: '#D9B300',
    maserati: '#0D4D91',
    bentley: '#1E6B52',
    jaguar: '#2E8B57',
    bmw: '#0066B1',
    audi: '#B8C0CC',
    lexus: '#8A7C6C',
    landrover: '#53744E',
    astonmartin: '#667F74',
    mclaren: '#8B704B',
    'rolls-royce': '#7A8088',
    cadillac: '#556F93',
    mercedes: '#00A3E0'
  };

  const brandAccentFilterMap = {
    porsche: 'brightness(0) saturate(100%) invert(52%) sepia(41%) saturate(746%) hue-rotate(356deg) brightness(91%) contrast(88%)',
    ferrari: 'brightness(0) saturate(100%) invert(15%) sepia(99%) saturate(6126%) hue-rotate(349deg) brightness(91%) contrast(108%)',
    lamborghini: 'brightness(0) saturate(100%) invert(79%) sepia(84%) saturate(775%) hue-rotate(8deg) brightness(104%) contrast(103%)',
    maserati: 'brightness(0) saturate(100%) invert(18%) sepia(72%) saturate(3115%) hue-rotate(202deg) brightness(95%) contrast(92%)',
    bentley: 'brightness(0) saturate(100%) invert(27%) sepia(30%) saturate(1292%) hue-rotate(116deg) brightness(94%) contrast(88%)',
    jaguar: 'brightness(0) saturate(100%) invert(36%) sepia(53%) saturate(529%) hue-rotate(96deg) brightness(92%) contrast(89%)',
    bmw: 'brightness(0) saturate(100%) invert(20%) sepia(91%) saturate(2683%) hue-rotate(195deg) brightness(94%) contrast(101%)',
    audi: 'brightness(0) saturate(100%) invert(80%) sepia(7%) saturate(246%) hue-rotate(176deg) brightness(92%) contrast(92%)',
    lexus: 'brightness(0) saturate(100%) invert(52%) sepia(11%) saturate(726%) hue-rotate(350deg) brightness(94%) contrast(87%)',
    landrover: 'brightness(0) saturate(100%) invert(35%) sepia(23%) saturate(850%) hue-rotate(67deg) brightness(92%) contrast(86%)',
    astonmartin: 'brightness(0) saturate(100%) invert(45%) sepia(16%) saturate(689%) hue-rotate(112deg) brightness(94%) contrast(85%)',
    mclaren: 'brightness(0) saturate(100%) invert(49%) sepia(36%) saturate(736%) hue-rotate(352deg) brightness(92%) contrast(87%)',
    'rolls-royce': 'brightness(0) saturate(100%) invert(53%) sepia(8%) saturate(340%) hue-rotate(173deg) brightness(90%) contrast(90%)',
    cadillac: 'brightness(0) saturate(100%) invert(40%) sepia(19%) saturate(1002%) hue-rotate(181deg) brightness(91%) contrast(88%)',
    mercedes: 'brightness(0) saturate(100%) invert(61%) sepia(71%) saturate(3269%) hue-rotate(155deg) brightness(95%) contrast(104%)'
  };

  function normalizeBrandKeyToken(value) {
    return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  const canonicalBrandKeyByToken = new Map(
    brands.map((brand) => [normalizeBrandKeyToken(brand.key), brand.key])
  );

  /** e.g. admin `ferrari-test` → token `ferraritest` → canonical `ferrari` */
  const brandKeyEnvSuffixes = ['test', 'dev', 'staging'];

  function resolveCanonicalBrandKey(rawBrandKey) {
    const token = normalizeBrandKeyToken(rawBrandKey);
    if (!token) return '';
    const direct = brandKeyAliasMap[token] || canonicalBrandKeyByToken.get(token) || '';
    if (direct) return direct;
    for (const suffix of brandKeyEnvSuffixes) {
      if (!token.endsWith(suffix) || token.length <= suffix.length) continue;
      const baseToken = token.slice(0, -suffix.length);
      const resolved =
        brandKeyAliasMap[baseToken] || canonicalBrandKeyByToken.get(baseToken) || '';
      if (resolved) return resolved;
    }
    return '';
  }

  const vehicleTypeOptions = [
    { value: '高性能SUV', labelZh: '高性能SUV', labelJa: 'ハイパフォーマンスSUV', labelEn: 'High-performance SUV' },
    { value: '豪华SUV', labelZh: '豪华SUV', labelJa: 'ラグジュアリーSUV', labelEn: 'Luxury SUV' },
    { value: '越野SUV', labelZh: '越野SUV', labelJa: 'オフロードSUV', labelEn: 'Off-road SUV' },
    { value: '轿跑SUV', labelZh: '轿跑SUV', labelJa: 'クーペSUV', labelEn: 'Coupe SUV' },
    { value: '行政轿车', labelZh: '行政轿车', labelJa: 'エグゼクティブセダン', labelEn: 'Executive Sedan' },
    { value: '豪华轿车', labelZh: '豪华轿车', labelJa: 'ラグジュアリーセダン', labelEn: 'Luxury Sedan' },
    { value: '高性能轿车', labelZh: '高性能轿车', labelJa: 'ハイパフォーマンスセダン', labelEn: 'High-performance Sedan' },
    { value: '双门轿跑', labelZh: '双门轿跑', labelJa: '2ドアクーペ', labelEn: 'Two-door Coupe' },
    { value: '四门轿跑', labelZh: '四门轿跑', labelJa: '4ドアクーペ', labelEn: 'Four-door Coupe' },
    { value: 'GT跑车', labelZh: 'GT跑车', labelJa: 'GTカー', labelEn: 'GT Car' },
    { value: '中置跑车', labelZh: '中置跑车', labelJa: 'ミッドシップスポーツ', labelEn: 'Mid-engine Sports Car' },
    { value: '敞篷跑车', labelZh: '敞篷跑车', labelJa: 'オープンスポーツ', labelEn: 'Convertible Sports Car' },
    { value: 'V12超跑', labelZh: 'V12超跑', labelJa: 'V12スーパーカー', labelEn: 'V12 Supercar' },
    { value: '混动超跑', labelZh: '混动超跑', labelJa: 'ハイブリッドスーパーカー', labelEn: 'Hybrid Supercar' },
    { value: '纯电性能车', labelZh: '纯电性能车', labelJa: 'EVパフォーマンスカー', labelEn: 'EV Performance Car' },
    { value: '猎装车', labelZh: '猎装车', labelJa: 'シューティングブレーク', labelEn: 'Shooting Brake' },
    { value: '旅行车', labelZh: '旅行车', labelJa: 'ワゴン', labelEn: 'Wagon' },
    { value: 'MPV', labelZh: 'MPV', labelJa: 'MPV', labelEn: 'MPV' },
    { value: '皮卡', labelZh: '皮卡', labelJa: 'ピックアップ', labelEn: 'Pickup' }
  ];

  const bodyTypeSearchOptions = [
    { value: 'kei', labelZh: '轻型车', labelJa: '軽自動車', labelEn: 'Kei Car' },
    { value: 'compact', labelZh: '紧凑型车', labelJa: 'コンパクトカー', labelEn: 'Compact Car' },
    { value: 'mpv', labelZh: 'MPV', labelJa: 'ミニバン', labelEn: 'Minivan' },
    { value: 'wagon', labelZh: '旅行车', labelJa: 'ステーションワゴン', labelEn: 'Wagon' },
    { value: 'suv', labelZh: 'SUV', labelJa: 'SUV・クロカン', labelEn: 'SUV' },
    { value: 'sedan', labelZh: '轿车', labelJa: 'セダン', labelEn: 'Sedan' },
    { value: 'camper', labelZh: '露营房车', labelJa: 'キャンピングカー', labelEn: 'Camper Van' },
    { value: 'coupe', labelZh: '轿跑', labelJa: 'クーペ', labelEn: 'Coupe' },
    { value: 'hybrid', labelZh: '混动', labelJa: 'ハイブリッド', labelEn: 'Hybrid' },
    { value: 'hatchback', labelZh: '掀背车', labelJa: 'ハッチバック', labelEn: 'Hatchback' },
    { value: 'convertible', labelZh: '敞篷', labelJa: 'オープンカー', labelEn: 'Convertible' },
    { value: 'pickup', labelZh: '皮卡', labelJa: 'ピックアップトラック', labelEn: 'Pickup Truck' },
    { value: 'welfare', labelZh: '福祉车', labelJa: '福祉車両', labelEn: 'Welfare Vehicle' },
    { value: 'commercial-van', labelZh: '商用面包车', labelJa: '商用車・バン', labelEn: 'Commercial Van' },
    { value: 'truck', labelZh: '卡车', labelJa: 'トラック', labelEn: 'Truck' },
    { value: 'other', labelZh: '其他', labelJa: 'その他', labelEn: 'Other' }
  ];

  const defaultBenefits = [
    '一年质保服务',
    '支持旧车置换',
    '可选金融分期',
    '专属交付顾问'
  ];

  const defaultBenefitsJa = [
    '1年間保証サポート',
    '下取りのご相談に対応',
    'ローンプランのご提案',
    '専任デリバリーアドバイザー'
  ];

  const defaultBenefitsEn = [
    '1-year warranty support',
    'Trade-in consultation available',
    'Financing options available',
    'Dedicated delivery advisor'
  ];

  const defaultFeatures = [
    '质检认证',
    '现车在库',
    '全国配送',
    '手续透明',
    '专人跟进',
    '售后支持',
    '急速交付'
  ];

  const defaultFeaturesJa = [
    '点検認証済み',
    '在庫車両あり',
    '全国納車対応',
    '手続き明瞭',
    '専任フォロー',
    'アフターサポート',
    'スピード納車'
  ];

  const defaultFeaturesEn = [
    'Inspected and certified',
    'In stock now',
    'Nationwide delivery',
    'Transparent paperwork',
    'Dedicated follow-up',
    'After-sales support',
    'Fast delivery'
  ];

  /** 管理端 / 首页筛选 / 存库统一使用的车身类型（中文） */
  const standardBodyStyleValues = [
    'SUV',
    'MPV',
    '轿车',
    '跑车',
    '超跑',
    '敞篷车',
    '旅行车',
    '双门轿跑',
    '皮卡',
    '轻自动车',
    '商务车 / 面包车',
    '越野车'
  ];

  /** 历史合并字段「4.0L V8」「2.0L Turbo」→ 排量 / 缸数布局 */
  function splitLegacyEngineSpec(combined) {
    const t = String(combined || '').trim();
    if (!t) return { displacement: '', cylinders: '' };
    const m = t.match(/^([\d.]+\s*L(?:\s+(?:Turbo|Hybrid))?)(?:\s+(.+))?$/i);
    if (m) {
      return { displacement: (m[1] || '').trim(), cylinders: (m[2] || '').trim() };
    }
    return { displacement: t, cylinders: '' };
  }

  function formatVehicleEngineLine(vehicle) {
    if (!vehicle) return '';
    const d = String(vehicle.displacement || '').trim();
    const c = String(vehicle.cylinders || '').trim();
    if (d && c) return `${d} ${c}`;
    if (d) return d;
    if (c) return c;
    return String(vehicle.engine || '').trim();
  }

  function formatVehicleEngineAndForcedInductionLine(vehicle, language = getCurrentLanguage()) {
    const base = formatVehicleEngineLine(vehicle);
    const fi = getVehicleHighlightField(vehicle, 'forcedInduction', language);
    const parts = [base, fi].map((s) => String(s || '').trim()).filter(Boolean);
    if (!parts.length) return '';
    if (parts.length === 1) return parts[0];
    const sep = language === 'en' ? ', ' : ' · ';
    return parts.join(sep);
  }

  function normalizeVehicleEngineFields(vehicle) {
    if (!vehicle || typeof vehicle !== 'object') return vehicle;
    let d = String(vehicle.displacement ?? '').trim();
    let c = String(vehicle.cylinders ?? '').trim();
    if (!d && !c && vehicle.engine) {
      const sp = splitLegacyEngineSpec(vehicle.engine);
      d = sp.displacement;
      c = sp.cylinders;
    }
    return { ...vehicle, displacement: d, cylinders: c };
  }

  const apiPresets = (window.TK168_API_PRESETS && typeof window.TK168_API_PRESETS === "object")
    ? window.TK168_API_PRESETS
    : null;

  // Vehicle inventory comes exclusively from js/api-hydrate.js (TK168_API_VEHICLES).
  function pickDefined(src) {
    const out = {};
    if (!src || typeof src !== "object") return out;
    for (const [key, value] of Object.entries(src)) {
      if (value === null || value === undefined) continue;
      if (typeof value === "string" && value.trim() === "") continue;
      if (Array.isArray(value) && value.length === 0) continue;
      out[key] = value;
    }
    return out;
  }

  function buildMergedVehicleListFromHydrate() {
    const apiList = Array.isArray(window.TK168_API_VEHICLES)
      ? window.TK168_API_VEHICLES
      : null;
    const apiVehicleIds = apiList && apiList.length
      ? new Set(apiList.map((v) => v && v.id).filter(Boolean))
      : new Set();
    const seed = apiList && apiList.length ? apiList.slice() : [];
    return seed
      .map((vehicle) => {
        const canonicalBrandKey = resolveCanonicalBrandKey(vehicle.brandKey);
        const v = canonicalBrandKey
          ? { ...vehicle, brandKey: canonicalBrandKey }
          : { ...vehicle };
        return normalizeVehicleEngineFields(v);
      })
      .filter((vehicle) => {
        if (activeBrandKeySet.has(vehicle.brandKey)) return true;
        if (apiVehicleIds.size > 0 && vehicle.id && apiVehicleIds.has(vehicle.id)) {
          return true;
        }
        return false;
      });
  }

  /** 与 `window.TK168_API_VEHICLES` 同步的可变数组；顺序与后台 display_order 一致 */
  const vehicles = [];
  vehicles.push(...buildMergedVehicleListFromHydrate());

  function refreshVehiclesFromApiHydrate() {
    const next = buildMergedVehicleListFromHydrate();
    vehicles.length = 0;
    vehicles.push(...next);
  }

  const news = [
    {
      id: 'static-0',
      title: '2026年最值得期待的超跑：性能进化与设计美学的再一次碰撞',
      titleJa: '2026年注目のスーパーカー特集 性能進化とデザイン美学が再び交差する',
      titleEn: '2026 supercars to watch: where performance evolution meets design again',
      category: '行业动态',
      categoryJa: 'マーケット情報',
      categoryEn: 'Market update',
      date: '2026 · 04 · 08',
      image: 'assets/images/placeholder.svg',
      summary: '从法拉利到布加迪，2026 年度最受关注的超跑阵容正在成形。TK168 为您提前梳理每一台车型背后的设计语言与性能看点……',
      summaryJa: 'フェラーリからブガッティまで、2026年に注目されるスーパーカーの顔ぶれが見え始めています。TK168 が各モデルのデザイン言語と性能面の見どころを先に整理します。',
      summaryEn: 'From Ferrari to Bugatti, the 2026 supercar line-up is starting to take shape. TK168 highlights the design language and performance points worth tracking in advance.'
    },
    {
      id: 'static-1',
      title: '全新法拉利 SF90 Spider 正式入库',
      titleJa: '新型 Ferrari SF90 Spider が正式入庫',
      titleEn: 'New Ferrari SF90 Spider officially added to stock',
      category: '新车到库',
      categoryJa: '新規入庫',
      categoryEn: 'New arrival',
      date: '2026 · 03 · 28',
      image: 'assets/images/placeholder.svg'
    },
    {
      id: 'static-2',
      title: 'TK168 × Monaco 慈善拍卖活动圆满落幕',
      titleJa: 'TK168 × Monaco チャリティーオークション開催レポート',
      titleEn: 'TK168 × Monaco charity auction event recap',
      category: '公司活动',
      categoryJa: 'ブランドトピックス',
      categoryEn: 'Brand story',
      date: '2026 · 03 · 12',
      image: 'assets/images/placeholder.svg'
    }
  ];

  const vehicleConditionPresets = {
    'lamborghini-urus': {
      dealerWarranty: { zh: '3个月 / 5,000km', ja: '3ヵ月 / 5,000km' },
      oneOwner: { zh: '是', ja: '○' },
    },
    'audi-r8-spyder': {
      dealerWarranty: { zh: '6个月 / 10,000km', ja: '6ヵ月 / 10,000km' },
      oneOwner: { zh: '是', ja: '○' },
    },
    'ferrari-458-italia': {
      dealerWarranty: { zh: '1个月 / 1,000km', ja: '1ヵ月 / 1,000km' },
      oneOwner: { zh: '否', ja: '-' },
    },
    'bmw-x6-m': {
      dealerWarranty: { zh: '12个月 / 20,000km', ja: '12ヵ月 / 20,000km' },
      oneOwner: { zh: '是', ja: '○' },
    },
    'ferrari-488-gtb': {
      dealerWarranty: { zh: '3个月 / 3,000km', ja: '3ヵ月 / 3,000km' },
      oneOwner: { zh: '否', ja: '-' },
    },
    'lamborghini-aventador': {
      dealerWarranty: { zh: '店保 1个月', ja: '販売店保証 1ヵ月' },
      oneOwner: { zh: '否', ja: '-' },
    },
    'lamborghini-huracan-evo': {
      dealerWarranty: { zh: '6个月 / 5,000km', ja: '6ヵ月 / 5,000km' },
      oneOwner: { zh: '是', ja: '○' },
    },
    'lamborghini-urus-s': {
      dealerWarranty: { zh: '12个月 / 20,000km', ja: '12ヵ月 / 20,000km' },
      oneOwner: { zh: '是', ja: '○' },
    },
    'lamborghini-huracan-sto': {
      dealerWarranty: { zh: '3个月 / 3,000km', ja: '3ヵ月 / 3,000km' },
      oneOwner: { zh: '否', ja: '-' },
    },
    'lamborghini-gallardo': {
      dealerWarranty: { zh: '无', ja: '保証無' },
      oneOwner: { zh: '否', ja: '-' },
    },
    'lamborghini-sian-fkp-37': {
      dealerWarranty: { zh: '店保 1个月', ja: '販売店保証 1ヵ月' },
      oneOwner: { zh: '是', ja: '○' },
    },
    'lamborghini-urus-performante': {
      dealerWarranty: { zh: '12个月 / 20,000km', ja: '12ヵ月 / 20,000km' },
      oneOwner: { zh: '是', ja: '○' },
    },
    'lamborghini-huracan-evo-rwd': {
      dealerWarranty: { zh: '6个月 / 5,000km', ja: '6ヵ月 / 5,000km' },
      oneOwner: { zh: '否', ja: '-' },
    }
  };

  const vehicleListingPresets = {
    'lamborghini-urus': {
      repairHistory: { zh: '无', ja: 'なし' },
      vehicleInspection: { zh: '2026（R08）年12月', ja: '2026(R08)年12月' },
      legalMaintenance: { zh: '整备付', ja: '整備付' },
      fuelGrade: { zh: '高辛烷汽油', ja: 'ハイオク', en: 'Premium' },
    },
    'audi-r8-spyder': {
      repairHistory: { zh: '无', ja: 'なし' },
      vehicleInspection: { zh: '2026（R08）年09月', ja: '2026(R08)年09月' },
      legalMaintenance: { zh: '整备付', ja: '整備付' },
      fuelGrade: { zh: '高辛烷汽油', ja: 'ハイオク', en: 'Premium' },
    },
    'ferrari-458-italia': {
      repairHistory: { zh: '无', ja: 'なし' },
      vehicleInspection: { zh: '2026（R08）年06月', ja: '2026(R08)年06月' },
      legalMaintenance: { zh: '无', ja: 'なし' },
      fuelGrade: { zh: '高辛烷汽油', ja: 'ハイオク', en: 'Premium' },
    },
    'bmw-x6-m': {
      repairHistory: { zh: '无', ja: 'なし' },
      vehicleInspection: { zh: '2027（R09）年03月', ja: '2027(R09)年03月' },
      legalMaintenance: { zh: '整备付', ja: '整備付' },
      fuelGrade: { zh: '高辛烷汽油', ja: 'ハイオク', en: 'Premium' },
    },
    'ferrari-488-gtb': {
      repairHistory: { zh: '无', ja: 'なし' },
      vehicleInspection: { zh: '2026（R08）年11月', ja: '2026(R08)年11月' },
      legalMaintenance: { zh: '整备付', ja: '整備付' },
      fuelGrade: { zh: '高辛烷汽油', ja: 'ハイオク', en: 'Premium' },
    },
    'lamborghini-aventador': {
      repairHistory: { zh: '无', ja: 'なし' },
      vehicleInspection: { zh: '2026（R08）年10月', ja: '2026(R08)年10月' },
      legalMaintenance: { zh: '无', ja: 'なし' },
      fuelGrade: { zh: '高辛烷汽油', ja: 'ハイオク', en: 'Premium' },
    },
    'lamborghini-huracan-evo': {
      repairHistory: { zh: '无', ja: 'なし' },
      vehicleInspection: { zh: '2027（R09）年01月', ja: '2027(R09)年01月' },
      legalMaintenance: { zh: '整备付', ja: '整備付' },
      fuelGrade: { zh: '高辛烷汽油', ja: 'ハイオク', en: 'Premium' },
    },
    'lamborghini-urus-s': {
      repairHistory: { zh: '无', ja: 'なし' },
      vehicleInspection: { zh: '2027（R09）年05月', ja: '2027(R09)年05月' },
      legalMaintenance: { zh: '整备付', ja: '整備付' },
      fuelGrade: { zh: '高辛烷汽油', ja: 'ハイオク', en: 'Premium' },
    },
    'lamborghini-huracan-sto': {
      repairHistory: { zh: '无', ja: 'なし' },
      vehicleInspection: { zh: '2026（R08）年08月', ja: '2026(R08)年08月' },
      legalMaintenance: { zh: '无', ja: 'なし' },
      fuelGrade: { zh: '高辛烷汽油', ja: 'ハイオク', en: 'Premium' },
    },
    'lamborghini-gallardo': {
      repairHistory: { zh: '无', ja: 'なし' },
      vehicleInspection: { zh: '2026（R08）年04月', ja: '2026(R08)年04月' },
      legalMaintenance: { zh: '无', ja: 'なし' },
      fuelGrade: { zh: '高辛烷汽油', ja: 'ハイオク', en: 'Premium' },
    },
    'lamborghini-sian-fkp-37': {
      repairHistory: { zh: '无', ja: 'なし' },
      vehicleInspection: { zh: '2026（R08）年07月', ja: '2026(R08)年07月' },
      legalMaintenance: { zh: '整备付', ja: '整備付' },
      fuelGrade: { zh: '高辛烷汽油', ja: 'ハイオク', en: 'Premium' },
    },
    'lamborghini-urus-performante': {
      repairHistory: { zh: '无', ja: 'なし' },
      vehicleInspection: { zh: '2027（R09）年02月', ja: '2027(R09)年02月' },
      legalMaintenance: { zh: '整备付', ja: '整備付' },
      fuelGrade: { zh: '高辛烷汽油', ja: 'ハイオク', en: 'Premium' },
    },
    'lamborghini-huracan-evo-rwd': {
      repairHistory: { zh: '无', ja: 'なし' },
      vehicleInspection: { zh: '2026（R08）年05月', ja: '2026(R08)年05月' },
      legalMaintenance: { zh: '整备付', ja: '整備付' },
    }
  };

  const vehicleHighlightPresets = {
    'lamborghini-urus': {
      steering: { zh: '右舵', ja: '右ハンドル' },
      chassisTail: { zh: '381', ja: '381' }
    },
    'audi-r8-spyder': {
      steering: { zh: '左舵', ja: '左ハンドル' },
      chassisTail: { zh: '127', ja: '127' }
    },
    'ferrari-458-italia': {
      steering: { zh: '左舵', ja: '左ハンドル' },
      chassisTail: { zh: '458', ja: '458' }
    },
    'bmw-x6-m': {
      steering: { zh: '右舵', ja: '右ハンドル' },
      chassisTail: { zh: '642', ja: '642' }
    },
    'ferrari-488-gtb': {
      steering: { zh: '左舵', ja: '左ハンドル' },
      chassisTail: { zh: '488', ja: '488' }
    },
    'lamborghini-aventador': {
      steering: { zh: '左舵', ja: '左ハンドル' },
      chassisTail: { zh: '770', ja: '770' }
    },
    'lamborghini-huracan-evo': {
      steering: { zh: '左舵', ja: '左ハンドル' },
      chassisTail: { zh: '613', ja: '613' }
    },
    'lamborghini-urus-s': {
      steering: { zh: '右舵', ja: '右ハンドル' },
      chassisTail: { zh: '524', ja: '524' }
    },
    'lamborghini-huracan-sto': {
      steering: { zh: '左舵', ja: '左ハンドル' },
      chassisTail: { zh: '912', ja: '912' }
    },
    'lamborghini-gallardo': {
      steering: { zh: '左舵', ja: '左ハンドル' },
      chassisTail: { zh: '305', ja: '305' }
    },
    'lamborghini-sian-fkp-37': {
      steering: { zh: '左舵', ja: '左ハンドル' },
      chassisTail: { zh: '037', ja: '037' }
    },
    'lamborghini-urus-performante': {
      steering: { zh: '右舵', ja: '右ハンドル' },
      chassisTail: { zh: '801', ja: '801' }
    },
    'lamborghini-huracan-evo-rwd': {
      steering: { zh: '左舵', ja: '左ハンドル' },
      chassisTail: { zh: '274', ja: '274' }
    }
  };

  const priceOptions = [
    { value: 'under-100', label: '低于 JPY 20M', labelJa: 'JPY 20M 未満', labelEn: 'Under JPY 20M', match: (amount) => amount < 1000000 },
    { value: '100-200', label: 'JPY 20M–40M', labelJa: 'JPY 20M〜40M', labelEn: 'JPY 20M–40M', match: (amount) => amount >= 1000000 && amount < 2000000 },
    { value: '200-300', label: 'JPY 40M–60M', labelJa: 'JPY 40M〜60M', labelEn: 'JPY 40M–60M', match: (amount) => amount >= 2000000 && amount < 3000000 },
    { value: '300-plus', label: 'JPY 60M 以上', labelJa: 'JPY 60M 以上', labelEn: 'JPY 60M+', match: (amount) => amount >= 3000000 }
  ];

  const yearOptions = [
    { value: 'before-2001', label: '2000年前', labelJa: '2000年以前', labelEn: 'Before 2001', match: (year) => year <= 2000 },
    ...Array.from({ length: 26 }, (_, index) => {
      const year = 2001 + index;
      return {
        value: String(year),
        label: String(year),
        labelJa: `${year}年`,
        labelEn: String(year),
        match: (targetYear) => targetYear === year
      };
    })
  ];

  const mileageOptions = [
    { value: 'under-1000', label: '1,000km内', labelJa: '1,000km以下', labelEn: 'Under 1,000 km', match: (mileage) => mileage < 1000 },
    { value: '1000-10000', label: '1千-1万km', labelJa: '1,000km-1万km', labelEn: '1,000-10,000 km', match: (mileage) => mileage >= 1000 && mileage < 10000 },
    { value: '10000-30000', label: '1万-3万km', labelJa: '1万km-3万km', labelEn: '10,000-30,000 km', match: (mileage) => mileage >= 10000 && mileage < 30000 },
    { value: '30000-plus', label: '3万km+', labelJa: '3万km以上', labelEn: '30,000 km+', match: (mileage) => mileage >= 30000 }
  ];

  const vehicleFieldTranslations = {
    fuel: {
      zh: {
        汽油: '汽油',
        柴油: '柴油',
        'HEV（混动）': 'HEV（混动）',
        'PHEV（插电混动）': 'PHEV（插电混动）',
        'BEV（纯电动车）': 'BEV（纯电动车）',
        'EREV（增程式电动车）': 'EREV（增程式电动车）',
        油电混动: 'HEV（混动）',
        插电混动: 'PHEV（插电混动）',
        纯电动: 'BEV（纯电动车）',
        增程式: 'EREV（增程式电动车）',
        Hybrid: 'HEV（混动）',
        EV: 'BEV（纯电动车）',
        普通汽油: '汽油',
        高辛烷汽油: '汽油',
        电动: 'BEV（纯电动车）',
      },
      ja: {
        汽油: 'ガソリン',
        柴油: 'ディーゼル',
        'HEV（混动）': 'HEV（ハイブリッド）',
        'PHEV（插电混动）': 'PHEV（プラグイン）',
        'BEV（纯电动车）': 'BEV（純電気）',
        'EREV（增程式电动车）': 'EREV（レンジエクステンダー）',
        油电混动: 'HEV（ハイブリッド）',
        插电混动: 'PHEV（プラグイン）',
        纯电动: 'BEV（純電気）',
        增程式: 'EREV（レンジエクステンダー）',
        Hybrid: 'HEV（ハイブリッド）',
        EV: 'BEV（純電気）',
        普通汽油: 'ガソリン',
        高辛烷汽油: 'ガソリン',
        电动: 'BEV（純電気）',
      },
      en: {
        汽油: 'Gasoline',
        柴油: 'Diesel',
        'HEV（混动）': 'HEV (hybrid)',
        'PHEV（插电混动）': 'PHEV (plug-in hybrid)',
        'BEV（纯电动车）': 'BEV (battery electric)',
        'EREV（增程式电动车）': 'EREV (extended-range EV)',
        油电混动: 'HEV (hybrid)',
        插电混动: 'PHEV (plug-in hybrid)',
        纯电动: 'BEV (battery electric)',
        增程式: 'EREV (extended-range EV)',
        Hybrid: 'HEV (hybrid)',
        EV: 'BEV (battery electric)',
        普通汽油: 'Gasoline',
        高辛烷汽油: 'Gasoline',
        电动: 'BEV (battery electric)',
      },
    },
    fuelOilType: {
      zh: {
        普通汽油: '普通汽油',
        高辛烷汽油: '高辛烷汽油',
        柴油: '柴油',
        电动: '电动',
      },
      ja: {
        普通汽油: 'レギュラー',
        高辛烷汽油: 'ハイオク',
        柴油: '軽油',
        电动: '電気',
      },
      en: {
        普通汽油: 'Regular',
        高辛烷汽油: 'Premium',
        柴油: 'Diesel',
        电动: 'Electric',
      },
    },
    trans: {
      zh: {
        '5MT': '5MT',
        '6MT': '6MT',
        '7MT': '7MT',
        AT: 'AT',
        CVT: 'CVT',
        'E-CVT': 'E-CVT',
        DCT: 'DCT',
        'Single-Speed（BEV）': 'Single-Speed（BEV）',
        自动挡: 'AT',
        手动挡: '6MT',
        CVT无级变速: 'CVT',
        手自一体: 'AT',
        双离合: 'DCT',
        电动车单速: 'Single-Speed（BEV）'
      },
      ja: {
        '5MT': '5MT',
        '6MT': '6MT',
        '7MT': '7MT',
        AT: 'AT',
        CVT: 'CVT',
        'E-CVT': 'E-CVT',
        DCT: 'DCT',
        'Single-Speed（BEV）': 'Single-Speed（BEV）',
        自动挡: 'AT',
        手动挡: '6MT',
        CVT无级变速: 'CVT',
        手自一体: 'AT',
        双离合: 'DCT',
        电动车单速: 'Single-Speed（BEV）'
      },
      en: {
        '5MT': '5-speed MT',
        '6MT': '6-speed MT',
        '7MT': '7-speed MT',
        AT: 'AT',
        CVT: 'CVT',
        'E-CVT': 'E-CVT',
        DCT: 'DCT',
        'Single-Speed（BEV）': 'Single-speed (BEV)',
        自动挡: 'AT',
        手动挡: '6-speed MT',
        CVT无级变速: 'CVT',
        手自一体: 'AT',
        双离合: 'DCT',
        电动车单速: 'Single-speed (BEV)'
      }
    },
    bodyStyle: {
      zh: {
        SUV: 'SUV',
        MPV: 'MPV',
        轿车: '轿车',
        跑车: '跑车',
        超跑: '超跑',
        敞篷车: '敞篷车',
        旅行车: '旅行车',
        双门轿跑: '双门轿跑',
        皮卡: '皮卡',
        轻自动车: '轻自动车',
        '商务车 / 面包车': '商务车 / 面包车',
        越野车: '越野车',
        '高性能 SUV': '高性能 SUV',
        '双门跑车': '双门跑车',
        豪华SUV: '豪华SUV',
        越野SUV: '越野SUV',
        轿跑SUV: '轿跑SUV',
        行政轿车: '行政轿车',
        豪华轿车: '豪华轿车',
        高性能轿车: '高性能轿车',
        GT跑车: 'GT跑车',
        中置跑车: '中置跑车',
        敞篷跑车: '敞篷跑车',
        V12超跑: 'V12超跑',
        混动超跑: '混动超跑',
        纯电性能车: '纯电性能车',
        猎装车: '猎装车',
        四门轿跑: '四门轿跑',
        kei: '轻型车',
        compact: '紧凑型车',
        suv: 'SUV',
        sedan: '轿车',
        camper: '露营房车',
        coupe: '轿跑',
        hybrid: '混动',
        hatchback: '掀背车',
        convertible: '敞篷',
        pickup: '皮卡',
        welfare: '福祉车',
        'commercial-van': '商用面包车',
        truck: '卡车',
        wagon: '旅行车',
        mpv: 'MPV',
        other: '其他'
      },
      ja: {
        SUV: 'SUV',
        MPV: 'MPV',
        轿车: 'セダン',
        跑车: 'スポーツカー',
        超跑: 'スーパーカー',
        敞篷车: 'コンバーチブル',
        旅行车: 'ステーションワゴン',
        双门轿跑: '2ドアクーペ',
        皮卡: 'ピックアップトラック',
        轻自动车: '軽自動車',
        '商务车 / 面包车': '商用バン / ミニバン',
        越野车: 'オフロード車',
        '高性能 SUV': 'ハイパフォーマンス SUV',
        '双门跑车': '2ドアスポーツ',
        豪华SUV: 'ラグジュアリーSUV',
        越野SUV: 'オフロードSUV',
        轿跑SUV: 'クーペSUV',
        行政轿车: 'エグゼクティブセダン',
        豪华轿车: 'ラグジュアリーセダン',
        高性能轿车: 'ハイパフォーマンスセダン',
        GT跑车: 'GTカー',
        中置跑车: 'ミッドシップスポーツ',
        敞篷跑车: 'オープンスポーツ',
        V12超跑: 'V12スーパーカー',
        混动超跑: 'ハイブリッドスーパーカー',
        纯电性能车: '電動ハイパフォーマンス',
        猎装车: 'シューティングブレーク',
        四门轿跑: '4ドアクーペ',
        kei: '軽自動車',
        compact: 'コンパクトカー',
        suv: 'SUV',
        sedan: 'セダン',
        camper: 'キャンピングカー',
        coupe: 'クーペ',
        hybrid: 'ハイブリッド',
        hatchback: 'ハッチバック',
        convertible: 'コンバーチブル',
        pickup: 'ピックアップ',
        welfare: '福祉車',
        'commercial-van': '商用バン',
        truck: 'トラック',
        wagon: 'ワゴン',
        mpv: 'ミニバン',
        other: 'その他'
      },
      en: {
        SUV: 'SUV',
        MPV: 'MPV',
        轿车: 'Sedan',
        跑车: 'Sports car',
        超跑: 'Supercar',
        敞篷车: 'Convertible',
        旅行车: 'Wagon',
        双门轿跑: 'Coupe',
        皮卡: 'Pickup truck',
        轻自动车: 'Kei car',
        '商务车 / 面包车': 'Commercial van',
        越野车: 'Off-road vehicle',
        '高性能 SUV': 'High-performance SUV',
        '双门跑车': 'Two-door sports car',
        豪华SUV: 'Luxury SUV',
        越野SUV: 'Off-road SUV',
        轿跑SUV: 'Coupe SUV',
        行政轿车: 'Executive sedan',
        豪华轿车: 'Luxury sedan',
        高性能轿车: 'High-performance sedan',
        GT跑车: 'GT car',
        中置跑车: 'Mid-engine sports car',
        敞篷跑车: 'Convertible sports car',
        V12超跑: 'V12 supercar',
        混动超跑: 'Hybrid supercar',
        纯电性能车: 'Electric performance car',
        猎装车: 'Shooting brake',
        四门轿跑: 'Four-door coupe',
        kei: 'Kei car',
        compact: 'Compact car',
        suv: 'SUV',
        sedan: 'Sedan',
        camper: 'Camper van',
        coupe: 'Coupe',
        hybrid: 'Hybrid',
        hatchback: 'Hatchback',
        convertible: 'Convertible',
        pickup: 'Pickup',
        welfare: 'Welfare vehicle',
        'commercial-van': 'Commercial van',
        truck: 'Truck',
        wagon: 'Wagon',
        mpv: 'MPV',
        other: 'Other'
      }
    },
    drive: {
      zh: {
        FWD: 'FWD',
        RWD: 'RWD',
        AWD: 'AWD',
        '4WD': '4WD',
        前轮驱动: 'FWD',
        后轮驱动: 'RWD',
        四轮驱动: 'AWD',
        适时四驱: 'AWD',
        全时四驱: 'AWD',
        电动四驱: 'AWD',
      },
      ja: {
        FWD: 'FWD',
        RWD: 'RWD',
        AWD: 'AWD',
        '4WD': '4WD',
        前轮驱动: 'FWD',
        后轮驱动: 'RWD',
        四轮驱动: 'AWD',
        适时四驱: 'AWD',
        全时四驱: 'AWD',
        电动四驱: 'AWD',
      },
      en: {
        FWD: 'FWD',
        RWD: 'RWD',
        AWD: 'AWD',
        '4WD': '4WD',
        前轮驱动: 'FWD',
        后轮驱动: 'RWD',
        四轮驱动: 'AWD',
        适时四驱: 'AWD',
        全时四驱: 'AWD',
        电动四驱: 'AWD',
      },
    },
    serviceRecord: {
      zh: {
        完整在册: '完整在册'
      },
      ja: {
        完整在册: '整備記録あり'
      },
      en: {
        完整在册: 'Full service records'
      }
    },
    bodyColor: {
      zh: {
        白色: '白色',
        珍珠白: '珍珠白',
        黑色: '黑色',
        珍珠黑: '珍珠黑',
        银色: '银色',
        灰色: '灰色',
        蓝色: '蓝色',
        深蓝色: '深蓝色',
        红色: '红色',
        酒红色: '酒红色',
        粉色: '粉色',
        黄色: '黄色',
        金色: '金色',
        橙色: '橙色',
        绿色: '绿色',
        棕色: '棕色',
        米色: '米色',
        紫色: '紫色',
        曜石黑: '曜石黑',
        竞技红: '竞技红',
        矿石白: '矿石白',
        亮银灰: '亮银灰',
        珍珠黄: '珍珠黄',
        石墨灰: '石墨灰',
        赛道灰: '赛道灰',
        黑曜石: '黑曜石',
        金属绿: '金属绿',
        哑光灰: '哑光灰'
      },
      ja: {
        白色: 'ホワイト',
        珍珠白: 'パールホワイト',
        黑色: 'ブラック',
        珍珠黑: 'パールブラック',
        银色: 'シルバー',
        灰色: 'グレー',
        蓝色: 'ブルー',
        深蓝色: 'ダークブルー',
        红色: 'レッド',
        酒红色: 'ワインレッド',
        粉色: 'ピンク',
        黄色: 'イエロー',
        金色: 'ゴールド',
        橙色: 'オレンジ',
        绿色: 'グリーン',
        棕色: 'ブラウン',
        米色: 'ベージュ',
        紫色: 'パープル',
        曜石黑: 'オブシディアンブラック',
        竞技红: 'ロッソコルサ',
        矿石白: 'ミネラルホワイト',
        亮银灰: 'ブライトシルバー',
        珍珠黄: 'パールイエロー',
        石墨灰: 'グラファイトグレー',
        赛道灰: 'レーシンググレー',
        黑曜石: 'オブシディアンブラック',
        金属绿: 'メタリックグリーン',
        哑光灰: 'マットグレー'
      },
      en: {
        白色: 'White',
        珍珠白: 'Pearl White',
        黑色: 'Black',
        珍珠黑: 'Pearl Black',
        银色: 'Silver',
        灰色: 'Gray',
        蓝色: 'Blue',
        深蓝色: 'Dark Blue',
        红色: 'Red',
        酒红色: 'Wine Red',
        粉色: 'Pink',
        黄色: 'Yellow',
        金色: 'Gold',
        橙色: 'Orange',
        绿色: 'Green',
        棕色: 'Brown',
        米色: 'Beige',
        紫色: 'Purple',
        曜石黑: 'Obsidian Black',
        竞技红: 'Rosso Corsa',
        矿石白: 'Mineral White',
        亮银灰: 'Bright Silver',
        珍珠黄: 'Pearl Yellow',
        石墨灰: 'Graphite Gray',
        赛道灰: 'Racing Gray',
        黑曜石: 'Obsidian Black',
        金属绿: 'Metallic Green',
        哑光灰: 'Matte Gray'
      }
    },
    interiorColor: {
      zh: {
        白色: '白色',
        珍珠白: '珍珠白',
        黑色: '黑色',
        珍珠黑: '珍珠黑',
        银色: '银色',
        灰色: '灰色',
        蓝色: '蓝色',
        深蓝色: '深蓝色',
        红色: '红色',
        酒红色: '酒红色',
        粉色: '粉色',
        黄色: '黄色',
        金色: '金色',
        橙色: '橙色',
        绿色: '绿色',
        棕色: '棕色',
        米色: '米色',
        紫色: '紫色',
        黑色真皮: '黑色真皮',
        棕色真皮: '棕色真皮',
        '黑红拼色真皮': '黑红拼色真皮',
        深棕真皮: '深棕真皮',
        '黑色 Alcantara': '黑色 Alcantara',
        黑黄拼色: '黑黄拼色',
        黑橙拼色: '黑橙拼色',
        黑金拼色: '黑金拼色'
      },
      ja: {
        白色: 'ホワイト',
        珍珠白: 'パールホワイト',
        黑色: 'ブラック',
        珍珠黑: 'パールブラック',
        银色: 'シルバー',
        灰色: 'グレー',
        蓝色: 'ブルー',
        深蓝色: 'ダークブルー',
        红色: 'レッド',
        酒红色: 'ワインレッド',
        粉色: 'ピンク',
        黄色: 'イエロー',
        金色: 'ゴールド',
        橙色: 'オレンジ',
        绿色: 'グリーン',
        棕色: 'ブラウン',
        米色: 'ベージュ',
        紫色: 'パープル',
        黑色真皮: 'ブラックレザー',
        棕色真皮: 'ブラウンレザー',
        '黑红拼色真皮': 'ブラック / レッド レザー',
        深棕真皮: 'ダークブラウンレザー',
        '黑色 Alcantara': 'ブラック Alcantara',
        黑黄拼色: 'ブラック / イエロー',
        黑橙拼色: 'ブラック / オレンジ',
        黑金拼色: 'ブラック / ゴールド'
      },
      en: {
        白色: 'White',
        珍珠白: 'Pearl White',
        黑色: 'Black',
        珍珠黑: 'Pearl Black',
        银色: 'Silver',
        灰色: 'Gray',
        蓝色: 'Blue',
        深蓝色: 'Dark Blue',
        红色: 'Red',
        酒红色: 'Wine Red',
        粉色: 'Pink',
        黄色: 'Yellow',
        金色: 'Gold',
        橙色: 'Orange',
        绿色: 'Green',
        棕色: 'Brown',
        米色: 'Beige',
        紫色: 'Purple',
        黑色真皮: 'Black Leather',
        棕色真皮: 'Brown Leather',
        '黑红拼色真皮': 'Black / Red Leather',
        深棕真皮: 'Dark Brown Leather',
        '黑色 Alcantara': 'Black Alcantara',
        黑黄拼色: 'Black / Yellow',
        黑橙拼色: 'Black / Orange',
        黑金拼色: 'Black / Gold'
      }
    },
    seats: {
      zh: {
        '2 座': '2 座',
        '4 座': '4 座',
        '5 座': '5 座',
        '6 座': '6 座',
        '7 座': '7 座',
        '8 座及以上': '8 座及以上'
      },
      ja: {
        '2 座': '2名',
        '4 座': '4名',
        '5 座': '5名',
        '6 座': '6名',
        '7 座': '7名',
        '8 座及以上': '8名以上'
      },
      en: {
        '2 座': '2 seats',
        '4 座': '4 seats',
        '5 座': '5 seats',
        '6 座': '6 seats',
        '7 座': '7 seats',
        '8 座及以上': '8+ seats'
      }
    }
  };

  function parseCurrency(value) {
    return Number(String(value || '').replace(/[^\d]/g, '')) || 0;
  }

  function normalizeMileageUnit(u) {
    const s = String(u ?? '').trim().toLowerCase();
    if (s === 'km' || s === 'kilometer' || s === 'kilometres' || s === 'kilometre') return 'km';
    return 'wan';
  }

  function parseMileage(value) {
    const raw = String(value ?? '').trim();
    if (!raw) return 0;
    if (/万/.test(raw)) {
      const n = parseFloat(raw.replace(/[^\d.]/g, ''));
      return Number.isFinite(n) ? Math.round(n * 10000) : 0;
    }
    const compact = raw.replace(/[,，]/g, '').trim();
    if (!/^[\d.]+$/.test(compact)) return 0;
    const n = parseFloat(compact);
    if (!Number.isFinite(n)) return 0;
    if (compact.includes('.') && n < 1000) return Math.round(n * 10000);
    return Math.round(n);
  }

  /** 换算为公里整数；尊重 vehicle.mileageUnit（wan|km） */
  function parseVehicleMileageKm(vehicle) {
    const raw = String(vehicle?.mileage ?? '').trim();
    if (!raw) return 0;
    if (normalizeMileageUnit(vehicle?.mileageUnit) === 'km') {
      const compact = raw.replace(/[,，\s]/g, '');
      if (!/^[\d.]+$/.test(compact)) return 0;
      const n = parseFloat(compact);
      return Number.isFinite(n) ? Math.round(n) : 0;
    }
    return parseMileage(raw);
  }

  /**
   * 展示里程。第三参 mileageUnit：wan=万公里小数存库；km=公里整数存库。
   * 英文统一「N km」；中文 wan→「X万公里」、km→「N 公里」；日文 km→「N km」、wan→「X万公里」（与历史文案一致）。
   */
  function formatVehicleMileageDisplay(value, language = getCurrentLanguage(), mileageUnit) {
    const raw = String(value ?? '').trim();
    if (!raw) return '';
    if (!/\d/.test(raw)) return raw;
    const unit = normalizeMileageUnit(mileageUnit);
    if (unit === 'km') {
      const compact = raw.replace(/[,，\s]/g, '');
      const n = parseFloat(compact);
      const km = Number.isFinite(n) ? Math.round(n) : 0;
      if (!km) return raw;
      if (language === 'en') return `${km.toLocaleString('en-US')} km`;
      if (language === 'ja') return `${km.toLocaleString('ja-JP')} km`;
      return `${km.toLocaleString('zh-CN')} 公里`;
    }
    const km = parseMileage(raw);
    if (!km) return raw;
    if (language === 'en') {
      return `${km.toLocaleString('en-US')} km`;
    }
    const wan = km / 10000;
    let s = wan.toFixed(2);
    s = s.replace(/(\.\d*?[1-9])0+$/g, '$1').replace(/\.$/, '');
    return `${s}万公里`;
  }

  function parseYear(value) {
    return Number(String(value || '').replace(/[^\d]/g, '')) || 0;
  }

  function resolveVehicleMediaSource(path) {
    const rawPath = String(path || '').trim();
    if (!rawPath) return '';
    if (/^(?:https?:)?\/\//.test(rawPath) || rawPath.startsWith('data:') || rawPath.startsWith('blob:') || rawPath.startsWith('assets/')) {
      return rawPath;
    }
    // Legacy numeric filenames (001.png … 006.png) are stored in R2 under
    // vehicles/seed/ and listed in D1; resolve to the Worker media route.
    let apiPath = rawPath;
    if (!rawPath.startsWith('/api/')) {
      if (/^00[1-6]\.png$/i.test(rawPath)) {
        apiPath = `/api/media/vehicles/seed/${rawPath}`;
      } else {
        return `assets/images/${rawPath}`;
      }
    }
    const apiBase = (typeof window !== 'undefined' && typeof window.TK168_API_BASE === 'string')
      ? window.TK168_API_BASE
      : 'https://api.tk168.co.jp';
    const sameOrigin = typeof location !== 'undefined' && apiBase && apiBase.startsWith(location.origin);
    return sameOrigin || !apiBase ? apiPath : `${apiBase.replace(/\/+$/, '')}${apiPath}`;
  }

  function getCurrentLanguage() {
    return window.TK168I18N?.getLanguage?.() || 'ja';
  }

  function getBrandLabel(brandOrKey, language = getCurrentLanguage()) {
    const brand = typeof brandOrKey === 'string' ? getBrandByKey(brandOrKey) : brandOrKey;
    if (!brand) return '';
    if (language === 'en') return brand.labelEn || brand.labelJa || brand.labelZh;
    if (language === 'ja') return brand.labelJa || brand.labelEn || brand.labelZh;
    return brand.labelZh || brand.labelJa || brand.labelEn || '';
  }

  /** 去掉开头的「品牌 + 空格 / 全角空格」，用于日/英车名与品牌分行显示 */
  function stripLeadingBrandLabel(full, brandLabel) {
    const s = String(full || '').trim();
    const b = String(brandLabel || '').trim();
    if (!s || !b) return s;
    if (s.startsWith(`${b} `)) return s.slice(b.length + 1).trim();
    if (s.startsWith(`${b}\u3000`)) return s.slice(b.length + 1).trim();
    return s;
  }

  function getVehicleBrandTitle(vehicle, language = getCurrentLanguage()) {
    if (!vehicle) return '';
    return getBrandLabel(vehicle.brandKey, language);
  }

  function getVehicleModelDisplayName(vehicle, language = getCurrentLanguage()) {
    if (!vehicle) return '';
    const brandLbl = getBrandLabel(vehicle.brandKey, language);
    if (language === 'zh') return getVehicleModelName(vehicle);
    if (language === 'ja' && String(vehicle.nameJa || '').trim()) {
      const raw = String(vehicle.nameJa).trim();
      return stripLeadingBrandLabel(raw, brandLbl) || raw;
    }
    if (language === 'en' && String(vehicle.nameEn || '').trim()) {
      const raw = String(vehicle.nameEn).trim();
      return stripLeadingBrandLabel(raw, brandLbl) || raw;
    }
    return getVehicleModelName(vehicle);
  }

  function getVehicleModelName(vehicle) {
    const brand = getBrandByKey(vehicle.brandKey);
    if (!brand) return vehicle.name;
    const prefix = `${brand.labelZh} `;
    return vehicle.name.startsWith(prefix) ? vehicle.name.slice(prefix.length) : vehicle.name;
  }

  function getVehicleName(vehicle, language = getCurrentLanguage()) {
    if (!vehicle) return '';
    if (language === 'zh') {
      const model = getVehicleModelName(vehicle);
      const brand = getBrandLabel(vehicle.brandKey, 'zh');
      const parts = [brand, model].filter(Boolean);
      return parts.join(' ').trim() || model || brand || '';
    }
    if (language === 'ja' && String(vehicle.nameJa || '').trim()) return String(vehicle.nameJa).trim();
    if (language === 'en' && String(vehicle.nameEn || '').trim()) return String(vehicle.nameEn).trim();
    return `${getBrandLabel(vehicle.brandKey, language)} ${getVehicleModelName(vehicle)}`.trim();
  }

  function getVehicleTypeLabel(type, language = getCurrentLanguage()) {
    const option = vehicleTypeOptions.find((item) => item.value === type);
    if (!option) return type;
    if (language === 'en') return option.labelEn || option.labelJa || option.labelZh;
    if (language === 'ja') return option.labelJa || option.labelEn || option.labelZh;
    return option.labelZh || option.labelJa || option.labelEn || type;
  }

  /** 车身 slug（首页筛选）或 labelZh → 用于门数等逻辑的中文语境 */
  function resolveBodyStyleLabelZh(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    const opt = bodyTypeSearchOptions.find((o) => o.value === raw || o.labelZh === raw);
    if (opt) return opt.labelZh;
    return raw;
  }

  /** 车身类型：新标准中文值走 vehicleFieldTranslations；旧 slug/筛选项走 bodyTypeSearchOptions */
  function getBodyStyleFieldLabel(value, language = getCurrentLanguage()) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (standardBodyStyleValues.includes(raw)) {
      const fieldCatalog = vehicleFieldTranslations.bodyStyle || {};
      const catalog = fieldCatalog[language] || fieldCatalog.ja || fieldCatalog.zh;
      return catalog?.[raw] || raw;
    }
    const opt = bodyTypeSearchOptions.find((o) => o.value === raw || o.labelZh === raw);
    if (opt) {
      if (language === 'en') return opt.labelEn || opt.labelJa || opt.labelZh;
      if (language === 'ja') return opt.labelJa || opt.labelEn || opt.labelZh;
      return opt.labelZh;
    }
    const fieldCatalog = vehicleFieldTranslations.bodyStyle || {};
    const catalog = fieldCatalog[language] || fieldCatalog.ja || fieldCatalog.zh;
    return catalog?.[raw] || raw;
  }

  function getVehicleFieldLabel(field, value, language = getCurrentLanguage()) {
    if (field === 'bodyStyle') return getBodyStyleFieldLabel(value, language);
    const fieldCatalog = vehicleFieldTranslations[field] || {};
    const catalog = fieldCatalog[language] || fieldCatalog.ja || fieldCatalog.zh;
    let raw = String(value ?? '').trim();
    if ((field === 'fuel' || field === 'fuelOilType') && raw) {
      const normalizedKey = raw.replace(/\(/g, '（').replace(/\)/g, '）');
      const translated = catalog?.[normalizedKey] ?? catalog?.[raw];
      return translated !== undefined && translated !== null && translated !== '' ? translated : raw;
    }
    return catalog?.[raw] ?? raw;
  }

  function formatEnglishWarranty(value) {
    const raw = String(value || '').trim();
    if (!raw || raw === '无') return 'None';
    const normalized = raw
      .replace(/^店保\s*/, 'Dealer warranty ')
      .replace(/(\d+)个月/g, (_, months) => `${months} month${Number(months) === 1 ? '' : 's'}`)
      .replace(/(\d[\d,]*)km/g, '$1 km');
    return normalized;
  }

  function formatEnglishInspectionDate(value) {
    return String(value || '')
      .replace(/（/g, ' (')
      .replace(/）/g, ')')
      .replace(/年/g, ' / ')
      .replace(/月/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function translatePresetValueToEnglish(key, value) {
    const raw = String(value || '').trim();
    if (!raw) return '';

    const basicMap = {
      是: 'Yes',
      否: 'No',
      有: 'Yes',
      没有: 'None',
      无: 'None',
      附: 'Included',
      整备付: 'Service included',
      不适用: 'Not applicable',
      适用: 'Eligible',
      右舵: 'Right-hand drive',
      左舵: 'Left-hand drive'
    };

    if (basicMap[raw]) return basicMap[raw];
    if (key === 'fuelGrade') {
      const map = {
        普通汽油: 'Regular',
        高辛烷汽油: 'Premium',
        柴油: 'Diesel',
        电动: 'Electric',
      };
      if (map[raw]) return map[raw];
    }
    if (key === 'dealerWarranty') return formatEnglishWarranty(raw);
    if (key === 'vehicleInspection') return formatEnglishInspectionDate(raw);
    return raw;
  }

  function buildVehicleOverviewEn(vehicle) {
    if (!vehicle) return [];
    const brandName = getVehicleName(vehicle, 'en');
    const typeLabel = getBodyStyleFieldLabel(vehicle.bodyStyle, 'en') || 'premium vehicle';
    const fuelLabel = getVehicleFieldLabel('fuel', vehicle.fuel, 'en') || 'combustion';
    const driveLabel = getVehicleFieldLabel('drive', vehicle.drive, 'en') || 'road-ready';
    const bodyColorLabel = getVehicleFieldLabel('bodyColor', vehicle.bodyColor, 'en') || 'well-kept';
    const interiorLabel = getVehicleFieldLabel('interiorColor', vehicle.interiorColor, 'en') || 'refined';
    const mileageLabel = formatVehicleMileageDisplay(vehicle.mileage, 'en', vehicle.mileageUnit) || 'a well-kept mileage record';

    return [
      `${brandName} is presented here as a ${typeLabel.toLowerCase()}, pairing ${formatVehicleEngineLine(vehicle)} output with ${fuelLabel.toLowerCase()} power and ${driveLabel} traction.`,
      `Its ${bodyColorLabel.toLowerCase()} exterior, ${interiorLabel.toLowerCase()} cabin, and ${mileageLabel} make it a strong fit for clients who want clear condition, strong presence, and everyday usability.`
    ];
  }

  function getVehicleOverview(vehicle, language = getCurrentLanguage()) {
    if (!vehicle) return [];
    if (language === 'en' && Array.isArray(vehicle.overviewEn)) return vehicle.overviewEn;
    if (language === 'ja' && Array.isArray(vehicle.overviewJa)) return vehicle.overviewJa;
    if (language === 'en') return buildVehicleOverviewEn(vehicle);
    // The admin API surfaces the Chinese copy as `overviewZh`; the legacy
    // static shape used the unsuffixed `overview`.  Accept both so data
    // edited from the admin panel is rendered here.
    return vehicle.overviewZh || vehicle.overview || vehicle.overviewJa || [];
  }

  function getVehicleBenefits(vehicle, language = getCurrentLanguage()) {
    if (!vehicle) return [];
    if (language === 'en') return vehicle.benefitsEn || defaultBenefitsEn;
    if (language === 'ja') return vehicle.benefitsJa || defaultBenefitsJa;
    return vehicle.benefits || defaultBenefits;
  }

  function getVehicleFeatures(vehicle, language = getCurrentLanguage()) {
    if (!vehicle) return [];
    if (language === 'en') return vehicle.featuresEn || defaultFeaturesEn;
    if (language === 'ja') return vehicle.featuresJa || defaultFeaturesJa;
    return vehicle.features || defaultFeatures;
  }

  function getVehicleConditionField(vehicle, key, language = getCurrentLanguage()) {
    const apiPreset = apiPresets?.condition?.[vehicle?.id]?.[key];
    const preset = apiPreset ?? vehicleConditionPresets[vehicle?.id]?.[key];
    if (!preset) return '';
    if (typeof preset === 'string') return language === 'en' ? translatePresetValueToEnglish(key, preset) : preset;
    if (language === 'en') return preset.en || translatePresetValueToEnglish(key, preset.zh || preset.ja || '');
    if (language === 'ja') return preset.ja || preset.en || preset.zh || '';
    return preset.zh || preset.ja || preset.en || '';
  }

  function getVehicleListingField(vehicle, key, language = getCurrentLanguage()) {
    const apiPreset = apiPresets?.listing?.[vehicle?.id]?.[key];
    const preset = apiPreset ?? vehicleListingPresets[vehicle?.id]?.[key];
    if (!preset) return '';
    if (typeof preset === 'string') return language === 'en' ? translatePresetValueToEnglish(key, preset) : preset;
    if (language === 'en') return preset.en || translatePresetValueToEnglish(key, preset.zh || preset.ja || '');
    if (language === 'ja') return preset.ja || preset.en || preset.zh || '';
    return preset.zh || preset.ja || preset.en || '';
  }

  function getVehicleHighlightField(vehicle, key, language = getCurrentLanguage()) {
    if (!vehicle) return '';

    if (key === 'displacement') {
      const d = String(vehicle.displacement || '').trim();
      if (d) return d;
      return splitLegacyEngineSpec(vehicle.engine).displacement;
    }
    if (key === 'cylinders') {
      const c = String(vehicle.cylinders || '').trim();
      if (c) return c;
      return splitLegacyEngineSpec(vehicle.engine).cylinders;
    }
    if (key === 'forcedInduction') {
      let text = String(
        vehicle.forcedInductionText || vehicle.forced_induction_text || '',
      ).trim();
      if (!text) {
        text = String(
          vehicle.forcedInductionZh ||
            vehicle.forcedInductionJa ||
            vehicle.forcedInductionEn ||
            vehicle.forced_induction_zh ||
            vehicle.forced_induction_ja ||
            vehicle.forced_induction_en ||
            '',
        ).trim();
      }
      const uRaw = String(vehicle.forcedInductionUnit || '').trim();
      const isDash = uRaw === '-' || uRaw === '—';
      const isOther = isDash || /^other$/i.test(uRaw) || uRaw === '其它';
      const u = uRaw.toUpperCase();
      let turboWord = '涡轮增压';
      let scWord = '机械增压';
      if (language === 'en') {
        turboWord = 'Turbocharged';
        scWord = 'Supercharged';
      } else if (language === 'ja') {
        turboWord = 'ターボ';
        scWord = 'スーパーチャージャー';
      }
      if (!uRaw) {
        if (!text) return '';
        return text;
      }
      if (isOther) {
        if (!text) return '-';
        return `${text} -`;
      }
      if (u === 'T') {
        if (!text) return turboWord;
        return `${text}T ${turboWord}`;
      }
      if (u === 'S') {
        if (!text) return scWord;
        return `${text}S ${scWord}`;
      }
      if (!text) return '';
      return text;
    }
    if (key === 'drive') return getVehicleFieldLabel('drive', vehicle.drive, language);
    if (key === 'seats') return getVehicleFieldLabel('seats', vehicle.seats, language);
    if (key === 'doors') {
      const bodyContext = `${resolveBodyStyleLabelZh(vehicle.bodyStyle)} ${getVehicleModelName(vehicle)}`;
      let doorCount = 2;
      if (/(SUV|MPV|旅行车|ワゴン|越野车)/i.test(bodyContext)) doorCount = 5;
      else if (/(轿车|セダン)/i.test(bodyContext)) doorCount = 4;
      if (language === 'en') return `${doorCount} doors`;
      return language === 'ja' ? `${doorCount}ドア` : `${doorCount} 门`;
    }

    const apiPreset = apiPresets?.highlight?.[vehicle.id]?.[key];
    const preset = apiPreset ?? vehicleHighlightPresets[vehicle.id]?.[key];
    if (!preset) return '';
    if (typeof preset === 'string') return language === 'en' ? translatePresetValueToEnglish(key, preset) : preset;
    if (language === 'en') return preset.en || translatePresetValueToEnglish(key, preset.zh || preset.ja || '');
    if (language === 'ja') return preset.ja || preset.en || preset.zh || '';
    return preset.zh || preset.ja || preset.en || '';
  }

  function formatRegistrationYear(yearValue, language = getCurrentLanguage()) {
    const year = parseYear(yearValue);
    if (!year) return '';
    let eraCode = '';
    let eraYear = '';
    if (year >= 2019) {
      eraCode = 'R';
      eraYear = String(year - 2018).padStart(2, '0');
    } else if (year >= 1989) {
      eraCode = 'H';
      eraYear = String(year - 1988).padStart(2, '0');
    }
    if (!eraCode) return String(year);
    return language === 'ja'
      ? `${year}(${eraCode}${eraYear})`
      : `${year}（${eraCode}${eraYear}）`;
  }

  function absoluteApiUrlIfNeeded(path) {
    const s = String(path || '').trim();
    if (!s) return '';
    if (/^https?:\/\//i.test(s)) return s;
    if (s.startsWith('/api/')) {
      const base = typeof window.TK168_API_BASE === 'string'
        ? window.TK168_API_BASE.replace(/\/+$/, '')
        : '';
      if (base) return `${base}${s}`;
    }
    return s;
  }

  /** 后台 /api/journal 拉取后的条目；仅 API 未就绪时回退到内置 `news` */
  function buildNewsListFromApi() {
    if (!window.__TK168_JOURNAL_HYDRATED__) return null;
    const raw = window.TK168_API_JOURNAL;
    if (!Array.isArray(raw)) return null;
    return raw
      .filter((j) => j.isPublished !== false)
      .map((j) => ({
      id: j.id || '',
      title: j.titleZh || '',
      titleJa: j.titleJa || '',
      titleEn: j.titleEn || '',
      category: j.categoryZh || '',
      categoryJa: j.categoryJa || '',
      categoryEn: j.categoryEn || '',
      summary: j.summaryZh || '',
      summaryJa: j.summaryJa || '',
      summaryEn: j.summaryEn || '',
      image: absoluteApiUrlIfNeeded(j.imageUrl) || j.imageUrl || '',
      date: j.dateLabel || '',
      bodyZh: j.bodyZh,
      bodyJa: j.bodyJa,
      bodyEn: j.bodyEn
    }));
  }

  function getNewsItems(language = getCurrentLanguage()) {
    const fromApi = buildNewsListFromApi();
    const source = fromApi !== null ? fromApi : news;
    return source.map((item) => ({
      ...item,
      title: language === 'en'
        ? (item.titleEn || item.titleJa || item.title)
        : (language === 'ja' ? (item.titleJa || item.titleEn || item.title) : (item.title || item.titleJa || item.titleEn || '')),
      category: language === 'en'
        ? (item.categoryEn || item.categoryJa || item.category)
        : (language === 'ja' ? (item.categoryJa || item.categoryEn || item.category) : (item.category || item.categoryJa || item.categoryEn || '')),
      summary: language === 'en'
        ? (item.summaryEn || item.summaryJa || item.summary || '')
        : (language === 'ja' ? (item.summaryJa || item.summaryEn || item.summary || '') : (item.summary || item.summaryJa || item.summaryEn || ''))
    }));
  }

  function refreshJournalFromApiHydrate() {
    /* 资讯从 window.TK168_API_JOURNAL 即时读取，无需同步本地数组 */
  }

  function pickI18nField(language, zh, ja, en) {
    if (language === 'en') return (en || ja || zh || '').trim();
    if (language === 'ja') return (ja || en || zh || '').trim();
    return (zh || ja || en || '').trim();
  }

  /** 与 `getNewsItems` 同一数据源，用于独立详情页 */
  function getNewsDetailRecord({ id, index, language = getCurrentLanguage() } = {}) {
    const fromApi = buildNewsListFromApi();
    const useApi = fromApi !== null;
    const rows = useApi
      ? fromApi.map((r) => ({
          id: r.id,
          titleZh: r.title,
          titleJa: r.titleJa,
          titleEn: r.titleEn,
          categoryZh: r.category,
          categoryJa: r.categoryJa,
          categoryEn: r.categoryEn,
          summaryZh: r.summary,
          summaryJa: r.summaryJa,
          summaryEn: r.summaryEn,
          bodyZh: r.bodyZh,
          bodyJa: r.bodyJa,
          bodyEn: r.bodyEn,
          image: r.image,
          date: r.date
        }))
      : news.map((n, i) => ({
          id: n.id || `static-${i}`,
          titleZh: n.title,
          titleJa: n.titleJa,
          titleEn: n.titleEn,
          categoryZh: n.category,
          categoryJa: n.categoryJa,
          categoryEn: n.categoryEn,
          summaryZh: n.summary,
          summaryJa: n.summaryJa,
          summaryEn: n.summaryEn,
          bodyZh: n.bodyZh,
          bodyJa: n.bodyJa,
          bodyEn: n.bodyEn,
          image: n.image,
          date: n.date
        }));

    let row = null;
    const rawId = id != null && String(id).trim() ? String(id).trim() : '';
    if (rawId) {
      row = rows.find((r) => r.id === rawId) || null;
    }
    if (!row && index != null && index !== '') {
      const n = Number.parseInt(String(index), 10);
      if (Number.isFinite(n) && n >= 0 && n < rows.length) row = rows[n];
    }
    if (!row) return null;

    const bodyRaw = pickI18nField(language, row.bodyZh, row.bodyJa, row.bodyEn);
    const summaryRaw = pickI18nField(
      language,
      row.summaryZh,
      row.summaryJa,
      row.summaryEn
    );
    return {
      id: row.id,
      title: pickI18nField(language, row.titleZh, row.titleJa, row.titleEn),
      category: pickI18nField(
        language,
        row.categoryZh,
        row.categoryJa,
        row.categoryEn
      ),
      date: row.date || '',
      image: row.image || '',
      summary: summaryRaw,
      body: (bodyRaw || '').trim()
    };
  }

  function getJournalDetailPageUrl({ id, index } = {}) {
    if (id != null && String(id).trim()) {
      return `news-detail.html?id=${encodeURIComponent(String(id).trim())}`;
    }
    if (index != null && index !== '' && Number.isFinite(Number(index))) {
      return `news-detail.html?i=${encodeURIComponent(String(index))}`;
    }
    return 'news-detail.html';
  }

  let _brandKeyCatalog = null; // { keySet, shortJa }
  function ensureBrandKeyCatalog() {
    if (_brandKeyCatalog) return;
    const keySet = new Set();
    const shortJa = new Map();
    const groups = (typeof window !== 'undefined' && window.TK168AdminBrandKeyOptionGroups) || [];
    for (const g of groups) {
      for (const o of g.options || []) {
        if (!o?.value) continue;
        const k = String(o.value);
        keySet.add(k);
        const full = String(o.label || o.value);
        const short = full
          .replace(/\s*（[0-9,]+）\s*$/u, '')
          .replace(/\s*\([0-9,]+\)\s*$/g, '')
          .replace(/\s*—\s*[^—]+$/u, '')
          .trim() || k;
        shortJa.set(k, short);
      }
    }
    _brandKeyCatalog = { keySet, shortJa };
  }

  /** 与后台 `admin-brand-key-options.js` 分组 / 首页国旗 PNG 一致（`assets/images/flags/ui/*.png`） */
  const MAKER_GROUP_COUNTRY = Object.freeze({
    'search.makerGroup.japan': Object.freeze({
      code: 'jp',
      country: Object.freeze({ zh: '日本', ja: '日本', en: 'Japan' })
    }),
    'search.makerGroup.germany': Object.freeze({
      code: 'de',
      country: Object.freeze({ zh: '德国', ja: 'ドイツ', en: 'Germany' })
    }),
    'search.makerGroup.usa': Object.freeze({
      code: 'us',
      country: Object.freeze({ zh: '美国', ja: 'アメリカ', en: 'United States' })
    }),
    'search.makerGroup.uk': Object.freeze({
      code: 'gb',
      country: Object.freeze({ zh: '英国', ja: 'イギリス', en: 'United Kingdom' })
    }),
    'search.makerGroup.sweden': Object.freeze({
      code: 'se',
      country: Object.freeze({ zh: '瑞典', ja: 'スウェーデン', en: 'Sweden' })
    }),
    'search.makerGroup.france': Object.freeze({
      code: 'fr',
      country: Object.freeze({ zh: '法国', ja: 'フランス', en: 'France' })
    }),
    'search.makerGroup.italy': Object.freeze({
      code: 'it',
      country: Object.freeze({ zh: '意大利', ja: 'イタリア', en: 'Italy' })
    })
  });

  const BRAND_MAKER_COUNTRY_OVERRIDES = Object.freeze({
    byd: Object.freeze({
      code: 'cn',
      country: Object.freeze({ zh: '中国', ja: '中国', en: 'China' })
    }),
    hyundai: Object.freeze({
      code: 'kr',
      country: Object.freeze({ zh: '韩国', ja: '韓国', en: 'South Korea' })
    })
  });

  let _brandKeyMakerCountry = null;

  function ensureBrandKeyMakerCountryMap() {
    if (_brandKeyMakerCountry) return;
    _brandKeyMakerCountry = new Map();
    const groups = (typeof window !== 'undefined' && window.TK168AdminBrandKeyOptionGroups) || [];
    for (const g of groups) {
      const groupMeta = MAKER_GROUP_COUNTRY[g.i18nKey];
      if (!groupMeta) continue;
      for (const o of g.options || []) {
        const k = String(o.value || '').trim();
        if (!k) continue;
        const override = BRAND_MAKER_COUNTRY_OVERRIDES[k];
        _brandKeyMakerCountry.set(k, override || groupMeta);
      }
    }
    Object.keys(BRAND_MAKER_COUNTRY_OVERRIDES).forEach((k) => {
      if (!_brandKeyMakerCountry.has(k)) {
        _brandKeyMakerCountry.set(k, BRAND_MAKER_COUNTRY_OVERRIDES[k]);
      }
    });
  }

  /** 由后台「品牌 Key」国家分组解析国旗 code 与三国语言国名 */
  function getBrandMakerCountry(brandKey) {
    const raw = String(brandKey || '').trim();
    if (!raw) return null;
    ensureBrandKeyMakerCountryMap();
    const resolved = resolveCanonicalBrandKey(raw) || raw.toLowerCase();
    const candidates = [resolved, raw.toLowerCase()];
    for (let i = 0; i < candidates.length; i += 1) {
      const hit = _brandKeyMakerCountry.get(candidates[i]);
      if (hit) return hit;
    }
    return null;
  }

  function getBrandLogoHomeCopy(assetKey) {
    const key = String(assetKey || '').trim().toLowerCase();
    if (!key) return null;
    const api =
      typeof window !== 'undefined' && window.TK168BrandLogoHomeCopy
        ? window.TK168BrandLogoHomeCopy
        : null;
    return api && api[key] ? api[key] : null;
  }

  function withMakerCountryNavFields(navItem) {
    const assetKey =
      navItem.assetKey || brandLogoAssetKeyFromFile(navItem.file) || '';
    const copy = getBrandLogoHomeCopy(assetKey);
    const meta = getBrandMakerCountry(navItem.key);
    let next = navItem;
    if (meta) {
      next = {
        ...next,
        countryCode: meta.code,
        country: meta.country
      };
    }
    if (!copy) return next;
    return {
      ...next,
      labelZh: copy.name?.zh || next.labelZh,
      labelJa: copy.name?.ja || next.labelJa,
      labelEn: copy.name?.en || next.labelEn,
      homeStory: copy.story || next.homeStory
    };
  }

  function titleEnFromBrandSlug(s) {
    return String(s)
      .split(/-/)
      .filter(Boolean)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join(' ');
  }

  function makeCatalogBrand(lookupKey) {
    ensureBrandKeyCatalog();
    if (!_brandKeyCatalog.keySet.has(lookupKey)) return null;
    const tri =
      typeof window !== "undefined" && window.TK168BrandKeyNameI18n
        ? window.TK168BrandKeyNameI18n[lookupKey]
        : null;
    if (tri && tri.ja && tri.zh && tri.en) {
      return {
        key: lookupKey,
        labelJa: tri.ja,
        labelZh: tri.zh,
        labelEn: tri.en,
        file: "",
        isCatalogOnly: true
      };
    }
    const short = _brandKeyCatalog.shortJa.get(lookupKey) || lookupKey;
    const en = titleEnFromBrandSlug(lookupKey);
    return {
      key: lookupKey,
      labelJa: short,
      labelZh: en,
      labelEn: en,
      file: "",
      isCatalogOnly: true
    };
  }

  function getBrandByKey(key) {
    const raw = String(key || '').trim();
    if (!raw) return null;
    const resolved = resolveCanonicalBrandKey(key) || '';
    if (resolved) {
      const b = brands.find((brand) => brand.key === resolved);
      if (b) return b;
    }
    ensureBrandKeyCatalog();
    const set = _brandKeyCatalog.keySet;
    const candidates = [resolved, raw.toLowerCase()].filter(Boolean);
    for (const c of candidates) {
      if (set.has(c)) return makeCatalogBrand(c);
    }
    return null;
  }

  /** 列表/卡片角标：优先后台「图标」字段，否则用品牌库 file（catalog-only 品牌无 file 时必依赖 icon） */
  function resolveVehicleBrandGlyphUrl(vehicle) {
    if (!vehicle) return 'assets/images/logo_TK168.svg';
    const icon = String(vehicle.icon || '').trim();
    if (icon) {
      const url = resolveVehicleMediaSource(icon);
      if (url) return url;
    }
    const brand = getBrandByKey(vehicle.brandKey);
    if (brand?.file) return `assets/images/brands/logos/${brand.file}`;
    return 'assets/images/logo_TK168.svg';
  }

  /** `assets/images/brands/logos/ferrari.svg` → `ferrari` */
  function brandLogoAssetKeyFromUrl(url) {
    const match = String(url || '').match(/brands\/logos\/([^/?#]+)\.svg/i);
    return match ? match[1].toLowerCase() : '';
  }

  function brandLogoAssetKeyFromFile(file) {
    return String(file || '').replace(/\.svg$/i, '').toLowerCase();
  }

  /** Logo 文件名（如 corvette）与 canonical brandKey 不同时的展示名 */
  const BRAND_LOGO_ASSET_LABELS = Object.freeze({
    corvette: Object.freeze({
      zh: '克尔维特',
      ja: 'コルベット',
      en: 'Chevrolet Corvette'
    })
  });

  function withLogoAssetLabels(navItem, assetKey) {
    const tri = BRAND_LOGO_ASSET_LABELS[String(assetKey || '').trim().toLowerCase()];
    if (!tri) return navItem;
    return {
      ...navItem,
      labelZh: tri.zh || navItem.labelZh,
      labelJa: tri.ja || navItem.labelJa,
      labelEn: tri.en || navItem.labelEn
    };
  }

  function catalogNavItemFromLogoRow(item) {
    const assetKey = brandLogoAssetKeyFromFile(item.file);
    return {
      key: item.key,
      assetKey,
      iconUrl: item.file ? `assets/images/brands/logos/${item.file}` : '',
      file: item.file,
      labelZh: item.labelZh,
      labelJa: item.labelJa,
      labelEn: item.labelEn
    };
  }

  /**
   * 首页轮盘与品牌展厅导航共用的品牌 logo 列表：来自后台品牌车辆「图标」字段，
   * 按图标去重；已知品牌保持 brand-logo-inventory 顺序，其余按库存出现顺序追加。
   */
  function getInventoryBrandGlyphNavItems() {
    const catalogItems = Array.isArray(brandLogoInventoryApi.items)
      ? brandLogoInventoryApi.items
      : [];

    const order = [];
    const byAsset = new Map();
    vehicles.forEach((vehicle) => {
      const iconUrl = resolveVehicleBrandGlyphUrl(vehicle);
      if (!iconUrl || iconUrl.includes('logo_TK168')) return;
      const base = brandLogoAssetKeyFromUrl(iconUrl);
      const mapKey = base || String(iconUrl).trim();
      if (!mapKey || byAsset.has(mapKey)) return;
      const canonicalKey = resolveCanonicalBrandKey(vehicle.brandKey) || '';
      byAsset.set(mapKey, {
        iconUrl,
        brandKey: vehicle.brandKey,
        canonicalKey,
        base
      });
      order.push(mapKey);
    });

    if (!byAsset.size) {
      return catalogItems.map((item) => withMakerCountryNavFields(catalogNavItemFromLogoRow(item)));
    }

    const result = [];
    const used = new Set();

    catalogItems.forEach((item) => {
      const assetKey = brandLogoAssetKeyFromFile(item.file);
      if (!byAsset.has(assetKey)) return;
      const info = byAsset.get(assetKey);
      result.push(withMakerCountryNavFields(withLogoAssetLabels({
        key: info.canonicalKey || item.key,
        assetKey,
        iconUrl: info.iconUrl,
        file: item.file,
        labelZh: item.labelZh,
        labelJa: item.labelJa,
        labelEn: item.labelEn
      }, assetKey)));
      used.add(assetKey);
    });

    order.forEach((mapKey) => {
      if (used.has(mapKey)) return;
      const info = byAsset.get(mapKey);
      const assetKey = info.base || mapKey;
      const catalogBrand = getBrandByKey(info.canonicalKey || info.brandKey);
      const key = info.canonicalKey
        || catalogBrand?.key
        || resolveCanonicalBrandKey(info.brandKey)
        || assetKey;
      const fallbackLabel = assetKey
        ? assetKey.replace(/(^|[-_])([a-z])/g, (_, sep, c) => (sep ? ' ' : '') + c.toUpperCase())
        : key;
      result.push(withMakerCountryNavFields(withLogoAssetLabels({
        key,
        assetKey,
        iconUrl: info.iconUrl,
        file: catalogBrand?.file || `${assetKey}.svg`,
        labelZh: catalogBrand?.labelZh || fallbackLabel,
        labelJa: catalogBrand?.labelJa || fallbackLabel,
        labelEn: catalogBrand?.labelEn || fallbackLabel
      }, assetKey)));
      used.add(mapKey);
    });

    return result;
  }

  function getBrandAccentColor(key) {
    const canonicalKey = resolveCanonicalBrandKey(key) || String(key || '').trim().toLowerCase();
    return brandAccentMap[canonicalKey] || '#171717';
  }

  function getBrandAccentFilter(key) {
    const canonicalKey = resolveCanonicalBrandKey(key) || String(key || '').trim().toLowerCase();
    return brandAccentFilterMap[canonicalKey] || '';
  }

  function getVehicleById(id) {
    return vehicles.find((vehicle) => vehicle.id === id) || null;
  }

  /** Single-row merge for forms when `vehicles` list has not yet refreshed from API (same rules as buildMergedVehicleListFromHydrate). */
  function buildInventoryVehicleFromApiRow(apiV) {
    if (!apiV || !apiV.id) return null;
    let vehicle = { ...apiV };
    const canonicalBrandKey = resolveCanonicalBrandKey(vehicle.brandKey);
    vehicle = canonicalBrandKey ? { ...vehicle, brandKey: canonicalBrandKey } : { ...vehicle };
    return normalizeVehicleEngineFields(vehicle);
  }

  /** Resolve inventory vehicle by id for detail/stock-confirm/inquiry even before `vehicles` array picks up async hydrate. */
  function getInventoryVehicleById(id) {
    const clean = String(id || '').trim();
    if (!clean) return null;
    const listed = getVehicleById(clean);
    if (listed) return listed;
    const apiList = window.TK168_API_VEHICLES;
    if (!Array.isArray(apiList)) return null;
    const apiV = apiList.find((v) => v && v.id === clean);
    if (!apiV) return null;
    return buildInventoryVehicleFromApiRow(apiV);
  }

  function getVehiclesByBrand(brandKey) {
    const canonicalKey = resolveCanonicalBrandKey(brandKey) || String(brandKey || '').trim().toLowerCase();
    return vehicles.filter((vehicle) => vehicle.brandKey === canonicalKey);
  }

  function getVehicleTotalPrice(vehicle) {
    return vehicle?.totalPrice || vehicle?.price || '';
  }

  function getVehicleBasePrice(vehicle) {
    return getVehicleTotalPrice(vehicle);
  }


  // Rentals live in a separate API-backed inventory (window.TK168_API_RENTALS populated by js/api-hydrate.js).
  function getApiRentals() {
    const list = window.TK168_API_RENTALS;
    return Array.isArray(list) ? list : null;
  }

  function getApiRentalById(id) {
    const list = getApiRentals();
    if (!list || !id) return null;
    return list.find((r) => r && r.id === id) || null;
  }

  /** レンタル専用テーブル由来の1台を、詳細HTMLが期待する車両形に整形（在庫車 getVehicleById とは分離） */
  function getRentalVehicleDetailById(id) {
    const r = getApiRentalById(String(id || '').trim());
    return r ? buildRentalVehicleRecord(r) : null;
  }

  /**
   * 租赁详情页首屏解析用：优先 API 租赁表；在库车兜底仅当该 id 已在租赁 API 中标记可租时生效。
   */
  function resolveRentalDetailPageVehicle(id) {
    const clean = String(id || '').trim();
    if (!clean) return null;
    const fromRental = getRentalVehicleDetailById(clean);
    if (fromRental) return fromRental;
    const base = getInventoryVehicleById(clean);
    if (!base) return null;
    const profile = getVehicleRentalProfile(clean);
    if (!profile.rentable) return null;
    return {
      ...base,
      rentalStatus: normalizeRentalFleetStatus(profile.rentalStatus),
      minDays: profile.minDays,
    };
  }

  /** 単体取得の生データを `TK168_API_RENTALS` に突き合わせたうえで詳細用レコードを返す */
  function mergeApiRentalWithBase(flat) {
    if (!flat || !flat.id) return null;
    const list = getApiRentals();
    if (list) {
      const next = list.map((r) => {
        if (!r || r.id !== flat.id) return r;
        return { ...r, ...flat };
      });
      if (!next.some((r) => r && r.id === flat.id)) {
        next.push(flat);
      }
      window.TK168_API_RENTALS = next;
    } else {
      window.TK168_API_RENTALS = [flat];
    }
    return getRentalVehicleDetailById(flat.id);
  }

  function getVehicleRentalProfile(vehicleOrId) {
    const vehicleId = typeof vehicleOrId === 'string' ? vehicleOrId : vehicleOrId?.id;
    if (!vehicleId) {
      return {
        rentable: false,
        rentalStatus: 'unavailable',
        dailyRate: 0,
        deposit: 0,
        minDays: 1
      };
    }

    const apiRental = getApiRentalById(vehicleId);
    if (apiRental) {
      return {
        rentable: true,
        rentalStatus: apiRental.rentalStatus || 'available',
        dailyRate: Number(apiRental.dailyRate) || 0,
        deposit: Number(apiRental.deposit) || 0,
        minDays: Number(apiRental.minDays) || 1
      };
    }

    return {
      rentable: false,
      rentalStatus: 'unavailable',
      dailyRate: 0,
      deposit: 0,
      minDays: 1
    };
  }

  function isVehicleRentable(vehicle) {
    const profile = getVehicleRentalProfile(vehicle);
    const status = String(profile.rentalStatus || 'available').trim().toLowerCase();
    return profile.rentable && status === 'available';
  }

  /** 后台租赁档期状态 → 前台排序与标签用标准 slug */
  function normalizeRentalFleetStatus(status) {
    const s = String(status || 'available').trim().toLowerCase();
    if (s === 'available' || s === 'reserved' || s === 'rented' || s === 'unavailable') return s;
    return 'unavailable';
  }

  /** 可租 → 已预订 → 出租中 → 不可租，同状态按 id 稳定排序 */
  function sortRentalFleetRecordsByStatus(records) {
    const rank = { available: 0, reserved: 1, rented: 2, unavailable: 3 };
    return records.slice().sort((a, b) => {
      const da = rank[normalizeRentalFleetStatus(a.rentalStatus)] ?? 99;
      const db = rank[normalizeRentalFleetStatus(b.rentalStatus)] ?? 99;
      if (da !== db) return da - db;
      return String(a.id || '').localeCompare(String(b.id || ''));
    });
  }

  // When the API has rentals, build the rental fleet directly from that
  // list so the rental page shows exactly what the admin manages under
  // the レンタル板块 — independent from the on-sale `vehicles` inventory.
  // Each rental is adapted into the shape vehicle cards expect.
  function pickForcedInductionTextFromRecord(v) {
    if (!v || typeof v !== 'object') return '';
    const parts = [
      v.forcedInductionText,
      v.forced_induction_text,
      v.forcedInductionZh,
      v.forced_induction_zh,
      v.forcedInductionJa,
      v.forced_induction_ja,
      v.forcedInductionEn,
      v.forced_induction_en
    ];
    for (const p of parts) {
      if (p == null) continue;
      const s = String(p).trim();
      if (s !== '') return s;
    }
    return '';
  }

  function buildRentalVehicleRecord(rental) {
    const rawBrand = rental.brandKey || '';
    const brandKey = resolveCanonicalBrandKey(rawBrand) || rawBrand;
    const mergedEngine = normalizeVehicleEngineFields({
      displacement: rental.displacement,
      cylinders: rental.cylinders,
      engine: rental.engine,
    });
    const fallback = {
      id: rental.id,
      brandKey,
      name: rental.name || rental.id,
      nameJa: rental.nameJa,
      nameEn: rental.nameEn,
      grade: rental.grade || '',
      year: rental.year || '',
      type: rental.type || '',
      icon: rental.icon && String(rental.icon).trim() ? String(rental.icon).trim() : '',
      mileage: rental.mileage || '',
      mileageUnit: rental.mileageUnit || '',
      displacement: mergedEngine.displacement,
      cylinders: mergedEngine.cylinders,
      engine: formatVehicleEngineLine(mergedEngine),
      forcedInductionText: pickForcedInductionTextFromRecord(rental),
      forcedInductionUnit: String(rental.forcedInductionUnit ?? rental.forced_induction_unit ?? '').trim(),
      forcedInductionZh: rental.forcedInductionZh ?? rental.forced_induction_zh,
      forcedInductionJa: rental.forcedInductionJa ?? rental.forced_induction_ja,
      forcedInductionEn: rental.forcedInductionEn ?? rental.forced_induction_en,
      fuel: rental.fuel || '',
      fuelOilType: rental.fuelOilType || '',
      trans: rental.trans || '',
      bodyStyle: rental.bodyStyle || '',
      drive: rental.drive || '',
      bodyColor: rental.bodyColor || '',
      interiorColor: rental.interiorColor || '',
      seats: rental.seats || '',
      totalPrice: '',
      basePrice: '',
      overview: rental.overview || rental.overviewZh || [],
      overviewZh: rental.overviewZh || [],
      overviewJa: rental.overviewJa || [],
      overviewEn: rental.overviewEn || null,
      benefits: rental.benefits || defaultBenefits,
      features: rental.features || defaultFeatures,
      photo: rental.photo || '',
      gallery: Array.isArray(rental.gallery) ? rental.gallery : [],
      staffMessage: rental.staffMessage,
      staffPhone: rental.staffPhone,
      staffPhoto: rental.staffPhoto,
      rentalStatus: normalizeRentalFleetStatus(rental.rentalStatus),
      minDays: Number(rental.minDays) > 0 ? Number(rental.minDays) : 1,
    };
    return fallback;
  }

  function getRentableVehicles() {
    const apiRentals = getApiRentals();
    if (!apiRentals || !apiRentals.length) return [];
    return sortRentalFleetRecordsByStatus(apiRentals.map(buildRentalVehicleRecord));
  }

  /** 前台标价：中日英统一「X万 JPY」（日本円÷1万）。用于买卖车源与租赁保証金。 */
  function getDisplayPrice(value, language = getCurrentLanguage()) {
    const amount = parseCurrency(value);
    if (!amount) return '';
    const wan = amount / 10000;
    let s = wan.toFixed(4).replace(/\.?0+$/, '');
    return `${s}万 JPY`;
  }

  /** 租赁「1日料金」：整数日元千分位，不用「万」；日文「円」、中文「日元」、英文「JPY」。保証金仍用 getRentalManJpyDisplayPrice（万 JPY）。 */
  function getRentalDailyDisplayPrice(value, language = getCurrentLanguage()) {
    const amount = parseCurrency(value);
    if (!amount) return '';
    if (language === 'en') {
      return `JPY ${amount.toLocaleString('en-US', { useGrouping: true, maximumFractionDigits: 0 })}`;
    }
    if (language === 'ja') {
      return `${amount.toLocaleString('ja-JP')}円`;
    }
    if (language === 'zh') {
      return `${amount.toLocaleString('zh-CN')}日元`;
    }
    return `${amount.toLocaleString('ja-JP')}円`;
  }

  /** 租赁保証金等：与买卖车源同一「X万 JPY」口径。 */
  function getRentalManJpyDisplayPrice(value) {
    return getDisplayPrice(value);
  }

  function getVehicleTotalPriceDisplay(vehicle, language = getCurrentLanguage()) {
    return getDisplayPrice(getVehicleTotalPrice(vehicle), language);
  }

  function getVehicleBasePriceDisplay(vehicle, language = getCurrentLanguage()) {
    return getDisplayPrice(getVehicleBasePrice(vehicle), language);
  }

  function getSearchFilterOptions(filterKey) {
    const language = getCurrentLanguage();
    if (filterKey === 'brand') {
      return brands.map((brand) => ({
        value: brand.key,
        label: getBrandLabel(brand, language)
      }));
    }

    if (filterKey === 'bodyStyle') {
      return standardBodyStyleValues.map((zh) => ({
        value: zh,
        label: getBodyStyleFieldLabel(zh, language)
      }));
    }

    if (filterKey === 'price') {
      return priceOptions.map(({ value, label, labelJa, labelEn }) => ({
        value,
        label: language === 'en'
          ? (labelEn || labelJa || label)
          : (language === 'ja' ? (labelJa || labelEn || label) : (label || labelJa || labelEn))
      }));
    }
    if (filterKey === 'year') {
      return yearOptions.map(({ value, label, labelJa, labelEn }) => ({
        value,
        label: language === 'en'
          ? (labelEn || labelJa || label)
          : (language === 'ja' ? (labelJa || labelEn || label) : (label || labelJa || labelEn))
      }));
    }
    if (filterKey === 'mileage') {
      return mileageOptions.map(({ value, label, labelJa, labelEn }) => ({
        value,
        label: language === 'en'
          ? (labelEn || labelJa || label)
          : (language === 'ja' ? (labelJa || labelEn || label) : (label || labelJa || labelEn))
      }));
    }
    return [];
  }

  function getSearchFilterLabel(filterKey, value) {
    const defaults = {
      brand: window.TK168I18N?.t('search.brand') || '按品牌',
      bodyStyle: window.TK168I18N?.t('search.bodyStyle') || '车身类型',
      price: window.TK168I18N?.t('search.price') || '总额预算',
      year: window.TK168I18N?.t('search.year') || '上牌年份',
      mileage: window.TK168I18N?.t('search.mileage') || '行驶里程'
    };

    if (!value) return defaults[filterKey] || '';
    if (filterKey === 'brand') {
      const b = getBrandByKey(value);
      if (b) return getBrandLabel(b, getCurrentLanguage());
    }
    if (filterKey === 'bodyStyle' && value) {
      return getBodyStyleFieldLabel(value, getCurrentLanguage());
    }
    const option = getSearchFilterOptions(filterKey).find((item) => item.value === value);
    return option ? option.label : defaults[filterKey];
  }

  function parseInventoryFilters(search = '') {
    const params = new URLSearchParams(search);
    const filters = {
      brand: params.get('brand') || '',
      bodyStyle: params.get('bodyStyle') || '',
      price: params.get('price') || '',
      year: params.get('year') || '',
      mileage: params.get('mileage') || '',
      keyword: (params.get('keyword') || '').trim(),
      /** レンタル在庫の詳細: 在庫車 id と衝突させない */
      from: params.get('from') === 'rental' ? 'rental' : ''
    };

    if (filters.brand && !getBrandByKey(filters.brand)) filters.brand = '';
    if (filters.bodyStyle && !standardBodyStyleValues.includes(filters.bodyStyle)) filters.bodyStyle = '';
    if (filters.price && !priceOptions.some((item) => item.value === filters.price)) filters.price = '';
    if (filters.year && !yearOptions.some((item) => item.value === filters.year)) filters.year = '';
    if (filters.mileage && !mileageOptions.some((item) => item.value === filters.mileage)) filters.mileage = '';

    return filters;
  }

  /**
   * @param {object} [opts]
   * @param {boolean} [opts.homeOnly] 为 true 时仅保留「首页显示」车辆（showOnHome !== false），用于 index.html；品牌页不传此项。
   */
  function filterVehicles(list, filters = {}, opts = {}) {
    const homeOnly = Boolean(opts && opts.homeOnly);
    const pool = homeOnly ? list.filter((vehicle) => vehicle.showOnHome !== false) : list;
    const keyword = String(filters.keyword || '').trim().toLowerCase();
    const priceOption = priceOptions.find((item) => item.value === filters.price);
    const yearOption = yearOptions.find((item) => item.value === filters.year);
    const mileageOption = mileageOptions.find((item) => item.value === filters.mileage);

    return pool.filter((vehicle) => {
      if (filters.brand && vehicle.brandKey !== filters.brand) return false;
      if (filters.bodyStyle && String(vehicle.bodyStyle || '').trim() !== filters.bodyStyle) return false;
      if (priceOption) {
        const amount = parseCurrency(getVehicleTotalPrice(vehicle));
        if (!priceOption.match(amount)) return false;
      }
      if (yearOption && !yearOption.match(parseYear(vehicle.year))) return false;
      if (mileageOption && !mileageOption.match(parseVehicleMileageKm(vehicle))) return false;

      if (keyword) {
        const brand = getBrandByKey(vehicle.brandKey);
        const haystack = [
          vehicle.name,
          getVehicleName(vehicle, 'ja'),
          brand?.labelZh,
          brand?.labelJa,
          brand?.labelEn,
          vehicle.engine,
          formatVehicleEngineLine(vehicle),
          vehicle.displacement,
          vehicle.cylinders,
          vehicle.forcedInductionText,
          vehicle.forcedInductionZh,
          vehicle.forcedInductionJa,
          vehicle.forcedInductionEn,
          vehicle.forcedInductionUnit,
          vehicle.fuel,
          getVehicleFieldLabel('fuel', vehicle.fuel, 'ja'),
          getVehicleFieldLabel('fuelOilType', vehicle.fuelOilType, 'ja'),
          vehicle.trans,
          getVehicleFieldLabel('trans', vehicle.trans, 'ja'),
          vehicle.bodyStyle,
          getVehicleFieldLabel('bodyStyle', vehicle.bodyStyle, 'ja'),
          getVehicleFieldLabel('bodyStyle', vehicle.bodyStyle, 'en'),
          vehicle.bodyColor,
          getVehicleFieldLabel('bodyColor', vehicle.bodyColor, 'ja'),
          vehicle.interiorColor,
          getVehicleFieldLabel('interiorColor', vehicle.interiorColor, 'ja')
        ].join(' ').toLowerCase();

        const tokens = keyword.split(/\s+/).filter(Boolean);
        const toks = tokens.length ? tokens : [keyword];
        if (!toks.every((t) => haystack.includes(t))) return false;
      }

      return true;
    });
  }

  function serializeInventoryFilters(filters = {}) {
    const params = new URLSearchParams();
    const normalized = {
      brand: filters.brand || '',
      bodyStyle: filters.bodyStyle || '',
      price: filters.price || '',
      year: filters.year || '',
      mileage: filters.mileage || '',
      keyword: String(filters.keyword || '').trim()
    };

    Object.entries(normalized).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    return params.toString();
  }

  function buildInventoryUrl(filters = {}) {
    const query = serializeInventoryFilters(filters);
    return `brand.html${query ? `?${query}` : ''}`;
  }

  function countActiveFilters(filters = {}) {
    return ['brand', 'bodyStyle', 'price', 'year', 'mileage', 'keyword']
      .filter((key) => String(filters[key] || '').trim() !== '')
      .length;
  }

  function buildFilterSummary(filters = {}) {
    const parts = [];
    const brand = filters.brand ? getBrandByKey(filters.brand) : null;

    if (brand) parts.push(getBrandLabel(brand));
    if (filters.bodyStyle) parts.push(getBodyStyleFieldLabel(filters.bodyStyle));
    if (filters.price) parts.push(getSearchFilterLabel('price', filters.price));
    if (filters.year) parts.push(getSearchFilterLabel('year', filters.year));
    if (filters.mileage) parts.push(getSearchFilterLabel('mileage', filters.mileage));
    if (filters.keyword) {
      const keyword = String(filters.keyword).trim();
      parts.push(window.TK168I18N?.t('inventory.keywordSummary', { keyword }) || `关键词“${keyword}”`);
    }

    return parts.join(' · ');
  }

  function buildBrandUrl(brandKey) {
    const resolved = resolveCanonicalBrandKey(brandKey);
    const brand = resolved || String(brandKey || '').trim();
    return buildInventoryUrl({ brand });
  }

  /**
   * Vercel 等线上环境启用 cleanUrls（/detail → detail.html）；Live Server / 局域网静态服不支持。
   */
  function siteUsesCleanHtmlUrls() {
    if (typeof window === 'undefined') return false;
    const host = String(window.location.hostname || '').toLowerCase();
    if (!host || host === 'localhost' || host === '127.0.0.1' || host === '[::1]') return false;
    if (/^192\.168\./.test(host) || /^10\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host)) {
      return false;
    }
    return true;
  }

  /**
   * 在 clean URL 环境下（路径为 /home、/detail 等无 .html 后缀），若仍链到
   * `detail.html?id=…`，部分服务器会 301 到 `/detail` 并丢掉查询串，详情页读不到 id。
   * 此时改为生成同目录下的 `/detail?…`（或子路径前缀 + /detail）。
   */
  function resolveDetailHref(queryString) {
    if (typeof window === 'undefined' || !/^https?:$/i.test(String(window.location.protocol || ''))) {
      return `detail.html?${queryString}`;
    }
    if (!siteUsesCleanHtmlUrls()) {
      return `detail.html?${queryString}`;
    }
    const path = window.location.pathname || '/';
    const segments = path.split('/').filter(Boolean);
    const leaf = segments.length ? segments[segments.length - 1] : '';
    if (leaf.includes('.')) {
      return `detail.html?${queryString}`;
    }
    const lastSlash = path.lastIndexOf('/');
    const dir = lastSlash > 0 ? path.slice(0, lastSlash) : '';
    return `${dir}/detail?${queryString}`.replace(/\/{2,}/g, '/');
  }

  function buildDetailUrl(vehicleId, filters = {}) {
    const params = new URLSearchParams();
    params.set('id', vehicleId);

    const normalized = {
      brand: filters.brand || '',
      bodyStyle: filters.bodyStyle || '',
      price: filters.price || '',
      year: filters.year || '',
      mileage: filters.mileage || '',
      keyword: String(filters.keyword || '').trim(),
      from: filters.from === 'rental' ? 'rental' : ''
    };

    Object.entries(normalized).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    return resolveDetailHref(params.toString());
  }

  function mergeApiVehicleWithBase(apiFlat) {
    if (!apiFlat || !apiFlat.id) return null;
    const base = getVehicleById(apiFlat.id);
    const merged = base ? { ...base, ...pickDefined(apiFlat) } : { ...apiFlat };
    return normalizeVehicleEngineFields(merged);
  }

  return {
    site,
    brands,
    vehicles,
    news,
    defaultBenefits,
    defaultFeatures,
    getBrandByKey,
    getBrandAccentColor,
    getBrandAccentFilter,
    getVehicleById,
    getInventoryVehicleById,
    getVehiclesByBrand,
    getBrandLabel,
    getVehicleBrandTitle,
    getVehicleModelDisplayName,
    getVehicleModelName,
    getVehicleName,
    resolveVehicleMediaSource,
    resolveVehicleBrandGlyphUrl,
    getBrandMakerCountry,
    getBrandLogoHomeCopy,
    getInventoryBrandGlyphNavItems,
    getVehicleTypeLabel,
    getVehicleFieldLabel,
    getVehicleOverview,
    getVehicleBenefits,
    getVehicleFeatures,
    getVehicleConditionField,
    getVehicleListingField,
    getVehicleHighlightField,
    formatRegistrationYear,
    getVehicleTotalPrice,
    getVehicleBasePrice,
    getVehicleTotalPriceDisplay,
    getVehicleBasePriceDisplay,
    getVehicleRentalProfile,
    isVehicleRentable,
    normalizeRentalFleetStatus,
    getRentableVehicles,
    getDisplayPrice,
    getRentalDailyDisplayPrice,
    getRentalManJpyDisplayPrice,
    getNewsItems,
    getNewsDetailRecord,
    getJournalDetailPageUrl,
    getSearchFilterOptions,
    getSearchFilterLabel,
    parseInventoryFilters,
    filterVehicles,
    serializeInventoryFilters,
    buildInventoryUrl,
    countActiveFilters,
    buildFilterSummary,
    buildBrandUrl,
    buildDetailUrl,
    mergeApiVehicleWithBase,
    parseMileage,
    parseVehicleMileageKm,
    formatVehicleMileageDisplay,
    getRentalVehicleDetailById,
    resolveRentalDetailPageVehicle,
    mergeApiRentalWithBase,
    refreshVehiclesFromApiHydrate,
    refreshJournalFromApiHydrate,
    formatVehicleEngineLine,
    formatVehicleEngineAndForcedInductionLine
  };
})();
