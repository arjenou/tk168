/**
 * Full-page skeleton overlay until DOM + fonts are ready (min display time).
 * Skips: home (intro video), admin, data-tk168-skeleton="off", maintenance index.
 */
(function () {
  function shouldSkip() {
    var b = document.body;
    if (b && b.getAttribute("data-tk168-skeleton") === "off") return true;
    var path = (typeof location !== "undefined" && location.pathname) ? location.pathname.toLowerCase() : "";
    if (path.indexOf("admin.html") !== -1 || path.endsWith("/admin")) return true;
    if (path.indexOf("home.html") !== -1 || path === "/home" || path.endsWith("/home")) return true;
    return false;
  }

  if (shouldSkip()) {
    document.documentElement.classList.add("tk168-skeleton-ready");
    return;
  }

  var MIN_MS = 380;
  var start = typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
  document.documentElement.classList.add("tk168-skeleton-active");

  var overlay = document.createElement("div");
  overlay.className = "tk168-skeleton-overlay";
  overlay.setAttribute("role", "progressbar");
  overlay.setAttribute("aria-busy", "true");
  overlay.setAttribute("aria-label", "Loading");

  var nav = document.createElement("div");
  nav.className = "tk168-sk-nav tk168-sk-shimmer";
  overlay.appendChild(nav);

  var hero = document.createElement("div");
  hero.className = "tk168-sk-hero tk168-sk-shimmer";
  overlay.appendChild(hero);

  var lines = document.createElement("div");
  lines.className = "tk168-sk-lines";
  for (var i = 0; i < 3; i += 1) {
    var line = document.createElement("span");
    line.className = "tk168-sk-shimmer";
    lines.appendChild(line);
  }
  overlay.appendChild(lines);

  var grid = document.createElement("div");
  grid.className = "tk168-sk-grid";
  for (var j = 0; j < 8; j += 1) {
    var cell = document.createElement("span");
    cell.className = "tk168-sk-shimmer";
    grid.appendChild(cell);
  }
  overlay.appendChild(grid);

  document.body.insertBefore(overlay, document.body.firstChild);

  function finish() {
    var elapsed = (typeof performance !== "undefined" && performance.now ? performance.now() : Date.now()) - start;
    var wait = Math.max(0, MIN_MS - elapsed);
    window.setTimeout(function () {
      overlay.classList.add("is-done");
      overlay.setAttribute("aria-busy", "false");
      document.documentElement.classList.remove("tk168-skeleton-active");
      document.documentElement.classList.add("tk168-skeleton-ready");
      window.setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 480);
    }, wait);
  }

  function whenReady() {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(finish);
    });
  }

  var fontsReady = document.fonts && document.fonts.ready
    ? document.fonts.ready.catch(function () {})
    : Promise.resolve();

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      function () {
        Promise.resolve(fontsReady).then(whenReady);
      },
      { once: true }
    );
  } else {
    Promise.resolve(fontsReady).then(whenReady);
  }
})();
