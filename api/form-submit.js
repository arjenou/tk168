const nodemailer = require('nodemailer');

const FORM_LABELS = {
  contact: 'お問い合わせ',
  inquiry: '来店予約',
  'service-appointment': '付加サービス予約',
  'rental-inquiry': 'レンタル相談',
  'stock-confirm': '在庫確認'
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
  const label = prefix || 'value';
  return [`${label}: ${String(value)}`];
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

function formatEmailBody(payload) {
  const lines = [
    `フォーム: ${FORM_LABELS[payload.form] || payload.form}`,
    `言語: ${payload.lang || '-'}`,
    `送信日時: ${payload.submittedAt || '-'}`,
    `ページ: ${payload.pageUrl || '-'}`,
    ''
  ];

  if (payload.meta && Object.keys(payload.meta).length) {
    lines.push('--- Meta ---', ...flattenLines(payload.meta), '');
  }

  lines.push('--- 入力内容 ---', ...flattenLines(payload.data));
  return lines.join('\n');
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

    const label = FORM_LABELS[form] || form;
    const subject = `[TK168] ${label}`;
    const text = formatEmailBody(payload);
    const replyTo = findReplyEmail(payload);

    await transporter.sendMail({
      from: `"TK168 Web" <${user}>`,
      to: to.split(',').map((entry) => entry.trim()).filter(Boolean),
      replyTo: replyTo || undefined,
      subject,
      text
    });

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
