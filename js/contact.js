/* ============================================================
   contact.js — お問い合わせページ
   - 3 タブ（sell-general / sell-specific / rental）の切替
   - URL クエリ（?type=sell-general 等）で初期タブを指定可
   - メールアドレス必須バリデーション
   - 送信は現状フロント完結のスタブ（TODO: バックエンド連携）
   ============================================================ */
(() => {
  'use strict';

  const STORAGE_DRAFT_KEY = 'tk168_contact_draft';
  const VALID_TABS = ['sell-general', 'sell-specific', 'rental'];

  const i18n = window.TK168I18N;
  const t = (key, fallback) => {
    if (i18n && typeof i18n.t === 'function') {
      const value = i18n.t(key);
      if (value && value !== key) return value;
    }
    return fallback != null ? fallback : key;
  };

  const noUrlSync = !!document.querySelector('[data-contact-no-url-sync]');

  const tabs = Array.from(document.querySelectorAll('.contact-tab'));
  const forms = Array.from(document.querySelectorAll('.contact-board[data-form]'));

  function readInitialTab() {
    try {
      const params = new URLSearchParams(window.location.search);
      const requested = (params.get('type') || params.get('tab') || '').toLowerCase();
      if (VALID_TABS.includes(requested)) return requested;
    } catch (_) {
      /* noop */
    }
    return VALID_TABS[0];
  }

  function activateTab(name) {
    if (!VALID_TABS.includes(name)) return;
    tabs.forEach((tab) => {
      const isActive = tab.dataset.tab === name;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    forms.forEach((form) => {
      const isActive = form.dataset.form === name;
      form.classList.toggle('is-active', isActive);
    });

    if (!noUrlSync) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('type', name);
        window.history.replaceState({}, '', url.toString());
      } catch (_) {
        /* noop */
      }
    }
  }

  function bindTabs() {
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => activateTab(tab.dataset.tab));
    });
  }

  function isValidEmail(value) {
    if (!value) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function setMessage(form, text, type) {
    const slot = form.querySelector('[data-message]');
    if (!slot) return;
    slot.textContent = text || '';
    slot.classList.toggle('is-success', type === 'success');
  }

  function clearErrors(form) {
    form.querySelectorAll('.has-error').forEach((el) => el.classList.remove('has-error'));
  }

  function collectPayload(form) {
    const payload = {
      type: form.dataset.form,
      source: document.getElementById('home-contact') ? 'home' : 'contact',
      fields: {}
    };
    Array.from(form.elements).forEach((el) => {
      if (!el.name) return;
      payload.fields[el.name] = (el.value || '').trim();
    });
    payload.submittedAt = new Date().toISOString();
    payload.lang = (i18n && typeof i18n.getLanguage === 'function') ? i18n.getLanguage() : (document.documentElement.lang || 'ja');
    return payload;
  }

  function persistDraft(payload) {
    try {
      const drafts = JSON.parse(localStorage.getItem(STORAGE_DRAFT_KEY) || '[]');
      drafts.push(payload);
      while (drafts.length > 20) drafts.shift();
      localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(drafts));
    } catch (_) {
      /* localStorage unavailable */
    }
  }

  async function handleSubmit(form, event) {
    event.preventDefault();
    clearErrors(form);

    const emailField = form.querySelector('input[name="email"]');
    const emailValue = emailField ? emailField.value.trim() : '';

    if (!isValidEmail(emailValue)) {
      if (emailField) {
        emailField.classList.add('has-error');
        emailField.focus();
      }
      setMessage(form, t('contact.error.email', 'メールアドレスをご確認ください。'), 'error');
      return;
    }

    const requiredText = form.querySelector('input[name="model"][required]');
    if (requiredText && !requiredText.value.trim()) {
      requiredText.classList.add('has-error');
      requiredText.focus();
      setMessage(form, t('contact.error.required', '必須項目を入力してください。'), 'error');
      return;
    }

    const submitBtn = form.querySelector('.contact-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.originalText = submitBtn.textContent;
      submitBtn.textContent = t('contact.submitting', '送信中…');
    }

    const payload = collectPayload(form);
    persistDraft(payload);

    try {
      // TODO: 後ほど Cloudflare Worker (worker/) に POST するエンドポイントを追加
      //       例: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(payload) })
      await new Promise((resolve) => setTimeout(resolve, 600));

      setMessage(form, t('contact.success', '送信が完了しました。担当者よりご連絡いたします。'), 'success');
      form.reset();
    } catch (err) {
      console.error('[contact] submit failed', err);
      setMessage(form, t('contact.error.network', '送信に失敗しました。時間をおいて再度お試しください。'), 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        if (submitBtn.dataset.originalText) {
          submitBtn.textContent = submitBtn.dataset.originalText;
          delete submitBtn.dataset.originalText;
        }
      }
    }
  }

  function bindForms() {
    forms.forEach((form) => {
      form.addEventListener('submit', (ev) => handleSubmit(form, ev));

      form.querySelectorAll('input, select, textarea').forEach((field) => {
        field.addEventListener('input', () => {
          if (field.classList.contains('has-error')) field.classList.remove('has-error');
          const slot = form.querySelector('[data-message]');
          if (slot && slot.textContent && !slot.classList.contains('is-success')) {
            slot.textContent = '';
          }
        });
      });
    });
  }

  function syncSubmitOnLanguageChange() {
    window.addEventListener('tk168:languagechange', () => {
      forms.forEach((form) => {
        const slot = form.querySelector('[data-message]');
        if (slot) slot.textContent = '';
      });
    });
  }

  function init() {
    if (!tabs.length || !forms.length) return;
    bindTabs();
    bindForms();
    syncSubmitOnLanguageChange();
    activateTab(readInitialTab());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
