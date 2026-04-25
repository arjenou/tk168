(() => {
  const { getNewsDetailRecord } = window.TK168_DATA || {};

  function getLanguage() {
    return window.TK168I18N?.getLanguage?.() || "ja";
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatBodyToHtml(text) {
    const raw = String(text || "").trim();
    if (!raw) return "";
    return raw
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
      .join("");
  }

  function getTagClass(category) {
    const value = String(category);
    if (/(入库|到库|入荷|入庫|新車)/i.test(value)) return "news-detail-article__tag--orange";
    if (/(活动|活動|会社|イベント|品牌|ブランド)/i.test(value)) return "news-detail-article__tag--green";
    return "news-detail-article__tag--teal";
  }

  const hero = document.querySelector(".news-detail-hero");
  const heroWrap = document.querySelector("[data-news-hero-img-wrap]");
  const articleRoot = document.querySelector("[data-news-detail-article]");
  const notFound = document.querySelector("[data-news-notfound]");
  const titleEl = document.querySelector("[data-news-title]");
  const dateEl = document.querySelector("[data-news-date]");
  const bodyEl = document.querySelector("[data-news-body]");
  const tagEl = document.querySelector("[data-news-tag]");
  if (!getNewsDetailRecord) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const iParam = params.get("i");
  const lang = getLanguage();

  const record = getNewsDetailRecord({
    id: id || undefined,
    index: iParam != null && iParam !== "" ? iParam : id ? undefined : 0,
    language: lang
  });

  if (!record || !String(record.title || "").trim()) {
    if (articleRoot) articleRoot.hidden = true;
    if (hero) hero.hidden = true;
    if (notFound) {
      notFound.hidden = false;
    }
    document.title = `${window.TK168I18N?.t?.("news.notFound") || "Not found"} — TK168`;
    return;
  }

  document.title = `${record.title} — TK168 Premium Automotive`;
  if (notFound) notFound.hidden = true;

  if (heroWrap && record.image) {
    heroWrap.innerHTML = `<img src="${escapeHtml(record.image)}" alt="${escapeHtml(record.title)}" loading="eager" decoding="async">`;
  } else if (hero) {
    hero.style.minHeight = "120px";
  }

  if (titleEl) titleEl.textContent = record.title;
  if (dateEl) dateEl.textContent = record.date || "—";
  if (tagEl) {
    if (record.category) {
      tagEl.textContent = record.category;
      tagEl.className = `news-detail-article__tag ${getTagClass(record.category)}`;
      tagEl.removeAttribute("style");
    } else {
      tagEl.setAttribute("hidden", "");
    }
  }

  const bodyHtml = formatBodyToHtml(record.body);
  if (bodyHtml) {
    bodyEl.innerHTML = bodyHtml;
  } else if (record.summary) {
    bodyEl.innerHTML = `<div class="news-detail-article__lead">${formatBodyToHtml(
      record.summary
    )}</div>`;
  } else {
    const empty = window.TK168I18N?.t?.("news.detailEmpty");
    bodyEl.innerHTML = `<p class="news-detail-article__empty">${
      empty || "—"
    }</p>`;
  }

  const back = document.querySelector(".news-detail-article__back");
  if (back) {
    const listUrl = "about.html#about-news";
    back.setAttribute("href", listUrl);
  }

  window.addEventListener("tk168:languagechange", () => {
    const next = getNewsDetailRecord({
      id: id || undefined,
      index: iParam != null && iParam !== "" ? iParam : id ? undefined : 0,
      language: getLanguage()
    });
    if (!next) {
      window.location.reload();
      return;
    }
    if (titleEl) titleEl.textContent = next.title;
    if (dateEl) dateEl.textContent = next.date || "—";
    if (tagEl) {
      if (next.category) {
        tagEl.textContent = next.category;
        tagEl.className = `news-detail-article__tag ${getTagClass(next.category)}`;
        tagEl.removeAttribute("hidden");
      } else {
        tagEl.setAttribute("hidden", "");
      }
    }
    const h = formatBodyToHtml(next.body);
    if (h) {
      bodyEl.innerHTML = h;
    } else if (next.summary) {
      bodyEl.innerHTML = `<div class="news-detail-article__lead">${formatBodyToHtml(
        next.summary
      )}</div>`;
    } else {
      const empty = window.TK168I18N?.t?.("news.detailEmpty");
      bodyEl.innerHTML = `<p class="news-detail-article__empty">${
        empty || "—"
      }</p>`;
    }
    document.title = `${next.title} — TK168 Premium Automotive`;
  });
})();
