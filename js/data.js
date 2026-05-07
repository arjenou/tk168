window.TK168_DATA = (() => {
  const site = {
    phone: '+81 09012220168',
    email: 'AUTO@tk168.co.jp',
    address: '339-0035埼玉県さいたま市岩槻区笹久保新田'
  };

  const RMB_TO_JPY_RATE = 20;
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
  const brandLogoMetaByKey = new Map(
    brandLogoInventoryItems.map((item) => [
      item.key,
      {
        labelZh: item.labelZh,
        labelJa: item.labelJa,
        labelEn: item.labelEn,
        file: item.file
      }
    ])
  );
  const brandLibraryApi = window.TK168BrandLibrary || { items: [], getByKey: () => null };
  const brandLibraryItems = Array.isArray(brandLibraryApi.items)
    ? brandLibraryApi.items.filter((item) => activeBrandKeySet.has(item.key))
    : [];

  const brandLibraryExtraMeta = {
    astonmartin: { labelZh: '阿斯顿・马丁', labelJa: 'アストンマーティン', labelEn: 'Aston Martin' },
    audi: { labelZh: '奥迪', labelJa: 'アウディ', labelEn: 'Audi' },
    bentley: { labelZh: '宾利', labelJa: 'ベントレー', labelEn: 'Bentley' },
    bmw: { labelZh: '宝马', labelJa: 'BMW', labelEn: 'BMW' },
    cadillac: { labelZh: '凯迪拉克', labelJa: 'キャデラック', labelEn: 'Cadillac' },
    ferrari: { labelZh: '法拉利', labelJa: 'フェラーリ', labelEn: 'Ferrari' },
    jaguar: { labelZh: '捷豹', labelJa: 'ジャガー', labelEn: 'Jaguar' },
    lamborghini: { labelZh: '兰博基尼', labelJa: 'ランボルギーニ', labelEn: 'Lamborghini' },
    landrover: { labelZh: '路虎', labelJa: 'ランドローバー', labelEn: 'Land Rover' },
    lexus: { labelZh: '雷克萨斯', labelJa: 'レクサス', labelEn: 'Lexus' },
    mclaren: { labelZh: '迈凯伦', labelJa: 'マクラーレン', labelEn: 'McLaren' },
    maserati: { labelZh: '玛莎拉蒂', labelJa: 'マセラティ', labelEn: 'Maserati' },
    mercedes: { labelZh: '奔驰', labelJa: 'メルセデス・ベンツ', labelEn: 'Mercedes-Benz' },
    porsche: { labelZh: '保时捷', labelJa: 'ポルシェ', labelEn: 'Porsche' },
    'rolls-royce': { labelZh: '劳斯莱斯', labelJa: 'ロールス・ロイス', labelEn: 'Rolls-Royce' }
  };

  const coreBrands = [
    { key: 'rolls-royce', labelZh: '劳斯莱斯', labelJa: 'ロールス・ロイス', labelEn: 'Rolls-Royce', file: 'rollsroyce.svg', heroImage: 'assets/images/f2.webp' },
    { key: 'bentley', labelZh: '宾利', labelJa: 'ベントレー', labelEn: 'Bentley', file: 'bentley.svg', heroImage: 'assets/images/f7.webp' },
    { key: 'mercedes', labelZh: '奔驰', labelJa: 'メルセデス・ベンツ', labelEn: 'Mercedes-Benz', file: 'mercedes.svg', heroImage: 'assets/images/f4.webp' },
    { key: 'bmw', labelZh: '宝马', labelJa: 'BMW', labelEn: 'BMW', file: 'bmw.svg', heroImage: 'assets/images/f4.webp' },
    { key: 'porsche', labelZh: '保时捷', labelJa: 'ポルシェ', labelEn: 'Porsche', file: 'porsche.svg', heroImage: 'assets/images/f2.webp' },
    { key: 'ferrari', labelZh: '法拉利', labelJa: 'フェラーリ', labelEn: 'Ferrari', file: 'ferrari.svg', heroImage: 'assets/images/f3.webp' },
    { key: 'lamborghini', labelZh: '兰博基尼', labelJa: 'ランボルギーニ', labelEn: 'Lamborghini', file: 'lamborghini.svg', heroImage: 'assets/images/f2.webp' },
    { key: 'audi', labelZh: '奥迪', labelJa: 'アウディ', labelEn: 'Audi', file: 'audi.svg', heroImage: 'assets/images/f7.webp' },
    { key: 'lexus', labelZh: '雷克萨斯', labelJa: 'レクサス', labelEn: 'Lexus', file: 'lexus.svg', heroImage: 'assets/images/f3.webp' },
    { key: 'landrover', labelZh: '路虎', labelJa: 'ランドローバー', labelEn: 'Land Rover', file: 'landrover.svg', heroImage: 'assets/images/f7.webp' },
    { key: 'maserati', labelZh: '玛莎拉蒂', labelJa: 'マセラティ', labelEn: 'Maserati', file: 'maserati.svg', heroImage: 'assets/images/f4.webp' },
    { key: 'astonmartin', labelZh: '阿斯顿・马丁', labelJa: 'アストンマーティン', labelEn: 'Aston Martin', file: 'astonmartin.svg', heroImage: 'assets/images/f2.webp' },
    { key: 'mclaren', labelZh: '迈凯伦', labelJa: 'マクラーレン', labelEn: 'McLaren', file: 'mclaren.svg', heroImage: 'assets/images/f3.webp' },
    { key: 'jaguar', labelZh: '捷豹', labelJa: 'ジャガー', labelEn: 'Jaguar', file: 'jaguar.svg', heroImage: 'assets/images/f3.webp' },
    { key: 'cadillac', labelZh: '凯迪拉克', labelJa: 'キャデラック', labelEn: 'Cadillac', file: 'cadillac.svg', heroImage: 'assets/images/f4.webp' }
  ];

  function mergeBrandCatalog(sourceBrands, libraryItems) {
    const merged = sourceBrands.map((brand) => ({ ...brand }));
    const seen = new Set(merged.map((brand) => brand.key));

    libraryItems.forEach((item) => {
      if (!item?.key || seen.has(item.key) || !activeBrandKeySet.has(item.key)) return;
      const meta = brandLogoMetaByKey.get(item.key) || brandLibraryExtraMeta[item.key];
      if (!meta) return;

      merged.push({
        key: item.key,
        labelZh: meta.labelZh,
        labelJa: meta.labelJa,
        labelEn: meta.labelEn,
        file: meta.file || `${item.folder || item.key}.svg`,
        heroImage: item.models?.[0]?.image || 'assets/images/f2.webp'
      });
      seen.add(item.key);
    });

    return merged;
  }

  const brands = mergeBrandCatalog(coreBrands, brandLibraryItems)
    .filter((brand) => activeBrandKeySet.has(brand.key));

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

  const libraryVehicleOrigins = {
    astonmartin: '英国进口',
    audi: '德国进口',
    bentley: '英国进口',
    bmw: '德国进口',
    cadillac: '美国进口',
    ferrari: '意大利进口',
    jaguar: '英国进口',
    lamborghini: '意大利进口',
    landrover: '英国进口',
    lexus: '日本进口',
    maserati: '意大利进口',
    mclaren: '英国进口',
    mercedes: '德国进口',
    porsche: '德国进口',
    'rolls-royce': '英国进口'
  };

  const libraryVehicleCatalogPresets = {
    exotic: {
      typeOptions: ['中置跑车', 'GT跑车', 'V12超跑'],
      bodyStyleOptions: ['跑车', '超跑', '敞篷车'],
      displacementOptions: ['3.9L', '5.2L', '6.5L'],
      cylinderOptions: ['V8', 'V10', 'V12'],
      fuelOptions: ['汽油', 'HEV（混动）'],
      driveOptions: ['RWD', 'AWD'],
      seats: '2 座',
      totalBase: 1680000,
      totalStep: 320000,
      mileageBase: 1800,
      mileageStep: 2600
    },
    gt: {
      typeOptions: ['GT跑车', '双门轿跑'],
      bodyStyleOptions: ['跑车', '双门轿跑', '敞篷车'],
      displacementOptions: ['3.0L', '4.0L', '5.2L'],
      cylinderOptions: ['V6', 'V8', 'V10'],
      fuelOptions: ['汽油', 'HEV（混动）'],
      driveOptions: ['RWD', 'AWD'],
      seats: '2 座',
      totalBase: 920000,
      totalStep: 210000,
      mileageBase: 4200,
      mileageStep: 3400
    },
    suv: {
      typeOptions: ['豪华SUV', '高性能SUV', '越野SUV', '轿跑SUV'],
      bodyStyleOptions: ['SUV', '越野车'],
      displacementOptions: ['2.0L Turbo', '3.0L', '3.5L', '4.0L'],
      cylinderOptions: ['L4', 'V6', 'V6', 'V8'],
      fuelOptions: ['汽油', 'HEV（混动）', 'PHEV（插电混动）'],
      driveOptions: ['AWD'],
      seats: '5 座',
      totalBase: 480000,
      totalStep: 140000,
      mileageBase: 6200,
      mileageStep: 4200
    },
    sedan: {
      typeOptions: ['行政轿车', '豪华轿车', '高性能轿车'],
      bodyStyleOptions: ['轿车'],
      displacementOptions: ['2.0L Turbo', '2.5L Hybrid', '3.0L'],
      cylinderOptions: ['L4', 'L4', 'V6'],
      fuelOptions: ['汽油', 'HEV（混动）', 'PHEV（插电混动）'],
      driveOptions: ['RWD', 'AWD'],
      seats: '5 座',
      totalBase: 280000,
      totalStep: 110000,
      mileageBase: 7800,
      mileageStep: 4600
    }
  };

  const libraryVehicleColors = ['珍珠白', '黑色', '银色', '灰色', '蓝色', '酒红色', '黄色', '绿色', '米色', '紫色'];
  const libraryVehicleInteriors = ['黑色', '棕色', '米色', '灰色', '红色', '白色', '蓝色'];
  const libraryVehicleIcons = ['b1.svg', 'b2.svg', 'b3.svg', 'b4.svg', 'b5.svg', 'b6.svg'];

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

  function pickCatalogValue(pool, seed) {
    if (!Array.isArray(pool) || pool.length === 0) return '';
    return pool[Math.abs(seed) % pool.length];
  }

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

  function formatCatalogPrice(amount) {
    return `¥ ${Number(amount || 0).toLocaleString('ja-JP', { useGrouping: true })}`;
  }

  function resolveLibraryVehicleCategory(brandKey, modelSlug, modelName) {
    const token = `${brandKey} ${modelSlug} ${modelName}`.toLowerCase();

    if (/urus|dbx|bentayga|escalade|xt5|defender|discovery|range-rover|q5|x5|gle|f-pace|levante|macan|cayenne|nx|rx/.test(token)) {
      return 'suv';
    }
    if (/911|488|f8-tributo|huracan|aventador|570s|720s|artura/.test(token)) {
      return 'exotic';
    }
    if (/roma|f-type|db11|vantage|continental-gt|granturismo|ghost|phantom|flying-spur/.test(token)) {
      return 'gt';
    }
    return 'sedan';
  }

  function buildLibraryVehicleOverview(brand, model, type) {
    return {
      zh: [
        `${brand.labelZh} ${model.name} 是门店在品牌咨询里很常被问到的一台，先用这组照片帮助判断车身比例、姿态和 ${type} 的整体气质是否符合预期。`,
        '如果准备继续确认预算、上牌年份、到店节奏或交付方式，顾问会再根据实际车辆状态补充更细的说明。'
      ],
      ja: [
        `${brand.labelJa} ${model.name} はブランド相談でよく比較対象になる一台で、このフォトカードではまずボディバランスと ${type} の雰囲気を把握しやすくしています。`,
        'ご予算や年式、入庫予定、納車段取りまで確認したい場合は、担当スタッフが実車状況に合わせて続けてご案内します。'
      ]
    };
  }

  function createLibraryVehicleRecord(brand, model, index) {
    const category = resolveLibraryVehicleCategory(brand.key, model.slug, model.name);
    const preset = libraryVehicleCatalogPresets[category] || libraryVehicleCatalogPresets.sedan;
    const seed = `${brand.key}-${model.slug}-${index}`.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const totalAmount = preset.totalBase + ((seed % 5) * preset.totalStep);
    const baseAmount = Math.max(100000, totalAmount - (28000 + ((seed % 4) * 6000)));
    const year = 2019 + (seed % 7);
    const mileageKm = preset.mileageBase + ((seed % 6) * preset.mileageStep);
    const type = pickCatalogValue(preset.typeOptions, seed);
    const bodyStyle = pickCatalogValue(preset.bodyStyleOptions, seed + 1) || type;
    const overview = buildLibraryVehicleOverview(brand, model, type);

    return {
      id: `${brand.key}-${model.slug}-catalog`,
      brandKey: brand.key,
      name: `${brand.labelZh} ${model.name}`,
      year: String(year),
      type,
      icon: pickCatalogValue(libraryVehicleIcons, seed),
      photo: model.image,
      gallery: [model.image, model.image, model.image, model.image],
      mileage: (() => {
        const w = mileageKm / 10000;
        let s = w.toFixed(2).replace(/(\.\d*?[1-9])0+$/g, '$1').replace(/\.$/, '');
        return s || '0';
      })(),
      displacement: pickCatalogValue(preset.displacementOptions, seed + 2),
      cylinders: pickCatalogValue(preset.cylinderOptions, seed + 3),
      fuel: pickCatalogValue(preset.fuelOptions, seed + 4),
      trans: 'AT',
      totalPrice: formatCatalogPrice(totalAmount),
      basePrice: formatCatalogPrice(baseAmount),
      bodyStyle,
      drive: pickCatalogValue(preset.driveOptions, seed + 5),
      bodyColor: pickCatalogValue(libraryVehicleColors, seed + 6),
      interiorColor: pickCatalogValue(libraryVehicleInteriors, seed + 7),
      seats: preset.seats,
      serviceRecord: '完整在册',
      origin: libraryVehicleOrigins[brand.key] || '日本进口',
      overview: overview.zh,
      overviewJa: overview.ja,
      benefits: defaultBenefits,
      features: defaultFeatures
    };
  }

  function appendBrandLibraryVehicles(existingVehicles, libraryItems) {
    const normalizedVehicles = existingVehicles.map((vehicle) => ({
      ...vehicle,
      brandKey: resolveCanonicalBrandKey(vehicle.brandKey) || vehicle.brandKey
    }));
    const existingIds = new Set(normalizedVehicles.map((vehicle) => vehicle.id));

    libraryItems.forEach((item) => {
      const canonicalBrandKey = resolveCanonicalBrandKey(item?.key) || item?.key;
      const brand = brands.find((entry) => entry.key === canonicalBrandKey);
      if (!brand) return;

      item.models.slice(0, 3).forEach((model, index) => {
        const candidateId = `${brand.key}-${model.slug}-catalog`;
        if (existingIds.has(candidateId)) return;
        normalizedVehicles.push(createLibraryVehicleRecord(brand, model, index));
        existingIds.add(candidateId);
      });
    });

    return normalizedVehicles;
  }

  const baseVehicles = [
    {
      id: 'lamborghini-urus',
      brandKey: 'lamborghini',
      name: '兰博基尼 Urus',
      year: '2022',
      type: '高性能SUV',
      icon: 'b1.svg',
      photo: '001.png',
      gallery: ['001.png', '001.png', '001.png', '001.png'],
      mileage: '0.32',
      displacement: '4.0L',
      cylinders: 'V8',
      fuel: '汽油',
      trans: 'AT',
      totalPrice: '¥ 1,980,000',
      basePrice: '¥ 1,860,000',
      bodyStyle: 'SUV',
      drive: 'AWD',
      bodyColor: '曜石黑',
      interiorColor: '黑色真皮',
      seats: '5 座',
      serviceRecord: '完整在册',
      origin: '意大利进口',
      overview: [
        '这台 Lamborghini Urus 保持了完整保养记录与出色的整体状态，在高性能 SUV 的张力之外，也保留了足够从容的日常使用感。',
        '车身姿态、内饰质感与机械完成度都处于很整齐的水准，适合被当作兼顾性能表达与通勤场景的一台主力座驾。'
      ],
      overviewJa: [
        'この Lamborghini Urus は整備履歴が明確で、全体のコンディションも非常に整っています。高性能 SUV らしい緊張感を保ちながら、日常域では落ち着いた扱いやすさも感じられる一台です。',
        'ボディの佇まい、内装の質感、機関系のまとまりまで全体の完成度が高く、パフォーマンス性と日常使いを両立したメインカーとして自然に選べる内容です。'
      ],
      benefits: defaultBenefits,
      features: defaultFeatures
    },
    {
      id: 'audi-r8-spyder',
      brandKey: 'audi',
      name: '奥迪 R8 Spyder',
      year: '2023',
      type: '敞篷跑车',
      icon: 'b2.svg',
      photo: '002.png',
      gallery: ['002.png', '002.png', '002.png', '002.png'],
      mileage: '0.009',
      displacement: '5.2L',
      cylinders: 'V10',
      fuel: '汽油',
      trans: 'AT',
      totalPrice: '¥ 1,600,000',
      basePrice: '¥ 1,490,000',
      bodyStyle: '跑车',
      drive: 'AWD',
      bodyColor: '曜石黑',
      interiorColor: '棕色真皮',
      seats: '2 座',
      serviceRecord: '完整在册',
      origin: '德国进口',
      overview: [
        '这台奥迪 R8 保持了低里程与完整保养记录，低伏车身与中置布局让整车始终带着很鲜明的超跑比例。',
        '无论是漆面状态、机械质感还是敞篷姿态，都呈现出相当完整的完成度，兼具驾驶乐趣与日常使用的稳定感。'
      ],
      overviewJa: [
        'このアウディ R8 Spyder は低走行で整備履歴も明確に保たれており、低く構えたシルエットとミッドシップレイアウトによって、スーパーカーらしいプロポーションが際立っています。',
        'ボディコンディション、機械的な質感、オープントップの見栄えまで総合的な完成度が高く、走る楽しさと日常での扱いやすさをバランスよく備えています。'
      ],
      benefits: defaultBenefits,
      features: defaultFeatures
    },
    {
      id: 'ferrari-458-italia',
      brandKey: 'ferrari',
      name: '法拉利 458 Italia',
      year: '2019',
      type: '中置跑车',
      icon: 'b3.svg',
      photo: '003.png',
      gallery: ['003.png', '003.png', '003.png', '003.png'],
      mileage: '1.52',
      displacement: '4.5L',
      cylinders: 'V8',
      fuel: '汽油',
      trans: 'AT',
      totalPrice: '¥ 1,750,000',
      basePrice: '¥ 1,640,000',
      bodyStyle: '跑车',
      drive: 'RWD',
      bodyColor: '竞技红',
      interiorColor: '黑红拼色真皮',
      seats: '2 座',
      serviceRecord: '完整在册',
      origin: '意大利进口',
      overview: [
        'Ferrari 458 Italia 保留了自然吸气时代极具代表性的声浪与比例，是法拉利车系里辨识度很高的一代作品。',
        '这台车的整体状态干净利落，既有足够鲜明的收藏气质，也保留了很纯粹的驾驶表达。'
      ],
      overviewJa: [
        'Ferrari 458 Italia は自然吸気時代を象徴するサウンドとプロポーションを色濃く残した一台で、フェラーリの中でも特に印象深い世代として知られています。',
        'この個体は全体の状態が非常にすっきりと整っており、コレクション性を感じさせながらも、純粋なドライビングプレジャーをしっかり残しています。'
      ],
      benefits: defaultBenefits,
      features: defaultFeatures
    },
    {
      id: 'bmw-x6-m',
      brandKey: 'bmw',
      name: '宝马 X6 M',
      year: '2024',
      type: '轿跑SUV',
      icon: 'b4.svg',
      photo: '004.png',
      gallery: ['004.png', '004.png', '004.png', '004.png'],
      mileage: '0.012',
      displacement: '4.4L',
      cylinders: 'V8',
      fuel: '汽油',
      trans: 'AT',
      totalPrice: '¥ 750,000',
      basePrice: '¥ 698,000',
      bodyStyle: 'SUV',
      drive: 'AWD',
      bodyColor: '矿石白',
      interiorColor: '黑色真皮',
      seats: '5 座',
      serviceRecord: '完整在册',
      origin: '德国进口',
      overview: [
        'BMW X6 M 将轿跑 SUV 的线条与高性能动力结合得很直接，整车视觉重心低，气场也足够鲜明。',
        '低里程与整齐的车况让它更像一台完成度很高的性能日用车，在通勤与长途场景里都保持着稳定质感。'
      ],
      overviewJa: [
        'BMW X6 M はクーペ SUV ならではの流麗なラインと高出力ユニットを素直に結びつけた一台で、低重心に見えるスタンスが強い存在感を生み出しています。',
        '低走行かつコンディションも整っており、日常使いのしやすさを備えながら、パフォーマンスモデルとしての濃さもしっかり感じられる内容です。'
      ],
      benefits: defaultBenefits,
      features: defaultFeatures
    },
    {
      id: 'ferrari-488-gtb',
      brandKey: 'ferrari',
      name: '法拉利 488 GTB',
      year: '2021',
      type: '中置跑车',
      icon: 'b5.svg',
      photo: '005.png',
      gallery: ['005.png', '005.png', '005.png', '005.png'],
      mileage: '0.87',
      displacement: '3.9L',
      cylinders: 'V8',
      fuel: '汽油',
      trans: 'AT',
      totalPrice: '¥ 2,250,000',
      basePrice: '¥ 2,120,000',
      bodyStyle: '跑车',
      drive: 'RWD',
      bodyColor: '亮银灰',
      interiorColor: '深棕真皮',
      seats: '2 座',
      serviceRecord: '完整在册',
      origin: '意大利进口',
      overview: [
        'Ferrari 488 GTB 有着很成熟的空气动力学比例，车身线条紧凑而克制，是法拉利近代设计语言里很完整的一台作品。',
        '这台车的状态收得很整齐，既保留了性能车应有的锋利感，也维持了足够清爽的日常可驾性。'
      ],
      overviewJa: [
        'Ferrari 488 GTB は空力処理を感じさせる完成度の高いプロポーションを持ち、引き締まったボディラインが現代フェラーリらしい美しさを際立たせています。',
        'この個体は全体のまとまりが良く、スーパーカーらしい鋭さを保ちながらも、日常域で扱いやすいクリアな印象をしっかり残しています。'
      ],
      benefits: defaultBenefits,
      features: defaultFeatures
    },
    {
      id: 'lamborghini-aventador',
      brandKey: 'lamborghini',
      name: '兰博基尼 Aventador',
      year: '2022',
      type: 'V12超跑',
      icon: 'b6.svg',
      photo: '006.png',
      gallery: ['006.png', '006.png', '006.png', '006.png'],
      mileage: '1.25',
      displacement: '6.5L',
      cylinders: 'V12',
      fuel: '汽油',
      trans: 'AT',
      totalPrice: '¥ 4,000,000',
      basePrice: '¥ 3,780,000',
      bodyStyle: '跑车',
      drive: 'AWD',
      bodyColor: '珍珠白',
      interiorColor: '黑色 Alcantara',
      seats: '2 座',
      serviceRecord: '完整在册',
      origin: '意大利进口',
      overview: [
        'Aventador 保留了兰博基尼最具代表性的楔形姿态与 V12 气场，整车的存在感几乎不需要额外修饰。',
        '从比例、声浪到细节完成度，它都更接近一台具有象征意味的旗舰超跑，而不只是单纯的性能机器。'
      ],
      overviewJa: [
        'Aventador はランボルギーニを象徴するウェッジシェイプと V12 の圧倒的な存在感をそのまま体現しており、余計な演出がなくても十分な迫力を放つ一台です。',
        'プロポーション、サウンド、細部の仕上がりに至るまで、単なる高性能車というよりブランドの象徴性を背負ったフラッグシップとしての空気感があります。'
      ],
      benefits: defaultBenefits,
      features: defaultFeatures
    },
    {
      id: 'lamborghini-huracan-evo',
      brandKey: 'lamborghini',
      name: '兰博基尼 Huracan EVO',
      year: '2023',
      type: '中置跑车',
      icon: 'b1.svg',
      photo: '003.png',
      gallery: ['003.png', '003.png', '003.png', '003.png'],
      mileage: '0.08',
      displacement: '5.2L',
      cylinders: 'V10',
      fuel: '汽油',
      trans: 'AT',
      totalPrice: '¥ 2,680,000',
      basePrice: '¥ 2,520,000',
      bodyStyle: '跑车',
      drive: 'AWD',
      bodyColor: '珍珠黄',
      interiorColor: '黑黄拼色',
      seats: '2 座',
      serviceRecord: '完整在册',
      origin: '意大利进口',
      overview: [
        'Huracan EVO 以极低里程保留了很新鲜的状态，车身比例紧凑直接，带着典型的兰博基尼视觉张力。',
        '它的动态表达比外形更轻快，既适合城市环境中的展示感，也保留了周末驾驶时应有的灵活回应。'
      ],
      overviewJa: [
        'Huracan EVO は極低走行らしい新鮮さを保っており、引き締まったボディバランスにはランボルギーニらしい視覚的な緊張感が宿っています。',
        '見た目の強さに対して走りの反応は軽快で、街中での見栄えと週末のドライビングの楽しさをどちらも自然に楽しめる仕上がりです。'
      ],
      benefits: defaultBenefits,
      features: defaultFeatures
    },
    {
      id: 'lamborghini-urus-s',
      brandKey: 'lamborghini',
      name: '兰博基尼 Urus S',
      year: '2024',
      type: '高性能SUV',
      icon: 'b1.svg',
      photo: '004.png',
      gallery: ['004.png', '004.png', '004.png', '004.png'],
      mileage: '0.012',
      displacement: '4.0L',
      cylinders: 'V8',
      fuel: '汽油',
      trans: 'AT',
      totalPrice: '¥ 2,280,000',
      basePrice: '¥ 2,140,000',
      bodyStyle: 'SUV',
      drive: 'AWD',
      bodyColor: '石墨灰',
      interiorColor: '黑橙拼色',
      seats: '5 座',
      serviceRecord: '完整在册',
      origin: '意大利进口',
      overview: [
        'Urus S 在保留实用性的同时，依然维持了很强的品牌辨识度与性能氛围，是一台边界感很少的高性能 SUV。',
        '整车状态新、配置完整，外观与座舱都呈现出相当统一的完成度，适合被放进更高频的日常使用场景里。'
      ],
      overviewJa: [
        'Urus S は高い実用性を持ちながらも、ブランドらしいアイコン性とパフォーマンス感をしっかり残した、懐の深いハイパフォーマンス SUV です。',
        '車両状態は非常に新しく、装備も整っており、エクステリアとインテリアの完成度に統一感があるため、日常の使用頻度が高い環境にも自然に馴染みます。'
      ],
      benefits: defaultBenefits,
      features: defaultFeatures
    },
    {
      id: 'lamborghini-huracan-sto',
      brandKey: 'lamborghini',
      name: '兰博基尼 Huracan STO',
      year: '2022',
      type: '中置跑车',
      icon: 'b1.svg',
      photo: '005.png',
      gallery: ['005.png', '005.png', '005.png', '005.png'],
      mileage: '0.54',
      displacement: '5.2L',
      cylinders: 'V10',
      fuel: '汽油',
      trans: 'AT',
      totalPrice: '¥ 3,150,000',
      basePrice: '¥ 2,960,000',
      bodyStyle: '跑车',
      drive: 'RWD',
      bodyColor: '赛道灰',
      interiorColor: '黑色 Alcantara',
      seats: '2 座',
      serviceRecord: '完整在册',
      origin: '意大利进口',
      overview: [
        'Huracan STO 的设定明显更偏赛道取向，空气动力学细节与车身姿态都带着非常直接的功能性表达。',
        '它保留了更纯粹的操控导向，同时也让整车在静止状态下就有很强的收藏与展示意味。'
      ],
      overviewJa: [
        'Huracan STO は明確にサーキット志向へ振られたモデルで、空力パーツや車体の構えそのものに機能性がストレートに表れています。',
        '操作感はよりピュアで、停まっている状態でもコレクション性と展示映えの強さを感じさせる、非常に個性の立った一台です。'
      ],
      benefits: defaultBenefits,
      features: defaultFeatures
    },
    {
      id: 'lamborghini-gallardo',
      brandKey: 'lamborghini',
      name: '兰博基尼 Gallardo',
      year: '2019',
      type: '中置跑车',
      icon: 'b1.svg',
      photo: '002.png',
      gallery: ['002.png', '002.png', '002.png', '002.png'],
      mileage: '2.8',
      displacement: '5.0L',
      cylinders: 'V10',
      fuel: '汽油',
      trans: 'AT',
      totalPrice: '¥ 1,480,000',
      basePrice: '¥ 1,360,000',
      bodyStyle: '跑车',
      drive: 'AWD',
      bodyColor: '黑曜石',
      interiorColor: '黑色真皮',
      seats: '2 座',
      serviceRecord: '完整在册',
      origin: '意大利进口',
      overview: [
        'Gallardo 保留了兰博基尼早期非常鲜明的车身比例，线条更简洁，也更容易让人联想到品牌过去的设计阶段。',
        '这台车的状态干净稳定，既有经典时期的气质，也带着很明确的品牌历史感。'
      ],
      overviewJa: [
        'Gallardo はランボルギーニ初期の鮮烈なプロポーションを色濃く残し、よりシンプルなラインによってブランドの過去のデザイン文脈を想起させる一台です。',
        'この個体はコンディションが安定しており、クラシックな時代感とブランドの歴史性を素直に味わえる内容にまとまっています。'
      ],
      benefits: defaultBenefits,
      features: defaultFeatures
    },
    {
      id: 'lamborghini-sian-fkp-37',
      brandKey: 'lamborghini',
      name: '兰博基尼 Sian FKP 37',
      year: '2021',
      type: '混动超跑',
      icon: 'b1.svg',
      photo: '001.png',
      gallery: ['001.png', '001.png', '001.png', '001.png'],
      mileage: '0.21',
      displacement: '6.5L',
      cylinders: 'V12',
      fuel: 'HEV（混动）',
      trans: 'AT',
      totalPrice: '¥ 8,800,000',
      basePrice: '¥ 8,320,000',
      bodyStyle: '跑车',
      drive: 'AWD',
      bodyColor: '金属绿',
      interiorColor: '黑金拼色',
      seats: '2 座',
      serviceRecord: '完整在册',
      origin: '意大利进口',
      overview: [
        'Sian FKP 37 兼具极高稀缺性与技术象征性，视觉表达和机械规格都处在品牌体系里非常特殊的位置。',
        '相比常规量产超跑，它更像一件带有明确时代印记的收藏级作品，存在感和话题性都非常完整。'
      ],
      overviewJa: [
        'Sian FKP 37 は圧倒的な希少性と技術的象徴性を併せ持ち、デザイン表現とメカニカルな存在感の両面でブランド内でも特別な立ち位置にあるモデルです。',
        '一般的な量産スーパーカーというより、時代性を明確に刻んだコレクターズピースに近く、存在感も話題性も非常に完成度の高い一台です。'
      ],
      benefits: defaultBenefits,
      features: defaultFeatures
    },
    {
      id: 'lamborghini-urus-performante',
      brandKey: 'lamborghini',
      name: '兰博基尼 Urus Performante',
      year: '2023',
      type: '高性能SUV',
      icon: 'b1.svg',
      photo: '004.png',
      gallery: ['004.png', '004.png', '004.png', '004.png'],
      mileage: '0.036',
      displacement: '4.0L',
      cylinders: 'V8',
      fuel: '汽油',
      trans: 'AT',
      totalPrice: '¥ 2,650,000',
      basePrice: '¥ 2,490,000',
      bodyStyle: 'SUV',
      drive: 'AWD',
      bodyColor: '哑光灰',
      interiorColor: '黑红拼色',
      seats: '5 座',
      serviceRecord: '完整在册',
      origin: '意大利进口',
      overview: [
        'Urus Performante 在实用轮廓之上进一步强化了性能感，整车姿态、细节处理和运动氛围都更鲜明一些。',
        '低里程让它保留了很完整的新鲜度，无论从外观状态还是驾驶预期来看，都处在很利落的区间里。'
      ],
      overviewJa: [
        'Urus Performante は実用的な SUV の輪郭を保ちながら、さらに強いパフォーマンス色を与えられたモデルで、姿勢や細部の処理により濃いスポーツ感が表れています。',
        '低走行によって新鮮な印象が残されており、外観の状態も走りへの期待値もともにシャープな水準にあります。'
      ],
      benefits: defaultBenefits,
      features: defaultFeatures
    },
    {
      id: 'lamborghini-huracan-evo-rwd',
      brandKey: 'lamborghini',
      name: '兰博基尼 Huracan EVO RWD',
      year: '2020',
      type: '中置跑车',
      icon: 'b1.svg',
      photo: '005.png',
      gallery: ['005.png', '005.png', '005.png', '005.png'],
      mileage: '0.92',
      displacement: '5.2L',
      cylinders: 'V10',
      fuel: '汽油',
      trans: 'AT',
      totalPrice: '¥ 2,100,000',
      basePrice: '¥ 1,960,000',
      bodyStyle: '跑车',
      drive: 'RWD',
      bodyColor: '珍珠白',
      interiorColor: '黑色真皮',
      seats: '2 座',
      serviceRecord: '完整在册',
      origin: '意大利进口',
      overview: [
        'Huracan EVO RWD 有着更直接的转向与车尾反馈，整车动态更轻快，也更接近传统后驱跑车的驾驶语气。',
        '它在状态上保持得很整齐，既保留了兰博基尼应有的视觉张力，也多了一层更纯粹的操控趣味。'
      ],
      overviewJa: [
        'Huracan EVO RWD はステアリングの初期応答とリアの動きがよりダイレクトで、伝統的な後輪駆動スポーツらしい軽快なドライビングフィールが魅力です。',
        'コンディションも非常に整っており、ランボルギーニらしい視覚的な緊張感に加えて、より純粋な操る楽しさがしっかり感じられる一台です。'
      ],
      benefits: defaultBenefits,
      features: defaultFeatures
    }
  ];

  // If the API hydrate script (js/api-hydrate.js) populated live vehicles
  // from the admin backend, merge them onto the static baseVehicles so the
  // admin console drives the site while fields the admin does not manage
  // (richly localised `specs`, `highlights`, `description`, etc.) keep
  // falling back to the built-in defaults.  If the API has never been
  // reached we behave exactly like before.
  const apiPresets = (window.TK168_API_PRESETS && typeof window.TK168_API_PRESETS === "object")
    ? window.TK168_API_PRESETS
    : null;

  // Keep only values the admin actually set; an empty string or null means
  // "fall back to whatever baseVehicles has for this field".
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

  function mergeVehicleData(base, override) {
    if (!base) return { ...override };
    if (!override) return { ...base };
    return { ...base, ...pickDefined(override) };
  }

  // When the backend has published vehicles we treat it as the source of
  // truth: the homepage / brand pages show exactly what the admin manages
  // under the 首页车辆 板块, and the legacy brand-library-data.js is kept
  // only as a catalog of brand logos / filters (no synthesized cards).
  //
  // If the API is unreachable we fall back to the old behaviour so file://
  // previews and offline dev don't end up with an empty site.
  function buildMergedVehicleListFromHydrate() {
    const apiList = Array.isArray(window.TK168_API_VEHICLES)
      ? window.TK168_API_VEHICLES
      : null;
    const apiVehicleIds = apiList && apiList.length
      ? new Set(apiList.map((v) => v && v.id).filter(Boolean))
      : new Set();
    let seed;
    let includeBrandLibraryCards = false;
    if (apiList && apiList.length) {
      const baseById = new Map(baseVehicles.map((v) => [v.id, v]));
      seed = apiList.map((apiV) => mergeVehicleData(baseById.get(apiV.id), apiV));
    } else {
      seed = baseVehicles;
      includeBrandLibraryCards = true;
    }
    const raw = includeBrandLibraryCards
      ? appendBrandLibraryVehicles(seed, brandLibraryItems)
      : seed;
    return raw
      .map((vehicle) => {
        const canonicalBrandKey = resolveCanonicalBrandKey(vehicle.brandKey);
        const v = canonicalBrandKey
          ? { ...vehicle, brandKey: canonicalBrandKey }
          : { ...vehicle };
        return normalizeVehicleEngineFields(v);
      })
      .filter((vehicle) => {
        if (activeBrandKeySet.has(vehicle.brandKey)) return true;
        // 后台「首页车辆」写入的数据应全部可见；白名单只约束静态种子与品牌馆占位，避免 test 等自填品牌整卡被裁掉
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
      image: 'assets/images/f3.webp',
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
      image: 'assets/images/f4.webp'
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
      image: 'assets/images/f7.webp'
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
    { value: 'under-100', label: '100万元以下', labelJa: '2,000万円以下', labelEn: 'Under JPY 20M', match: (amount) => amount < 1000000 },
    { value: '100-200', label: '100-200万元', labelJa: '2,000万-4,000万円', labelEn: 'JPY 20M-40M', match: (amount) => amount >= 1000000 && amount < 2000000 },
    { value: '200-300', label: '200-300万元', labelJa: '4,000万-6,000万円', labelEn: 'JPY 40M-60M', match: (amount) => amount >= 2000000 && amount < 3000000 },
    { value: '300-plus', label: '300万元以上', labelJa: '6,000万円以上', labelEn: 'JPY 60M+', match: (amount) => amount >= 3000000 }
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
        'FCEV（氢燃料电池车）': 'FCEV（氢燃料电池车）',
        油电混动: 'HEV（混动）',
        插电混动: 'PHEV（插电混动）',
        纯电动: 'BEV（纯电动车）',
        增程式: 'EREV（增程式电动车）',
        Hybrid: 'HEV（混动）',
        EV: 'BEV（纯电动车）'
      },
      ja: {
        汽油: 'ガソリン',
        柴油: 'ディーゼル',
        'HEV（混动）': 'HEV（ハイブリッド）',
        'PHEV（插电混动）': 'PHEV（プラグイン）',
        'BEV（纯电动车）': 'BEV（純電気）',
        'EREV（增程式电动车）': 'EREV（レンジエクステンダー）',
        'FCEV（氢燃料电池车）': 'FCEV（燃料電池）',
        油电混动: 'HEV（ハイブリッド）',
        插电混动: 'PHEV（プラグイン）',
        纯电动: 'BEV（純電気）',
        增程式: 'EREV（レンジエクステンダー）',
        Hybrid: 'HEV（ハイブリッド）',
        EV: 'BEV（純電気）'
      },
      en: {
        汽油: 'Gasoline',
        柴油: 'Diesel',
        'HEV（混动）': 'HEV (hybrid)',
        'PHEV（插电混动）': 'PHEV (plug-in hybrid)',
        'BEV（纯电动车）': 'BEV (battery electric)',
        'EREV（增程式电动车）': 'EREV (extended-range EV)',
        'FCEV（氢燃料电池车）': 'FCEV (fuel cell)',
        油电混动: 'HEV (hybrid)',
        插电混动: 'PHEV (plug-in hybrid)',
        纯电动: 'BEV (battery electric)',
        增程式: 'EREV (extended-range EV)',
        Hybrid: 'HEV (hybrid)',
        EV: 'BEV (battery electric)'
      }
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
    origin: {
      zh: {
        意大利进口: '意大利进口',
        德国进口: '德国进口',
        日本进口: '日本进口',
        英国进口: '英国进口',
        美国进口: '美国进口',
        法国进口: '法国进口',
        瑞典进口: '瑞典进口'
      },
      ja: {
        意大利进口: 'イタリア輸入',
        德国进口: 'ドイツ輸入',
        日本进口: '日本輸入',
        英国进口: 'イギリス輸入',
        美国进口: 'アメリカ輸入',
        法国进口: 'フランス輸入',
        瑞典进口: 'スウェーデン輸入'
      },
      en: {
        意大利进口: 'Italy import',
        德国进口: 'Germany import',
        日本进口: 'Japan import',
        英国进口: 'United Kingdom import',
        美国进口: 'United States import',
        法国进口: 'France import',
        瑞典进口: 'Sweden import'
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

  function formatRmbPrice(amount) {
    const opts = { useGrouping: true };
    if (amount >= 10000) {
      const wan = amount / 10000;
      const fractionDigits = Number.isInteger(wan) ? 0 : 1;
      return `${wan.toLocaleString('zh-CN', {
        ...opts,
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: 1
      })}万元`;
    }
    return `${amount.toLocaleString('zh-CN', opts)}元`;
  }

  function formatJpyPrice(amountRmb, numberLocale = 'ja-JP') {
    const amountJpy = amountRmb * RMB_TO_JPY_RATE;
    const opts = { useGrouping: true };
    if (amountJpy >= 10000) {
      const man = amountJpy / 10000;
      const fractionDigits = Number.isInteger(man) ? 0 : 1;
      return `${man.toLocaleString(numberLocale, {
        ...opts,
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: 1
      })} JPY`;
    }
    return `${amountJpy.toLocaleString(numberLocale, opts)} JPY`;
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

  /** 展示用：有有效里程则 zh/ja 为「X万公里」，en 为「N km」；纯文字或无数字则原样返回 */
  function formatVehicleMileageDisplay(value, language = getCurrentLanguage()) {
    const raw = String(value ?? '').trim();
    if (!raw) return '';
    if (!/\d/.test(raw)) return raw;
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
    return catalog?.[value] || value;
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
    const mileageLabel = formatVehicleMileageDisplay(vehicle.mileage, 'en') || 'a well-kept mileage record';

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

  /** 后台 /api/journal 拉取后的条目；无或空数组时回退到内置 `news` */
  function buildNewsListFromApi() {
    const raw = window.TK168_API_JOURNAL;
    if (!Array.isArray(raw) || raw.length === 0) return null;
    return raw.map((j) => ({
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
    const source = fromApi && fromApi.length ? fromApi : news;
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
    const useApi = fromApi && fromApi.length;
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
        heroImage: "assets/images/f2.webp",
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
      heroImage: "assets/images/f2.webp",
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

  function getVehiclesByBrand(brandKey) {
    const canonicalKey = resolveCanonicalBrandKey(brandKey) || String(brandKey || '').trim().toLowerCase();
    return vehicles.filter((vehicle) => vehicle.brandKey === canonicalKey);
  }

  function getVehicleTotalPrice(vehicle) {
    return vehicle?.totalPrice || vehicle?.price || '';
  }

  function getVehicleBasePrice(vehicle) {
    return vehicle?.basePrice || getVehicleTotalPrice(vehicle);
  }

  const rentalProfiles = {
    'lamborghini-urus': { rentable: true, rentalStatus: 'available', dailyRate: 5600, deposit: 120000, minDays: 2 },
    'audi-r8-spyder': { rentable: true, rentalStatus: 'available', dailyRate: 4800, deposit: 100000, minDays: 2 },
    'ferrari-458-italia': { rentable: true, rentalStatus: 'reserved', dailyRate: 5200, deposit: 120000, minDays: 3 },
    'bmw-x6-m': { rentable: true, rentalStatus: 'available', dailyRate: 3600, deposit: 80000, minDays: 2 },
    'ferrari-488-gtb': { rentable: true, rentalStatus: 'rented', dailyRate: 5600, deposit: 130000, minDays: 3 },
    'lamborghini-aventador': { rentable: true, rentalStatus: 'available', dailyRate: 7600, deposit: 180000, minDays: 3 },
    'lamborghini-huracan-evo': { rentable: true, rentalStatus: 'available', dailyRate: 6800, deposit: 150000, minDays: 3 },
    'lamborghini-urus-s': { rentable: true, rentalStatus: 'available', dailyRate: 6000, deposit: 130000, minDays: 2 },
    'lamborghini-huracan-sto': { rentable: true, rentalStatus: 'reserved', dailyRate: 7200, deposit: 160000, minDays: 3 },
    'lamborghini-gallardo': { rentable: true, rentalStatus: 'available', dailyRate: 4300, deposit: 90000, minDays: 2 }
  };

  // Rentals live in a separate API-backed inventory
  // (`window.TK168_API_RENTALS` populated by js/api-hydrate.js).  We keep
  // the legacy `rentalProfiles` object as a last-resort fallback so the
  // site still renders if the API is unreachable.
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

  /** 単体取得の生データを `TK168_API_RENTALS` に突き合わせたうえで詳細用レコードを返す */
  function mergeApiRentalWithBase(flat) {
    if (!flat || !flat.id) return null;
    const list = getApiRentals();
    if (list) {
      const next = list.map((r) => (r && r.id === flat.id ? { ...r, ...flat } : r));
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

    const profile = rentalProfiles[vehicleId] || {};
    const rentable = Boolean(profile.rentable);
    const rentalStatus = profile.rentalStatus || (rentable ? 'available' : 'unavailable');
    const dailyRate = Number(profile.dailyRate) > 0 ? Number(profile.dailyRate) : 0;
    const deposit = Number(profile.deposit) > 0 ? Number(profile.deposit) : 0;
    const minDays = Number(profile.minDays) > 0 ? Number(profile.minDays) : 1;

    return {
      rentable,
      rentalStatus,
      dailyRate,
      deposit,
      minDays
    };
  }

  function isVehicleRentable(vehicle) {
    const profile = getVehicleRentalProfile(vehicle);
    return profile.rentable && profile.rentalStatus === 'available';
  }

  // When the API has rentals, build the rental fleet directly from that
  // list so the rental page shows exactly what the admin manages under
  // the レンタル板块 — independent from the on-sale `vehicles` inventory.
  // Each rental is adapted into the shape vehicle cards expect.
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
      year: rental.year || '',
      type: rental.type || '',
      icon: rental.icon && String(rental.icon).trim() ? String(rental.icon).trim() : '',
      mileage: rental.mileage || '',
      displacement: mergedEngine.displacement,
      cylinders: mergedEngine.cylinders,
      engine: formatVehicleEngineLine(mergedEngine),
      fuel: rental.fuel || '',
      trans: rental.trans || '',
      bodyStyle: rental.bodyStyle || '',
      drive: rental.drive || '',
      bodyColor: rental.bodyColor || '',
      interiorColor: rental.interiorColor || '',
      seats: rental.seats || '',
      origin: rental.origin || '',
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
    };
    return fallback;
  }

  function getRentableVehicles() {
    const apiRentals = getApiRentals();
    if (apiRentals && apiRentals.length) {
      return apiRentals
        .filter((r) => (r.rentalStatus || 'available') === 'available')
        .map(buildRentalVehicleRecord);
    }
    return vehicles.filter((vehicle) => isVehicleRentable(vehicle));
  }

  function getDisplayPrice(value, language = getCurrentLanguage()) {
    const amount = parseCurrency(value);
    if (!amount) return '';
    if (language === 'zh') return formatRmbPrice(amount);
    if (language === 'en') return formatJpyPrice(amount, 'en-US');
    return formatJpyPrice(amount, 'ja-JP');
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
      priceMetric: params.get('priceMetric') === 'base' ? 'base' : 'total',
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

  function filterVehicles(list, filters = {}) {
    const keyword = String(filters.keyword || '').trim().toLowerCase();
    const priceOption = priceOptions.find((item) => item.value === filters.price);
    const priceMetric = filters.priceMetric === 'base' ? 'base' : 'total';
    const yearOption = yearOptions.find((item) => item.value === filters.year);
    const mileageOption = mileageOptions.find((item) => item.value === filters.mileage);

    return list.filter((vehicle) => {
      if (filters.brand && vehicle.brandKey !== filters.brand) return false;
      if (filters.bodyStyle && String(vehicle.bodyStyle || '').trim() !== filters.bodyStyle) return false;
      if (priceOption) {
        const amount = priceMetric === 'base'
          ? parseCurrency(getVehicleBasePrice(vehicle))
          : parseCurrency(getVehicleTotalPrice(vehicle));
        if (!priceOption.match(amount)) return false;
      }
      if (yearOption && !yearOption.match(parseYear(vehicle.year))) return false;
      if (mileageOption && !mileageOption.match(parseMileage(vehicle.mileage))) return false;

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
          vehicle.fuel,
          getVehicleFieldLabel('fuel', vehicle.fuel, 'ja'),
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
      priceMetric: filters.price ? (filters.priceMetric === 'base' ? 'base' : '') : '',
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
   * 在 clean URL 环境下（路径为 /home、/detail 等无 .html 后缀），若仍链到
   * `detail.html?id=…`，部分服务器会 301 到 `/detail` 并丢掉查询串，详情页读不到 id。
   * 此时改为生成同目录下的 `/detail?…`（或子路径前缀 + /detail）。
   */
  function resolveDetailHref(queryString) {
    if (typeof window === 'undefined' || !/^https?:$/i.test(String(window.location.protocol || ''))) {
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
      priceMetric: filters.price ? (filters.priceMetric === 'base' ? 'base' : '') : '',
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
    return normalizeVehicleEngineFields(mergeVehicleData(base, apiFlat));
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
    getVehiclesByBrand,
    getBrandLabel,
    getVehicleBrandTitle,
    getVehicleModelDisplayName,
    getVehicleModelName,
    getVehicleName,
    resolveVehicleMediaSource,
    resolveVehicleBrandGlyphUrl,
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
    getRentableVehicles,
    getDisplayPrice,
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
    formatVehicleMileageDisplay,
    getRentalVehicleDetailById,
    mergeApiRentalWithBase,
    refreshVehiclesFromApiHydrate,
    refreshJournalFromApiHydrate,
    formatVehicleEngineLine
  };
})();
