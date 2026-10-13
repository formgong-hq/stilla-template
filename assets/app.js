/* Stilla: menu, wishlist, filters, forms. No dependencies. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Mobile menu
  var burger = $(".burger"), nav = $("#nav");
  if (burger && nav) burger.addEventListener("click", function () {
    var open = burger.getAttribute("aria-expanded") !== "true";
    burger.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
  });

  // Toast
  var toast = $(".toast");
  function say(msg) { if (!toast) return; toast.textContent = msg; toast.classList.add("show"); clearTimeout(say.t); say.t = setTimeout(function () { toast.classList.remove("show"); }, 2400); }

  // Wishlist hearts (stored in this browser only)
  var saved = [];
  try { saved = JSON.parse(localStorage.getItem("stilla-wish") || "[]"); } catch (e) {}
  function count() { $$("[data-wish-count]").forEach(function (n) { n.textContent = saved.length; n.hidden = !saved.length; }); }
  $$("[data-wish]").forEach(function (b) {
    var id = b.getAttribute("data-wish");
    b.setAttribute("aria-pressed", String(saved.indexOf(id) > -1));
    b.addEventListener("click", function (e) {
      e.preventDefault();
      var i = saved.indexOf(id);
      if (i > -1) saved.splice(i, 1); else saved.push(id);
      try { localStorage.setItem("stilla-wish", JSON.stringify(saved)); } catch (err) {}
      $$('[data-wish="' + id + '"]').forEach(function (x) { x.setAttribute("aria-pressed", String(i < 0)); });
      count(); say(i < 0 ? "Saved to your wishlist" : "Removed from your wishlist");
    });
  });
  count();

  // Grid density
  var grid = $("#grid");
  $$("[data-view]").forEach(function (b) {
    b.addEventListener("click", function () {
      $$("[data-view]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      grid.classList.toggle("dense", b.getAttribute("data-view") === "dense");
    });
  });

  // Filter drawer
  var drawer = $("#filters"), opener = $("[data-open-filters]"), last;
  function openD() { last = document.activeElement; drawer.classList.add("open"); drawer.removeAttribute("inert"); opener.setAttribute("aria-expanded", "true"); var f = $("button, input", drawer); if (f) f.focus(); }
  function closeD() { drawer.classList.remove("open"); drawer.setAttribute("inert", ""); opener.setAttribute("aria-expanded", "false"); if (last) last.focus(); }
  if (drawer && opener) {
    opener.addEventListener("click", openD);
    $$("[data-close-filters]").forEach(function (b) { b.addEventListener("click", closeD); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && drawer.classList.contains("open")) closeD(); });
    var form = $("form", drawer);
    function apply() {
      var data = new FormData(form), want = {};
      ["cat", "color", "size"].forEach(function (k) { want[k] = data.getAll(k); });
      var cards = $$(".card", grid), shown = 0;
      cards.forEach(function (c) {
        var ok = ["cat", "color", "size"].every(function (k) {
          if (!want[k].length) return true;
          var have = (c.getAttribute("data-" + k) || "").split(" ");
          return want[k].some(function (v) { return have.indexOf(v) > -1; });
        });
        c.hidden = !ok; if (ok) shown++;
      });
      var filtered = want.cat.length || want.color.length || want.size.length;
      $$(".tile", grid).forEach(function (t) { t.hidden = !!filtered; });
      var sort = data.get("sort");
      if (sort && sort !== "featured") {
        cards.sort(function (a, b) {
          var pa = +a.getAttribute("data-price"), pb = +b.getAttribute("data-price");
          if (sort === "price-asc") return pa - pb;
          if (sort === "price-desc") return pb - pa;
          return a.getAttribute("data-name").localeCompare(b.getAttribute("data-name"));
        });
      } else cards.sort(function (a, b) { return a.getAttribute("data-i") - b.getAttribute("data-i"); });
      var empty = $(".empty", grid);
      cards.forEach(function (c) { grid.insertBefore(c, empty); });
      if (!filtered && (!sort || sort === "featured")) $$(".tile", grid).forEach(function (t) { var before = $('.card[data-i="' + t.getAttribute("data-before") + '"]', grid); if (before) grid.insertBefore(t, before); });
      empty.hidden = shown > 0;
      $$("[data-count]").forEach(function (n) { n.textContent = shown + (shown === 1 ? " product" : " products"); });
    }
    form.addEventListener("change", apply);
    form.addEventListener("reset", function () { setTimeout(apply, 0); });
    form.addEventListener("submit", function (e) { e.preventDefault(); apply(); closeD(); });
    function fromHash() {
      var h = location.hash.slice(1);
      $$('input[name="cat"]', form).forEach(function (i) { i.checked = i.value === h; });
      $$(".col-hero .tabs a").forEach(function (a) { var on = (a.getAttribute("href").slice(1) || "") === h || (!h && a.getAttribute("href") === "./"); if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
      apply();
    }
    window.addEventListener("hashchange", fromHash);
    if (location.hash) fromHash();
  }

  // Product page: selected size/colour labels
  $$("[data-pick]").forEach(function (group) {
    var out = $("#" + group.getAttribute("data-pick"));
    group.addEventListener("change", function (e) { if (out) out.textContent = e.target.value; var mirror = $('[name="size"]', $(".ask")); if (mirror && e.target.name === "pick-size") mirror.value = e.target.value; });
  });
  $$("[data-add]").forEach(function (b) {
    b.addEventListener("click", function () {
      var picked = $('input[name="pick-size"]:checked');
      if (!picked) { say("Choose a size first"); var first = $('input[name="pick-size"]'); if (first) first.focus(); return; }
      $$("[data-bag-count]").forEach(function (n) { n.textContent = (+n.textContent || 0) + 1; n.hidden = false; });
      say("Added to bag: size " + picked.value);
    });
  });
  $$(".quick").forEach(function (b) { b.addEventListener("click", function () { $$("[data-bag-count]").forEach(function (n) { n.textContent = (+n.textContent || 0) + 1; n.hidden = false; }); say("Added to bag"); }); });

  // Formgong forms: success only when Formgong answers success: true
  $$("form.fg").forEach(function (form) {
    var status = $(".status", form), button = $('button[type="submit"]', form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (button) button.disabled = true;
      status.className = "status"; status.textContent = "Sending…";
      fetch(form.action, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) })
        .then(function (r) { return r.json().catch(function () { return null; }); })
        .then(function (res) {
          if (res && res.success === true) { form.reset(); status.textContent = ""; form.classList.add("is-sent"); var ok = $(".ok", form); if (ok) ok.focus(); }
          else { status.className = "status err"; status.textContent = (res && res.message) || "Could not send. Please try again."; }
        })
        .catch(function () { status.className = "status err"; status.textContent = "Could not send. Check your connection and try again."; })
        .then(function () { if (button) button.disabled = false; });
    });
  });

  // Scroll reveal: fade up text, stagger cards, settle large photos.
  var root = document.documentElement;
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var sel = ".intro>*,.split-tx>*,.row-head>*,.quote>*,.faq>*,.faq details,.news-tx>*,.foot-grid>*,.card,.split-img,.tile";
  var targets = $$(sel).filter(function (t) { return !t.closest(".col-hero"); });
  if (still || !("IntersectionObserver" in window)) { targets.forEach(function (t) { t.classList.add("is-in"); }); return; }
  var io = new IntersectionObserver(function (entries) {
    var batch = entries.filter(function (e) { return e.isIntersecting; });
    batch.forEach(function (e, n) {
      var t = e.target;
      t.style.transitionDelay = Math.min(n, 6) * 80 + "ms";
      t.classList.add("is-in");
      io.unobserve(t);
      setTimeout(function () { t.style.transitionDelay = ""; }, 1800);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  targets.forEach(function (t) { io.observe(t); });
  // Cards hidden by a filter and shown again should appear at once.
  window.addEventListener("hashchange", function () { $$(".card").forEach(function (c) { c.classList.add("is-in"); }); });
  root.classList.add("motion");
})();
