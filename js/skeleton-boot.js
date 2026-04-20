/**
 * TK168 page-transition + skeleton bootstrap.
 *
 * Goal: silky cross-page transitions, never a white flash. Strategy:
 *   1. On Chromium (both same-document and cross-document View Transitions
 *      are natively supported via @view-transition), we do NOTHING extra —
 *      the browser crossfades the old and new page so there is no blank
 *      moment between them.
 *   2. On Safari/Firefox, we fall back to a skeleton overlay but keep the
 *      outgoing page visible behind it (no body fade-out). A slim top
 *      progress bar gives feedback during the network round-trip so the
 *      UI doesn't feel stuck.
 *   3. The head-injected overlay only appears on the *incoming* page while
 *      it hydrates — never on the outgoing page — so you never see content
 *      replaced by a skeleton replaced by new content on the same screen.
 *
 * Opt-out: <body data-tk168-skeleton="off"> or html[data-skeleton-layout="off"].
 */
(function () {
  var MIN_MS = 260;
  var STORAGE_KEY = "tk168:nextSkeleton";
  var root = document.documentElement;

  // Chromium with cross-document View Transitions: let the browser handle it.
  // (Detected via the same-document API; @view-transition in CSS activates
  // the cross-document flavor on browsers that ship it — Chrome 126+.)
  var supportsViewTransitions =
    typeof document.startViewTransition === "function";

  function optedOut() {
    if (root.getAttribute("data-skeleton-layout") === "off") return true;
    if (document.body && document.body.getAttribute("data-tk168-skeleton") === "off") return true;
    var path = (location && location.pathname ? location.pathname : "").toLowerCase();
    if (path.indexOf("admin") !== -1) return true;
    if (path === "/" || path.endsWith("/index.html")) return true;
    if (path.indexOf("home.html") !== -1 || path === "/home" || path.endsWith("/home")) return true;
    return false;
  }

  function pathLayout() {
    var p = (location && location.pathname ? location.pathname : "").toLowerCase();
    if (p.indexOf("detail") !== -1) return { layout: "detail", theme: "light" };
    if (p.indexOf("brand") !== -1) return { layout: "brand", theme: "light" };
    if (p.indexOf("favorites") !== -1) return { layout: "favorites", theme: "light" };
    if (p.indexOf("rental-inquiry") !== -1) return { layout: "form", theme: "light" };
    if (p.indexOf("rental") !== -1) return { layout: "hero-grid", theme: "light" };
    if (p.indexOf("service-appointment") !== -1) return { layout: "form", theme: "light" };
    if (p.indexOf("service") !== -1) return { layout: "hero-text", theme: "light" };
    if (p.indexOf("auto-export") !== -1) return { layout: "hero-text", theme: "light" };
    if (p.indexOf("stock-confirm") !== -1) return { layout: "form", theme: "light" };
    if (p.indexOf("inquiry") !== -1) return { layout: "form", theme: "light" };
    if (p.indexOf("about") !== -1) return { layout: "hero-text", theme: "light" };
    return { layout: "hero-text", theme: "light" };
  }

  function resolveLayout() {
    var explicit = root.getAttribute("data-skeleton-layout");
    var explicitTheme = root.getAttribute("data-skeleton-theme");
    if (explicit && explicit !== "auto") {
      return { layout: explicit, theme: explicitTheme || "light" };
    }
    var cached = null;
    try { cached = sessionStorage.getItem(STORAGE_KEY); } catch (_) {}
    if (cached) {
      try { sessionStorage.removeItem(STORAGE_KEY); } catch (_) {}
      try {
        var parsed = JSON.parse(cached);
        if (parsed && parsed.path && location.pathname.indexOf(parsed.path) !== -1) {
          return { layout: parsed.layout, theme: parsed.theme || "light" };
        }
      } catch (_) {}
    }
    return pathLayout();
  }

  function block(extraClass) {
    var span = document.createElement("span");
    span.className = "tk168-sk-block" + (extraClass ? " " + extraClass : "");
    return span;
  }
  function nav() {
    var n = document.createElement("div");
    n.className = "tk168-sk-nav tk168-sk-block";
    return n;
  }
  function hero() {
    var h = document.createElement("div");
    h.className = "tk168-sk-hero tk168-sk-block";
    return h;
  }
  function lines(count) {
    var wrap = document.createElement("div");
    wrap.className = "tk168-sk-lines";
    for (var i = 0; i < (count || 3); i += 1) wrap.appendChild(block());
    return wrap;
  }
  function grid(count) {
    var wrap = document.createElement("div");
    wrap.className = "tk168-sk-grid";
    for (var i = 0; i < (count || 8); i += 1) wrap.appendChild(block());
    return wrap;
  }
  function brandnav(count) {
    var wrap = document.createElement("div");
    wrap.className = "tk168-sk-brandnav";
    for (var i = 0; i < (count || 6); i += 1) wrap.appendChild(block());
    return wrap;
  }
  function form() {
    var wrap = document.createElement("div");
    wrap.className = "tk168-sk-form";
    for (var i = 0; i < 4; i += 1) wrap.appendChild(block());
    wrap.appendChild(block("is-tall"));
    wrap.appendChild(block());
    return wrap;
  }
  function detail() {
    var wrap = document.createElement("div");
    wrap.className = "tk168-sk-detail";
    var gallery = document.createElement("div");
    gallery.className = "tk168-sk-gallery tk168-sk-block";
    wrap.appendChild(gallery);
    var spec = document.createElement("div");
    spec.className = "tk168-sk-spec";
    for (var i = 0; i < 5; i += 1) spec.appendChild(block());
    wrap.appendChild(spec);
    return wrap;
  }
  function col(children) {
    var wrap = document.createElement("div");
    wrap.className = "tk168-sk-col";
    for (var i = 0; i < children.length; i += 1) wrap.appendChild(children[i]);
    return wrap;
  }
  function buildFor(layout) {
    switch (layout) {
      case "detail":    return col([detail(), lines(2), grid(4)]);
      case "brand":     return col([brandnav(), grid(8)]);
      case "favorites": return col([hero(), grid(6)]);
      case "hero-grid": return col([hero(), grid(8)]);
      case "form":      return col([lines(2), form()]);
      case "hero-text":
      default:          return col([hero(), lines(3), grid(6)]);
    }
  }

  // -------- Incoming-page skeleton (only on non-Chromium engines) -------
  function mountIncoming(resolved) {
    var overlay = document.createElement("div");
    overlay.className = "tk168-skeleton-overlay";
    overlay.setAttribute("role", "progressbar");
    overlay.setAttribute("aria-busy", "true");
    overlay.setAttribute("aria-label", "Loading");
    overlay.appendChild(nav());
    overlay.appendChild(buildFor(resolved.layout));
    (document.body || document.documentElement).appendChild(overlay);
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", function () {
        if (overlay.parentNode !== document.body) document.body.appendChild(overlay);
      }, { once: true });
    }
    return overlay;
  }

  function runIncoming() {
    if (optedOut()) return;
    var resolved = resolveLayout();
    root.setAttribute("data-skeleton-theme", resolved.theme);
    root.classList.add("tk168-skeleton-active");
    var overlay = mountIncoming(resolved);
    var start = (performance && performance.now) ? performance.now() : Date.now();
    function finish() {
      var elapsed = ((performance && performance.now) ? performance.now() : Date.now()) - start;
      var wait = Math.max(0, MIN_MS - elapsed);
      window.setTimeout(function () {
        overlay.classList.add("is-done");
        overlay.setAttribute("aria-busy", "false");
        root.classList.remove("tk168-skeleton-active");
        window.setTimeout(function () {
          if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, 460);
      }, wait);
    }
    function whenReady() {
      var fontsReady = (document.fonts && document.fonts.ready)
        ? document.fonts.ready.catch(function () {})
        : Promise.resolve();
      Promise.resolve(fontsReady).then(function () {
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(finish);
        });
      });
    }
    if (document.readyState === "complete" || document.readyState === "interactive") {
      whenReady();
    } else {
      document.addEventListener("DOMContentLoaded", whenReady, { once: true });
    }
  }

  // -------- Outgoing-page progress bar (non-Chromium only) --------------
  // Google-style thin indeterminate bar pinned to the top of the viewport
  // so the user gets immediate feedback while the new document loads. The
  // outgoing page content itself is NOT faded out — no white flash.
  function ensureProgressBar() {
    var bar = document.querySelector(".tk168-progress-bar");
    if (bar) return bar;
    bar = document.createElement("div");
    bar.className = "tk168-progress-bar";
    var fill = document.createElement("span");
    bar.appendChild(fill);
    (document.body || document.documentElement).appendChild(bar);
    bar.getBoundingClientRect();
    return bar;
  }
  function startProgress() {
    var bar = ensureProgressBar();
    bar.classList.add("is-active");
  }

  // -------- Link-click interception -------------------------------------
  function decideLayoutFor(path) {
    path = (path || "").toLowerCase();
    if (path.indexOf("home.html") !== -1 || path === "/home" || path.endsWith("/home") ||
        path.indexOf("admin") !== -1 || path === "/" || path.endsWith("/index.html")) {
      return null;
    }
    if (path.indexOf("detail") !== -1) return "detail";
    if (path.indexOf("brand") !== -1) return "brand";
    if (path.indexOf("favorites") !== -1) return "favorites";
    if (path.indexOf("rental-inquiry") !== -1) return "form";
    if (path.indexOf("rental") !== -1) return "hero-grid";
    if (path.indexOf("service-appointment") !== -1) return "form";
    if (path.indexOf("service") !== -1) return "hero-text";
    if (path.indexOf("auto-export") !== -1) return "hero-text";
    if (path.indexOf("stock-confirm") !== -1) return "form";
    if (path.indexOf("inquiry") !== -1) return "form";
    if (path.indexOf("about") !== -1) return "hero-text";
    return "hero-text";
  }

  document.addEventListener("click", function (event) {
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    var a = event.target && event.target.closest ? event.target.closest("a[href]") : null;
    if (!a || a.hasAttribute("download") || a.dataset.noTransition === "1") return;
    var target = (a.getAttribute("target") || "").toLowerCase();
    if (target && target !== "_self") return;
    var href = a.getAttribute("href") || "";
    if (!href || href.charAt(0) === "#") return;
    var url;
    try { url = new URL(a.href, location.href); } catch (_) { return; }
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) return;
    var layout = decideLayoutFor(url.pathname);
    if (!layout) return;
    // Hint the next page so its head-injected skeleton matches.
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        path: url.pathname, layout: layout, theme: "light"
      }));
    } catch (_) {}
    // Chromium: let native View Transitions handle the crossfade — do NOT
    // mount anything that would cover the outgoing page.
    if (supportsViewTransitions) return;
    // Other browsers: show a thin top progress bar. Outgoing content stays
    // fully visible so there's no flash to white.
    startProgress();
  }, true);

  // Incoming-page skeleton only for non-Chromium engines.
  if (!supportsViewTransitions) {
    runIncoming();
  } else {
    // Make sure any leftover class/attr is cleaned on view-transition pages.
    root.classList.remove("tk168-skeleton-active");
  }

  // bfcache restore — clear any transient UI instantly.
  window.addEventListener("pageshow", function () {
    var bar = document.querySelector(".tk168-progress-bar");
    if (bar) bar.classList.remove("is-active");
    root.classList.remove("tk168-skeleton-active");
    var overlays = document.querySelectorAll(".tk168-skeleton-overlay");
    for (var i = 0; i < overlays.length; i += 1) {
      if (overlays[i].parentNode) overlays[i].parentNode.removeChild(overlays[i]);
    }
  });
})();
