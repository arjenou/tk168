(function (global) {
  const COPY = {
    zh: {
      title: '在库确认内容填写',
      subtitle: '请在一页内填写下列信息，核对无误后点击「确认」进入确认页。',
      review: {
        title: '在库确认 — 信息核对',
        subtitle: '请确认下列内容与您的意向一致。',
        lead: '确认无误后请点击「提交」。我们将通过您留下的联系方式推进在库与报价确认。'
      },
      labels: {
        request: '确认内容',
        requestType: '确认类型',
        requestNote: '确认备注（可选）',
        name: '姓名',
        kana: '片假名',
        contact: '邮箱/电话',
        email: '邮箱',
        phone: '电话',
        confirm: '内容确认',
        consentAggregate: '同意与通知',
        required: '必填'
      },
      placeholders: {
        requestType: '请选择',
        requestNote: '请填写希望确认的要点、预算、配置偏好等',
        name: '张 三',
        kana: 'チョウ サン',
        email: 'name@example.com',
        phone: '09012345678'
      },
      options: {
        stock: '确认在库状态',
        quote: '确认总价估算',
        spec: '确认配置与参数'
      },
      buttons: {
        edit: '修改',
        prev: '返回',
        confirm: '确认',
        submit: '提交'
      },
      summary: {
        empty: '未填写',
        unconfirmed: '未确认',
        confirmReady: '已同意并完成确认',
        confirmPending: '待确认条款',
        newsOn: '接收通知',
        newsOff: '不接收通知'
      },
      messages: {
        request: '请选择确认类型。',
        name: '请输入姓名。',
        kana: '请输入片假名。',
        contact: '邮箱和电话至少填写一项。',
        policy: '请先同意利用条款与隐私政策。',
        success: '确认内容已整理完成，请按填写的联系方式继续确认库存与报价。'
      },
      consentNews: '接收新车源与活动通知',
      consentPolicy: '同意利用条款和隐私政策'
    },
    ja: {
      title: '在庫確認内容の入力',
      subtitle: '必要事項をこのページで入力し、内容を確認したら「確認」で次の画面へ進みます。',
      review: {
        title: '在庫確認 — 内容の確認',
        subtitle: '入力内容をご確認のうえ、お間違いがなければ送信してください。',
        lead: '送信後、ご入力の連絡先にて在庫・見積りの確認を進めます。'
      },
      labels: {
        request: '確認内容',
        requestType: '確認種別',
        requestNote: '確認メモ（任意）',
        name: '氏名',
        kana: 'フリガナ',
        contact: 'メール・電話',
        email: 'メールアドレス',
        phone: '電話番号',
        confirm: '内容確認',
        consentAggregate: '同意・通知',
        required: '必須'
      },
      placeholders: {
        requestType: '選択してください',
        requestNote: '希望条件や確認したいポイントを入力してください',
        name: '山田 太郎',
        kana: 'ヤマダ タロウ',
        email: 'name@example.com',
        phone: '09012345678'
      },
      options: {
        stock: '在庫状況を確認したい',
        quote: '支払総額の見積りを確認したい',
        spec: '装備・仕様を確認したい'
      },
      buttons: {
        edit: '修正する',
        prev: '戻る',
        confirm: '確認',
        submit: '送信'
      },
      summary: {
        empty: '未入力',
        unconfirmed: '未確認',
        confirmReady: '同意済み（確認完了）',
        confirmPending: '規約確認待ち',
        newsOn: '受け取る',
        newsOff: '受け取らない'
      },
      messages: {
        request: '確認種別を選択してください。',
        name: '氏名を入力してください。',
        kana: 'フリガナを入力してください。',
        contact: 'メールまたは電話番号を入力してください。',
        policy: '利用規約とプライバシーポリシーへの同意が必要です。',
        success: '確認内容の整理が完了しました。入力した連絡先をもとに、在庫と見積りの確認を進めてください。'
      },
      consentNews: '新着在庫・キャンペーン情報を受け取る',
      consentPolicy: '利用規約とプライバシーポリシーに同意する'
    },
    en: {
      title: 'Complete Your Stock Check Request',
      subtitle: 'Fill in everything on this page, then tap Confirm to open the summary page.',
      review: {
        title: 'Stock check — Review',
        subtitle: 'Please verify your details before submitting.',
        lead: 'After you submit, we will follow up using the contact information you provided.'
      },
      labels: {
        request: 'Request',
        requestType: 'Request type',
        requestNote: 'Request note (optional)',
        name: 'Full name',
        kana: 'Name reading',
        contact: 'Email / phone',
        email: 'Email address',
        phone: 'Phone number',
        confirm: 'Confirmation',
        consentAggregate: 'Consent & updates',
        required: 'Required'
      },
      placeholders: {
        requestType: 'Select',
        requestNote: 'Enter the points you want confirmed, budget range, or spec preferences',
        name: 'Taro Yamada',
        kana: 'Yamada Taro',
        email: 'name@example.com',
        phone: '09012345678'
      },
      options: {
        stock: 'Check stock availability',
        quote: 'Check total price estimate',
        spec: 'Check equipment and specifications'
      },
      buttons: {
        edit: 'Edit',
        prev: 'Back',
        confirm: 'Confirm',
        submit: 'Submit'
      },
      summary: {
        empty: 'Not provided',
        unconfirmed: 'Not confirmed',
        confirmReady: 'Agreed and confirmed',
        confirmPending: 'Policy consent pending',
        newsOn: 'Opted in to updates',
        newsOff: 'No marketing updates'
      },
      messages: {
        request: 'Please select a request type.',
        name: 'Please enter your name.',
        kana: 'Please enter the phonetic reading of your name.',
        contact: 'Enter at least one of email or phone number.',
        policy: 'You must agree to the terms of use and privacy policy first.',
        success: 'The request details are organized. Please continue the stock and quotation check using the contact details you entered.'
      },
      consentNews: 'Receive new stock and event notifications',
      consentPolicy: 'I agree to the terms of use and privacy policy'
    }
  };

  function getLanguage() {
    const language = global.TK168I18N?.getLanguage?.();
    return language === 'zh' || language === 'en' || language === 'ja' ? language : 'ja';
  }

  function getText() {
    return COPY[getLanguage()] || COPY.ja;
  }

  global.TK168StockConfirmI18n = {
    COPY,
    getLanguage,
    getText
  };
})(typeof window !== 'undefined' ? window : globalThis);
