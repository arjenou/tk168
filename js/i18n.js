window.TK168I18N = (() => {
  const STORAGE_KEY = 'tk168_lang';
  const DEFAULT_LANGUAGE = 'ja';
  const SUPPORTED_LANGUAGES = new Set(['ja', 'zh', 'en']);

  const messages = {
    zh: {
      'page.landingTitle': '首页 — TK168 Premium Automotive',
      'nav.landing': '首页',
      'nav.home': '企业简介',
      'nav.inventory': '品牌展厅',
      'nav.services': '服务',
      'nav.favorite': '收藏',
      'nav.rental': '租车',
      'nav.export': '汽车出口',
      'nav.contact': '联系顾问',
      'mobileBar.inquiry': '咨询',
      'mobileBar.access': '地图 / 到店',
      'favorite.title': '收藏',
      'favorite.empty': '暂无收藏车辆，去选几台喜欢的吧。',
      'favorite.clear': '清空收藏',
      'favorite.clearConfirm': '确定要清空收藏吗？',
      'service.appraisal': '车辆评估',
      'service.insurance': '保险办理',
      'service.maintenance': '维修保养',
      'service.finance': '金融方案',
      'hero.title': '探索未来之路',
      'hero.subtitle': '安心、省心，也更高效。<br>以专业甄选与一站式服务，帮你找到真正适合的座驾。',
      'hero.cta': '探索品牌展厅',
      'home.brandsTitle': '精选品牌',
      'home.brandsSubtitle': '根据品牌车标直达车型照片库',
      'home.vehiclesTitle': '臻选系列',
      'home.newsTitle': '最新资讯',
      'home.newsSubtitle': '行业观察 · 新车入库 · 品牌动态',
      'home.loadMore': '加载更多',
      'brand.eyebrow': '精选品牌库',
      'brand.defaultTitle': '精选品牌',
      'brand.galleryEyebrow': '品牌照片库',
      'brand.gallerySubtitle': '已整理 {count} 张车型照片，可先浏览外观风格，再决定是否继续查看库存。',
      'brand.noStockMessage': '当前品牌暂无在库车辆，可先浏览上方车型照片。',
      'brand.showAll': '显示全部',
      'brand.loadMore': '加载更多',
      'brand.resetSort': '恢复默认排序',
      'brand.sortLabel': '最新上架',
      'brand.totalPrice': '总价',
      'brand.basePrice': '车辆价格',
      'brand.year': '上牌年份',
      'brand.mileage': '行驶距离',
      'brand.engine': '排气量',
      'brand.inspection': '车检',
      'brand.repair': '修复历史',
      'brand.new': '新',
      'brand.old': '旧',
      'brand.low': '低',
      'brand.high': '高',
      'brand.yes': '有',
      'brand.no': '无',
      'search.makeModel': '品牌车型',
      'search.brand': '按品牌',
      'search.type': '车身类型',
      'search.bodyStyle': '车身类型',
      'search.price': '价格',
      'search.year': '上牌年份',
      'search.mileage': '行驶里程',
      'search.placeholder': '例如：法拉利 458',
      'search.cta': '搜索车源',
      'search.all': '不限',
      'search.makerAllBrandsNote': '全部品牌',
      'search.makerGroup.japan': '日本 / 国产',
      'search.makerGroup.germany': '德国',
      'search.makerGroup.usa': '美国',
      'search.makerGroup.uk': '英国',
      'search.makerGroup.sweden': '瑞典',
      'search.makerGroup.france': '法国',
      'search.makerGroup.italy': '意大利',
      'search.makerGroup.other': '其他国家/地区',
      'search.makerGroup.category': '分类',
      'search.resetTitle': '返回全部在库',
      'news.more': '了解详情',
      'page.journalTitle': '最新资讯',
      'news.detailKicker': 'LATEST JOURNAL',
      'news.detailBack': '返回最新资讯列表',
      'news.notFound': '未找到该文章',
      'news.detailLoading': '正在加载…',
      'news.detailEmpty': '暂无正文，摘要见上。',
      'footer.slogan': '专注高端汽车甄选与跨境服务，<br>为每一次购车决策提供更省心的体验。',
      'footer.newsletterTitle': '订阅资讯',
      'footer.newsletterPlaceholder': '输入邮箱地址',
      'footer.newsletterButton': '立即订阅',
      'footer.storesTitle': '门店网络',
      'footer.stores.tokyo.eyebrow': '日本 · 东京',
      'footer.stores.tokyo.name': '龟户店',
      'footer.stores.tokyo.address': '东京都江东区龟户<br>地址准备中',
      'footer.stores.saitama.eyebrow': '日本 · 东京',
      'footer.stores.saitama.name': 'さいたま店',
      'footer.stores.saitama.address': '339-0035<br>埼玉県さいたま市岩槻区笹久保新田',
      'footer.stores.saitama.phoneLine': '电话：048-796-4907',
      'footer.stores.saitama.faxLine': '传真：048-796-4946',
      'footer.stores.saitama.emailLine': '邮箱：AUTO@tk168.co.jp',
      'footer.stores.osaka.eyebrow': '日本 · 大阪',
      'footer.stores.osaka.name': '大阪店',
      'footer.stores.osaka.address': '〒595-0042<br>大阪府泉大津市高津町12-11',
      'footer.stores.osaka.phoneLine': '电话：072-592-9577',
      'footer.stores.osaka.faxLine': '传真：072-592-9631',
      'footer.stores.osaka.emailLine': '邮箱：OSAKA@tk168.co.jp',
      'footer.stores.malaysia.eyebrow': '马来西亚',
      'footer.stores.malaysia.name': '马来西亚分店',
      'footer.stores.malaysia.address': 'Kuala Lumpur, Malaysia<br>地址准备中',
      'footer.storePhoneLine': '电话：准备中',
      'footer.storeEmailLine': '邮箱：准备中',
      'footer.pages': '页面',
      'footer.phone': '联系电话',
      'footer.email': '联系邮箱',
      'footer.address': '联系地址',
      'footer.addressValue': '339-0035埼玉県さいたま市岩<br>槻区笹久保新田',
      'footer.copyright': '© 2026 TK168. 版权所有。',
      'footer.faq': '常见问题',
      'footer.shopTokyo': 'TK168东京店',
      'footer.shopOsaka': 'TK168大阪店',
      'footer.shopFukuoka': 'TK168福冈店',
      'footer.repair': '维修',
      'footer.care': '保养',
      'footer.inspection': '车检',
      'detail.specsTitle': '参数信息',
      'detail.overviewTitle': '车型概览',
      'detail.contactTitle': '联系顾问',
      'detail.benefitsTitle': '基本规格',
      'detail.featuresTitle': '核心亮点',
      'detail.staffTitle': '员工介绍',
      'detail.staffName': 'TK168 顾问团队',
      'detail.staffRole': '进口车顾问',
      'detail.staffBio': '专注高性能车型与跨境购车沟通，为来店看车、在库确认和方案建议提供更高效的支持。',
      'detail.staffLanguage': '支持中文 / 日文 / 英文',
      'detail.staffSupport': '支持视频看车与到店预约',
      'detail.featuredTitle': '在库推荐',
      'detail.moreInventory': '查看更多车源',
      'detail.backToResults': '返回筛选结果',
      'detail.back': '返回上一层',
      'detail.call': '致电顾问',
      'detail.stockConfirm': '在库确认',
      'detail.storeVisit': '来店预约',
      'detail.lightbox': '车辆大图预览',
      'detail.closeLightbox': '关闭大图预览',
      'price.total': '总价',
      'price.base': '车辆价格',
      'price.baseLong': '车辆价格',
      'price.taxIncluded': '（含税）',
      'price.helpLabel': '查看价格说明',
      'price.modalClose': '关闭说明弹窗',
      'price.helpTotal': '总价（含税）是在车辆价格基础上，加上法定税费、登记等基础费用后的参考金额。',
      'price.helpBase': '车辆价格（含税）指车辆本身的销售价格，不包含延长保修、运输及个别追加服务费用。',
      'rental.priceDaily': '日租金',
      'rental.priceDeposit': '押金',
      'rental.minDays': '最短租期',
      'rental.fuelType': '燃料',
      'inventory.available': '现车',
      'cta.viewDetail': '进入详情',
      'inventory.emptyDefault': '暂无符合条件的在库车辆，敬请期待',
      'inventory.emptyAfterFilter': '当前筛选条件下暂无在库车辆，可尝试放宽或重置条件。',
      'inventory.emptyFiltered': '未找到符合 {summary} 的在库车辆',
      'inventory.keywordSummary': '关键词“{keyword}”',
      'gallery.main': '整体',
      'gallery.front': '前脸',
      'gallery.rear': '车尾',
      'gallery.wheel': '车轮',
      'gallery.angle': '视角',
      'contact.pageTitle': '咨询 — TK168 Premium Automotive',
      'contact.eyebrow': 'TK168 CONTACT',
      'contact.title': '咨询登记',
      'contact.subtitle': '请选择咨询类别后填写资料，顾问会在 1 个工作日内联系您。',
      'contact.tabs.sellGeneral': '大致需求',
      'contact.tabs.sellGeneralEyebrow': '我想买车',
      'contact.tabs.sellSpecific': '具体车型',
      'contact.tabs.sellSpecificEyebrow': '我想买车',
      'contact.tabs.rental': '租车咨询',
      'contact.tabs.rentalEyebrow': '我想租车',
      'contact.required': '必填',
      'contact.section.contactInfo': '联系方式',
      'contact.foot': '提交后顾问会在 1 个工作日内回复，急需联系也欢迎来电咨询。',
      'contact.submit': '提交',
      'contact.submitting': '提交中…',
      'contact.success': '提交成功，顾问将尽快与您联系。',
      'contact.error.email': '请输入有效的邮箱地址。',
      'contact.error.required': '请填写带必填标记的字段。',
      'contact.error.network': '提交失败，请稍后再试。',
      'contact.sellGeneral.lead': '想找一台什么样的车？请告诉我们大致的方向。',
      'contact.sellSpecific.lead': '已经有具体车型？请填写车型、年式、公里数等详细信息。',
      'contact.rental.lead': '想租到什么车？请连同用车计划一起告诉我们。',
      'contact.field.bodyType': '希望车型类型',
      'contact.field.brand': '希望品牌',
      'contact.field.budget': '预算',
      'contact.field.condition': '希望条件',
      'contact.field.note': '备注（选填）',
      'contact.field.email': '邮箱地址',
      'contact.field.name': '姓名（选填）',
      'contact.field.phone': '电话（选填）',
      'contact.field.preferredLanguage': '希望联络语言',
      'contact.field.model': '希望车型',
      'contact.field.year': '年式',
      'contact.field.mileage': '行驶距离',
      'contact.field.color': '希望颜色',
      'contact.field.transmission': '变速箱',
      'contact.field.rentalCar': '希望租到的车',
      'contact.field.usage': '主要用途',
      'contact.field.rentalDate': '希望用车日期',
      'contact.field.rentalDays': '使用天数',
      'contact.field.pickup': '取车地点',
      'contact.option.selectPlaceholder': '请选择',
      'contact.option.noPreference': '不限',
      'contact.bodyType.sedan': '轿车',
      'contact.bodyType.suv': 'SUV',
      'contact.bodyType.coupe': '轿跑 / 跑车',
      'contact.bodyType.convertible': '敞篷',
      'contact.bodyType.wagon': '旅行车',
      'contact.bodyType.minivan': 'MPV',
      'contact.bodyType.kei': '轻自动车',
      'contact.bodyType.other': '其他 / 未定',
      'contact.budget.lt3m': '300万日元以下',
      'contact.budget.3to5m': '300万 - 500万日元',
      'contact.budget.5to10m': '500万 - 1,000万日元',
      'contact.budget.10to20m': '1,000万 - 2,000万日元',
      'contact.budget.20mPlus': '2,000万日元以上',
      'contact.budget.undecided': '希望咨询',
      'contact.transmission.at': 'AT 自动',
      'contact.transmission.mt': 'MT 手动',
      'contact.transmission.dct': 'DCT / 半自动',
      'contact.usage.city': '市区代步',
      'contact.usage.business': '商务接待',
      'contact.usage.trip': '近郊出行',
      'contact.usage.cross': '跨地区行程',
      'contact.usage.shoot': '拍摄 / 活动',
      'contact.usage.other': '其他 / 待咨询',
      'contact.language.ja': '日本語',
      'contact.language.zh': '中文',
      'contact.language.en': 'English',
      'contact.placeholder.brand': '例如：Lamborghini / Porsche / 未定',
      'contact.placeholder.condition': '例如：无修复历 / 低公里 / 指定颜色',
      'contact.placeholder.email': 'name@example.com',
      'contact.placeholder.name': '张三',
      'contact.placeholder.phone': '09012345678',
      'contact.placeholder.noteSell': '交车时间、使用场景、其他要求等请自由填写。',
      'contact.placeholder.noteSellSpecific': '配置、选装、是否接受修复历、交车时间等',
      'contact.placeholder.noteRental': '人数、行程、其他需求等请填写。',
      'contact.placeholder.model': '例如：Lamborghini Urus Performante',
      'contact.placeholder.year': '例如：2020 - 2024',
      'contact.placeholder.mileage': '例如：30,000 公里以内',
      'contact.placeholder.color': '例如：白 / 黑 / 不限',
      'contact.placeholder.budgetSpecific': '例如：1,500万日元前后',
      'contact.placeholder.budgetRental': '例如：50,000日元 / 天',
      'contact.placeholder.rentalCar': '例如：Lamborghini Urus / SUV / 高级轿车',
      'contact.placeholder.rentalDays': '例如：3',
      'contact.placeholder.pickup': '例如：东京 / 大阪 / 埼玉',
      'lang.switcher': '语言切换',
      'lang.zh': '中文',
      'lang.ja': '日本語',
      'lang.en': 'English'
    },
    ja: {
      'page.landingTitle': 'ホーム — TK168 Premium Automotive',
      'nav.landing': 'ホーム',
      'nav.home': '会社概要',
      'nav.inventory': '在庫車両',
      'nav.services': 'サービス案内',
      'nav.favorite': 'お気に入り',
      'nav.rental': 'レンタカー事業',
      'nav.export': '自動車輸出事業',
      'nav.contact': 'お問い合わせ',
      'mobileBar.inquiry': 'お問い合わせ',
      'mobileBar.access': 'アクセス',
      'favorite.title': 'お気に入り',
      'favorite.empty': 'お気に入りの車両はまだありません。',
      'favorite.clear': 'お気に入りをクリア',
      'favorite.clearConfirm': 'お気に入りをすべて削除しますか？',
      'service.appraisal': '車両査定',
      'service.insurance': '保険手続き',
      'service.maintenance': '整備メンテナンス',
      'service.finance': 'ファイナンス',
      'hero.title': '未来への道を探る',
      'hero.subtitle': '安心感と効率を両立しながら、<br>理想の一台に出会うための上質な導線を整えます。',
      'hero.cta': 'ブランドを探索',
      'home.brandsTitle': '厳選ブランド',
      'home.brandsSubtitle': 'ブランドロゴから車種フォトライブラリへ直接アクセス',
      'home.vehiclesTitle': 'プレミアムセレクション',
      'home.newsTitle': '最新情報',
      'home.newsSubtitle': 'マーケット情報 ・ 新規入庫 ・ ブランドトピックス',
      'home.loadMore': 'もっと見る',
      'brand.eyebrow': 'セレクテッドブランド',
      'brand.defaultTitle': '厳選ブランド',
      'brand.galleryEyebrow': 'ブランドフォトライブラリ',
      'brand.gallerySubtitle': '{count} 枚の車種写真を整理済みです。外観の雰囲気を確認してから在庫ページへ進めます。',
      'brand.noStockMessage': '現在このブランドの在庫車両はありません。先に上のフォトライブラリをご覧ください。',
      'brand.showAll': 'すべて表示',
      'brand.loadMore': 'もっと見る',
      'brand.resetSort': '元の並び順に戻す',
      'brand.sortLabel': '新着順',
      'brand.totalPrice': '支払総額',
      'brand.basePrice': '本体価格',
      'brand.year': '年式',
      'brand.mileage': '走行距離',
      'brand.engine': '排気量',
      'brand.inspection': '車検',
      'brand.repair': '修復歴',
      'brand.new': '新',
      'brand.old': '古',
      'brand.low': '安',
      'brand.high': '高',
      'brand.yes': '付',
      'brand.no': '無',
      'search.makeModel': 'メーカー車名',
      'search.brand': 'ブランド',
      'search.type': 'ボディタイプ',
      'search.bodyStyle': 'ボディタイプ',
      'search.price': '価格',
      'search.year': '年式',
      'search.mileage': '走行距離',
      'search.placeholder': '例: フェラーリ 458',
      'search.cta': '検索する',
      'search.all': '指定なし',
      'search.makerAllBrandsNote': 'すべてのブランド',
      'search.makerGroup.japan': '日本 / 国産',
      'search.makerGroup.germany': 'ドイツ',
      'search.makerGroup.usa': 'アメリカ',
      'search.makerGroup.uk': 'イギリス',
      'search.makerGroup.sweden': 'スウェーデン',
      'search.makerGroup.france': 'フランス',
      'search.makerGroup.italy': 'イタリア',
      'search.makerGroup.other': 'その他の国',
      'search.makerGroup.category': '区分',
      'search.resetTitle': '全在庫へ戻る',
      'news.more': '詳細を見る',
      'page.journalTitle': '最新情報',
      'news.detailKicker': 'LATEST JOURNAL',
      'news.detailBack': '最新情報一覧へ',
      'news.notFound': '記事が見つかりません',
      'news.detailLoading': '読み込み中…',
      'news.detailEmpty': '本文未登録。概要をご覧ください。',
      'footer.slogan': '上質な一台との出会いを、<br>越境サービスとともに丁寧にサポートします。',
      'footer.newsletterTitle': 'ニュースレター',
      'footer.newsletterPlaceholder': 'メールアドレスを入力',
      'footer.newsletterButton': '登録する',
      'footer.storesTitle': '店舗ネットワーク',
      'footer.stores.tokyo.eyebrow': 'JAPAN · TOKYO',
      'footer.stores.tokyo.name': '亀戸店',
      'footer.stores.tokyo.address': '東京都江東区亀戸<br>住所準備中',
      'footer.stores.saitama.eyebrow': 'JAPAN · TOKYO',
      'footer.stores.saitama.name': 'さいたま店',
      'footer.stores.saitama.address': '339-0035<br>埼玉県さいたま市岩槻区笹久保新田',
      'footer.stores.saitama.phoneLine': 'TEL：048-796-4907',
      'footer.stores.saitama.faxLine': 'FAX：048-796-4946',
      'footer.stores.saitama.emailLine': 'EMAIL：AUTO@tk168.co.jp',
      'footer.stores.osaka.eyebrow': 'JAPAN · OSAKA',
      'footer.stores.osaka.name': '大阪店',
      'footer.stores.osaka.address': '〒595-0042<br>大阪府泉大津市高津町１２−１１',
      'footer.stores.osaka.phoneLine': 'TEL：072-592-9577',
      'footer.stores.osaka.faxLine': 'FAX：072-592-9631',
      'footer.stores.osaka.emailLine': 'EMAIL：OSAKA@tk168.co.jp',
      'footer.stores.malaysia.eyebrow': 'MALAYSIA',
      'footer.stores.malaysia.name': 'マレーシア支店',
      'footer.stores.malaysia.address': 'Kuala Lumpur, Malaysia<br>住所準備中',
      'footer.storePhoneLine': '電話番号：準備中',
      'footer.storeEmailLine': 'メール：準備中',
      'footer.pages': 'ページ',
      'footer.phone': '電話番号',
      'footer.email': 'メール',
      'footer.address': '住所',
      'footer.addressValue': '339-0035埼玉県さいたま市岩<br>槻区笹久保新田',
      'footer.copyright': '© 2026 TK168. All rights reserved.',
      'footer.faq': 'よくある質問',
      'footer.shopTokyo': 'TK168東京店',
      'footer.shopOsaka': 'TK168大阪店',
      'footer.shopFukuoka': 'TK168福岡店',
      'footer.repair': '修理',
      'footer.care': 'メンテナンス',
      'footer.inspection': '車検',
      'detail.specsTitle': '車両情報',
      'detail.overviewTitle': '車両概要',
      'detail.contactTitle': 'お問い合わせ',
      'detail.benefitsTitle': '基本スペック',
      'detail.featuresTitle': '注目ポイント',
      'detail.staffTitle': 'スタッフ紹介',
      'detail.staffName': 'TK168 セールスチーム',
      'detail.staffRole': '輸入車アドバイザー',
      'detail.staffBio': 'スーパーカーとハイパフォーマンスモデルを中心に、在庫案内から来店相談まで丁寧にサポートします。',
      'detail.staffLanguage': '中国語・日本語・英語対応',
      'detail.staffSupport': 'オンライン案内・来店予約に対応',
      'detail.featuredTitle': 'おすすめ在庫',
      'detail.moreInventory': '在庫をもっと見る',
      'detail.backToResults': '検索結果へ戻る',
      'detail.back': '前に戻る',
      'detail.call': 'お電話で相談',
      'detail.stockConfirm': '在庫確認',
      'detail.storeVisit': '来店予約',
      'detail.lightbox': '車両画像プレビュー',
      'detail.closeLightbox': '画像プレビューを閉じる',
      'price.total': '支払総額',
      'price.base': '車両本体価格',
      'price.baseLong': '車両本体価格',
      'price.taxIncluded': '（税込）',
      'price.helpLabel': '価格の説明を見る',
      'price.modalClose': '説明ポップアップを閉じる',
      'price.helpTotal': '支払総額（税込）は、車両本体価格に法定費用や登録などの基本費用を含めた参考金額です。',
      'price.helpBase': '車両本体価格（税込）は、車両本体のみの価格で、延長保証や輸送、個別追加サービス費用は含みません。',
      'rental.priceDaily': '1日料金',
      'rental.priceDeposit': '保証金',
      'rental.minDays': '最短日数',
      'rental.fuelType': '燃料',
      'inventory.available': '在庫あり',
      'cta.viewDetail': '詳細を見る',
      'inventory.emptyDefault': '条件に合う在庫車両は現在ありません',
      'inventory.emptyAfterFilter': '現在の絞り込み条件に一致する在庫車がありません。条件を変更するかリセットしてください。',
      'inventory.emptyFiltered': '{summary} に該当する在庫車両は見つかりませんでした',
      'inventory.keywordSummary': 'キーワード「{keyword}」',
      'gallery.main': '全体',
      'gallery.front': 'フロント',
      'gallery.rear': 'リア',
      'gallery.wheel': 'ホイール',
      'gallery.angle': 'ビュー',
      'contact.pageTitle': 'お問い合わせ — TK168 Premium Automotive',
      'contact.eyebrow': 'TK168 CONTACT',
      'contact.title': 'お問い合わせ',
      'contact.subtitle': 'ご希望の内容を選択して、必要事項をご記入ください。担当アドバイザーから 1 営業日以内にご連絡いたします。',
      'contact.tabs.sellGeneral': '大まかな希望',
      'contact.tabs.sellGeneralEyebrow': '買いたい',
      'contact.tabs.sellSpecific': '具体的な車種',
      'contact.tabs.sellSpecificEyebrow': '買いたい',
      'contact.tabs.rental': 'レンタル相談',
      'contact.tabs.rentalEyebrow': '借りたい',
      'contact.required': '必須',
      'contact.section.contactInfo': 'お客様情報',
      'contact.foot': '送信後、担当より 1 営業日以内にご返信いたします。お急ぎの方はお電話でも承ります。',
      'contact.submit': '送信する',
      'contact.submitting': '送信中…',
      'contact.success': '送信が完了しました。担当者よりご連絡いたします。',
      'contact.error.email': 'メールアドレスをご確認ください。',
      'contact.error.required': '必須項目を入力してください。',
      'contact.error.network': '送信に失敗しました。時間をおいて再度お試しください。',
      'contact.sellGeneral.lead': 'どんな一台をお探しですか？大まかなご希望を教えてください。',
      'contact.sellSpecific.lead': '具体的なご希望車両があれば、車種・年式・走行距離などを教えてください。',
      'contact.rental.lead': 'どんな車をレンタルしたいですか？利用予定とあわせてお聞かせください。',
      'contact.field.bodyType': '希望タイプ',
      'contact.field.brand': '希望ブランド',
      'contact.field.budget': '予算',
      'contact.field.condition': '希望条件',
      'contact.field.note': 'ご要望（任意）',
      'contact.field.email': 'メールアドレス',
      'contact.field.name': 'お名前（任意）',
      'contact.field.phone': '電話番号（任意）',
      'contact.field.preferredLanguage': '希望言語',
      'contact.field.model': '希望車種',
      'contact.field.year': '年式',
      'contact.field.mileage': '走行距離',
      'contact.field.color': '希望カラー',
      'contact.field.transmission': 'トランスミッション',
      'contact.field.rentalCar': '借りたい車',
      'contact.field.usage': '主な用途',
      'contact.field.rentalDate': '利用希望日',
      'contact.field.rentalDays': '利用日数',
      'contact.field.pickup': '受け取り希望地',
      'contact.option.selectPlaceholder': '選択してください',
      'contact.option.noPreference': 'こだわらない',
      'contact.bodyType.sedan': 'セダン',
      'contact.bodyType.suv': 'SUV',
      'contact.bodyType.coupe': 'クーペ / スポーツ',
      'contact.bodyType.convertible': 'オープン / カブリオレ',
      'contact.bodyType.wagon': 'ワゴン',
      'contact.bodyType.minivan': 'ミニバン',
      'contact.bodyType.kei': '軽自動車',
      'contact.bodyType.other': 'その他 / 未定',
      'contact.budget.lt3m': '300万円以下',
      'contact.budget.3to5m': '300万 - 500万円',
      'contact.budget.5to10m': '500万 - 1,000万円',
      'contact.budget.10to20m': '1,000万 - 2,000万円',
      'contact.budget.20mPlus': '2,000万円以上',
      'contact.budget.undecided': '相談したい',
      'contact.transmission.at': 'AT',
      'contact.transmission.mt': 'MT',
      'contact.transmission.dct': 'DCT / セミAT',
      'contact.usage.city': '市内移動',
      'contact.usage.business': '商用 / 接待',
      'contact.usage.trip': '近郊ドライブ',
      'contact.usage.cross': '長距離 / 県外',
      'contact.usage.shoot': '撮影 / イベント',
      'contact.usage.other': 'その他 / 相談',
      'contact.language.ja': '日本語',
      'contact.language.zh': '中文',
      'contact.language.en': 'English',
      'contact.placeholder.brand': '例: Lamborghini / Porsche / 未定',
      'contact.placeholder.condition': '例: 修復歴なし / 低走行 / カラー指定 など',
      'contact.placeholder.email': 'name@example.com',
      'contact.placeholder.name': '山田 太郎',
      'contact.placeholder.phone': '09012345678',
      'contact.placeholder.noteSell': '納期希望、用途、その他のご要望などをご自由にお書きください。',
      'contact.placeholder.noteSellSpecific': 'グレード、オプション、修復歴の可否、納期希望など',
      'contact.placeholder.noteRental': '人数、ルート、その他のご要望などをご記入ください。',
      'contact.placeholder.model': '例: Lamborghini Urus Performante',
      'contact.placeholder.year': '例: 2020 - 2024',
      'contact.placeholder.mileage': '例: 30,000 km 以下',
      'contact.placeholder.color': '例: ホワイト / ブラック / 指定なし',
      'contact.placeholder.budgetSpecific': '例: 1,500万円前後',
      'contact.placeholder.budgetRental': '例: 50,000円 / 日',
      'contact.placeholder.rentalCar': '例: Lamborghini Urus / SUV / 高級セダン',
      'contact.placeholder.rentalDays': '例: 3',
      'contact.placeholder.pickup': '例: 東京 / 大阪 / さいたま',
      'lang.switcher': '言語切替',
      'lang.zh': '中文',
      'lang.ja': '日本語',
      'lang.en': 'English'
    },
    en: {
      'page.landingTitle': 'Home — TK168 Premium Automotive',
      'nav.landing': 'Home',
      'nav.home': 'About',
      'nav.inventory': 'Brand Gallery',
      'nav.services': 'Services',
      'nav.favorite': 'Favorites',
      'nav.rental': 'Rental',
      'nav.export': 'Auto Export',
      'nav.contact': 'Contact',
      'mobileBar.inquiry': 'Contact',
      'mobileBar.access': 'Directions',
      'favorite.title': 'Favorites',
      'favorite.empty': 'No saved vehicles yet. Pick a few and come back.',
      'favorite.clear': 'Clear favorites',
      'favorite.clearConfirm': 'Clear all saved vehicles?',
      'service.appraisal': 'Vehicle appraisal',
      'service.insurance': 'Insurance support',
      'service.maintenance': 'Maintenance',
      'service.finance': 'Finance plan',
      'hero.title': 'Find the right next car',
      'hero.subtitle': 'Calm, efficient, and easier to trust.<br>We connect careful selection with one clear service line.',
      'hero.cta': 'Explore brands',
      'home.brandsTitle': 'Selected Brands',
      'home.brandsSubtitle': 'Jump from the logo directly into each model photo library',
      'home.vehiclesTitle': 'Premium Selection',
      'home.newsTitle': 'Latest News',
      'home.newsSubtitle': 'Market notes · New arrivals · Brand updates',
      'home.loadMore': 'Load more',
      'brand.eyebrow': 'Selected Brands',
      'brand.defaultTitle': 'Selected Brands',
      'brand.galleryEyebrow': 'Brand Photo Library',
      'brand.gallerySubtitle': '{count} model photos prepared. Check the exterior style first, then continue to stock if needed.',
      'brand.noStockMessage': 'No stock vehicles for this brand right now. You can still browse the photo library above.',
      'brand.showAll': 'Show all',
      'brand.loadMore': 'Load more',
      'brand.resetSort': 'Reset order',
      'brand.sortLabel': 'Newest',
      'brand.totalPrice': 'Total price',
      'brand.basePrice': 'Base price',
      'brand.year': 'Year',
      'brand.mileage': 'Mileage',
      'brand.engine': 'Engine',
      'brand.inspection': 'Inspection',
      'brand.repair': 'Repair history',
      'brand.new': 'New',
      'brand.old': 'Old',
      'brand.low': 'Low',
      'brand.high': 'High',
      'brand.yes': 'Yes',
      'brand.no': 'No',
      'search.makeModel': 'Make / Model',
      'search.brand': 'Brand',
      'search.type': 'Body type',
      'search.bodyStyle': 'Body type',
      'search.price': 'Price',
      'search.year': 'Year',
      'search.mileage': 'Mileage',
      'search.placeholder': 'e.g. Ferrari 458',
      'search.cta': 'Search stock',
      'search.all': 'All',
      'search.makerAllBrandsNote': 'All brands',
      'search.makerGroup.japan': 'Japan / Domestic',
      'search.makerGroup.germany': 'Germany',
      'search.makerGroup.usa': 'United States',
      'search.makerGroup.uk': 'United Kingdom',
      'search.makerGroup.sweden': 'Sweden',
      'search.makerGroup.france': 'France',
      'search.makerGroup.italy': 'Italy',
      'search.makerGroup.other': 'Other countries / regions',
      'search.makerGroup.category': 'Category',
      'search.resetTitle': 'Back to all stock',
      'news.more': 'Learn more',
      'page.journalTitle': 'Latest journal',
      'news.detailKicker': 'LATEST JOURNAL',
      'news.detailBack': 'Back to journal list',
      'news.notFound': 'Article not found',
      'news.detailLoading': 'Loading…',
      'news.detailEmpty': 'No full article yet; see the summary above.',
      'footer.slogan': 'Carefully selected premium cars and cross-border support,<br>built into one calmer buying experience.',
      'footer.newsletterTitle': 'Newsletter',
      'footer.newsletterPlaceholder': 'Enter your email',
      'footer.newsletterButton': 'Subscribe',
      'footer.storesTitle': 'Store Network',
      'footer.stores.tokyo.eyebrow': 'JAPAN · TOKYO',
      'footer.stores.tokyo.name': 'Kameido Store',
      'footer.stores.tokyo.address': 'Koto-ku, Kameido, Tokyo<br>Address in preparation',
      'footer.stores.saitama.eyebrow': 'JAPAN · TOKYO',
      'footer.stores.saitama.name': 'Saitama Store',
      'footer.stores.saitama.address': '339-0035 Sasakubo Shinden, Iwatsuki-ku<br>Saitama-shi, Saitama',
      'footer.stores.saitama.phoneLine': 'TEL: 048-796-4907',
      'footer.stores.saitama.faxLine': 'FAX: 048-796-4946',
      'footer.stores.saitama.emailLine': 'EMAIL: AUTO@tk168.co.jp',
      'footer.stores.osaka.eyebrow': 'JAPAN · OSAKA',
      'footer.stores.osaka.name': 'Osaka Store',
      'footer.stores.osaka.address': '12-11 Takatsu-cho, Izumiotsu-shi<br>Osaka 595-0042, Japan',
      'footer.stores.osaka.phoneLine': 'TEL: 072-592-9577',
      'footer.stores.osaka.faxLine': 'FAX: 072-592-9631',
      'footer.stores.osaka.emailLine': 'EMAIL: OSAKA@tk168.co.jp',
      'footer.stores.malaysia.eyebrow': 'MALAYSIA',
      'footer.stores.malaysia.name': 'Malaysia Branch',
      'footer.stores.malaysia.address': 'Kuala Lumpur, Malaysia<br>Address in preparation',
      'footer.storePhoneLine': 'Phone: In preparation',
      'footer.storeEmailLine': 'Email: In preparation',
      'footer.pages': 'Pages',
      'footer.phone': 'Phone',
      'footer.email': 'Email',
      'footer.address': 'Address',
      'footer.addressValue': '339-0035 Iwatsuki-ku, Saitama-shi, Saitama<br>Sasakubo Shinden',
      'footer.copyright': '© 2026 TK168. All rights reserved.',
      'footer.faq': 'FAQ',
      'footer.shopTokyo': 'TK168 Tokyo',
      'footer.shopOsaka': 'TK168 Osaka',
      'footer.shopFukuoka': 'TK168 Fukuoka',
      'footer.repair': 'Repair',
      'footer.care': 'Maintenance',
      'footer.inspection': 'Inspection',
      'detail.specsTitle': 'Specifications',
      'detail.overviewTitle': 'Overview',
      'detail.contactTitle': 'Contact',
      'detail.benefitsTitle': 'Basic Specs',
      'detail.featuresTitle': 'Highlights',
      'detail.staffTitle': 'Advisor',
      'detail.staffName': 'TK168 Advisory Team',
      'detail.staffRole': 'Imported car advisor',
      'detail.staffBio': 'Focused on performance vehicles and cross-border purchase support, from showroom visits to stock confirmation and proposal guidance.',
      'detail.staffLanguage': 'Chinese / Japanese / English support',
      'detail.staffSupport': 'Video viewing and store booking available',
      'detail.featuredTitle': 'Recommended Stock',
      'detail.moreInventory': 'View more stock',
      'detail.backToResults': 'Back to results',
      'detail.back': 'Go back',
      'detail.call': 'Call advisor',
      'detail.stockConfirm': 'Confirm stock',
      'detail.storeVisit': 'Book a visit',
      'detail.lightbox': 'Vehicle image preview',
      'detail.closeLightbox': 'Close image preview',
      'price.total': 'Total price',
      'price.base': 'Base price',
      'price.baseLong': 'Vehicle base price',
      'price.taxIncluded': '(tax incl.)',
      'price.helpLabel': 'Price guide',
      'price.modalClose': 'Close guide',
      'price.helpTotal': 'Total price (tax included) is a reference amount that combines the vehicle price with registration and standard statutory costs.',
      'price.helpBase': 'Vehicle base price (tax included) refers to the vehicle itself and does not include optional warranty, transport, or extra service charges.',
      'rental.priceDaily': 'Daily rate',
      'rental.priceDeposit': 'Deposit',
      'rental.minDays': 'Minimum rental',
      'rental.fuelType': 'Fuel type',
      'inventory.available': 'In stock',
      'cta.viewDetail': 'View details',
      'inventory.emptyDefault': 'No vehicles match this view right now',
      'inventory.emptyAfterFilter': 'No vehicles match your current filters. Try widening them or reset.',
      'inventory.emptyFiltered': 'No stock vehicles matched {summary}',
      'inventory.keywordSummary': 'keyword "{keyword}"',
      'gallery.main': 'Main',
      'gallery.front': 'Front',
      'gallery.rear': 'Rear',
      'gallery.wheel': 'Wheel',
      'gallery.angle': 'Angle',
      'contact.pageTitle': 'Contact — TK168 Premium Automotive',
      'contact.eyebrow': 'TK168 CONTACT',
      'contact.title': 'Contact us',
      'contact.subtitle': 'Pick the topic you need and fill in the form. An advisor will reply within one business day.',
      'contact.tabs.sellGeneral': 'General request',
      'contact.tabs.sellGeneralEyebrow': 'I want to buy',
      'contact.tabs.sellSpecific': 'Specific model',
      'contact.tabs.sellSpecificEyebrow': 'I want to buy',
      'contact.tabs.rental': 'Rental inquiry',
      'contact.tabs.rentalEyebrow': 'I want to rent',
      'contact.required': 'Required',
      'contact.section.contactInfo': 'Your details',
      'contact.foot': 'An advisor will follow up within one business day. For urgent matters, please call us directly.',
      'contact.submit': 'Send',
      'contact.submitting': 'Sending…',
      'contact.success': 'Thanks — your request has been received. We will be in touch shortly.',
      'contact.error.email': 'Please enter a valid email address.',
      'contact.error.required': 'Please fill in the required fields.',
      'contact.error.network': 'Submission failed. Please try again later.',
      'contact.sellGeneral.lead': 'Looking for the right car? Tell us roughly what you have in mind.',
      'contact.sellSpecific.lead': 'Have a specific model in mind? Share details such as model, year, and mileage.',
      'contact.rental.lead': 'What kind of car would you like to rent? Share your plan with us.',
      'contact.field.bodyType': 'Preferred type',
      'contact.field.brand': 'Preferred brand',
      'contact.field.budget': 'Budget',
      'contact.field.condition': 'Preferred conditions',
      'contact.field.note': 'Notes (optional)',
      'contact.field.email': 'Email address',
      'contact.field.name': 'Name (optional)',
      'contact.field.phone': 'Phone (optional)',
      'contact.field.preferredLanguage': 'Preferred language',
      'contact.field.model': 'Preferred model',
      'contact.field.year': 'Model year',
      'contact.field.mileage': 'Mileage',
      'contact.field.color': 'Color',
      'contact.field.transmission': 'Transmission',
      'contact.field.rentalCar': 'Car you want to rent',
      'contact.field.usage': 'Main usage',
      'contact.field.rentalDate': 'Pickup date',
      'contact.field.rentalDays': 'Rental days',
      'contact.field.pickup': 'Pickup area',
      'contact.option.selectPlaceholder': 'Please select',
      'contact.option.noPreference': 'No preference',
      'contact.bodyType.sedan': 'Sedan',
      'contact.bodyType.suv': 'SUV',
      'contact.bodyType.coupe': 'Coupe / Sports',
      'contact.bodyType.convertible': 'Convertible',
      'contact.bodyType.wagon': 'Wagon',
      'contact.bodyType.minivan': 'Minivan',
      'contact.bodyType.kei': 'Kei car',
      'contact.bodyType.other': 'Other / Undecided',
      'contact.budget.lt3m': 'Under 3M JPY',
      'contact.budget.3to5m': '3M – 5M JPY',
      'contact.budget.5to10m': '5M – 10M JPY',
      'contact.budget.10to20m': '10M – 20M JPY',
      'contact.budget.20mPlus': 'Over 20M JPY',
      'contact.budget.undecided': 'Want to discuss',
      'contact.transmission.at': 'AT',
      'contact.transmission.mt': 'MT',
      'contact.transmission.dct': 'DCT / Semi-AT',
      'contact.usage.city': 'City driving',
      'contact.usage.business': 'Business / Hospitality',
      'contact.usage.trip': 'Short trip',
      'contact.usage.cross': 'Long distance',
      'contact.usage.shoot': 'Shoot / Event',
      'contact.usage.other': 'Other / Need advice',
      'contact.language.ja': '日本語',
      'contact.language.zh': '中文',
      'contact.language.en': 'English',
      'contact.placeholder.brand': 'e.g. Lamborghini / Porsche / undecided',
      'contact.placeholder.condition': 'e.g. no accident history / low mileage / specific color',
      'contact.placeholder.email': 'name@example.com',
      'contact.placeholder.name': 'John Smith',
      'contact.placeholder.phone': '09012345678',
      'contact.placeholder.noteSell': 'Delivery timing, usage, anything else you would like us to know.',
      'contact.placeholder.noteSellSpecific': 'Trim, options, accident history acceptance, delivery timing, etc.',
      'contact.placeholder.noteRental': 'Number of passengers, route, any other requests.',
      'contact.placeholder.model': 'e.g. Lamborghini Urus Performante',
      'contact.placeholder.year': 'e.g. 2020 – 2024',
      'contact.placeholder.mileage': 'e.g. under 30,000 km',
      'contact.placeholder.color': 'e.g. White / Black / no preference',
      'contact.placeholder.budgetSpecific': 'e.g. around 15M JPY',
      'contact.placeholder.budgetRental': 'e.g. 50,000 JPY / day',
      'contact.placeholder.rentalCar': 'e.g. Lamborghini Urus / SUV / luxury sedan',
      'contact.placeholder.rentalDays': 'e.g. 3',
      'contact.placeholder.pickup': 'e.g. Tokyo / Osaka / Saitama',
      'lang.switcher': 'Language',
      'lang.zh': '中文',
      'lang.ja': '日本語',
      'lang.en': 'English'
    }
  };

  let currentLanguage = DEFAULT_LANGUAGE;

  function interpolate(template, params = {}) {
    return Object.entries(params).reduce((result, [key, value]) => (
      result.replaceAll(`{${key}}`, value)
    ), template);
  }

  function readStoredLanguage() {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return SUPPORTED_LANGUAGES.has(stored) ? stored : DEFAULT_LANGUAGE;
    } catch {
      return DEFAULT_LANGUAGE;
    }
  }

  function writeStoredLanguage(language) {
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Ignore storage failures.
    }
  }

  function t(key, params = {}, language = currentLanguage) {
    const catalog = messages[language] || messages[DEFAULT_LANGUAGE];
    const fallbackCatalog = messages[DEFAULT_LANGUAGE];
    const template = catalog[key] || fallbackCatalog[key] || key;
    return interpolate(template, params);
  }

  function getLanguage() {
    return currentLanguage;
  }

  function getLanguageShortLabel(language = currentLanguage) {
    if (language === 'en') return 'EN';
    if (language === 'zh') return 'ZH';
    return 'JA';
  }

  function closeAllSwitchers() {
    document.querySelectorAll('[data-lang-switcher].is-open').forEach((switcher) => {
      switcher.classList.remove('is-open');
      switcher.querySelector('[data-lang-trigger]')?.setAttribute('aria-expanded', 'false');
    });
  }

  function updateSwitchers() {
    document.querySelectorAll('[data-lang-switcher]').forEach((switcher) => {
      switcher.dataset.currentLang = currentLanguage;
      const trigger = switcher.querySelector('[data-lang-trigger]');
      const currentLabel = switcher.querySelector('[data-lang-current-label]');
      if (trigger) {
        trigger.setAttribute('aria-label', t('lang.switcher'));
        trigger.setAttribute('title', t('lang.switcher'));
      }
      if (currentLabel) currentLabel.textContent = getLanguageShortLabel(currentLanguage);
      switcher.querySelectorAll('[data-lang-option]').forEach((option) => {
        const isActive = option.dataset.langOption === currentLanguage;
        option.classList.toggle('is-active', isActive);
        option.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    });
  }

  function fitCompactNewsletterTitle(root = document) {
    const needsCompactTitle = currentLanguage === 'ja' || currentLanguage === 'en';
    root.querySelectorAll('.footer-newsletter h4[data-i18n="footer.newsletterTitle"]').forEach((title) => {
      title.style.whiteSpace = 'nowrap';
      title.style.fontSize = '';
      title.style.letterSpacing = '';
      if (!needsCompactTitle) return;

      const block = title.closest('.footer-newsletter');
      if (!block) return;

      const rawTarget = window.getComputedStyle(block).getPropertyValue('--footer-newsletter-btn-width').trim();
      let targetWidth = Number.parseFloat(rawTarget);
      if (!Number.isFinite(targetWidth) || targetWidth <= 0) {
        const btn = block.querySelector('.footer-btn');
        targetWidth = btn ? btn.getBoundingClientRect().width : title.getBoundingClientRect().width;
      }

      title.style.letterSpacing = '0px';
      const text = (title.textContent || '').replace(/\s+/g, '');
      const glyphCount = Array.from(text).length;
      if (glyphCount <= 1 || !Number.isFinite(targetWidth) || targetWidth <= 0) return;

      const contentWidth = title.getBoundingClientRect().width;
      if (!Number.isFinite(contentWidth) || contentWidth <= 0) return;

      if (currentLanguage === 'en') {
        title.style.fontSize = '16px';
      }

      const adjustedWidth = title.getBoundingClientRect().width;
      if (!Number.isFinite(adjustedWidth) || adjustedWidth <= 0) return;

      // Measure-to-fit: match title visual width to button width without overflow.
      const spacingPx = Math.max(0, Math.min(7, (targetWidth - adjustedWidth) / (glyphCount - 1)));
      title.style.letterSpacing = `${spacingPx}px`;
    });
  }

  function syncDocumentTitle(root = document) {
    if (root !== document) return;
    const titleKey = document.body?.dataset.i18nPageTitle;
    if (!titleKey) return;
    document.title = t(titleKey);
  }

  function applyTranslations(root = document) {
    root.querySelectorAll('[data-i18n]').forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });

    root.querySelectorAll('[data-i18n-html]').forEach((element) => {
      element.innerHTML = t(element.dataset.i18nHtml);
    });

    root.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
      element.setAttribute('placeholder', t(element.dataset.i18nPlaceholder));
    });

    root.querySelectorAll('[data-i18n-title]').forEach((element) => {
      element.setAttribute('title', t(element.dataset.i18nTitle));
    });

    root.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
      element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
    });

    document.documentElement.lang = currentLanguage === 'en'
      ? 'en'
      : (currentLanguage === 'zh' ? 'zh-CN' : 'ja');
    syncDocumentTitle(root);
    updateSwitchers();
    fitCompactNewsletterTitle(root);
  }

  function setLanguage(language) {
    const nextLanguage = SUPPORTED_LANGUAGES.has(language) ? language : DEFAULT_LANGUAGE;
    if (nextLanguage === currentLanguage) return;
    currentLanguage = nextLanguage;
    writeStoredLanguage(currentLanguage);
    applyTranslations(document);
    window.dispatchEvent(new CustomEvent('tk168:languagechange', {
      detail: { language: currentLanguage }
    }));
  }

  function bindSwitchers() {
    document.querySelectorAll('[data-lang-switcher]').forEach((switcher) => {
      if (switcher.dataset.langBound === '1') return;
      switcher.dataset.langBound = '1';

      const trigger = switcher.querySelector('[data-lang-trigger]');
      const options = switcher.querySelectorAll('[data-lang-option]');

      trigger?.addEventListener('click', (event) => {
        event.stopPropagation();
        const willOpen = !switcher.classList.contains('is-open');
        closeAllSwitchers();
        if (!willOpen) return;
        switcher.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      });

      options.forEach((option) => {
        option.addEventListener('click', (event) => {
          event.stopPropagation();
          const nextLanguage = option.dataset.langOption || DEFAULT_LANGUAGE;
          closeAllSwitchers();
          setLanguage(nextLanguage);
        });
      });

      switcher.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        closeAllSwitchers();
        trigger?.focus();
      });
    });

    document.addEventListener('click', () => {
      closeAllSwitchers();
    });
  }

  let didInit = false;

  function init() {
    if (didInit) return;
    didInit = true;
    applyTranslations(document);
    bindSwitchers();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        applyTranslations(document);
        fitCompactNewsletterTitle(document);
      }, { once: true });
    }
    let rafId = 0;
    window.addEventListener('resize', () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => fitCompactNewsletterTitle(document));
    });
  }

  currentLanguage = readStoredLanguage();

  return {
    init,
    t,
    getLanguage,
    setLanguage,
    applyTranslations
  };
})();

/* 在脚本加载当下立即套用语言（不等到 DOMContentLoaded），避免后续脚本与首屏之间出现中文占位再切换的闪烁 */
window.TK168I18N.init();
