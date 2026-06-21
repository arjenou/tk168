window.TK168FormSubmit = (() => {
  const ENDPOINT = '/api/form-submit';

  function getLanguage() {
    return window.TK168I18N?.getLanguage?.() || document.documentElement.lang || 'ja';
  }

  function networkErrorMessage() {
    const lang = getLanguage();
    if (lang === 'zh') return '发送失败，请稍后重试。';
    if (lang === 'en') return 'Submission failed. Please try again later.';
    return '送信に失敗しました。時間をおいて再度お試しください。';
  }

  async function send({ form, data, meta = {} }) {
    const payload = {
      form: String(form || '').trim(),
      lang: getLanguage(),
      submittedAt: new Date().toISOString(),
      pageUrl: window.location.href,
      data: data || {},
      meta: meta || {}
    };

    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });

    let body = {};
    try {
      body = await response.json();
    } catch (_) {
      body = {};
    }

    if (!response.ok) {
      const error = new Error(body.error || `HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }

    return body;
  }

  return {
    send,
    networkErrorMessage
  };
})();
