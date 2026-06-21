window.TK168FormSubmit = (() => {
  const ENDPOINT = '/api/form-submit';

  function getLanguage() {
    return window.TK168I18N?.getLanguage?.() || document.documentElement.lang || 'ja';
  }

  function translate(key, fallbacks) {
    const via = window.TK168I18N?.t?.(key);
    if (via && via !== key) return via;
    const lang = getLanguage();
    return fallbacks[lang] || fallbacks.ja;
  }

  function submitLabel() {
    return translate('contact.submit', { ja: '送信する', zh: '提交', en: 'Send' });
  }

  function submittingLabel() {
    return translate('contact.submitting', { ja: '送信中…', zh: '提交中…', en: 'Sending…' });
  }

  function successButtonLabel() {
    return translate('form.submitSuccessButton', { ja: '送信完了', zh: '发送成功', en: 'Sent' });
  }

  function networkErrorMessage() {
    const lang = getLanguage();
    if (lang === 'zh') return '发送失败，请稍后重试。';
    if (lang === 'en') return 'Submission failed. Please try again later.';
    return '送信に失敗しました。時間をおいて再度お試しください。';
  }

  function beginSubmit(button) {
    if (!button) return;
    button.disabled = true;
    if (!button.dataset.submitOriginalText) {
      button.dataset.submitOriginalText = button.textContent;
    }
    button.textContent = submittingLabel();
    button.classList.remove('is-submit-success');
  }

  function markSubmitSuccess(button) {
    if (!button) return;
    button.disabled = true;
    button.textContent = successButtonLabel();
    button.classList.add('is-submit-success');
  }

  function resetSubmitButton(button) {
    if (!button) return;
    button.disabled = false;
    button.classList.remove('is-submit-success');
    if (button.dataset.submitOriginalText) {
      button.textContent = button.dataset.submitOriginalText;
      delete button.dataset.submitOriginalText;
    } else {
      button.textContent = submitLabel();
    }
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
    submitLabel,
    submittingLabel,
    successButtonLabel,
    beginSubmit,
    markSubmitSuccess,
    resetSubmitButton,
    networkErrorMessage
  };
})();
