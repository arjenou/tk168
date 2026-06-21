const nodemailer = require('nodemailer');

const FORM_LABELS_ZH = {
  contact: '咨询',
  inquiry: '来店预约',
  'service-appointment': '增值服务预约',
  'rental-inquiry': '租车咨询',
  'stock-confirm': '在库确认'
};

const FORM_LABELS_USER = {
  contact: { zh: '咨询', ja: 'お問い合わせ', en: 'contact inquiry' },
  inquiry: { zh: '来店预约', ja: '来店予約', en: 'visit booking' },
  'service-appointment': { zh: '增值服务预约', ja: '付加サービス予約', en: 'service booking' },
  'rental-inquiry': { zh: '租车咨询', ja: 'レンタル相談', en: 'rental inquiry' },
  'stock-confirm': { zh: '在库确认', ja: '在庫確認', en: 'stock confirmation' }
};

const LANG_LABELS_ZH = {
  ja: '日语',
  zh: '中文',
  en: '英语'
};

const KEY_LABELS_ZH = {
  type: '咨询类型',
  source: '来源',
  fields: '填写内容',
  submittedAt: '提交时间',
  lang: '界面语言',
  appointment: '来店预约',
  date: '日期',
  time: '时间',
  note: '备注',
  name: '姓名',
  kana: '姓名读音',
  email: '邮箱',
  phone: '电话',
  consentNews: '接收资讯通知',
  consentPolicy: '同意条款',
  bodyType: '车型类型',
  brand: '品牌',
  budget: '预算',
  condition: '希望条件',
  model: '希望车型',
  year: '年式',
  mileage: '行驶距离',
  color: '希望颜色',
  transmission: '变速箱',
  rentalCar: '希望租到的车',
  usage: '主要用途',
  rentalDate: '希望用车日期',
  rentalDays: '使用天数',
  pickup: '取车地点',
  mode: '沟通方式',
  category: '服务类别',
  stage: '当前阶段',
  vehicle: '车辆信息/问题',
  region: '所在城市/地区',
  language: '偏好语言',
  days: '预计租期（天）',
  wechat: '微信',
  whatsapp: 'WhatsApp',
  deliveryMethod: '交付方式',
  store: '门店',
  deliveryAddress: '送车/配送地址',
  consentIdpDeposit: 'IDP押金同意',
  vehicleId: '车辆ID',
  requestType: '确认类型',
  requestNote: '确认备注',
  isRentalDetail: '租车详情流程',
  v: '数据版本',
  vehicleName: '车辆名称',
  vehicleBrand: '车辆品牌',
  serviceTitle: '服务标题',
  contactType: '咨询类别',
  contactTypeValue: '咨询类别',
  pageUrl: '来源页面',
  value: '内容'
};

const VALUE_LABELS_ZH = {
  type: {
    'sell-general': '大致购车需求',
    'sell-specific': '具体车型咨询',
    rental: '租车咨询'
  },
  contactType: {
    'sell-general': '大致购车需求',
    'sell-specific': '具体车型咨询',
    rental: '租车咨询'
  },
  source: {
    home: '首页',
    contact: '咨询页'
  },
  requestType: {
    stock: '确认在库状态',
    quote: '确认总价估算',
    spec: '确认配置与参数'
  },
  deliveryMethod: {
    visit: '到店',
    delivery: '配送',
    ship: '配送'
  },
  mode: {
    visit: '到店面谈',
    remote: '电话/微信',
    video: '视频沟通'
  }
};

const MAX_BODY_BYTES = 64 * 1024;

function getMailConfig() {
  const user = String(process.env.GMAIL_USER || '').trim();
  const pass = String(process.env.GMAIL_APP_PASSWORD || '').trim();
  const to = String(process.env.FORM_MAIL_TO || user).trim();
  if (!user || !pass) {
    const error = new Error('Gmail credentials are not configured');
    error.code = 'MAIL_NOT_CONFIGURED';
    throw error;
  }
  return { user, pass, to };
}

function normalizeLang(lang) {
  const value = String(lang || '').trim().toLowerCase();
  if (value === 'zh' || value === 'en') return value;
  return 'ja';
}

function translateKey(keyPath) {
  if (keyPath === 'fields.lang') return '希望联络语言';
  return String(keyPath || '')
    .split('.')
    .map((segment) => KEY_LABELS_ZH[segment] || segment)
    .join('.');
}

function formatValue(keyPath, value) {
  if (typeof value === 'boolean') return value ? '是' : '否';
  const lastKey = String(keyPath || '').split('.').pop();
  const mapped = VALUE_LABELS_ZH[lastKey]?.[String(value)];
  return mapped != null ? mapped : String(value);
}

function flattenLines(value, prefix = '') {
  if (value == null || value === '') return [];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => flattenLines(item, `${prefix}[${index}]`));
  }
  if (typeof value === 'object') {
    return Object.entries(value).flatMap(([key, nested]) => {
      const nextPrefix = prefix ? `${prefix}.${key}` : key;
      return flattenLines(nested, nextPrefix);
    });
  }
  const label = translateKey(prefix || 'value');
  return [`${label}: ${formatValue(prefix, value)}`];
}

function findReplyEmail(payload) {
  const data = payload?.data || {};
  const candidates = [
    data.email,
    data.fields?.email,
    payload?.meta?.email
  ];
  for (const candidate of candidates) {
    const value = String(candidate || '').trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return value;
  }
  return '';
}

function findSubmitterName(payload) {
  const data = payload?.data || {};
  const candidates = [data.name, data.fields?.name];
  for (const candidate of candidates) {
    const value = String(candidate || '').trim();
    if (value) return value;
  }
  return '';
}

function formatAdminEmailBody(payload) {
  const formLabel = FORM_LABELS_ZH[payload.form] || payload.form;
  const langLabel = LANG_LABELS_ZH[normalizeLang(payload.lang)] || payload.lang || '-';

  const lines = [
    `表单: ${formLabel}`,
    `语言: ${langLabel}`,
    `提交时间: ${payload.submittedAt || '-'}`,
    `来源页面: ${payload.pageUrl || '-'}`,
    ''
  ];

  if (payload.meta && Object.keys(payload.meta).length) {
    lines.push('--- 附加信息 ---', ...flattenLines(payload.meta), '');
  }

  lines.push('--- 填写内容 ---', ...flattenLines(payload.data));
  return lines.join('\n');
}

function getUserFormLabel(form, lang) {
  const labels = FORM_LABELS_USER[form];
  if (!labels) return form;
  return labels[normalizeLang(lang)] || labels.ja;
}

function buildAutoReply(payload) {
  const lang = normalizeLang(payload.lang);
  const formLabel = getUserFormLabel(payload.form, lang);
  const name = findSubmitterName(payload);
  const greetingName = name || (lang === 'zh' ? '客户' : lang === 'en' ? 'Customer' : 'お客様');

  if (lang === 'zh') {
    return {
      subject: `【TK168】已收到您的${formLabel}`,
      text: [
        `${greetingName} 您好：`,
        '',
        '感谢您联系 TK168。',
        '',
        `我们已收到您提交的「${formLabel}」信息。工作人员将在 1 个工作日内通过您留下的联系方式与您联系。`,
        '',
        '如需紧急咨询，也欢迎直接致电各门店。',
        '',
        '此邮件为系统自动发送，请勿直接回复本邮件。',
        '',
        'TK168',
        'https://tk168.co.jp'
      ].join('\n')
    };
  }

  if (lang === 'en') {
    return {
      subject: `[TK168] We received your ${formLabel}`,
      text: [
        `Dear ${greetingName},`,
        '',
        'Thank you for contacting TK168.',
        '',
        `We have received your ${formLabel} submission. A member of our team will follow up within one business day using the contact details you provided.`,
        '',
        'For urgent matters, you are also welcome to call any of our stores directly.',
        '',
        'This is an automated message. Please do not reply to this email.',
        '',
        'TK168',
        'https://tk168.co.jp'
      ].join('\n')
    };
  }

  return {
    subject: `【TK168】${formLabel}を受け付けました`,
    text: [
      `${greetingName} 様`,
      '',
      'この度は TK168 へお問い合わせいただき、誠にありがとうございます。',
      '',
      `ご入力いただいた「${formLabel}」の内容を受け付けました。担当者より 1 営業日以内に、ご記入の連絡先へご連絡いたします。`,
      '',
      'お急ぎの場合は、各店舗へお電話いただくことも可能です。',
      '',
      '本メールは自動送信です。このメールへの返信はお控えください。',
      '',
      'TK168',
      'https://tk168.co.jp'
    ].join('\n')
  };
}

function parsePayload(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const raw = typeof req.body === 'string' ? req.body : '';
  if (!raw) return {};
  if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) {
    const error = new Error('Payload too large');
    error.code = 'PAYLOAD_TOO_LARGE';
    throw error;
  }
  return JSON.parse(raw);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = parsePayload(req);
    const form = String(payload.form || '').trim();
    if (!form) return res.status(400).json({ error: 'Missing form type' });

    const { user, pass, to } = getMailConfig();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });

    const adminLabel = FORM_LABELS_ZH[form] || form;
    const adminSubject = `[TK168] ${adminLabel}`;
    const adminText = formatAdminEmailBody(payload);
    const replyTo = findReplyEmail(payload);
    const customerEmail = replyTo;

    await transporter.sendMail({
      from: `"TK168 Web" <${user}>`,
      to: to.split(',').map((entry) => entry.trim()).filter(Boolean),
      replyTo: replyTo || undefined,
      subject: adminSubject,
      text: adminText
    });

    if (customerEmail) {
      const autoReply = buildAutoReply(payload);
      try {
        await transporter.sendMail({
          from: `"TK168" <${user}>`,
          to: customerEmail,
          subject: autoReply.subject,
          text: autoReply.text
        });
      } catch (autoReplyError) {
        console.error('[form-submit] auto-reply failed', autoReplyError);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('[form-submit]', error);
    if (error.code === 'PAYLOAD_TOO_LARGE') {
      return res.status(413).json({ error: 'Payload too large' });
    }
    if (error.code === 'MAIL_NOT_CONFIGURED') {
      return res.status(503).json({ error: 'Mail service unavailable' });
    }
    return res.status(500).json({ error: 'Failed to send' });
  }
};
