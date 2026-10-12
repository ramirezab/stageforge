(function () {
  "use strict";
  var cfg = window.SF_CONFIG || {};
  var dict = window.SF_I18N || {};
  var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]"));

  // English is the HTML itself
  var en = { "doc.title": document.title };
  nodes.forEach(function (n) { en[n.getAttribute("data-i18n")] = n.innerHTML; });
  dict.en = en;

  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  function setLang(lang) {
    if (!dict[lang]) lang = "en";
    var d = dict[lang];
    nodes.forEach(function (n) {
      var k = n.getAttribute("data-i18n");
      n.innerHTML = d[k] !== undefined ? d[k] : en[k];
    });
    document.documentElement.lang = lang;
    document.title = d["doc.title"] || en["doc.title"];
    Array.prototype.forEach.call(document.querySelectorAll(".lang button"), function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang ? "true" : "false");
    });
    var video = document.getElementById("promo");
    if (video) {
      var src = "assets/video/promo_" + lang + ".mp4";
      var source = video.querySelector("source");
      if (source && source.getAttribute("src") !== src) {
        source.setAttribute("src", src);
        video.load();
      }
    }
    store("sf_lang", lang);
  }

  Array.prototype.forEach.call(document.querySelectorAll(".lang button"), function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });
  var fromUrl = new URLSearchParams(location.search).get("lang");
  setLang(fromUrl || load("sf_lang") || "en"); // English unless the visitor chose otherwise

  // store links
  function wire(selector, url) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), function (a) {
      if (url) { a.href = url; a.removeAttribute("aria-disabled"); }
      else { a.href = "#pricing"; }
    });
  }
  wire(".js-download", cfg.downloadUrl);
  wire(".js-buy", cfg.buyUrl);
  if (!cfg.downloadUrl || !cfg.buyUrl)
    Array.prototype.forEach.call(document.querySelectorAll(".js-soon"), function (e) { e.classList.remove("hidden"); });
  Array.prototype.forEach.call(document.querySelectorAll(".js-mail"), function (a) {
    if (cfg.supportEmail) a.href = "mailto:" + cfg.supportEmail; else a.classList.add("hidden");
  });

  // compact header after scrolling
  var nav = document.querySelector(".nav");
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 24); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
