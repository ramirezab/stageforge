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

  // contact form -> license server (POST /contact), which e-mails it to Forge Tools
  var form = document.getElementById("contact-form");
  if (form && cfg.contactUrl) {
    var shownAt = Date.now();
    var status = form.querySelector(".js-contact-status");
    var button = form.querySelector("button[type=submit]");
    var field = function (n) { return form.querySelector("[name=" + n + "]"); };
    var say = function (key, isError) {
      var m = document.querySelector('#contact-msgs [data-i18n="contact.' + key + '"]');
      status.innerHTML = m ? m.innerHTML : "";
      status.classList.toggle("error", !!isError);
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = field("email"), message = field("message");
      if (!email.value.trim() || !email.checkValidity()) { say("bad_email", true); email.focus(); return; }
      if (message.value.trim().length < 10) { say("short", true); message.focus(); return; }
      button.disabled = true;
      say("sending");
      fetch(cfg.contactUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: field("name").value, email: email.value.trim(), topic: field("topic").value, message: message.value,
                               website: field("website").value, ms: Date.now() - shownAt, lang: document.documentElement.lang }),
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          if (j.ok) { form.reset(); say("ok"); }
          else say(r.status === 429 ? "too_many" : j.error === "bad_email" || j.error === "short" ? j.error : "error", true);
        });
      }).catch(function () { say("error", true); }).then(function () { button.disabled = false; });
    });
  } else if (form) {
    form.classList.add("hidden");
  }

  // compact header after scrolling
  var nav = document.querySelector(".nav");
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 24); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
